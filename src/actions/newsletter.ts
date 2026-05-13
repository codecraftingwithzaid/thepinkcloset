'use server';

import connectToDatabase from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import Subscriber from '@/models/Subscriber';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { emailQueue } from '@/lib/emailQueue';
import { Types } from 'mongoose';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getNewsletter(page = 1, limit = 10, search = '', status = '') {
  try {
    await connectToDatabase();

    const filter: any = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (status) filter.status = status;

    const total = await Newsletter.countDocuments(filter);
    const newsletters = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(newsletters)), pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createNewsletter(data: {
  title: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const session = await requireAdmin();

    if (!data.title?.trim() || !data.subject?.trim() || !data.html?.trim()) {
      throw new Error('Title, subject, and HTML are required');
    }

    await connectToDatabase();

    const newsletter = await Newsletter.create({
      title: data.title,
      subject: data.subject,
      html: data.html,
      text: data.text || '',
      status: 'draft',
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      createdBy: session.user?.id,
    });

    revalidatePath('/admin/marketing/newsletter');
    return { success: true, data: JSON.parse(JSON.stringify(newsletter)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendNewsletter(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid newsletter ID');
    }

    await connectToDatabase();
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    if (newsletter.status === 'sent') {
      throw new Error('Newsletter already sent');
    }

    // Get all subscribed emails
    const subscribers = await Subscriber.find({ status: 'subscribed' }).lean();
    const recipients = subscribers.map(s => ({ email: s.email, id: s._id.toString() }));

    newsletter.status = 'sending';
    newsletter.totalRecipients = recipients.length;
    await newsletter.save();

    // Queue emails
    for (const recipient of recipients) {
      await emailQueue.add({
        to: recipient.email,
        subject: newsletter.subject,
        html: newsletter.html,
        text: newsletter.text,
        newsletterId: id,
        recipientId: recipient.id,
      });
    }

    newsletter.status = 'sent';
    newsletter.sentCount = recipients.length;
    await newsletter.save();

    revalidatePath('/admin/marketing/newsletter');
    return { success: true, data: JSON.parse(JSON.stringify(newsletter)), message: 'Newsletter queued for sending' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNewsletter(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid newsletter ID');
    }

    await connectToDatabase();
    const newsletter = await Newsletter.findByIdAndDelete(id);
    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    revalidatePath('/admin/marketing/newsletter');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}