'use server';

import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';
import { revalidatePath } from 'next/cache';

export async function getCoupons() {
  try {
    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(coupons)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const readString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function getCouponById(id: string) {
  try {
    await connectToDatabase();
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) return { success: false, error: 'Coupon not found' };
    return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(formData: FormData) {
  try {
    await connectToDatabase();
    
    const newCoupon = await Coupon.create({
      code: readString(formData, 'code').toUpperCase(),
      description: readString(formData, 'description') || undefined,
      discountType: (readString(formData, 'discountType') || 'percentage') as 'percentage' | 'fixed' | 'free_shipping',
      discountValue: Number(readString(formData, 'discountValue')),
      minPurchaseAmount: Number(readString(formData, 'minPurchaseAmount')) || 0,
      maxDiscountAmount: readString(formData, 'maxDiscountAmount') ? Number(readString(formData, 'maxDiscountAmount')) : undefined,
      validFrom: readString(formData, 'validFrom') ? new Date(readString(formData, 'validFrom')) : new Date(),
      validUntil: readString(formData, 'validUntil') ? new Date(readString(formData, 'validUntil')) : undefined,
      usageLimit: readString(formData, 'usageLimit') ? Number(readString(formData, 'usageLimit')) : undefined,
      isActive: readString(formData, 'isActive') === 'true',
      autoApply: readString(formData, 'autoApply') === 'true',
      customerEmails: readString(formData, 'customerEmails') ? readString(formData, 'customerEmails').split(',').map((value) => value.trim()).filter(Boolean) : [],
    });
    
    revalidatePath('/admin/coupons');
    return { success: true, data: JSON.parse(JSON.stringify(newCoupon)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await connectToDatabase();
    await Coupon.findByIdAndDelete(id);
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCoupon(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    const updated = await Coupon.findByIdAndUpdate(
      id,
      {
        code: readString(formData, 'code').toUpperCase(),
        description: readString(formData, 'description') || undefined,
        discountType: (readString(formData, 'discountType') || 'percentage') as 'percentage' | 'fixed' | 'free_shipping',
        discountValue: Number(readString(formData, 'discountValue')),
        minPurchaseAmount: Number(readString(formData, 'minPurchaseAmount')) || 0,
        maxDiscountAmount: readString(formData, 'maxDiscountAmount') ? Number(readString(formData, 'maxDiscountAmount')) : undefined,
        validFrom: readString(formData, 'validFrom') ? new Date(readString(formData, 'validFrom')) : new Date(),
        validUntil: readString(formData, 'validUntil') ? new Date(readString(formData, 'validUntil')) : undefined,
        usageLimit: readString(formData, 'usageLimit') ? Number(readString(formData, 'usageLimit')) : undefined,
        isActive: readString(formData, 'isActive') === 'true',
        autoApply: readString(formData, 'autoApply') === 'true',
        customerEmails: readString(formData, 'customerEmails') ? readString(formData, 'customerEmails').split(',').map((value) => value.trim()).filter(Boolean) : [],
      },
      { new: true }
    ).lean();

    revalidatePath('/admin/coupons');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
