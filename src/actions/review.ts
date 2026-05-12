'use server';

import connectToDatabase from '@/lib/db';
// Import referenced models before Review queries to register them in Mongoose
import '@/models/Category';   // Product refs Category
import '@/models/User';
import '@/models/Product';
import Review from '@/models/Review';
import { revalidatePath } from 'next/cache';

export async function getReviews() {
  try {
    await connectToDatabase();
    const reviews = await Review.find().populate('product', 'name images price').populate('user', 'name email image').sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(reviews)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewById(id: string) {
  try {
    await connectToDatabase();
    const review = await Review.findById(id).populate('product', 'name images price').populate('user', 'name email image').lean();
    if (!review) return { success: false, error: 'Review not found' };
    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReviewStatus(id: string, status: string) {
  try {
    await connectToDatabase();
    const updated = await Review.findByIdAndUpdate(id, { status }, { new: true });
    revalidatePath('/admin/reviews');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function replyToReview(id: string, reply: string) {
  try {
    await connectToDatabase();
    const updated = await Review.findByIdAndUpdate(id, { reply }, { new: true }).lean();
    revalidatePath('/admin/reviews');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await connectToDatabase();
    await Review.findByIdAndDelete(id);
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
