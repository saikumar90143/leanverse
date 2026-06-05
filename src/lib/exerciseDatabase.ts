export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  sets: string;
  reps: string;
  rest: string;
  exerciseType: string;
  caloriesPerMinute: number;
  videoUrl: string;
  imageUrl: string;
  instructions: string[];
}

export const exerciseDatabase: Exercise[] = [
  // --- CHEST ---
  {
    id: 'c-1',
    name: "Push-Ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3-4",
    reps: "10-20",
    rest: "60 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/pushups.webp",
    instructions: [
      "Start in a high plank position with hands slightly wider than shoulders.",
      "Lower your body until your chest nearly touches the floor.",
      "Push back up to the starting position."
    ]
  },
  {
    id: 'c-2',
    name: "Incline Push-Ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight / Bench",
    sets: "3",
    reps: "10-15",
    rest: "60 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/pushups.webp",
    instructions: [
      "Place hands on an elevated surface (bench or box).",
      "Lower your chest towards the edge.",
      "Push back up to the starting position."
    ]
  },
  {
    id: 'c-3',
    name: "Knee Push-Ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3",
    reps: "10-15",
    rest: "60 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 5,
    videoUrl: "",
    imageUrl: "/images/exercises/pushups.webp",
    instructions: [
      "Perform a standard push-up but rest your knees on the ground."
    ]
  },
  {
    id: 'c-4',
    name: "Dumbbell Floor Press",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    sets: "3",
    reps: "10-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/dumbbell_floor_press.webp",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Hold dumbbells above you with arms extended.",
      "Lower elbows until they touch the floor, then press back up."
    ]
  },
  {
    id: 'c-5',
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell",
    sets: "3-4",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/benchpress.webp",
    instructions: [
      "Lie flat on the bench, feet firmly on the ground.",
      "Grip the bar slightly wider than shoulder-width.",
      "Lower the bar to your mid-chest.",
      "Press the bar back up explosively."
    ]
  },
  {
    id: 'c-6',
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells / Bench",
    sets: "3-4",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/incline_dumbbell_press.webp",
    instructions: [
      "Set bench to a 30-45 degree incline.",
      "Press dumbbells directly above your chest.",
      "Lower them until you feel a stretch, then press back up."
    ]
  },
  {
    id: 'c-7',
    name: "Dumbbell Flyes",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells / Bench",
    sets: "3",
    reps: "10-15",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/dumbbell_flyes.webp",
    instructions: [
      "Lie on bench holding dumbbells above you with a slight bend in elbows.",
      "Lower arms in a wide arc until you feel a stretch in the chest.",
      "Bring them back together."
    ]
  },
  {
    id: 'c-8',
    name: "Chest Dips",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dip Station",
    sets: "3-4",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/dips.webp",
    instructions: [
      "Support yourself on dip bars.",
      "Lean torso forward slightly to target chest.",
      "Lower body until arms are at a 90-degree angle, then press up."
    ]
  },
  {
    id: 'c-9',
    name: "Weighted Dips",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Dip Station / Weights",
    sets: "4",
    reps: "6-10",
    rest: "120 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 10,
    videoUrl: "",
    imageUrl: "/images/exercises/dips.webp",
    instructions: [
      "Attach a weight belt with plates.",
      "Perform chest dips, focusing on deep stretches and explosive lockouts."
    ]
  },
  {
    id: 'c-10',
    name: "Decline Bench Press",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Barbell / Decline Bench",
    sets: "4",
    reps: "8-10",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/decline_bench_press.webp",
    instructions: [
      "Secure feet on a decline bench.",
      "Lower the barbell to the lower chest line.",
      "Press upwards."
    ]
  },
  {
    id: 'c-11',
    name: "Cable Flyes",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Cable Machine",
    sets: "4",
    reps: "12-15",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/cable_flyes.webp",
    instructions: [
      "Set pulleys at chest height.",
      "Bring handles together in a hugging motion, crossing wrists at the end.",
      "Slowly return to start."
    ]
  },

  // --- BACK ---
  {
    id: 'b-1',
    name: "Superman Hold",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3",
    reps: "30-60 sec",
    rest: "60 sec",
    exerciseType: "Endurance",
    caloriesPerMinute: 5,
    videoUrl: "",
    imageUrl: "/images/exercises/pull.webp",
    instructions: [
      "Lie face down on the floor with arms extended ahead.",
      "Lift your chest, arms, and legs off the ground simultaneously.",
      "Hold the position and squeeze your glutes and lower back."
    ]
  },
  {
    id: 'b-2',
    name: "Resistance Band Rows",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Resistance Band",
    sets: "3",
    reps: "15-20",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/pull.webp",
    instructions: [
      "Anchor the band at chest height or wrap it around your feet if seated.",
      "Pull the bands toward your torso, squeezing shoulder blades together."
    ]
  },
  {
    id: 'b-3',
    name: "Inverted Rows",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Barbell / Smith Machine",
    sets: "3",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/pull.webp",
    instructions: [
      "Set a bar at waist height.",
      "Lie under the bar, grip it wider than shoulders.",
      "Pull your chest up to the bar while keeping your body straight."
    ]
  },
  {
    id: 'b-4',
    name: "Lat Pulldown",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    sets: "4",
    reps: "10-12",
    rest: "90 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/latpulldown.webp",
    instructions: [
      "Grip the wide bar and sit securely.",
      "Pull the bar down to your upper chest.",
      "Slowly let the bar return to the top, stretching the lats."
    ]
  },
  {
    id: 'b-5',
    name: "Seated Cable Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    sets: "4",
    reps: "10-12",
    rest: "90 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/barbellrow.webp",
    instructions: [
      "Sit with knees slightly bent and back straight.",
      "Pull the V-handle toward your belly button.",
      "Squeeze shoulder blades together and release."
    ]
  },
  {
    id: 'b-6',
    name: "One-Arm Dumbbell Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Dumbbells / Bench",
    sets: "3-4",
    reps: "8-12 per arm",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/onearm_dumbbell_row.webp",
    instructions: [
      "Place one knee and hand on a flat bench.",
      "Row the dumbbell up toward your hip with the opposite arm.",
      "Lower it with control."
    ]
  },
  {
    id: 'b-7',
    name: "Pull-Ups",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    sets: "4",
    reps: "6-12",
    rest: "120 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 9,
    videoUrl: "",
    imageUrl: "/images/exercises/pullups.webp",
    instructions: [
      "Grip the bar with an overhand grip slightly wider than shoulders.",
      "Pull yourself up until your chin clears the bar.",
      "Lower yourself with control."
    ]
  },
  {
    id: 'b-8',
    name: "Deadlifts",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Barbell",
    sets: "4-5",
    reps: "3-8",
    rest: "180 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 11,
    videoUrl: "",
    imageUrl: "/images/exercises/rdls.webp",
    instructions: [
      "Stand with mid-foot under the barbell.",
      "Hinge at hips to grip the bar, keep back straight.",
      "Drive through heels and extend hips to stand up."
    ]
  },

  // --- SHOULDERS ---
  {
    id: 's-1',
    name: "Pike Push-Ups",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/ohp.webp",
    instructions: [
      "Assume an inverted V position (downward dog).",
      "Lower your head towards the floor.",
      "Push back up to the inverted V."
    ]
  },
  {
    id: 's-2',
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    sets: "4",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/dumbbell_shoulder_press.webp",
    instructions: [
      "Sit on a bench with back support.",
      "Press dumbbells directly overhead until arms lock out.",
      "Lower them slowly back to shoulder level."
    ]
  },
  {
    id: 's-3',
    name: "Lateral Raises",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    sets: "4",
    reps: "12-15",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/lateralraises.webp",
    instructions: [
      "Stand holding dumbbells at your sides.",
      "Raise arms out to the sides until parallel with the floor.",
      "Lower with control."
    ]
  },
  {
    id: 's-4',
    name: "Face Pulls",
    muscleGroup: "Shoulders",
    difficulty: "Advanced",
    equipment: "Cable Machine",
    sets: "4",
    reps: "15-20",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/facepulls.webp",
    instructions: [
      "Set cable at face height with a rope attachment.",
      "Pull the rope toward your face, splitting your hands past your ears.",
      "Squeeze rear delts and release."
    ]
  },

  // --- LEGS (Quads & Hamstrings combined representation) ---
  {
    id: 'l-1',
    name: "Bodyweight Squats",
    muscleGroup: "Quadriceps",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3",
    reps: "15-20",
    rest: "60 sec",
    exerciseType: "Endurance",
    caloriesPerMinute: 8,
    videoUrl: "",
    imageUrl: "/images/exercises/legs.webp",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Sit back like you're aiming for a chair.",
      "Drive back up through your heels."
    ]
  },
  {
    id: 'l-2',
    name: "Goblet Squats",
    muscleGroup: "Quadriceps",
    difficulty: "Intermediate",
    equipment: "Dumbbell / Kettlebell",
    sets: "4",
    reps: "10-15",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 9,
    videoUrl: "",
    imageUrl: "/images/exercises/legs.webp",
    instructions: [
      "Hold a weight vertically against your chest.",
      "Descend into a deep squat, keeping chest up.",
      "Stand back up."
    ]
  },
  {
    id: 'l-3',
    name: "Barbell Back Squat",
    muscleGroup: "Quadriceps",
    difficulty: "Advanced",
    equipment: "Barbell",
    sets: "4-5",
    reps: "5-8",
    rest: "180 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 12,
    videoUrl: "",
    imageUrl: "/images/exercises/barbell_back_squat.webp",
    instructions: [
      "Rest the barbell on your upper back (traps).",
      "Squat down until thighs are parallel to the floor.",
      "Explosively drive back up."
    ]
  },
  {
    id: 'l-4',
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Barbell / Dumbbells",
    sets: "4",
    reps: "8-12",
    rest: "120 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 9,
    videoUrl: "",
    imageUrl: "/images/exercises/rdls.webp",
    instructions: [
      "Hold weight with a slight bend in the knees.",
      "Hinge at the hips, pushing them back until you feel a hamstring stretch.",
      "Squeeze glutes to return to standing."
    ]
  },
  {
    id: 'l-5',
    name: "Standing Calf Raises",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "4",
    reps: "20-25",
    rest: "60 sec",
    exerciseType: "Endurance",
    caloriesPerMinute: 5,
    videoUrl: "",
    imageUrl: "/images/exercises/calves.webp",
    instructions: [
      "Stand on the edge of a step.",
      "Raise your heels as high as possible.",
      "Lower heels below the step to stretch."
    ]
  },
  
  // --- ARMS (Biceps & Triceps) ---
  {
    id: 'a-1',
    name: "Dumbbell Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    sets: "3",
    reps: "12-15",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 5,
    videoUrl: "",
    imageUrl: "/images/exercises/dumbbell_curl.webp",
    instructions: [
      "Stand or sit holding dumbbells.",
      "Curl the weight up, keeping elbows pinned to your sides.",
      "Lower slowly."
    ]
  },
  {
    id: 'a-2',
    name: "Rope Pushdowns",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    sets: "4",
    reps: "12-15",
    rest: "60 sec",
    exerciseType: "Hypertrophy",
    caloriesPerMinute: 6,
    videoUrl: "",
    imageUrl: "/images/exercises/tricepextension.webp",
    instructions: [
      "Attach a rope to the high pulley.",
      "Push the rope down, splitting the handles at the bottom.",
      "Slowly return to start."
    ]
  },
  {
    id: 'a-3',
    name: "Skull Crushers",
    muscleGroup: "Triceps",
    difficulty: "Advanced",
    equipment: "EZ Bar / Bench",
    sets: "4",
    reps: "8-12",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/arms.webp",
    instructions: [
      "Lie on a bench holding an EZ bar overhead.",
      "Lower the bar towards your forehead by bending the elbows.",
      "Extend arms back to the starting position."
    ]
  },
  
  // --- CORE & CARDIO ---
  {
    id: 'ab-1',
    name: "Plank",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    sets: "3",
    reps: "30-60 sec",
    rest: "60 sec",
    exerciseType: "Endurance",
    caloriesPerMinute: 4,
    videoUrl: "",
    imageUrl: "/images/exercises/plank.webp",
    instructions: [
      "Rest on forearms and toes, keeping your body in a straight line.",
      "Brace your core tight and hold."
    ]
  },
  {
    id: 'ab-2',
    name: "Hanging Leg Raises",
    muscleGroup: "Abs",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    sets: "3",
    reps: "10-15",
    rest: "90 sec",
    exerciseType: "Strength",
    caloriesPerMinute: 7,
    videoUrl: "",
    imageUrl: "/images/exercises/pull.webp",
    instructions: [
      "Hang from a bar.",
      "Raise your straight legs until they are parallel to the floor.",
      "Lower with control to prevent swinging."
    ]
  },
  {
    id: 'crd-1',
    name: "HIIT Sprint Intervals",
    muscleGroup: "Cardio",
    difficulty: "Advanced",
    equipment: "Treadmill / Track",
    sets: "8-10 rounds",
    reps: "30s sprint / 30s rest",
    rest: "30 sec",
    exerciseType: "Cardio",
    caloriesPerMinute: 15,
    videoUrl: "",
    imageUrl: "/images/exercises/legs.webp",
    instructions: [
      "Sprint at maximum effort for 30 seconds.",
      "Walk or jog very slowly for 30 seconds to recover.",
      "Repeat."
    ]
  }
];
