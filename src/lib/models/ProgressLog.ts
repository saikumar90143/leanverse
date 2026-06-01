import mongoose, { Schema } from 'mongoose';

const ProgressLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    weight: { type: Number, required: true },
    caloriesConsumed: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    waterCups: { type: Number, default: 0 },
    workoutCompleted: { type: Boolean, default: false },
    measurements: {
      chest: { type: Number, default: 0 },
      waist: { type: Number, default: 0 },
      hips: { type: Number, default: 0 },
      neck: { type: Number, default: 0 },
      biceps: { type: Number, default: 0 },
    },
    progressPhoto: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.ProgressLog || mongoose.model('ProgressLog', ProgressLogSchema);
