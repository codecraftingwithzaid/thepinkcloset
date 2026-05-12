import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  location: 'hero' | 'announcement' | 'sidebar' | 'footer' | 'category' | 'promo';
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    location: { type: String, enum: ['hero', 'announcement', 'sidebar', 'footer', 'category', 'promo'], required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
export default Banner;
