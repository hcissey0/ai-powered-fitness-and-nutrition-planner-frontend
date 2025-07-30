// app/u/page.tsx
"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { TodayStats } from "@/components/today-stats";
import { TodayWorkoutNutrition } from "@/components/today-workout-nutrition";
import { ProgressCalendar } from "@/components/progress-calendar";
import CalorieTrackingRadial from "@/components/calorie-tracking-radial";
import MacronutrientBreakdown from "@/components/macro-nutrient-breakdown";
import WeeklyWorkoutCompletion from "@/components/weekly-workout-completion";

export default function Page() {
  const { user } = useAuth();
  const { activePlan, setGeneratePlanOpen } = useData();

  return (
    <>
      <div>
        <h1 className="text-5xl">
          Hello,{" "}
          <span className="font-extrabold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            {user?.first_name}
          </span>
          !
        </h1>
      </div>

      {activePlan ? (<>

      <TodayStats />
      <TodayWorkoutNutrition />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <ProgressCalendar className="sm:col-span-3 md:col-span-4" />
          <CalorieTrackingRadial className="sm:col-span-2" />
          <MacronutrientBreakdown className="sm:col-span-2" />
          <WeeklyWorkoutCompletion className="sm:col-span-2 md:col-span-4 lg:col-span-4" />
        </div>
      </>
      ) : (
        <div className="text-center py-8 border border-dashed border-border rounded-lg mb-6">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            You have no active plan
          </h3>
          <p className="text-muted-foreground mb-4">
            Generate your first AI-powered weekly fitness plan.
          </p>
          <Button
            size={"lg"}
            onClick={() => setGeneratePlanOpen(true)}
            className="cyber-button"
          >
            Generate Plan
          </Button>
        </div>
      )}
    </>
  );
};
