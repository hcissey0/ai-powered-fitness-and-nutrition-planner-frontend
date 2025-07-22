import { FitnessPlan, Profile, WorkoutTracking, MealTracking, DailyProgress, WaterTracking } from "@/interfaces";
import { api } from "@/lib/axios";

export const createProfile = async (
  profileData: Partial<Profile>
): Promise<Profile> => {
  console.log("Creating profile with data:", profileData);
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
  console.log("Updating profile with data:", profileData);
  const response = await api.patch<Profile>("/users/me/profile/", profileData);
  return response.data;
};

export const updateUser = async (
  userData: { first_name?: string; last_name?: string; username?: string; email?: string; password?: string }
): Promise<any> => {
  console.log("Updating user with data:", userData);
  const response = await api.patch("/users/me/", userData);
  return response.data;
};

export const getPlans = async (): Promise<FitnessPlan[]> => {
    const response = await api.get<FitnessPlan[]>("/users/me/plans/");
    console.log(response)
    console.log("Fetched plans:", response.data);
    return response.data;
}

export const generatePlan = async (dateRange: {
  start_date: string;
}): Promise<{
  message: string;
  plan: FitnessPlan;
}> => {
  console.log("Generating new AI fitness plan...");
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
    console.error("Backend is down:", error);
    return false;
  }
}

// Workout Tracking API functions
export const getWorkoutTracking = async (date?: string): Promise<WorkoutTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<WorkoutTracking[]>("/users/me/workout-tracking/", { params });
  return response.data;
};

export const createWorkoutTracking = async (
  trackingData: Omit<WorkoutTracking, 'id' | 'exercise_name' | 'exercise_sets' | 'created_at'>
): Promise<WorkoutTracking> => {
  console.log("Creating workout tracking with data:", trackingData);
  const response = await api.post<WorkoutTracking>("/users/me/workout-tracking/", trackingData);
  return response.data;
};

export const deleteWorkoutTracking = async (trackingId: number): Promise<void> => {
  await api.delete("/users/me/workout-tracking/", { data: { id: trackingId } });
};

// Meal Tracking API functions
export const getMealTracking = async (date?: string): Promise<MealTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<MealTracking[]>("/users/me/meal-tracking/", { params });
  return response.data;
};

export const createMealTracking = async (
  trackingData: Omit<MealTracking, 'id' | 'meal_description' | 'meal_type' | 'created_at'>
): Promise<MealTracking> => {
  console.log("Creating meal tracking with data:", trackingData);
  const response = await api.post<MealTracking>("/users/me/meal-tracking/", trackingData);
  return response.data;
};

export const deleteMealTracking = async (trackingId: number): Promise<void> => {
  await api.delete("/users/me/meal-tracking/", { data: { id: trackingId } });
};


// Water tracking functions
export const getWaterTracking = async (date?: string): Promise<WaterTracking[]> => {
  const params = date ? { date } : {};
  const response = await api.get<WaterTracking[]>("/users/me/water-tracking/", { params });
  return response.data;
}

export const createWaterTracking = async (
  trackingData: Omit<WaterTracking, 'id' | 'created_at' | 'target_litres'>
): Promise<WaterTracking> => {
  console.log("Creating water tracking data with", trackingData);
  const response = await api.post<WaterTracking>("/users/me/water-tracking/", trackingData);
  return response.data;
}

export const deleteWaterTracking = async (trackingId: number): Promise<void> => {
  await api.delete("/users/me/water-tracking", { data: {id: trackingId}});
}

// Daily Progress API function
export const getDailyProgress = async (
  params: { date?: string; start_date?: string; end_date?: string } = {}
): Promise<{ progress: DailyProgress[] }> => {
  console.log("Fetching daily progress with params:", params);
  const response = await api.get<{ progress: DailyProgress[] }>("/users/me/daily-progress/", { params });
  return response.data;
};

export const deletePlan = async (planId: number): Promise<void> => {
  await api.delete(`/users/me/plans/`, { data: { id: planId } });
};
