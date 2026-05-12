import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    coverImage: { type: String },
    featuredImage: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    author: { type: String, required: true, default: 'Admin' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    category: { type: String, default: 'Uncategorized' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
