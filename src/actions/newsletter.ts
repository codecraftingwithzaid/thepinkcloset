'use server';

import connectToDatabase from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { revalidatePath } from 'next/cache';

export async function getNewsletter(page = 1, limit = 10, search = '', status = '') {
  try {
    await connectToDatabase();

    const filter: any = {};
    if (search) filter.email = { $regex: search, $options: 'i' };
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const total = await Newsletter.countDocuments(filter);
    const subscribers = await Newsletter.find(filter)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(subscribers)), pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function subscribeNewsletter(email: string, tags: string[] = [], source = 'admin') {
  try {
    await connectToDatabase();
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { email: email.toLowerCase().trim(), tags, source, isActive: true, subscribedAt: new Date(), unsubscribedAt: undefined },
      { new: true, upsert: true }
    );
    revalidatePath('/admin/newsletter');
    return { success: true, data: JSON.parse(JSON.stringify(subscriber)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unsubscribeNewsletter(email: string) {
  try {
    await connectToDatabase();
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );
    revalidatePath('/admin/newsletter');
    return { success: true, data: JSON.parse(JSON.stringify(subscriber)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNewsletter(id: string) {
  try {
    await connectToDatabase();
    await Newsletter.findByIdAndDelete(id);
    revalidatePath('/admin/newsletter');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNewsletterStats() {
  try {
    await connectToDatabase();
    const [total, active, inactive] = await Promise.all([
      Newsletter.countDocuments({}),
      Newsletter.countDocuments({ isActive: true }),
      Newsletter.countDocuments({ isActive: false }),
    ]);
    return { success: true, data: { total, active, inactive } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}