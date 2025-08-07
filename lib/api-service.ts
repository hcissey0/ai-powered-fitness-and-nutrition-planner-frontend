// lib/api-service.ts
import {
  FitnessPlan,
  Profile,
  WorkoutTracking,
  MealTracking,
  Progress,
  WaterTracking,
  User,
} from "@/interfaces";
import { api } from "@/lib/axios";

export const createProfile = async (
  profileData: Partial<Profile>
): Promise<Profile> => {
  const response = await api.post<Profile>("/users/me/profile/", profileData);
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get<Profile>("/users/me/profile/");
  return response.data;
};

export const updateProfile = async (
  profileData: Partial<Profile>
): Promise<Profile> => {
  const response = await api.patch<Profile>("/users/me/profile/", profileData);
  return response.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.patch<User>("/users/me/", userData);
  return response.data;
};

export const getPlans = async (): Promise<FitnessPlan[]> => {
  const response = await api.get<FitnessPlan[]>("/users/me/plans/");
  return response.data;
};

export const generatePlan = async (dateRange: {
  start_date: string;
}): Promise<{
  message: string;
  plan: FitnessPlan;
}> => {
  const response = await api.post<{
    message: string;
    plan: FitnessPlan;
  }>("/users/me/plans/", dateRange);
  return response.data;
};

export const isBackendUp = async (): Promise<boolean> => {
  try {
    const response = await api.get("/status/");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Workout Tracking API functions
export const getWorkoutTracking = async (
  date?: string
): Promise<WorkoutTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<WorkoutTracking[]>(
    "/users/me/workout-tracking/",
    { params }
  );
  return response.data;
};

export const createWorkoutTracking = async (
  trackingData: Omit<
    WorkoutTracking,
    "id" | "exercise_name" | "exercise_sets" | "created_at"
  >
): Promise<WorkoutTracking> => {
  const response = await api.post<WorkoutTracking>(
    "/users/me/workout-tracking/",
    trackingData
  );
  return response.data;
};

export const deleteWorkoutTracking = async (
  trackingId: number
): Promise<void> => {
  await api.delete("/users/me/workout-tracking/", { data: { id: trackingId } });
};

// Meal Tracking API functions
export const getMealTracking = async (
  date?: string
): Promise<MealTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<MealTracking[]>("/users/me/meal-tracking/", {
    params,
  });
  return response.data;
};

export const createMealTracking = async (
  trackingData: Omit<
    MealTracking,
    "id" | "meal_description" | "meal_type" | "created_at"
  >
): Promise<MealTracking> => {
  const response = await api.post<MealTracking>(
    "/users/me/meal-tracking/",
    trackingData
  );
  return response.data;
};

export const deleteMealTracking = async (trackingId: number): Promise<void> => {
  await api.delete("/users/me/meal-tracking/", { data: { id: trackingId } });
};

// Water tracking functions
export const getWaterTracking = async (
  date?: string
): Promise<WaterTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<WaterTracking[]>("/users/me/water-tracking/", {
    params,
  });
  return response.data;
};

export const createWaterTracking = async (
  trackingData: Omit<WaterTracking, "id" | "created_at" | "target_litres">
): Promise<WaterTracking> => {
  const response = await api.post<WaterTracking>(
    "/users/me/water-tracking/",
    trackingData
  );
  return response.data;
};

export const deleteWaterTracking = async (
  trackingId: number
): Promise<void> => {
  await api.delete("/users/me/water-tracking/", { data: { id: trackingId } });
};

// Daily Progress API function
export const getProgress = async (
  params: { date?: string; start_date?: string; end_date?: string } = {}
): Promise<{ progress: Progress[] }> => {
  const response = await api.get<{ progress: Progress[] }>(
    "/users/me/progress/",
    { params }
  );
  return response.data;
};

export const deletePlan = async (planId: number): Promise<void> => {
  await api.delete(`/users/me/plans/`, { data: { id: planId } });
};

export const deleteMe = async (): Promise<void> => {
  await api.delete('/users/me/delete/');
}

export const addPlanToGoogleCalendar = async (plan_id: number, type: string = 'all')
:Promise<{message: string, success_count: number, failure_count?: number}> => {
  const res = await api.post<
    { message: string, success_count: number, failure_count: number }>('/users/me/add-plan-to-calendar/',
      {
        plan_id,
        type
      }
    )
    return res.data;
}

export const loginWithGoogle = async (
  accessToken: string
): Promise<{ token: string; user: User }> => {
  const response = await api.post<{ token: string; user: User }>(
    "/auth/google/",
    {
      access_token: accessToken,
    }
  );
  return response.data;
};