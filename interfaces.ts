export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile: Profile | null;
}

export interface Profile {
  user: User;
  image?: string | null;
  current_weight: number | null;
  height: number | null;
  age: number | null;
  gender: "male" | "female" | null;
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | null;
  goal: "weight_loss" | "maintenance" | "muscle_gain" | null;
  dietary_preferences: string;
  bmi: number | null;
  created_at: string;
  updated_at: string;
}

export interface FitnessPlan {
  id: number;
  profile: Profile // or Profile if embedded
  start_date: string;
  end_date: string;
  goal_at_creation: string;
  is_active: boolean;
  ai_prompt_text: string;
  ai_response_raw: any;
  created_at: string;
  workout_days: WorkoutDay[];
  nutrition_days: NutritionDay[];
}

export interface WorkoutDay {
  id: number;
  plan: number; // or FitnessPlan
  day_of_week: number;
  title: string;
  description: string;
  is_rest_day: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  workout_day: number;
  name: string;
  sets: number;
  reps: string;
  rest_period_seconds: number;
  notes?: string;
}

export interface NutritionDay {
  id: number;
  plan: number;
  day_of_week: number;
  notes?: string;
  target_calories?: number;
  target_protein_grams?: number;
  target_carbs_grams?: number;
  target_fats_grams?: number;
  target_water_litres?: number;
  meals: Meal[];
}

export interface Meal {
  id: number;
  nutrition_day: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  description: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  portion_size: string;
}

export interface WorkoutTracking {
  id: number;
  exercise: number;
  exercise_name: string;
  exercise_sets: number;
  date_completed: string;
  sets_completed: number;
  notes?: string;
  created_at: string;
}

export interface MealTracking {
  id: number;
  meal: number;
  meal_description: string;
  meal_type: string;
  date_completed: string;
  portion_consumed: number;
  notes?: string;
  created_at: string;
}

export interface WaterTracking {
  id: number;
  date: string;
  nutrition_day: number;
  litres_consumed: number;
  target_litres: number;
  notes?: string;
  created_at: string;
}

export interface DailyProgress {
  date: string;
  day_of_week: number;
  workout_progress: number;
  total_workout: number;
  nutrition_progress: number;
  total_nutrition: number;
  is_rest_day: boolean;
}


export interface DayStats {
    workouts_completed: number;
    total_workouts: number;
    meals_logged: number;
    total_meals: number;
    calories_consumed: number;
    target_calories: number;
    water_intake: number;
    target_water: number;
    protein: number;
    carbs: number;
    fats: number;
}