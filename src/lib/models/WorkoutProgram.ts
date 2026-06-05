import mongoose from 'mongoose';

export interface IWorkoutProgram {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: string;
  durationDays: number;
  activeUsers: number;
  completionRate: number;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutProgramSchema = new mongoose.Schema<IWorkoutProgram>(
  {
    name: { type: String, required: true },
    level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    goal: { type: String, required: true },
    durationDays: { type: Number, required: true },
    activeUsers: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutProgram || mongoose.model<IWorkoutProgram>('WorkoutProgram', WorkoutProgramSchema);
