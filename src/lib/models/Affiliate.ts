import mongoose, { Schema } from 'mongoose';

const AffiliateSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    affiliateLink: { type: String, required: true },
    commission: { type: Number, default: 5 }, // percentage
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 4.0 },
    imageUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Whey Protein', 'Creatine', 'Vitamins', 'Gym Equipment', 'Fitness Accessories', 'Pre-Workout', 'Fat Burner', 'Other'],
      default: 'Other',
    },
    isActive: { type: Boolean, default: true },
    // Analytics
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema);
