import mongoose, { Document, Model, Schema } from 'mongoose';

export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

export interface INewsletter extends Document {
  title: string;
  subject: string;
  html: string;
  text?: string;
  status: NewsletterStatus;
  scheduleAt?: Date;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    text: { type: String },
    status: { type: String, enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'], default: 'draft' },
    scheduleAt: { type: Date },
    totalRecipients: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

NewsletterSchema.index({ status: 1 });
NewsletterSchema.index({ scheduleAt: 1 });
NewsletterSchema.index({ createdAt: -1 });

const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter;