'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import EmailCampaign from '@/models/EmailCampaign';
import Subscriber from '@/models/Subscriber';
import User from '@/models/User';
import { sendMail, sendBulk } from '@/lib/email';
import { auth } from '@/auth';
import { Types } from 'mongoose';
import { emailQueue } from '@/lib/emailQueue';
import { serializeData } from '@/lib/serialize';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function createCampaign(data: {
  name: string;
  subject: string;
  templateId?: string;
  audience?: any;
  html?: string;
  text?: string;
}) {
  try {
    const session = await requireAdmin();

    if (!data.name?.trim() || !data.subject?.trim()) {
      throw new Error('Campaign name and subject are required');
    }

    await connectToDatabase();

    const campaign = await EmailCampaign.create({
      name: data.name,
      subject: data.subject,
      template: data.templateId || undefined,
      html: data.html,
      text: data.text,
      audience: data.audience || { type: 'all_subscribers' },
      status: 'draft',
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      createdBy: session.user?.id,
    });

    revalidatePath('/admin/marketing/campaigns');
    return { ok: true, campaign: serializeData(campaign) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function updateCampaign(
  id: string,
  data: Partial<{
    name: string;
    subject: string;
    templateId: string;
    audience: any;
    html: string;
    text: string;
    scheduleAt: Date;
  }>
) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid campaign ID');
    }

    await connectToDatabase();
    const campaign = await EmailCampaign.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Can only edit draft campaigns');
    }

    Object.assign(campaign, data);
    await campaign.save();

    revalidatePath('/admin/marketing/campaigns');
    return { ok: true, campaign: serializeData(campaign) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function deleteCampaign(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid campaign ID');
    }

    await connectToDatabase();
    const campaign = await EmailCampaign.findByIdAndDelete(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    revalidatePath('/admin/marketing/campaigns');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function scheduleCampaign(id: string, scheduleAt: Date) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid campaign ID');
    }

    await connectToDatabase();
    const campaign = await EmailCampaign.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Can only schedule draft campaigns');
    }

    campaign.scheduleAt = scheduleAt;
    campaign.status = 'scheduled';
    await campaign.save();

    revalidatePath('/admin/marketing/campaigns');
    return { ok: true, campaign };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

async function getAudienceEmails(audience: any) {
  const recipients: { email: string; id?: string }[] = [];

  if (audience.type === 'all_subscribers') {
    const subs = await Subscriber.find({ status: 'subscribed' }).lean();
    recipients.push(...subs.map(s => ({ email: s.email, id: s._id.toString() })));
  } else if (audience.type === 'all_customers') {
    const customers = await User.find({ role: 'customer' }).lean();
    recipients.push(...customers.map(c => ({ email: c.email, id: c._id.toString() })));
  } else if (audience.type === 'selected' && audience.emails) {
    recipients.push(...audience.emails);
  }

  return recipients;
}

export async function sendCampaign(id: string, sendNow: boolean = true) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid campaign ID');
    }

    await connectToDatabase();
    const campaign = await EmailCampaign.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status === 'sent' || campaign.status === 'sending') {
      throw new Error('Campaign already sent');
    }

    const recipients = await getAudienceEmails(campaign.audience);
    campaign.totalRecipients = recipients.length;

    if (!sendNow) {
      campaign.status = 'scheduled';
      await campaign.save();
      revalidatePath('/admin/marketing/campaigns');
      return { ok: true, campaign: serializeData(campaign), message: 'Campaign scheduled' };
    }

    campaign.status = 'sending';
    await campaign.save();

    // Queue emails for background processing
    for (const recipient of recipients) {
      await emailQueue.add({
        to: recipient.email,
        subject: campaign.subject,
        html: campaign.html,
        text: campaign.text,
        campaignId: id,
        recipientId: recipient.id,
      });
    }

    // Update campaign after batch queued
    campaign.status = 'sent';
    campaign.sentCount = recipients.length;
    await campaign.save();

    revalidatePath('/admin/marketing/campaigns');
    return { ok: true, campaign: serializeData(campaign), message: 'Campaign emails queued for sending' };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getCampaigns() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();
    const campaigns = await EmailCampaign.find()
      .populate('template', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return { ok: true, campaigns: serializeData(campaigns) };
  } catch (err: any) {
    return { ok: false, error: err?.message, campaigns: [] };
  }
}

export async function getCampaign(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid campaign ID');
    }

    await connectToDatabase();
    const campaign = await EmailCampaign.findById(id).populate('template').lean();
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return { ok: true, campaign: serializeData(campaign) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
