'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { auth } from '@/auth';
import { Types } from 'mongoose';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function subscribeEmail(email: string, name?: string) {
  try {
    if (!email?.trim() || !email.includes('@')) {
      throw new Error('Valid email is required');
    }

    await connectToDatabase();

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'subscribed') {
        return { ok: true, message: 'Already subscribed', subscriber: existing };
      }
      // Re-subscribe
      existing.status = 'subscribed';
      await existing.save();
      return { ok: true, message: 'Resubscribed successfully', subscriber: existing };
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name,
      status: 'subscribed',
      source: 'website',
    });

    revalidatePath('/admin/marketing/subscribers');
    return { ok: true, message: 'Subscribed successfully', subscriber };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function unsubscribeEmail(email: string) {
  try {
    if (!email?.trim()) {
      throw new Error('Email is required');
    }

    await connectToDatabase();
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { status: 'unsubscribed' },
      { new: true }
    );

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    revalidatePath('/admin/marketing/subscribers');
    return { ok: true, message: 'Unsubscribed successfully' };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getSubscribers(status?: string) {
  try {
    const session = await requireAdmin();

    await connectToDatabase();
    const query = status ? { status } : {};
    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 }).lean();

    return { ok: true, subscribers };
  } catch (err: any) {
    return { ok: false, error: err?.message, subscribers: [] };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid subscriber ID');
    }

    await connectToDatabase();
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    revalidatePath('/admin/marketing/subscribers');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function updateSubscriberStatus(id: string, status: 'subscribed' | 'unsubscribed' | 'bounced') {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid subscriber ID');
    }

    await connectToDatabase();
    const subscriber = await Subscriber.findByIdAndUpdate(id, { status }, { new: true });
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    revalidatePath('/admin/marketing/subscribers');
    return { ok: true, subscriber };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getSubscriberStats() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();
    const total = await Subscriber.countDocuments({});
    const subscribed = await Subscriber.countDocuments({ status: 'subscribed' });
    const unsubscribed = await Subscriber.countDocuments({ status: 'unsubscribed' });
    const bounced = await Subscriber.countDocuments({ status: 'bounced' });

    return { ok: true, stats: { total, subscribed, unsubscribed, bounced } };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
