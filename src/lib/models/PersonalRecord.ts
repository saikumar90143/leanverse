import mongoose, { Schema } from 'mongoose';

const PersonalRecordSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exerciseId: { type: String, required: true },
    maxWeight: { type: Number, required: true, default: 0 },
    maxReps: { type: Number, required: true, default: 0 },
    maxRepsAtMaxWeight: { type: Number, required: true, default: 0 },
    estimated1RM: { type: Number, required: true, default: 0 },
    lastPerformed: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Compound index to quickly find a user's PR for a specific exercise
PersonalRecordSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export default mongoose.models.PersonalRecord || mongoose.model('PersonalRecord', PersonalRecordSchema);
