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
import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button onClick={() => setGeneratePlanOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <ProgressCalendar className="sm:col-span-3 md:col-span-4"/>
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
          fetchPlans();
        }}
      />
    </>
  );
}
