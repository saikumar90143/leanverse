import mongoose, { Schema } from 'mongoose';

const ExerciseSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },

    // Classification
    muscleGroup: {
      type: String,
      required: true,
      index: true,
    },
    secondaryMuscles: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: [
        'Strength',
        'Cardio',
        'Mobility',
        'Yoga',
        'HIIT',
        'Stretching',
      ],
      default: 'Strength',
    },
    // Keep as array of strings based on previous user request
    difficulty: [{
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    }],

    // Workout Location
    locationType: {
      type: String,
      enum: ['Gym', 'Home', 'Both'],
      default: 'Both',
    },

    // Equipment
    equipment: {
      type: String,
      default: 'Bodyweight',
    },
    equipmentRequired: [
      {
        type: String,
      },
    ],

    // Media
    thumbnailUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    animationUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },

    // Exercise Details
    instructions: [
      {
        type: String,
      },
    ],
    commonMistakes: [
      {
        type: String,
      },
    ],
    safetyTips: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],

    // Workout Programming
    recommendedSets: {
      min: Number,
      max: Number,
    },
    recommendedReps: {
      min: Number,
      max: Number,
    },
    recommendedRestSeconds: {
      type: Number,
      default: 60,
    },
    caloriesPerMinute: {
      type: Number,
      default: 5,
    },

    // AI Workout Engine
    alternativeExercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
    progressionExercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
    regressionExercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],

    // SEO
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },

    // Analytics
    usageCount: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },

    // Admin
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Custom exercise fields
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String, // store userId string
      default: null,
    },

    // Additional Fields
    exerciseRotationPriority: {
      type: Number,
      default: 1,
    },
    estimatedLearningLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
    isCompound: {
      type: Boolean,
      default: false,
    },
    isIsolation: {
      type: Boolean,
      default: false,
    },
    primaryMovementPattern: {
      type: String,
      enum: [
        'Push',
        'Pull',
        'Squat',
        'Hinge',
        'Lunge',
        'Carry',
        'Core',
        'Cardio',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
ExerciseSchema.index({ muscleGroup: 1 });
ExerciseSchema.index({ difficulty: 1 });
ExerciseSchema.index({ locationType: 1 });
ExerciseSchema.index({ category: 1 });
ExerciseSchema.index({ slug: 1 });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
