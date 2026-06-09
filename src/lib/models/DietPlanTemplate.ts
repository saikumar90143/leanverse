import mongoose from 'mongoose';

export interface IDietPlanFood {
  foodItem: mongoose.Types.ObjectId | any;
  quantity: number;
}

export interface IMeal {
  name: string;
  foods: IDietPlanFood[];
}

export interface IDietPlanTemplate {
  name: string;
  goal: string;
  dietStyle: string;
  durationDays: number;
  description: string;
  meals: IMeal[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DietPlanFoodSchema = new mongoose.Schema<IDietPlanFood>({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const MealSchema = new mongoose.Schema<IMeal>({
  name: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Pre-workout', 'Post-workout', 'Dinner'] },
  foods: [DietPlanFoodSchema]
});

const DietPlanTemplateSchema = new mongoose.Schema<IDietPlanTemplate>(
  {
    name: { type: String, required: true },
    goal: { type: String, required: true },
    dietStyle: { type: String, default: 'Any' },
    durationDays: { type: Number, required: true, default: 30 },
    description: { type: String, default: '' },
    meals: [MealSchema],
    targetCalories: { type: Number, default: 0 },
    targetProtein: { type: Number, default: 0 },
    targetCarbs: { type: Number, default: 0 },
    targetFat: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

delete mongoose.models.DietPlanTemplate;
export default mongoose.model<IDietPlanTemplate>('DietPlanTemplate', DietPlanTemplateSchema);
