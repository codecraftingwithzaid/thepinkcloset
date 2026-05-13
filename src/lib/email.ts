import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import EmailLog from '@/models/EmailLog';
import mongoose from 'mongoose';

type SendMailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  campaignId?: string | mongoose.Types.ObjectId;
  newsletterId?: string | mongoose.Types.ObjectId;
  templateId?: string | mongoose.Types.ObjectId;
  recipientId?: string | mongoose.Types.ObjectId;
  from?: string;
  retries?: number;
};

async function getSmtpSettings() {
  await connectToDatabase();
  const settings = await Settings.findOne().lean();
  const emailSettings = settings?.emailSettings || {};

  // Fallback to env vars
  const host = emailSettings.smtpHost || process.env.SMTP_HOST;
  const port = emailSettings.smtpPort || (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined);
  const user = emailSettings.smtpUser || process.env.SMTP_USER;
  const pass = emailSettings.smtpPassword || process.env.SMTP_PASSWORD;
  const senderEmail = emailSettings.senderEmail || process.env.SMTP_FROM_EMAIL || process.env.NEXTAUTH_URL;
  const senderName = emailSettings.senderName || process.env.SMTP_FROM_NAME || '';

  if (!host || !port || !user || !pass || !senderEmail) {
    throw new Error('SMTP settings are not configured. Please configure them in Settings or env vars.');
  }

  return { host, port, user, pass, senderEmail, senderName };
}

async function createTransport() {
  const { host, port, user, pass } = await getSmtpSettings();
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
    maxMessages: 1000,
  } as any);

  // verify transporter - do not throw in production flows, bubble up
  try {
    await transporter.verify();
  } catch (err) {
    // leave verification to use-time but log here if needed
  }

  return transporter;
}

function validateEmail(email: string) {
  // simple regex, sufficient for validation here
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

async function logEmailRecord(opts: {
  campaign?: any;
  newsletter?: any;
  template?: any;
  recipientEmail: string;
  recipientId?: any;
  subject: string;
  status?: string;
  errorMessage?: string;
  smtpMessageId?: string;
  response?: any;
}) {
  const doc = await EmailLog.create({
    campaign: opts.campaign,
    newsletter: opts.newsletter,
    template: opts.template,
    recipientEmail: opts.recipientEmail,
    recipientId: opts.recipientId,
    subject: opts.subject,
    status: opts.status || 'queued',
    errorMessage: opts.errorMessage,
    smtpMessageId: opts.smtpMessageId,
    response: opts.response,
    sentAt: opts.status === 'sent' ? new Date() : undefined,
  } as any);

  return doc;
}

async function sendMail(options: SendMailOptions) {
  if (!validateEmail(options.to)) {
    throw new Error('Invalid recipient email');
  }

  await connectToDatabase();

  const settings = await Settings.findOne().lean();
  const emailSettings = settings?.emailSettings || {};
  const fromAddress = options.from || `${emailSettings.senderName || ''} <${emailSettings.senderEmail || process.env.SMTP_FROM_EMAIL}>`;

  const log = await logEmailRecord({
    campaign: options.campaignId,
    newsletter: options.newsletterId,
    template: options.templateId,
    recipientEmail: options.to,
    recipientId: options.recipientId,
    subject: options.subject,
    status: 'queued',
  });

  const transporter = await createTransport();

  const maxRetries = typeof options.retries === 'number' ? options.retries : 2;

  let attempt = 0;
  let lastError: any = null;

  while (attempt <= maxRetries) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      // update log
      await EmailLog.findByIdAndUpdate(log._id, {
        status: 'sent',
        smtpMessageId: info.messageId,
        response: info,
        sentAt: new Date(),
      });

      return { ok: true, info };
    } catch (err: any) {
      lastError = err;
      attempt += 1;
      await EmailLog.findByIdAndUpdate(log._id, {
        status: 'failed',
        errorMessage: String(err?.message || err),
        retryCount: attempt,
      });

      // exponential backoff
      const waitMs = Math.min(30000, 500 * Math.pow(2, attempt));
      await new Promise((res) => setTimeout(res, waitMs));
    }
  }

  throw lastError;
}

async function sendBulk(recipients: { email: string; id?: any }[], options: { subject: string; html?: string; text?: string; campaignId?: any; templateId?: any; batchSize?: number; concurrency?: number; retries?: number; from?: string; }) {
  if (!recipients || recipients.length === 0) return { total: 0, sent: 0, failed: 0 };

  const batchSize = options.batchSize || 100; // number per batch
  const concurrency = options.concurrency || 5; // parallel sends within batch

  let sent = 0;
  let failed = 0;

  // simple pool executor
  const sendTask = async (recipient: { email: string; id?: any }) => {
    try {
      await sendMail({
        to: recipient.email,
        subject: options.subject,
        html: options.html,
        text: options.text,
        campaignId: options.campaignId,
        templateId: options.templateId,
        recipientId: recipient.id,
        retries: options.retries ?? 2,
        from: options.from,
      });
      sent += 1;
    } catch (err) {
      failed += 1;
    }
  };

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    // process batch in parallel with limited concurrency
    const pool: Promise<void>[] = [];
    for (const r of batch) {
      const p = sendTask(r);
      pool.push(p as Promise<void>);
      if (pool.length >= concurrency) {
        await Promise.race(pool).catch(() => {});
        // remove settled promises
        for (let j = pool.length - 1; j >= 0; j--) {
          if ((pool[j] as any).resolved) pool.splice(j, 1);
        }
        // simple cleanup approach: await all to keep things moving
        await Promise.allSettled(pool);
        pool.length = 0;
      }
    }

    if (pool.length > 0) {
      await Promise.allSettled(pool);
    }
  }

  return { total: recipients.length, sent, failed };
}

export { createTransport, sendMail, sendBulk, validateEmail };
