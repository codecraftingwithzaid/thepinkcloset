import mongoose, { Document, Model, Schema } from 'mongoose';

export type EmailStatus = 'queued' | 'sent' | 'failed' | 'delivered' | 'bounced' | 'opened' | 'clicked';

export interface IEmailLog extends Document {
  campaign?: mongoose.Types.ObjectId;
  newsletter?: mongoose.Types.ObjectId;
  template?: mongoose.Types.ObjectId;
  recipientEmail: string;
  recipientId?: mongoose.Types.ObjectId;
  subject: string;
  status: EmailStatus;
  errorMessage?: string;
  smtpMessageId?: string;
  response?: any;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickData?: any;
  retryCount: number;
  createdAt: Date;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    campaign: { type: Schema.Types.ObjectId, ref: 'EmailCampaign' },
    newsletter: { type: Schema.Types.ObjectId, ref: 'Newsletter' },
    template: { type: Schema.Types.ObjectId, ref: 'EmailTemplate' },
    recipientEmail: { type: String, required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId },
    subject: { type: String },
    status: { type: String, enum: ['queued', 'sent', 'failed', 'delivered', 'bounced', 'opened', 'clicked'], default: 'queued' },
    errorMessage: { type: String },
    smtpMessageId: { type: String },
    response: { type: Schema.Types.Mixed },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    openedAt: { type: Date },
    clickData: { type: Schema.Types.Mixed },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EmailLogSchema.index({ recipientEmail: 1 });
EmailLogSchema.index({ status: 1 });
EmailLogSchema.index({ createdAt: -1 });

const EmailLog: Model<IEmailLog> = mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);

export default EmailLog;
