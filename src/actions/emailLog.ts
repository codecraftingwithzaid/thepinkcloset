'use server';

import connectToDatabase from '@/lib/db';
import EmailLog from '@/models/EmailLog';
import { auth } from '@/auth';
import { Types } from 'mongoose';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getEmailLogs(filter?: {
  status?: string;
  campaignId?: string;
  recipientEmail?: string;
  limit?: number;
  skip?: number;
}) {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    const query: any = {};
    if (filter?.status) query.status = filter.status;
    if (filter?.campaignId) query.campaign = filter.campaignId;
    if (filter?.recipientEmail) query.recipientEmail = new RegExp(filter.recipientEmail, 'i');

    const limit = filter?.limit || 50;
    const skip = filter?.skip || 0;

    const logs = await EmailLog.find(query)
      .populate('campaign', 'name')
      .populate('newsletter', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await EmailLog.countDocuments(query);

    return { ok: true, logs, total, limit, skip };
  } catch (err: any) {
    return { ok: false, error: err?.message, logs: [] };
  }
}

export async function getEmailLogStats() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    const total = await EmailLog.countDocuments({});
    const sent = await EmailLog.countDocuments({ status: 'sent' });
    const failed = await EmailLog.countDocuments({ status: 'failed' });
    const opened = await EmailLog.countDocuments({ status: 'opened' });
    const clicked = await EmailLog.countDocuments({ status: 'clicked' });

    return {
      ok: true,
      stats: {
        total,
        sent,
        failed,
        opened,
        clicked,
        openRate: total > 0 ? ((opened / total) * 100).toFixed(2) : 0,
        clickRate: total > 0 ? ((clicked / total) * 100).toFixed(2) : 0,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function retryFailedEmails() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();

    const failedLogs = await EmailLog.find({
      status: 'failed',
      retryCount: { $lt: 3 },
    }).limit(100);

    // Just flag them for retry - the queue worker will pick them up
    await EmailLog.updateMany(
      { _id: { $in: failedLogs.map(l => l._id) } },
      { status: 'queued', retryCount: { $inc: 1 } }
    );

    return { ok: true, retriedCount: failedLogs.length };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
