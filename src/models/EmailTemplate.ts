import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  status: 'active' | 'inactive';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    text: { type: String },
    variables: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Indexes
EmailTemplateSchema.index({ name: 1 });
EmailTemplateSchema.index({ status: 1 });
EmailTemplateSchema.index({ createdAt: -1 });

const EmailTemplate: Model<IEmailTemplate> =
  mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);

export default EmailTemplate;
