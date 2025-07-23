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

export default function Page() {
  const { user } = useAuth();
  const { todayStats, activePlan, refreshData } = useData();
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
      {/* Quick Stats Cards */}
      {todayStats && (
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
                    {todayStats.workouts_completed}/{todayStats.total_workouts}
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
                    {todayStats.meals_logged}/{todayStats.total_meals}
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
                    {todayStats.calories_consumed}
                  </div>
                  <p className="text-xs opacity-90">
                    of {todayStats.target_calories} kcal
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
                    {todayStats.water_intake}L
                  </div>
                  <p className="text-xs opacity-90">
                    of {todayStats.target_water}L
                  </p>
                </div>

                <Droplets className="h-8 w-8 opacity-80 text-blue-400" />
                {/* <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  💧
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            No Active Plans
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
          refreshData();
        }}
      />
    </>
  );
}
