'use server';

import connectToDatabase from '@/lib/db';
// Import User BEFORE Order to ensure 'User' ref is registered for populate()
import '@/models/User';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

export async function getOrders() {
  try {
    await connectToDatabase();
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').lean();
    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await connectToDatabase();
    await Order.findByIdAndUpdate(orderId, { status });
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
