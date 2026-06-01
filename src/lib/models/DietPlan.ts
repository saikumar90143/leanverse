import mongoose, { Schema } from 'mongoose';

const DietPlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    inputs: {
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      goal: { type: String, required: true },
      activityLevel: { type: String, required: true },
      budget: { type: String, default: 'medium' },
      foodPref: { type: String, required: true },
      allergies: { type: [String], default: [] },
      homeFoods: { type: [String], default: [] },
    },
    dailyCalorieTarget: { type: Number, required: true },
    macros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    meals: [
      {
        time: { type: String, required: true },
        name: { type: String, required: true },
        foods: [
          {
            name: { type: String, required: true },
            qty: { type: String, required: true },
            cals: { type: Number, required: true },
            protein: { type: Number, required: true },
            carbs: { type: Number, required: true },
            fat: { type: Number, required: true },
          },
        ],
        swaps: { type: [String], default: [] },
      },
    ],
    groceryList: { type: [String], default: [] },
    supplements: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.DietPlan || mongoose.model('DietPlan', DietPlanSchema);
