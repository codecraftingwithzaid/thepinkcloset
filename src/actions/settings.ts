'use server';

import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    await connectToDatabase();
    // Assuming there's only one global settings document
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // create default if not exists
    }
    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(id: string, formData: FormData) {
  try {
    await connectToDatabase();
    
    const updateData = {
      storeName: formData.get('storeName'),
      logo: formData.get('logo'),
      favicon: formData.get('favicon'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      address: formData.get('address'),
      socialLinks: {
        instagram: formData.get('instagram'),
        facebook: formData.get('facebook'),
        twitter: formData.get('twitter'),
        pinterest: formData.get('pinterest'),
        youtube: formData.get('youtube'),
      },
      paymentSettings: {
        razorpayKeyId: formData.get('razorpayKeyId'),
        razorpaySecret: formData.get('razorpaySecret'),
        stripePublishableKey: formData.get('stripePublishableKey'),
        stripeSecretKey: formData.get('stripeSecretKey'),
        enableCod: formData.get('enableCod') === 'true',
        enableRazorpay: formData.get('enableRazorpay') === 'true',
        enableStripe: formData.get('enableStripe') === 'true',
      },
      shippingSettings: {
        shippingCharge: Number(formData.get('shippingCharge')) || 0,
        freeShippingThreshold: Number(formData.get('freeShippingThreshold')) || 0,
        deliveryZones: formData.get('deliveryZones') ? String(formData.get('deliveryZones')).split(',').map((value) => value.trim()).filter(Boolean) : [],
      },
      seoSettings: {
        defaultTitle: formData.get('defaultTitle'),
        defaultDescription: formData.get('defaultDescription'),
        keywords: formData.get('keywords'),
        openGraphImage: formData.get('openGraphImage'),
        googleAnalyticsId: formData.get('googleAnalyticsId'),
      },
      emailSettings: {
        smtpHost: formData.get('smtpHost'),
        smtpPort: Number(formData.get('smtpPort')) || undefined,
        smtpUser: formData.get('smtpUser'),
        smtpPassword: formData.get('smtpPassword'),
        senderEmail: formData.get('senderEmail'),
        senderName: formData.get('senderName'),
      },
    };

    const updated = await Settings.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath('/admin/settings');
    revalidatePath('/'); // Global layout might depend on settings
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
