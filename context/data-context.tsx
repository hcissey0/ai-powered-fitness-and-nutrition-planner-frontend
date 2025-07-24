// this context for fetching all required data
"use client";

import {
  DailyProgress,
  FitnessPlan,
  MealTracking,
  WaterTracking,
  WorkoutTracking,
  DayStats,
  NutritionDay,
  WorkoutDay,
} from "@/interfaces";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import { handleApiError } from "@/lib/error-handler";
import {
  createMealTracking,
  createWaterTracking,
  createWorkoutTracking,
  deleteMealTracking,
  deletePlan,
  deleteWaterTracking,
  deleteWorkoutTracking,
  generatePlan,
  getDailyProgress,
  getMealTracking,
  getPlans,
  getWaterTracking,
  getWorkoutTracking,
} from "@/lib/api-service";

interface DataContextType {
  plans: FitnessPlan[];
  activePlan: FitnessPlan | null;
  dailyProgress: DailyProgress[];
  workoutTracking: WorkoutTracking[];
  mealTracking: MealTracking[];
  waterTracking: WaterTracking[];

  createPlan: (start_date: string) => void;
  track: (
    action: "track" | "untrack",
    type: "meal" | "workout" | "water",
    itemId: number,
    trackingId?: number,
    sets?: number,
    litres_consumed?: number
  ) => void;

  dataLoading: boolean;
  dataLoaded: boolean;

  todayStats: DayStats | null;
  todayNutrition: NutritionDay | null;
  todayWorkout: WorkoutDay | null;

