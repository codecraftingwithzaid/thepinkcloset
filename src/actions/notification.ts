'use server';

import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notification';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  try {
    await connectToDatabase();
    const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(notifications)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createNotification(title: string, message: string, type: 'order' | 'system' | 'customer' | 'alert' | 'inventory' | 'payment' | 'review', link?: string) {
  try {
    await connectToDatabase();
    const notification = await Notification.create({ title, message, type, link, isRead: false });
    revalidatePath('/admin');
    return { success: true, data: JSON.parse(JSON.stringify(notification)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAsRead(id: string) {
  try {
    await connectToDatabase();
    await Notification.findByIdAndUpdate(id, { isRead: true });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAsUnread(id: string) {
  try {
    await connectToDatabase();
    await Notification.findByIdAndUpdate(id, { isRead: false });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNotification(id: string) {
  try {
    await connectToDatabase();
    await Notification.findByIdAndDelete(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function clearAllNotifications() {
  try {
    await connectToDatabase();
    await Notification.deleteMany({});
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
