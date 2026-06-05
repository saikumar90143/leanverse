import mongoose from 'mongoose';

export interface IFoodItem {
  name: string;
  emoji: string;
  dietStyle: string[];
  mealTypes: string[];
  servingUnit: string;
  servingWeight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  selectionCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodItemSchema = new mongoose.Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    dietStyle: { type: [String], required: true },
    mealTypes: { type: [String], required: true },
    servingUnit: { type: String, required: true },
    servingWeight: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    category: { type: String, required: true },
    selectionCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

delete mongoose.models.FoodItem;
export default mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);
