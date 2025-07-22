// this context for fetching all required data
"use client";

import { DailyProgress, FitnessPlan, MealTracking, WorkoutTracking } from "@/interfaces";
import { api } from "@/lib/axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { handleApiError } from "@/lib/error-handler";
import { getDailyProgress, getMealTracking, getPlans, getWorkoutTracking } from "@/lib/api-service";

interface DataContextType {
    plans: FitnessPlan[];
    activePlan: FitnessPlan | null;
    dailyProgress: DailyProgress[];
    workoutTracking: WorkoutTracking[];
    mealTracking: MealTracking[];
    dataLoading: boolean;
    dataLoaded: boolean;
    todayStats: DayStats | null;
    refreshData: () => void;
}

interface DayStats {
    workouts_completed: number;
    total_workouts: number;
    meals_logged: number;
    total_meals: number;
    calories_consumed: number;
    water_intake: number;
    target_water: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children } : { children: ReactNode }) => {
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [activePlan, setActivePlan] = useState<FitnessPlan | null>(plans.find((p) => p.is_active) || null)
    const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
    const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
    const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    const today = new Date().toDateString()

    const todayStats = null;
    
    

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
            
            setPlans(plans);
            setActivePlan(plans.find((p) => p.is_active) || null)
            setDailyProgress(dailyProgress.progress);
            setWorkoutTracking(workoutTracking);
            setMealTracking(mealTracking);
            setDataLoaded(true);
            console.log('data fetched', {plans, dailyProgress, workoutTracking, mealTracking, activePlan})
        } catch (error) {
            setDataLoaded(false);
            handleApiError(error, "Error fetching data")
        } finally {
            setDataLoading(false);
        }
    }

    if (!user) 
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
            dailyProgress, workoutTracking,
            mealTracking, refreshData, dataLoading,
            dataLoaded, todayStats
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