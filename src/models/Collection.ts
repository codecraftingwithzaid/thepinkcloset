import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICollection extends Document {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  imagePath?: string; // Supabase storage path
  featuredImage?: string;
  featuredImagePath?: string; // Supabase storage path
  bannerImage?: string;
  bannerImagePath?: string; // Supabase storage path
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  featured: boolean;
  sortOrder?: number;
  products?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    imagePath: { type: String }, // Supabase storage path
    featuredImage: { type: String },
    featuredImagePath: { type: String }, // Supabase storage path
    bannerImage: { type: String },
    bannerImagePath: { type: String }, // Supabase storage path
    seoTitle: { type: String },
    seoDescription: { type: String },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const Collection: Model<ICollection> = mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
export default Collection;
