import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'order' | 'system' | 'customer' | 'alert' | 'inventory' | 'payment' | 'review';
  isRead: boolean;
  link?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['order', 'system', 'customer', 'alert', 'inventory', 'payment', 'review'], default: 'system' },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
