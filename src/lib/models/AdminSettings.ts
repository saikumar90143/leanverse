import mongoose, { Schema } from 'mongoose';

const AdminSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    // Ads
    adsEnabled: { type: Boolean, default: true },
    adPlacements: {
      homepage: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
      workout: { type: Boolean, default: true },
      calculators: { type: Boolean, default: true },
    },
    adsenseId: { type: String, default: '' },
    // AI Prompts
    aiPrompts: {
      workout: { type: String, default: 'Generate a comprehensive workout plan based on the following user parameters...' },
      diet: { type: String, default: 'Create a detailed Indian diet plan tailored to the following nutritional goals...' },
      coach: { type: String, default: 'You are LeanBot, an expert AI fitness coach for LeanVerse. Be motivating, precise, and data-driven.' },
    },
    // Subscription Plans
    subscriptionPlans: {
      type: [
        {
          name: String,
          price: Number,
          interval: String,
          features: [String],
          isActive: Boolean,
        },
      ],
      default: [
        { name: 'Monthly Pro', price: 499, interval: 'monthly', features: ['AI Diet Plan', 'AI Workout Plan', 'Progress Tracking'], isActive: true },
        { name: 'Quarterly Pro', price: 1199, interval: 'quarterly', features: ['All Monthly features', '3-Month Transformation', 'Priority Support'], isActive: true },
        { name: 'Yearly Pro', price: 3999, interval: 'yearly', features: ['All features', 'Lifetime Updates', '1-on-1 Coaching'], isActive: true },
      ],
    },
    // Transformation Control Center
    transformationRules: {
      beginnerToIntermediateDays: { type: Number, default: 30 },
      intermediateToAdvancedDays: { type: Number, default: 60 },
      cardioFrequencyBeginner: { type: Number, default: 2 },
      cardioFrequencyIntermediate: { type: Number, default: 3 },
      cardioFrequencyAdvanced: { type: Number, default: 4 },
      restDaysPerWeek: { type: Number, default: 1 },
      deloadWeekFrequency: { type: Number, default: 4 },
      progressiveOverloadIncrementPercent: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminSettings || mongoose.model('AdminSettings', AdminSettingsSchema);
