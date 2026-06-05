import mongoose from 'mongoose';

export interface ISubscriptionPlan {
  name: string;
  tier: 'free' | 'premium' | 'pro';
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new mongoose.Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },
    tier: { type: String, required: true, enum: ['free', 'premium', 'pro'] },
    monthlyPrice: { type: Number, required: true },
    annualPrice: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
