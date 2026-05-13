import mongoose, { Document, Model, Schema } from 'mongoose';

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';

export interface IEmailCampaign extends Document {
  name: string;
  subject: string;
  template: mongoose.Types.ObjectId;
  audience: any; // flexible audience definition (filter object / type)
  selectedRecipients?: mongoose.Types.ObjectId[];
  html?: string;
  text?: string;
  scheduleAt?: Date;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openCount: number;
  clickCount: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmailCampaignSchema = new Schema<IEmailCampaign>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    template: { type: Schema.Types.ObjectId, ref: 'EmailTemplate', required: false },
    audience: { type: Schema.Types.Mixed },
    selectedRecipients: [{ type: Schema.Types.ObjectId }],
    html: {
      type: String,
      trim: true,
      default: '',
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    scheduleAt: { type: Date },
    status: { type: String, enum: ['draft', 'scheduled', 'sending', 'sent', 'paused', 'failed'], default: 'draft' },
    totalRecipients: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Indexes for common queries
EmailCampaignSchema.index({ status: 1 });
EmailCampaignSchema.index({ scheduleAt: 1 });
EmailCampaignSchema.index({ createdAt: -1 });

const EmailCampaign: Model<IEmailCampaign> =
  mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);

export default EmailCampaign;
