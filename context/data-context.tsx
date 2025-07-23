// this context for fetching all required data
"use client";

import { DailyProgress, FitnessPlan, MealTracking, WaterTracking, WorkoutTracking, DayStats, NutritionDay, WorkoutDay } from "@/interfaces";
import { api } from "@/lib/axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { handleApiError } from "@/lib/error-handler";
import { getDailyProgress, getMealTracking, getPlans, getWaterTracking, getWorkoutTracking } from "@/lib/api-service";

interface DataContextType {
    plans: FitnessPlan[];
    activePlan: FitnessPlan | null;
    dailyProgress: DailyProgress[];
    workoutTracking: WorkoutTracking[];
    mealTracking: MealTracking[];
    waterTracking: WaterTracking[];
    
    dataLoading: boolean;
    dataLoaded: boolean;

    todayStats: DayStats | null;
    todayNutrition: NutritionDay | null;
    todayWorkout: WorkoutDay | null;

    refreshData: () => void;
    refreshPlans: () => void;
    refreshMealTracking: () => void;
    refreshWorkoutTracking: () => void;
    refreshWaterTracking: () => void;
    refreshTracking: () => void;
}



const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children } : { children: ReactNode }) => {
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [activePlan, setActivePlan] = useState<FitnessPlan | null>(plans.find((p) => p.is_active) || null)
    const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
    const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
    const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
    const [waterTracking, setWaterTracking] = useState<WaterTracking[]>([]);
    const [todayStats, setTodayStats]  = useState<DayStats | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    const today = new Date();
    
    
    // const activePlan = plans.find((p) => p.is_active) || null;
    
    
   
    
    const { user } = useAuth();
    useEffect(() => {
        refreshData();
    }, [user])
    
    const refreshData = async () => {
        if (!user) return;
        
        setDataLoading(true);
        try {
            const plans = await getPlans();
            const dailyProgress = await getDailyProgress();
            const workoutTracking = await getWorkoutTracking();
            const mealTracking = await getMealTracking();
            const watetTracking = await getWaterTracking();
            const activePlan = plans.find((p) => p.is_active) || null;
            
            
            setPlans(plans);
            setActivePlan(activePlan)
            setDailyProgress(dailyProgress.progress);
            setWorkoutTracking(workoutTracking);
            setWaterTracking(waterTracking);
            setMealTracking(mealTracking);
            setDataLoaded(true);

            
            const todayNutrition = activePlan?.nutrition_days.find((nd) => nd.day_of_week === today.getDay()) || null;
            const todayWorkout = activePlan?.workout_days.find((wd) => wd.day_of_week === today.getDay()) || null;
            const total_meals = todayNutrition?.meals;
                    const meals_logged = todayNutrition?.meals.filter((m) => mealTracking.find((mt) => mt.meal === m.id));
                    const total_workouts = todayWorkout?.exercises;
                    const workouts_completed = todayWorkout?.exercises.filter((w) => workoutTracking.find((wt) => wt.exercise === w.id));
                    
                    const calories_consumed = meals_logged?.reduce((total, meal) => total + meal.calories, 0);
                    
                    const target_calories = total_meals?.reduce((total, meal) => total + meal.calories, 0);
                    const water_intake = waterTracking.reduce((total, wt) => total + wt.litres_consumed, 0);
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
                        fats: todayNutrition?.target_fats_grams
                    } as DayStats
                    setTodayStats(todayStats)
                    console.log("stats from data:", todayStats)
                    
                    
            console.log('data fetched', {plans, dailyProgress, workoutTracking, mealTracking, activePlan})
        } catch (error) {
            setDataLoaded(false);
            handleApiError(error, "Error fetching data")
        } finally {
            setDataLoading(false);
        }
    }

    const refreshPlans = async () => {
        try {
            const plans = await getPlans();
            setPlans(plans)
            setActivePlan(plans.find((p) => p.is_active) || null);
        } catch (e) {
            handleApiError(e, "Failed to fetch plans.")
        }
    }

    const refreshMealTracking = async () => {
        try {
            const mealTracking = await getMealTracking();
            setMealTracking(mealTracking);
        } catch (e) {
            handleApiError(e, "Failed to fetch tracked meals.")
        }
    }

    const refreshWorkoutTracking = async () => {
        try {
            const workoutTracking = await getWorkoutTracking();
            setWorkoutTracking(workoutTracking);
        } catch (e) {
            handleApiError(e, "Failed to fetch tracked workouts.")
        }
    }

    const refreshWaterTracking = async () => {
        try {
            const watetTracking = await getWaterTracking();
            setWaterTracking(waterTracking);
        } catch (e) {
            handleApiError(e, 'Failed to fetch tracked water.')
        }
    }

    const refreshTracking = async () => {
        try {
            const waterTracking = await getWaterTracking();
            const mealTracking = await getMealTracking();
            const workoutTracking = await getWorkoutTracking();

            setWaterTracking(waterTracking);
            setMealTracking(mealTracking);
            setWorkoutTracking(workoutTracking);
        } catch (e) {
            handleApiError(e, "Failed to refresh tracking records.")
        }
    }

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
        value={{ plans, activePlan,
            // todayNutrition, todayWorkout,
            dailyProgress, workoutTracking,
            mealTracking, refreshData, dataLoading,
            dataLoaded, todayStats, waterTracking,
            refreshMealTracking, refreshWaterTracking,
            refreshPlans, refreshWorkoutTracking,
            refreshTracking
        }} >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw Error("useData must be use within a DataProvider");
    return context;
};