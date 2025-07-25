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
import { Dumbbell, Plus, Utensils, FlameIcon as Fire, Droplet, Droplets, Calendar } from "lucide-react";
import { ChartRadialText } from "@/components/chart-radial-text";
import CalorieTrackingRadial from "@/components/calorie-tracking-radial";
import WeeklyWorkoutCompletion from "@/components/weekly-workout-completion";
import { ProgressCalendar } from "@/components/progress-calendar";
import MacronutrientBreakdown from "@/components/macro-nutrient-breakdown";
import { useData } from "@/context/data-context";
import { TodayStats } from "@/components/today-stats";
import { TodayWorkoutNutrition } from "@/components/today-workout-nutrition";

export default function Page() {
  const { user } = useAuth();
  const { todayStats, activePlan, refresh } = useData();
  // const [plans, setPlans] = React.useState<FitnessPlan[]>([]);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [generatePlanOpen, setGeneratePlanOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && !user.profile) {
      setOnboardingOpen(true);
    }
  }, [user]);


  return (
    <>
      <div>
        <h1 className="text-5xl ">
          Hello,{" "}
          <span className="font-extrabold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            {user?.first_name}
          </span>
          !
        </h1>
      </div>
      {/* Today Workout and Nutrition */}
      <TodayWorkoutNutrition />
      {/* Quick Stats Cards */}
      <TodayStats />


      {activePlan ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <ProgressCalendar className="sm:col-span-3 md:col-span-4" />
          <CalorieTrackingRadial className="sm:col-span-2 " />
          <MacronutrientBreakdown className="sm:col-span-2 " />
          <WeeklyWorkoutCompletion className="sm:col-span-2 md:col-span-4 lg:col-span-4" />
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-white/20 rounded-lg mb-6">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No Active Plan
          </h3>
          <p className="text-muted-foreground mb-4">
            Generate your first AI-powered fitness and nutrition plan to get
            started.
          </p>
          <Button size={"lg"}
          onClick={() => setGeneratePlanOpen(true)}
          className="cyber-button">Generate Plan</Button>
        </div>
      )}
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
          refresh('all-data');
        }}
      />
    </>
  );
}
