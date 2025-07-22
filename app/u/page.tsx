"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { GeneratePlanDialog } from "@/components/generate-plan-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { FitnessPlan, Meal, WorkoutDay } from "@/interfaces";
import {
  deletePlan,
  getPlans,
  createWorkoutTracking,
  createMealTracking,
} from "@/lib/api-service";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Dumbbell, Plus, Utensils, FlameIcon as Fire, Droplet, Droplets } from "lucide-react";
import { ChartRadialText } from "@/components/chart-radial-text";
import CalorieTrackingRadial from "@/components/calorie-tracking-radial";
import WeeklyWorkoutCompletion from "@/components/weekly-workout-completion";
import { ProgressCalendar } from "@/components/progress-calendar";
import MacronutrientBreakdown from "@/components/macro-nutrient-breakdown";

export default function Page() {
  const { user } = useAuth();
  // const [plans, setPlans] = React.useState<FitnessPlan[]>([]);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [generatePlanOpen, setGeneratePlanOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && !user.profile) {
      setOnboardingOpen(true);
    }
  }, [user]);
  // Get plans and create today's stats
  const mockTodayStats = {
    workouts_completed: 3,
    total_workouts: 5,
    meals_logged: 2,
    total_meals: 4,
    calories_consumed: 1500,
    target_calories: 2000,
    water_intake: 1.5,
    target_water: 2.0,
  };

  // const fetchPlans = async () => {
  //   try {
  //     const fetchedPlans = await getPlans();
  //     setPlans(fetchedPlans);
  //   } catch (error) {
  //     console.error("Failed to fetch plans", error);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchPlans();
  // }, []);

  // const handleDeletePlan = async (planId: number) => {
  //   try {
  //     await deletePlan(planId);
  //     setPlans(plans.filter((plan) => plan.id !== planId));
  //     toast.success("Plan deleted successfully");
  //   } catch (error) {
  //     toast.error("Failed to delete plan");
  //   }
  // };

  // const handleTrackWorkout = async (exerciseId: number) => {
  //   try {
  //     await createWorkoutTracking({
  //       exercise: exerciseId,
  //       date_completed: new Date().toISOString().split("T")[0],
  //       sets_completed: 1, // Or some other logic
  //     });
  //     toast.success("Workout tracked successfully");
  //   } catch (error) {
  //     toast.error("Failed to track workout");
  //   }
  // };

  // const handleTrackMeal = async (mealId: number) => {
  //   try {
  //     await createMealTracking({
  //       meal: mealId,
  //       date_completed: new Date().toISOString().split("T")[0],
  //       portion_consumed: 1, // Or some other logic
  //     });
  //     toast.success("Meal tracked successfully");
  //   } catch (error) {
  //     toast.error("Failed to track meal");
  //   }
  // };

  if (!user) {
    return (
      <div className="min-h-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-white mt-4">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button onClick={() => setGeneratePlanOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>
      <div>
        <Button
        onClick={() => toast.success("success", {duration: Number.POSITIVE_INFINITY})}
        >
          Success
        </Button>
        <Button
        onClick={() => toast.error("error")}
        >
          error
        </Button>
        <Button
        onClick={() => toast.info("info")}
        >
          info
        </Button>
        <Button
        onClick={() => toast.warning("warning")}
        >
          warning
        </Button>
      </div> */}
      {/* <div className="grid grid-cols-2 gap-4"></div> */}

      <div>
        <h1 className="text-5xl ">Hello, <span className="font-extrabold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{user.first_name}</span>!</h1>
      </div>
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Today's Workouts */}
          <Card className="glass bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Today's Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {mockTodayStats.workouts_completed}/
                    {mockTodayStats.total_workouts}
                  </div>
                  <p className="text-xs opacity-90">Completed</p>
                </div>
                <Dumbbell className="h-8 w-8 opacity-80 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          {/* Meals Logged */}
          <Card className="glass bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Meals Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {mockTodayStats.meals_logged}/{mockTodayStats.total_meals}
                  </div>
                  <p className="text-xs opacity-90">Today</p>
                </div>
                <Utensils className="h-8 w-8 opacity-80 text-green-400" />
              </div>
            </CardContent>
          </Card>

          {/* Calories */}
          <Card className="glass bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {mockTodayStats.calories_consumed}
                  </div>
                  <p className="text-xs opacity-90">
                    of {mockTodayStats.target_calories} kcal
                  </p>
                </div>
                <Fire className="h-8 w-8 opacity-80 text-red-400" />
              </div>
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card className="glass bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {mockTodayStats.water_intake}L
                  </div>
                  <p className="text-xs opacity-90">
                    of {mockTodayStats.target_water}L
                  </p>
                </div>
                
                  <Droplets className="h-8 w-8 opacity-80 text-blue-400"/>
                {/* <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  💧
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <ProgressCalendar className="sm:col-span-3 md:col-span-4" />
        <CalorieTrackingRadial className="sm:col-span-2 " />
        <MacronutrientBreakdown className="sm:col-span-2 " />
        <WeeklyWorkoutCompletion className="sm:col-span-2 md:col-span-4 lg:col-span-4" />
      </div>
      <OnboardingDialog
        open={onboardingOpen}
        onComplete={() => {
          setOnboardingOpen(false);
        }}
        onClose={() => {
          setOnboardingOpen(false);
        }}
      />
      <GeneratePlanDialog
        open={generatePlanOpen}
        onClose={() => setGeneratePlanOpen(false)}
        onPlanGenerated={() => {
          // fetchPlans();
        }}
      />
    </>
  );
}
