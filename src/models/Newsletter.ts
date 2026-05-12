import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  isActive: boolean;
  tags: string[];
  source?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now, index: true },
    unsubscribedAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String }],
    source: { type: String, default: 'website' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Newsletter: Model<INewsletter> = mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
export default Newsletter;