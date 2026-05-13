import connectToDatabase from '@/lib/db';
import EmailLog from '@/models/EmailLog';
import { sendMail } from '@/lib/email';

export type QueuedEmail = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  campaignId?: string;
  newsletterId?: string;
  templateId?: string;
  recipientId?: string;
  from?: string;
  priority?: number;
};

// In-memory queue for processing (with persistence via DB)
class EmailQueue {
  private isProcessing = false;
  private queue: QueuedEmail[] = [];
  private processingIntervalMs = 5000; // process every 5 seconds

  constructor() {
    // Start background worker on init
    this.startWorker();
  }

  async add(email: QueuedEmail) {
    await connectToDatabase();
    // Create log entry immediately
    const log = await EmailLog.create({
      recipientEmail: email.to,
      subject: email.subject,
      status: 'queued',
      campaign: email.campaignId,
      newsletter: email.newsletterId,
      template: email.templateId,
      recipientId: email.recipientId,
    } as any);

    this.queue.push({ ...email, recipientId: log._id.toString() });
    return log;
  }

  async addBatch(emails: QueuedEmail[]) {
    const logs = [];
    for (const email of emails) {
      const log = await this.add(email);
      logs.push(log);
    }
    return logs;
  }

  private startWorker() {
    setInterval(() => {
      this.processQueue().catch(console.error);
    }, this.processingIntervalMs);
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    try {
      // Process in batches to avoid overwhelming server
      while (this.queue.length > 0) {
        const email = this.queue.shift();
        if (!email) break;

        try {
          await sendMail({
            to: email.to,
            subject: email.subject,
            html: email.html,
            text: email.text,
            campaignId: email.campaignId,
            newsletterId: email.newsletterId,
            templateId: email.templateId,
            recipientId: email.recipientId,
            from: email.from,
            retries: 2,
          });
        } catch (err) {
          console.error(`Failed to send email to ${email.to}:`, err);
          // Log already updated via sendMail
        }

        // Small delay between sends
        await new Promise((res) => setTimeout(res, 100));
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async processFailedEmails() {
    await connectToDatabase();
    const failedLogs = await EmailLog.find({
      status: 'failed',
      retryCount: { $lt: 3 },
    }).limit(100);

    for (const log of failedLogs) {
      try {
        await sendMail({
          to: log.recipientEmail,
          subject: log.subject,
          campaignId: log.campaign,
          templateId: log.template,
          newsletterId: log.newsletter,
          recipientId: log.recipientId,
          retries: 2,
        });
      } catch (err) {
        console.error(`Retry failed for ${log.recipientEmail}:`, err);
      }
    }
  }

  getQueueSize() {
    return this.queue.length;
  }
}

export const emailQueue = new EmailQueue();
