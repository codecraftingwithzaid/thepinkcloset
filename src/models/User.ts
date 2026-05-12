import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  image?: string;
  role: 'admin' | 'customer' | 'staff';
  status: 'active' | 'blocked' | 'suspended';
  addresses: {
    id?: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    landmark?: string;
    isDefault?: boolean;
  }[];
  totalOrders: number;
  totalSpent: number;
  lastLogin?: Date;
  emailVerified: boolean;
  wishlist: mongoose.Types.ObjectId[];
  rewardPoints: number;
  reviews: mongoose.Types.ObjectId[];
  loginActivity: {
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    image: { type: String },
    role: { type: String, enum: ['admin', 'customer', 'staff'], default: 'customer' },
    status: { type: String, enum: ['active', 'blocked', 'suspended'], default: 'active' },
    addresses: [
      {
        id: { type: String },
        fullName: { type: String },
        phone: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
        landmark: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    rewardPoints: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    loginActivity: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String },
        userAgent: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ totalSpent: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
