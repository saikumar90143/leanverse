import { ExerciseDefinition } from './types/transformation';

export const transformationExercises: ExerciseDefinition[] = [
  // --- CHEST ---
  { id: 'chest_bench_press_bb', name: 'Barbell Bench Press', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 5, requiredEquipment: ['barbell', 'gym'] },
  { id: 'chest_bench_press_db', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 4, requiredEquipment: ['dumbbells'] },
  { id: 'chest_incline_bb', name: 'Incline Bench Press', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 5, requiredEquipment: ['barbell', 'gym'] },
  { id: 'chest_decline_bb', name: 'Decline Bench Press', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 5, requiredEquipment: ['barbell', 'gym'] },
  { id: 'chest_machine_press', name: 'Machine Press', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 3, requiredEquipment: ['gym'] },
  { id: 'chest_cable_fly', name: 'Cable Fly', muscleGroup: 'Chest', pattern: 'chest_isolation', difficulty: 4, requiredEquipment: ['cables', 'gym'] },
  { id: 'chest_db_fly', name: 'Dumbbell Fly', muscleGroup: 'Chest', pattern: 'chest_isolation', difficulty: 3, requiredEquipment: ['dumbbells'] },
  { id: 'chest_butterfly', name: 'Butterfly Machine', muscleGroup: 'Chest', pattern: 'chest_isolation', difficulty: 2, requiredEquipment: ['gym'] },
  { id: 'chest_pushup', name: 'Push Up', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 2, requiredEquipment: ['bodyweight'] },
  { id: 'chest_weighted_pushup', name: 'Weighted Push Up', muscleGroup: 'Chest', pattern: 'horizontal_push', difficulty: 4, requiredEquipment: ['bodyweight'] },
  { id: 'chest_pec_deck', name: 'Pec Deck', muscleGroup: 'Chest', pattern: 'chest_isolation', difficulty: 2, requiredEquipment: ['gym'] },

  // --- BACK ---
  { id: 'back_pullup', name: 'Pull Up', muscleGroup: 'Back', pattern: 'vertical_pull', difficulty: 6, requiredEquipment: ['bodyweight'] },
  { id: 'back_lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', pattern: 'vertical_pull', difficulty: 3, requiredEquipment: ['cables', 'gym'] },
  { id: 'back_cable_row', name: 'Cable Row', muscleGroup: 'Back', pattern: 'horizontal_pull', difficulty: 3, requiredEquipment: ['cables', 'gym'] },
  { id: 'back_tbar_row', name: 'T Bar Row', muscleGroup: 'Back', pattern: 'horizontal_pull', difficulty: 5, requiredEquipment: ['barbell', 'gym'] },
  { id: 'back_bent_over_row', name: 'Bent Over Row', muscleGroup: 'Back', pattern: 'horizontal_pull', difficulty: 6, requiredEquipment: ['barbell', 'gym'] },
  { id: 'back_deadlift', name: 'Deadlift', muscleGroup: 'Back', pattern: 'hinge', difficulty: 8, requiredEquipment: ['barbell', 'gym'] },
  { id: 'back_single_arm_row', name: 'Single Arm Row', muscleGroup: 'Back', pattern: 'horizontal_pull', difficulty: 4, requiredEquipment: ['dumbbells'] },
  { id: 'back_machine_row', name: 'Machine Row', muscleGroup: 'Back', pattern: 'horizontal_pull', difficulty: 3, requiredEquipment: ['gym'] },

  // --- SHOULDERS ---
  { id: 'shoulder_ohp', name: 'Overhead Press', muscleGroup: 'Shoulders', pattern: 'vertical_push', difficulty: 6, requiredEquipment: ['barbell', 'gym'] },
  { id: 'shoulder_arnold', name: 'Arnold Press', muscleGroup: 'Shoulders', pattern: 'vertical_push', difficulty: 5, requiredEquipment: ['dumbbells'] },
  { id: 'shoulder_lateral', name: 'Lateral Raise', muscleGroup: 'Shoulders', pattern: 'shoulder_isolation', difficulty: 3, requiredEquipment: ['dumbbells'] },
  { id: 'shoulder_front', name: 'Front Raise', muscleGroup: 'Shoulders', pattern: 'shoulder_isolation', difficulty: 2, requiredEquipment: ['dumbbells'] },
  { id: 'shoulder_rear_delt', name: 'Rear Delt Fly', muscleGroup: 'Shoulders', pattern: 'shoulder_isolation', difficulty: 3, requiredEquipment: ['dumbbells'] },
  { id: 'shoulder_face_pull', name: 'Face Pull', muscleGroup: 'Shoulders', pattern: 'shoulder_isolation', difficulty: 3, requiredEquipment: ['cables', 'gym'] },
  { id: 'shoulder_machine_press', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', pattern: 'vertical_push', difficulty: 3, requiredEquipment: ['gym'] },

  // --- BICEPS ---
  { id: 'bicep_barbell', name: 'Barbell Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 3, requiredEquipment: ['barbell', 'gym'] },
  { id: 'bicep_ez', name: 'EZ Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 3, requiredEquipment: ['barbell', 'gym'] },
  { id: 'bicep_hammer', name: 'Hammer Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 2, requiredEquipment: ['dumbbells'] },
  { id: 'bicep_concentration', name: 'Concentration Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 2, requiredEquipment: ['dumbbells'] },
  { id: 'bicep_cable', name: 'Cable Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 2, requiredEquipment: ['cables', 'gym'] },
  { id: 'bicep_preacher', name: 'Preacher Curl', muscleGroup: 'Biceps', pattern: 'bicep_isolation', difficulty: 3, requiredEquipment: ['gym', 'barbell'] },

  // --- TRICEPS ---
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', pattern: 'tricep_isolation', difficulty: 2, requiredEquipment: ['cables', 'gym'] },
  { id: 'tricep_overhead', name: 'Overhead Extension', muscleGroup: 'Triceps', pattern: 'tricep_isolation', difficulty: 3, requiredEquipment: ['dumbbells'] },
  { id: 'tricep_dips', name: 'Dips', muscleGroup: 'Triceps', pattern: 'vertical_push', difficulty: 5, requiredEquipment: ['bodyweight', 'gym'] },
  { id: 'tricep_skullcrushers', name: 'Skull Crushers', muscleGroup: 'Triceps', pattern: 'tricep_isolation', difficulty: 4, requiredEquipment: ['barbell', 'gym'] },
  { id: 'tricep_close_grip', name: 'Close Grip Bench', muscleGroup: 'Triceps', pattern: 'horizontal_push', difficulty: 5, requiredEquipment: ['barbell', 'gym'] },
  { id: 'tricep_kickbacks', name: 'Kickbacks', muscleGroup: 'Triceps', pattern: 'tricep_isolation', difficulty: 2, requiredEquipment: ['dumbbells'] },

  // --- LEGS ---
  { id: 'leg_squat', name: 'Squat', muscleGroup: 'Legs', pattern: 'squat', difficulty: 6, requiredEquipment: ['barbell', 'gym'] },
  { id: 'leg_front_squat', name: 'Front Squat', muscleGroup: 'Legs', pattern: 'squat', difficulty: 7, requiredEquipment: ['barbell', 'gym'] },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'Legs', pattern: 'squat', difficulty: 4, requiredEquipment: ['gym'] },
  { id: 'leg_bulgarian', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', pattern: 'squat', difficulty: 6, requiredEquipment: ['dumbbells'] },
  { id: 'leg_lunges', name: 'Lunges', muscleGroup: 'Legs', pattern: 'lunge', difficulty: 4, requiredEquipment: ['dumbbells'] },
  { id: 'leg_rdl', name: 'Romanian Deadlift', muscleGroup: 'Legs', pattern: 'hinge', difficulty: 6, requiredEquipment: ['barbell', 'gym'] },
  { id: 'leg_curl', name: 'Leg Curl', muscleGroup: 'Legs', pattern: 'leg_isolation', difficulty: 2, requiredEquipment: ['gym'] },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'Legs', pattern: 'leg_isolation', difficulty: 2, requiredEquipment: ['gym'] },
  { id: 'leg_calf_raises', name: 'Calf Raises', muscleGroup: 'Legs', pattern: 'leg_isolation', difficulty: 2, requiredEquipment: ['bodyweight'] },

  // --- ABS (CORE) ---
  { id: 'abs_crunches', name: 'Crunches', muscleGroup: 'Abs', pattern: 'core_flexion', difficulty: 1, requiredEquipment: ['bodyweight'] },
  { id: 'abs_leg_raises', name: 'Leg Raises', muscleGroup: 'Abs', pattern: 'core_flexion', difficulty: 4, requiredEquipment: ['bodyweight'] },
  { id: 'abs_cable_crunch', name: 'Cable Crunch', muscleGroup: 'Abs', pattern: 'core_flexion', difficulty: 3, requiredEquipment: ['cables', 'gym'] },
  { id: 'abs_russian_twist', name: 'Russian Twist', muscleGroup: 'Abs', pattern: 'core_iso', difficulty: 3, requiredEquipment: ['bodyweight'] },
  { id: 'abs_plank', name: 'Plank', muscleGroup: 'Abs', pattern: 'core_iso', difficulty: 2, requiredEquipment: ['bodyweight'] },
  { id: 'abs_mountain_climbers', name: 'Mountain Climbers', muscleGroup: 'Abs', pattern: 'core_flexion', difficulty: 3, requiredEquipment: ['bodyweight'] },
  { id: 'abs_ab_wheel', name: 'Ab Wheel', muscleGroup: 'Abs', pattern: 'core_flexion', difficulty: 5, requiredEquipment: ['gym'] },

  // --- CARDIO ---
  { id: 'cardio_walking', name: 'Walking', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 1, requiredEquipment: ['bodyweight'] },
  { id: 'cardio_running', name: 'Running', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 4, requiredEquipment: ['bodyweight'] },
  { id: 'cardio_cycling', name: 'Cycling', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 3, requiredEquipment: ['gym'] },
  { id: 'cardio_jumprope', name: 'Jump Rope', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 4, requiredEquipment: ['gym'] },
  { id: 'cardio_hiit', name: 'HIIT', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 7, requiredEquipment: ['bodyweight'] },
  { id: 'cardio_rowing', name: 'Rowing', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 5, requiredEquipment: ['gym'] },
  { id: 'cardio_incline_walk', name: 'Incline Walk', muscleGroup: 'Cardio', pattern: 'cardio', difficulty: 3, requiredEquipment: ['gym'] }
];
