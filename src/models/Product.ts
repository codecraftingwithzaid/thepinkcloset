import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  imagePaths?: string[]; // Store Supabase storage paths for deletion
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  brand?: string;
  tags: string[];
  sku: string;
  stock: number;
  price: number;
  salePrice?: number;
  fabric?: string;
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratings: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    images: [{ type: String }],
    imagePaths: [{ type: String }], // Supabase storage paths
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String },
    brand: { type: String },
    tags: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    fabric: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
