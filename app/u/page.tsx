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

export default function Page() {
  const { user } = useAuth();
  const [plans, setPlans] = React.useState<FitnessPlan[]>([]);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [generatePlanOpen, setGeneratePlanOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && !user.profile) {
      setOnboardingOpen(true);
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await getPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    }
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const handleDeletePlan = async (planId: number) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter((plan) => plan.id !== planId));
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleTrackWorkout = async (exerciseId: number) => {
    try {
      await createWorkoutTracking({
        exercise: exerciseId,
        date_completed: new Date().toISOString().split("T")[0],
        sets_completed: 1, // Or some other logic
      });
      toast.success("Workout tracked successfully");
    } catch (error) {
      toast.error("Failed to track workout");
    }
  };

  const handleTrackMeal = async (mealId: number) => {
    try {
      await createMealTracking({
        meal: mealId,
        date_completed: new Date().toISOString().split("T")[0],
        portion_consumed: 1, // Or some other logic
      });
      toast.success("Meal tracked successfully");
    } catch (error) {
      toast.error("Failed to track meal");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button onClick={() => setGeneratePlanOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>
      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Plan: {plan.start_date} to {plan.end_date}
              </CardTitle>
              <Button
                onClick={() => handleDeletePlan(plan.id)}
                variant="destructive"
              >
                Delete Plan
              </Button>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {plan.workout_days.map((day: WorkoutDay) => (
                  <AccordionItem value={`workout-${day.id}`} key={day.id}>
                    <AccordionTrigger>{day.title}</AccordionTrigger>
                    <AccordionContent>
                      {day.is_rest_day ? (
                        <p>Rest day</p>
                      ) : (
                        <ul>
                          {day.exercises.map((exercise) => (
                            <li
                              key={exercise.id}
                              className="flex justify-between items-center"
                            >
                              <span>
                                {exercise.name} - {exercise.sets} sets of{" "}
                                {exercise.reps}
                              </span>
                              <Button
                                onClick={() => handleTrackWorkout(exercise.id)}
                              >
                                Track
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {plan.nutrition_days.map((day) => (
                  <AccordionItem value={`nutrition-${day.id}`} key={day.id}>
                    <AccordionTrigger>
                      Nutrition - Day {day.day_of_week}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul>
                        {day.meals.map((meal: Meal) => (
                          <li
                            key={meal.id}
                            className="flex justify-between items-center"
                          >
                            <span>
                              {meal.meal_type}: {meal.description}
                            </span>
                            <Button onClick={() => handleTrackMeal(meal.id)}>
                              Track
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
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
