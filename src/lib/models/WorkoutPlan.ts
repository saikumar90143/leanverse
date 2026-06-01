import mongoose, { Schema } from 'mongoose';

const WorkoutPlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    inputs: {
      location: { type: String, required: true },
      equipment: { type: [String], default: [] },
      level: { type: String, required: true },
      duration: { type: Number, required: true },
      goal: { type: String, required: true },
    },
    weeklySplit: [
      {
        dayName: { type: String, required: true }, // e.g., 'Monday - Push'
        exercises: [
          {
            name: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: String, required: true }, // e.g. "8-12" or "Max"
            rest: { type: Number, default: 60 }, // rest in seconds
            videoUrl: { type: String, default: '' },
            notes: { type: String, default: '' },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema);
