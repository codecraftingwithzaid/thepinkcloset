import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
  paymentSettings?: {
    razorpayKeyId?: string;
    razorpaySecret?: string;
    stripePublishableKey?: string;
    stripeSecretKey?: string;
    enableCod: boolean;
    enableRazorpay?: boolean;
    enableStripe?: boolean;
  };
  shippingSettings?: {
    shippingCharge?: number;
    freeShippingThreshold?: number;
    deliveryZones?: string[];
  };
  seoSettings?: {
    defaultTitle?: string;
    defaultDescription?: string;
    keywords?: string;
    openGraphImage?: string;
    googleAnalyticsId?: string;
  };
  emailSettings?: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    senderEmail?: string;
    senderName?: string;
  };
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    storeName: { type: String, default: 'Luxe Feminine Boutique' },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String, default: 'support@luxeboutique.com' },
    contactPhone: { type: String },
    address: { type: String },
    socialLinks: {
      instagram: String,
      facebook: String,
      twitter: String,
      pinterest: String,
      youtube: String,
    },
    paymentSettings: {
      razorpayKeyId: String,
      razorpaySecret: String,
      stripePublishableKey: String,
      stripeSecretKey: String,
      enableCod: { type: Boolean, default: true },
      enableRazorpay: { type: Boolean, default: true },
      enableStripe: { type: Boolean, default: false },
    },
    shippingSettings: {
      shippingCharge: { type: Number, default: 0 },
      freeShippingThreshold: { type: Number, default: 0 },
      deliveryZones: [{ type: String }],
    },
    seoSettings: {
      defaultTitle: String,
      defaultDescription: String,
      keywords: String,
      openGraphImage: String,
      googleAnalyticsId: String,
    },
    emailSettings: {
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      senderEmail: String,
      senderName: String,
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;
