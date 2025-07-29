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
  createPlan: (startDate: string) => Promise<void>;
  removePlan: (planId: number) => Promise<void>;
  track: (
    action: "track" | "untrack",
    type: "meal" | "workout" | "water",
    itemId: number,
    trackingId?: number,
    sets?: number,
    litres_consumed?: number
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
        "meal-tracking": async () => setMealTracking(await api.getMealTracking()),
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
        refresh("all-data").finally(() => setDataLoading(false));
      }
    }
  }, [isAuthenticated, user, refresh]);

   const activePlan = useMemo(
     () => plans.find((p) => p.is_active) || null,
     [plans]
   );

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
     const workoutsCompleted =
       todayWorkout?.exercises.filter((e) =>
         workoutTracking.some((wt) => wt.exercise === e.id)
       ) || [];

     const caloriesConsumed = mealsLogged.reduce(
       (sum, meal) => sum + meal.calories,
       0
     );
     const waterConsumed = waterTracking
       .filter((wt) => wt.nutrition_day === todayNutrition?.id)
       .reduce((sum, wt) => sum + wt.litres_consumed, 0);

     return {
       workouts_completed: workoutsCompleted.length,
       total_workouts: todayWorkout?.exercises.length || 0,
       meals_logged: mealsLogged.length,
       total_meals: todayNutrition?.meals.length || 0,
       calories_consumed: caloriesConsumed,
       target_calories: todayNutrition?.target_calories || 0,
       water_intake: waterConsumed,
       target_water: todayNutrition?.target_water_litres || 0,
       protein: todayNutrition?.target_protein_grams || 0,
       carbs: todayNutrition?.target_carbs_grams || 0,
       fats: todayNutrition?.target_fats_grams || 0,
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
     trackingId?: number,
     sets?: number,
     litres_consumed?: number
   ) => {
     try {
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
           <p className="text-foreground mt-4">Loading Your Dashboard...</p>
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
          refresh("all-data");
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
              refresh("all-data");
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
//////////////////// old code /////////////////////

// // this context for fetching all required data
// "use client";

// import {
//   Progress,
//   FitnessPlan,
//   MealTracking,
//   WaterTracking,
//   WorkoutTracking,
//   DayStats,
//   NutritionDay,
//   WorkoutDay,
// } from "@/interfaces";
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useAuth } from "./auth-context";
// import { handleApiError } from "@/lib/error-handler";
// import {
//   createMealTracking,
//   createWaterTracking,
//   createWorkoutTracking,
//   deleteMealTracking,
//   deletePlan,
//   deleteWaterTracking,
//   deleteWorkoutTracking,
//   generatePlan,
//   getProgress,
//   getMealTracking,
//   getPlans,
//   getWaterTracking,
//   getWorkoutTracking,
// } from "@/lib/api-service";

// interface DataContextType {
//   plans: FitnessPlan[];
//   activePlan: FitnessPlan | null;
//   progress: Progress[];
//   weeklyProgress: Progress[];
//   workoutTracking: WorkoutTracking[];
//   mealTracking: MealTracking[];
//   waterTracking: WaterTracking[];

//   createPlan: (start_date: string) => void;
//   track: (
//     action: "track" | "untrack",
//     type: "meal" | "workout" | "water",
//     itemId: number,
//     trackingId?: number,
//     sets?: number,
//     litres_consumed?: number
//   ) => void;

//   dataLoading: boolean;
//   dataLoaded: boolean;

//   todayStats: DayStats | null;
//   todayNutrition: NutritionDay | null;
//   todayWorkout: WorkoutDay | null;

//   refresh: (type: "all-data" | "plans" | "daily-progress" | "workout-tracking" | "meal-tracking" | "water-tracking", h?:boolean, t?:boolean) => void
//   removePlan: (planId: number, h?: boolean, t?: boolean) => void;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// export const DataProvider = ({ children }: { children: ReactNode }) => {

//     // States
//   const [plans, setPlans] = useState<FitnessPlan[]>([]);
//   const [progress, setProgress] = useState<Progress[]>([]);
//   const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
//   const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
//   const [waterTracking, setWaterTracking] = useState<WaterTracking[]>([]);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [dataLoaded, setDataLoaded] = useState(false);

//   const today = new Date();

// function getCurrentWeekProgress(data: Progress[]): Progress[] {

//   const day = today.getDay();
//   const diffToMonday = (day === 0 ? -6 : 1) - day;

//   const monday = new Date(today);
//   monday.setDate(today.getDate() + diffToMonday);
//   monday.setHours(0, 0, 0, 0);

//   const sunday = new Date(monday);
//   sunday.setDate(monday.getDate() + 6);
//   sunday.setHours(23, 59, 59, 999);

//   return data.filter((entry) => {
//     const entryDate = new Date(entry.date);
//     return entryDate >= monday && entryDate <= sunday;
//   });
// }

//   // Memos
//   const activePlan: FitnessPlan | null = useMemo(()=>plans.find((p)=>p.is_active)||null,[plans])
//   const weeklyProgress = useMemo(() => getCurrentWeekProgress(progress), [progress])

//   const todayNutrition: NutritionDay | null = useMemo(() =>
//     activePlan?.nutrition_days.find((nd) => nd.day_of_week === today.getDay()) || null,
// [activePlan]);
//   const todayWorkout: WorkoutDay | null = useMemo(()=>activePlan?.workout_days.find((wd)=>wd.day_of_week===today.getDay())||null,[activePlan])

//   const todayStats: DayStats | null = useMemo(() => {
//     if (!activePlan) return null;
//     const total_meals = todayNutrition?.meals;
//     const meals_logged = todayNutrition?.meals.filter((m) =>
//       mealTracking.find((mt) => mt.meal === m.id)
//     );
//     const total_workouts = todayWorkout?.exercises;
//     const workouts_completed = todayWorkout?.exercises.filter((w) =>
//       workoutTracking.find((wt) => wt.exercise === w.id)
//     );

//     const calories_consumed = meals_logged?.reduce(
//       (total, meal) => total + meal.calories,
//       0
//     );

//     const target_calories = total_meals?.reduce(
//       (total, meal) => total + meal.calories,
//       0
//     );
//     const water_intake = waterTracking.filter((wt) => wt.nutrition_day === todayNutrition?.id).reduce(
//       (total, wt) => total + wt.litres_consumed,
//       0
//     );
//     const target_water = todayNutrition?.target_water_litres;

//     const todayStats = {
//       workouts_completed: workouts_completed?.length,
//       total_workouts: total_workouts?.length,
//       meals_logged: meals_logged?.length,
//       total_meals: total_meals?.length,
//       calories_consumed,
//       target_calories,
//       water_intake,
//       target_water,
//       protein: todayNutrition?.target_protein_grams,
//       carbs: todayNutrition?.target_carbs_grams,
//       fats: todayNutrition?.target_fats_grams,
//     } as DayStats;
//     console.log("stats from data:", todayStats);
//     return todayStats;
//   }, [activePlan, mealTracking, workoutTracking, waterTracking]);

//   const { user } = useAuth();
//   useEffect(() => {
//     refreshData();
//   }, [user]);

//   const refreshData = async () => {
//     if (!user) return;

//     setDataLoading(true);
//     try {
//       await refresh('all-data', false, true)
//     } catch (error) {
//       setDataLoaded(false);
//       handleApiError(error, "Error fetching data");
//     } finally {
//       setDataLoading(false);
//     }
//   };

//   const refresh = async (type: "all-data" | "plans" | "daily-progress" | "workout-tracking" | "meal-tracking" | "water-tracking", h=true, t=true) => {
//     try {

//         switch (type) {
//             case "plans":
//                 const plans = await getPlans();
//                 setPlans(plans);
//                 break;
//             case "daily-progress":
//                 const progress = await getProgress();
//                 setProgress(progress.progress);
//                 break;
//             case "workout-tracking":
//                 const workoutTracking = await getWorkoutTracking();
//                 setWorkoutTracking(workoutTracking);
//                 break;
//             case "meal-tracking":
//                 const mealTracking = await getMealTracking();
//                 setMealTracking(mealTracking);
//                 break;
//             case "water-tracking":
//                 const waterTracking = await getWaterTracking();
//                 setWaterTracking(waterTracking);
//                 break;
//             case "all-data":
//                 const plansData = await getPlans();
//                 const progressData = await getProgress();
//                 const mealTrackingData = await getMealTracking();
//                 const workoutTrackingData = await getWorkoutTracking();
//                 const waterTrackingData = await getWaterTracking();
//                 setPlans(plansData);
//                 setProgress(progressData.progress);
//                 setMealTracking(mealTrackingData);
//                 setWorkoutTracking(workoutTrackingData);
//                 setWaterTracking(waterTrackingData);
//                 break;
//             default:
//                 throw new Error("Failed to refresh data.")
//         }
//         } catch (e) {
//             if (h) handleApiError(e, `Failed to generate ${type.replace("-", " ")}.`);
//             if (t) throw e;
//             }
//   }

//   const createPlan = async (start_date: string, h=true, t=true) => {
//     try {
//       const { message, plan } = await generatePlan({ start_date });
//       setPlans([...plans, plan]);
//       // await refreshPlans();
//     } catch (e) {
//       if (h) handleApiError(e, "Failed to generate a plan.");
//       if (t) throw e;
//     }
//   };

//   const removePlan = async (planId:number, h=true, t=true) => {
//     try {
//         await deletePlan(planId);
//         setPlans(plans.filter((p) => p.id !== planId));
//     } catch (e) {
//         if (h) handleApiError(e, "Failed to delete plan.");
//         if (t) throw e;
//     }
//   }

//   const track = async (
//     action: "track" | "untrack",
//     type: "meal" | "workout" | "water",
//     itemId: number,
//     trackingId?: number,
//     sets?: number,
//     litres_consumed?: number
//   ) => {
//     try {
//       if (action === "untrack" && trackingId) {
//         if (type === "meal") {
//           await deleteMealTracking(trackingId);
//           setMealTracking(mealTracking.filter((mt) => mt.id !== trackingId));
//           // await refreshMealTracking();
//         }
//         if (type === "workout") {
//           await deleteWorkoutTracking(trackingId);
//           setWorkoutTracking(
//             workoutTracking.filter((wt) => wt.id !== trackingId)
//           );
//           // await refreshWorkoutTracking();
//         }
//         if (type === "water") {
//           await deleteWaterTracking(trackingId);
//           setWaterTracking(waterTracking.filter((wt) => wt.id !== trackingId));
//           // await refreshWaterTracking();
//         }
//       } else if (action === "track") {
//         const date = new Date().toISOString().split("T")[0];
//         if (type === "meal") {
//           const trackedMeal = await createMealTracking({
//             meal: itemId,
//             date_completed: date,
//             portion_consumed: 1,
//             notes: "",
//           });
//           setMealTracking([...mealTracking, trackedMeal]);
//           // await refreshMealTracking();
//         }
//         if (type === "workout") {
//           const trackedWorkout = await createWorkoutTracking({
//             exercise: itemId,
//             date_completed: date,
//             sets_completed: sets || 0,
//             notes: "",
//           });
//           setWorkoutTracking([...workoutTracking, trackedWorkout]);
//           // await refreshWorkoutTracking();
//         }
//         if (type === "water") {
//           const trackedWater = await createWaterTracking({
//             date,
//             nutrition_day: itemId,
//             litres_consumed: litres_consumed || 0,
//             notes: "",
//           });
//           setWaterTracking([...waterTracking, trackedWater]);
//           // await refreshWaterTracking();
//         }
//       }
//       await refresh('daily-progress');
//     } catch (error) {
//       handleApiError(error, `Failed to ${action} ${type}.`);
//       throw error;
//     }
//   };

//   if (!user || dataLoading)
//     return (
//       <div className="min-h-full relative flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
//           <p className="text-white mt-4">Loading...</p>
//         </div>
//       </div>
//     );

//   return (
//     <DataContext.Provider
//       value={{
//         plans,
//         activePlan,
//         createPlan,
//         removePlan,
//         track,
//         todayNutrition,
//         todayWorkout,
//         progress,
//         weeklyProgress,
//         workoutTracking,
//         mealTracking,
//         dataLoading,
//         dataLoaded,
//         todayStats,
//         waterTracking,
//         refresh
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };

// export const useData = () => {
//   const context = useContext(DataContext);
//   if (!context) throw Error("useData must be use within a DataProvider");
//   return context;
// };
