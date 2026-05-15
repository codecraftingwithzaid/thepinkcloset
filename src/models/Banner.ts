import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  imagePath?: string; // Supabase storage path
  mobileImage?: string;
  mobileImagePath?: string; // Supabase storage path
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
    imagePath: { type: String }, // Supabase storage path
    mobileImage: { type: String },
    mobileImagePath: { type: String }, // Supabase storage path
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
