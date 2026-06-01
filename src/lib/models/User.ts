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
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
