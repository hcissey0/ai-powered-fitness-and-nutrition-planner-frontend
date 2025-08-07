// context/data-context.tsx
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  Progress,
  FitnessPlan,
  MealTracking,
  WaterTracking,
  WorkoutTracking,
  DayStats,
  NutritionDay,
  WorkoutDay,
  User,
} from "@/interfaces";
import { useAuth } from "./auth-context";
import { handleApiError } from "@/lib/error-handler";
import * as api from "@/lib/api-service";
import { GeneratePlanDialog } from "@/components/generate-plan-dialog";
import { OnboardingDialog } from "@/components/onboarding-dialog";

type RefreshableDataType =
  | "all-data"
  | "plans"
  | "daily-progress"
  | "workout-tracking"
  | "meal-tracking"
  | "water-tracking";

interface DataContextType {
  plans: FitnessPlan[];
  activePlan: FitnessPlan | null;
  progress: Progress[];
  weeklyProgress: Progress[];
  workoutTracking: WorkoutTracking[];
  mealTracking: MealTracking[];
  waterTracking: WaterTracking[];
  todayStats: DayStats | null;
  todayNutrition: NutritionDay | null;
  todayWorkout: WorkoutDay | null;
  dataLoading: boolean;
  settings: {
    trackingEnabled: boolean | undefined;
    trackAfterRestTimer: boolean | undefined;
    startRestTimerAfterExercise: boolean | undefined;
    connectedToGoogleAccount: boolean | undefined;
    times: {
      breakfast: string | undefined;
      lunch: string | undefined;
      snack: string | undefined;
      dinner: string | undefined;
      workout: string | undefined;
    };
  };
  createPlan: (startDate: string) => Promise<void>;
  removePlan: (planId: number) => Promise<void>;
  track: (
    action: "track" | "untrack",
    type: "meal" | "workout" | "water",
    itemId: number,
    trackingId: number,
    sets: number,
    calories_burned: number,
    litres_consumed: number
  ) => Promise<void>;
  refresh: (type: RefreshableDataType) => Promise<void>;
  setGeneratePlanOpen: (isOpen: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
  const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
  const [waterTracking, setWaterTracking] = useState<WaterTracking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [isGeneratePlanOpen, setInternalGeneratePlanOpen] = useState(false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);

  const setGeneratePlanOpen = (isOpen: boolean) => {
    if (isOpen) {
      if (user?.profile) {
        setInternalGeneratePlanOpen(true);
      } else {
        setOnboardingOpen(true);
      }
    } else {
      setInternalGeneratePlanOpen(false);
    }
  };

  const refresh = useCallback(
    async (
      type: RefreshableDataType,
      { showErrorToast = true, rethrowError = false } = {}
    ) => {
      if (!isAuthenticated) return;
      try {
        const fetchMap = {
          plans: async () => setPlans(await api.getPlans()),
          "daily-progress": async () =>
            setProgress((await api.getProgress()).progress),
          "workout-tracking": async () =>
            setWorkoutTracking(await api.getWorkoutTracking()),
          "meal-tracking": async () =>
            setMealTracking(await api.getMealTracking()),
          "water-tracking": async () =>
            setWaterTracking(await api.getWaterTracking()),
          "all-data": async () => {
            const [plansData, progressData, mealData, workoutData, waterData] =
              await Promise.all([
                api.getPlans(),
                api.getProgress(),
                api.getMealTracking(),
                api.getWorkoutTracking(),
                api.getWaterTracking(),
              ]);
            setPlans(plansData);
            setProgress(progressData.progress);
            setMealTracking(mealData);
            setWorkoutTracking(workoutData);
            setWaterTracking(waterData);
          },
        };
        await fetchMap[type]();
      } catch (err) {
        if (showErrorToast)
          handleApiError(err, `Failed to refresh ${type.replace("-", " ")}.`);
        if (rethrowError) throw err;
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (isAuthenticated) {
      setDataLoading(true);
      if (!user?.profile) {
        setOnboardingOpen(true);
        setDataLoading(false);
      } else {
        refresh("all-data", { showErrorToast: false }).finally(() =>
          setDataLoading(false)
        );
      }
    }
  }, [isAuthenticated, user, refresh]);

  const activePlan = useMemo(
    () => plans.find((p) => p.is_active) || null,
    [plans]
  );

  const settings = useMemo(() => {
    return {
      trackingEnabled: user?.profile?.tracking_enabled,
      trackAfterRestTimer: user?.profile?.track_after_rest_timer,
      startRestTimerAfterExercise:
        user?.profile?.start_rest_timer_after_exercise,
      connectedToGoogleAccount: user?.profile?.connected_to_google_account,
      times: {
        breakfast: user?.profile?.breakfast_time,
        lunch: user?.profile?.lunch_time,
        snack: user?.profile?.snack_time,
        dinner: user?.profile?.dinner_time,
        workout: user?.profile?.workout_time,
      },
    };
  }, [user]);

  const weeklyProgress = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return progress.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= monday && entryDate <= sunday;
    });
  }, [progress]);

  const { todayNutrition, todayWorkout } = useMemo(() => {
    if (!activePlan) return { todayNutrition: null, todayWorkout: null };
    const dayOfWeek = new Date().getDay();
    const nutrition =
      activePlan.nutrition_days.find((nd) => nd.day_of_week === dayOfWeek) ||
      null;
    const workout =
      activePlan.workout_days.find((wd) => wd.day_of_week === dayOfWeek) ||
      null;
    return { todayNutrition: nutrition, todayWorkout: workout };
  }, [activePlan]);

  const todayStats: DayStats | null = useMemo(() => {
    if (!todayNutrition && !todayWorkout) return null;

    const mealsLogged =
      todayNutrition?.meals.filter((m) =>
        mealTracking.some((mt) => mt.meal === m.id)
      ) || [];
    const { proteinConsumed, fatsConsumed, carbsConsumed } = mealsLogged.reduce(
      (a, m) => {
        return {
          proteinConsumed: a.proteinConsumed + m.protein_grams,
          fatsConsumed: a.fatsConsumed + m.fats_grams,
          carbsConsumed: a.carbsConsumed + m.carbs_grams,
        };
      },
      { proteinConsumed: 0, fatsConsumed: 0, carbsConsumed: 0 }
    );

    const workoutsCompleted =
      todayWorkout?.exercises.filter((e) =>
        workoutTracking.some((wt) => wt.exercise === e.id)
      ) || [];

    const caloriesConsumed = mealsLogged.reduce(
      (sum, meal) => sum + meal.calories,
      0
    );

    const caloriesBurned = workoutTracking
      .filter((wt) => workoutsCompleted.some((wc) => wc.id === wt.exercise))
      .reduce((a, wt) => a + wt.calories_burned, 0);

    const caloriesToBurn =
      todayWorkout?.exercises.reduce((a, e) => a + e.calories_to_burn, 0) || 0;

    const waterConsumed = waterTracking
      .filter((wt) => wt.nutrition_day === todayNutrition?.id)
      .reduce((sum, wt) => sum + wt.litres_consumed, 0);

    return {
      workouts_completed: workoutsCompleted.length,
      total_workouts: todayWorkout?.exercises.length || 0,
      meals_logged: mealsLogged.length,
      total_meals: todayNutrition?.meals.length || 0,
      calories_consumed: caloriesConsumed,
      calories_burned: caloriesBurned,
      calories_to_burn: caloriesToBurn,
      target_calories: todayNutrition?.target_calories || 0,
      water_intake: waterConsumed,
      target_water: todayNutrition?.target_water_litres || 0,
      protein: proteinConsumed,
      total_protein: todayNutrition?.target_protein_grams || 0,
      carbs: carbsConsumed,
      total_carbs: todayNutrition?.target_carbs_grams || 0,
      fats: fatsConsumed,
      total_fats: todayNutrition?.target_fats_grams || 0,
    };
  }, [
    activePlan,
    mealTracking,
    workoutTracking,
    waterTracking,
    todayNutrition,
    todayWorkout,
  ]);

  const createPlan = async (start_date: string) => {
    try {
      await api.generatePlan({ start_date });
      await refresh("plans", { showErrorToast: false });
    } catch (error) {
      handleApiError(error, "Failed to generate plan.");
      throw error;
    }
  };

  const removePlan = async (planId: number) => {
    try {
      await api.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (error) {
      handleApiError(error, "Failed to delete plan.");
      throw error;
    }
  };

  const track = async (
    action: "track" | "untrack",
    type: "meal" | "workout" | "water",
    itemId: number,
    trackingId: number,
    sets: number,
    calories_burned: number,
    litres_consumed: number
  ) => {
    try {
      if (!settings.trackingEnabled) throw new Error("Tracking disabled");
      const date = new Date().toISOString().split("T")[0];
      if (action === "untrack" && trackingId) {
        const actionMap = {
          meal: () => api.deleteMealTracking(trackingId),
          workout: () => api.deleteWorkoutTracking(trackingId),
          water: () => api.deleteWaterTracking(trackingId),
        };
        await actionMap[type]();
      } else if (action === "track") {
        const actionMap = {
          meal: () =>
            api.createMealTracking({
              meal: itemId,
              date_completed: date,
              portion_consumed: 1,
            }),
          workout: () =>
            api.createWorkoutTracking({
              exercise: itemId,
              date_completed: date,
              calories_burned: calories_burned || 0,
              sets_completed: sets || 0,
            }),
          water: () =>
            api.createWaterTracking({
              date,
              nutrition_day: itemId,
              litres_consumed: litres_consumed || 0,
            }),
        };
        await actionMap[type]();
      }

      await Promise.all([
        refresh(
          type === "meal"
            ? "meal-tracking"
            : type === "workout"
            ? "workout-tracking"
            : "water-tracking",
          { showErrorToast: false }
        ),
        refresh("daily-progress", { showErrorToast: false }),
      ]);
    } catch (error) {
      handleApiError(error, `Failed to ${action} ${type}.`);
      throw error;
    }
  };

  if (!isAuthenticated) return null; // AuthProvider handles redirect
  if (dataLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
          <p className="text-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        plans,
        activePlan,
        progress,
        weeklyProgress,
        workoutTracking,
        mealTracking,
        waterTracking,
        todayStats,
        todayNutrition,
        todayWorkout,
        dataLoading,
        settings,
        createPlan,
        removePlan,
        track,
        refresh,
        setGeneratePlanOpen,
      }}
    >
      {children}
      <GeneratePlanDialog
        open={isGeneratePlanOpen}
        onClose={() => setInternalGeneratePlanOpen(false)}
        onPlanGenerated={() => {
          refresh("all-data", { showErrorToast: false });
          setInternalGeneratePlanOpen(false);
        }}
      />
      <OnboardingDialog
        open={isOnboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => {
          setOnboardingOpen(false);
          refreshUser().then((updatedUser: User | null) => {
            if (updatedUser?.profile) {
              refresh("all-data", { showErrorToast: false });
            }
          });
        }}
      />
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined)
    throw new Error("useData must be used within a DataProvider");
  return context;
};
