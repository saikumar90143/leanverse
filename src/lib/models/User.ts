import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: false, default: null },
    googleId: { type: String, required: false, default: null, sparse: true },
    avatar: { type: String, required: false, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    tier: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    badges: { type: [String], default: [] },
    // Notification preferences
    pushNotificationsEnabled: { type: Boolean, default: false },
    emailRemindersEnabled: { type: Boolean, default: false },
    reminderTime: { type: String, default: '08:00' }, // HH:MM format
    streakAlertsEnabled: { type: Boolean, default: true },
    subscriptionExpiresAt: { type: Date, required: false, default: null },
    resetPasswordToken: { type: String, required: false, default: null },
    resetPasswordExpires: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);

