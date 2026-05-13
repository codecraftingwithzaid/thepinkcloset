import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  source?: string;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String },
    status: { type: String, enum: ['subscribed', 'unsubscribed', 'bounced'], default: 'subscribed' },
    source: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ status: 1 });
SubscriberSchema.index({ createdAt: -1 });

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