  refresh: (type: "all-data" | "plans" | "daily-progress" | "workout-tracking" | "meal-tracking" | "water-tracking", h?:boolean, t?:boolean) => void
  removePlan: (planId: number, h?: boolean, t?: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {

    // States
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
  const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
  const [waterTracking, setWaterTracking] = useState<WaterTracking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);


  const today = new Date();

  // Memos
  const activePlan: FitnessPlan | null = useMemo(()=>plans.find((p)=>p.is_active)||null,[plans])

  const todayNutrition: NutritionDay | null = useMemo(() =>
    activePlan?.nutrition_days.find((nd) => nd.day_of_week === today.getDay()) || null,
[activePlan]);
  const todayWorkout: WorkoutDay | null = useMemo(()=>activePlan?.workout_days.find((wd)=>wd.day_of_week===today.getDay())||null,[activePlan])

  const todayStats: DayStats | null = useMemo(() => {
    if (!activePlan) return null;
    const total_meals = todayNutrition?.meals;
    const meals_logged = todayNutrition?.meals.filter((m) =>
      mealTracking.find((mt) => mt.meal === m.id)
    );
    const total_workouts = todayWorkout?.exercises;
    const workouts_completed = todayWorkout?.exercises.filter((w) =>
      workoutTracking.find((wt) => wt.exercise === w.id)
    );

    const calories_consumed = meals_logged?.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    const target_calories = total_meals?.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    const water_intake = waterTracking.filter((wt) => wt.nutrition_day === todayNutrition?.id).reduce(
      (total, wt) => total + wt.litres_consumed,
      0
    );
    const target_water = todayNutrition?.target_water_litres;

    const todayStats = {
      workouts_completed: workouts_completed?.length,
      total_workouts: total_workouts?.length,
      meals_logged: meals_logged?.length,
      total_meals: total_meals?.length,
      calories_consumed,
      target_calories,
      water_intake,
      target_water,
      protein: todayNutrition?.target_protein_grams,
      carbs: todayNutrition?.target_carbs_grams,
      fats: todayNutrition?.target_fats_grams,
    } as DayStats;
    console.log("stats from data:", todayStats);
    return todayStats;
  }, [activePlan, mealTracking, workoutTracking, waterTracking]);


  const { user } = useAuth();
  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      await refresh('all-data')
    } catch (error) {
      setDataLoaded(false);
      handleApiError(error, "Error fetching data");
    } finally {
      setDataLoading(false);
    }
  };

  const refresh = async (type: "all-data" | "plans" | "daily-progress" | "workout-tracking" | "meal-tracking" | "water-tracking", h=true, t=true) => {
    try {

        switch (type) {
            case "plans":
                const plans = await getPlans();
                setPlans(plans);
                break;
            case "daily-progress":
                const dailyProgress = await getDailyProgress();
                setDailyProgress(dailyProgress.progress);
                break;
            case "workout-tracking":
                const workoutTracking = await getWorkoutTracking();
                setWorkoutTracking(workoutTracking);
                break;
            case "meal-tracking":
                const mealTracking = await getMealTracking();
                setMealTracking(mealTracking);
                break;
            case "water-tracking":
                const waterTracking = await getWaterTracking();
                setWaterTracking(waterTracking);
                break;
            case "all-data":
                const plansData = await getPlans();
                const dailyProgressData = await getDailyProgress();
                const mealTrackingData = await getMealTracking();
                const workoutTrackingData = await getWorkoutTracking();
                const waterTrackingData = await getWaterTracking();
                setPlans(plansData);
                setDailyProgress(dailyProgressData.progress);
                setMealTracking(mealTrackingData);
                setWorkoutTracking(workoutTrackingData);
                setWaterTracking(waterTrackingData);
                break;
            default:
                throw new Error("Failed to refresh data.")
        }
        } catch (e) {
            if (h) handleApiError(e, `Failed to generate ${type.replace("-", " ")}.`);
            if (t) throw e;
            }
  }


  const createPlan = async (start_date: string, h=true, t=true) => {
    try {
      const { message, plan } = await generatePlan({ start_date });
      setPlans([...plans, plan]);
      // await refreshPlans();
    } catch (e) {
      if (h) handleApiError(e, "Failed to generate a plan.");
      if (t) throw e;
    }
  };

  const removePlan = async (planId:number, h=true, t=true) => {
    try {
        await deletePlan(planId);
        setPlans(plans.filter((p) => p.id !== planId));
    } catch (e) {
        if (h) handleApiError(e, "Failed to delete plan.");
        if (t) throw e;
    }
  }

  const track = async (
    action: "track" | "untrack",
    type: "meal" | "workout" | "water",
    itemId: number,
    trackingId?: number,
    sets?: number,
    litres_consumed?: number
  ) => {
    try {
      if (action === "untrack" && trackingId) {
        if (type === "meal") {
          await deleteMealTracking(trackingId);
          setMealTracking(mealTracking.filter((mt) => mt.id !== trackingId));
          // await refreshMealTracking();
        }
        if (type === "workout") {
          await deleteWorkoutTracking(trackingId);
          setWorkoutTracking(
            workoutTracking.filter((wt) => wt.id !== trackingId)
          );
          // await refreshWorkoutTracking();
        }
        if (type === "water") {
          await deleteWaterTracking(trackingId);
          setWaterTracking(waterTracking.filter((wt) => wt.id !== trackingId));
          // await refreshWaterTracking();
        }
      } else if (action === "track") {
        const date = new Date().toISOString().split("T")[0];
        if (type === "meal") {
          const trackedMeal = await createMealTracking({
            meal: itemId,
            date_completed: date,
            portion_consumed: 1,
            notes: "",
          });
          setMealTracking([...mealTracking, trackedMeal]);
          // await refreshMealTracking();
        }
        if (type === "workout") {
          const trackedWorkout = await createWorkoutTracking({
            exercise: itemId,
            date_completed: date,
            sets_completed: sets || 0,
            notes: "",
          });
          setWorkoutTracking([...workoutTracking, trackedWorkout]);
          // await refreshWorkoutTracking();
        }
        if (type === "water") {
          const trackedWater = await createWaterTracking({
            date,
            nutrition_day: itemId,
            litres_consumed: litres_consumed || 0,
            notes: "",
          });
          setWaterTracking([...waterTracking, trackedWater]);
          // await refreshWaterTracking();
        }
      }
    } catch (error) {
      handleApiError(error, `Failed to ${action} ${type}.`);
      throw error;
    }
  };

  if (!user || dataLoading)
    return (
      <div className="min-h-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );

  return (
    <DataContext.Provider
      value={{
        plans,
        activePlan,
        createPlan,
        removePlan,
        track,
        todayNutrition,
        todayWorkout,
        dailyProgress,
        workoutTracking,
        mealTracking,
        dataLoading,
        dataLoaded,
        todayStats,
        waterTracking,
        refresh
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw Error("useData must be use within a DataProvider");
  return context;
};
