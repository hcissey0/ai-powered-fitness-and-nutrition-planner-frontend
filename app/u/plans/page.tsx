// /u/plans/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Dumbbell,
  Clock,
  Plus,
  Calendar,
  Target,
  Check,
  Droplets,
  Trophy,
  Ban,
} from "lucide-react";
import { FitnessPlan, Meal, NutritionDay, WorkoutDay } from "@/interfaces";
import { useEffect, useMemo, useState } from "react";
import { handleApiError } from "@/lib/error-handler";
import { Progress } from "@/components/ui/progress";
import { ExerciseTimer } from "@/components/exercise-timer";
import { useData } from "@/context/data-context";
import { MealCard } from "@/components/cards/meal-card";
import { ExerciseCard } from "@/components/cards/exercise-card";
import { addPlanToGoogleCalendar } from "@/lib/api-service";
import PlanToCalendar from "@/components/plan-to-calendar";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const mealIcons: { [key: string]: string } = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🍎",
  dinner: "🌙",
};

// Sub-component for Plan Selection
function PlanSelector({
  plans,
  selectedPlan,
  setSelectedPlan,
}: {
  plans: FitnessPlan[];
  selectedPlan: FitnessPlan | null;
  setSelectedPlan: (plan: FitnessPlan | null) => void;
}) {
  const { activePlan, removePlan } = useData();
  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    try {
      await removePlan(selectedPlan.id);
      setSelectedPlan(activePlan ?? (plans.length > 1 ? plans[0] : null));
    } catch (error) {
      handleApiError(error, "Failed to delete plan.");
    }
  };
  if (plans.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground  block">
        Select Plan ({plans.length} available):
      </label>
      <div className="flex flex-wrap gap-2">
        {plans.map((plan: FitnessPlan) => (
          <button
            key={plan.id}
            onClick={() =>
              setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)
            }
            className={`flex-shrink-0 p-2 rounded-lg border text-sm transition-all ${
              selectedPlan?.id === plan.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            {plan.is_active && (
              <Badge
                variant="secondary"
                className="mb-1 w-full justify-center text-green-500 border-green-500/50"
              >
                Active
              </Badge>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(plan.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <Target className="h-3 w-3" />
              <span className="text-xs capitalize">
                {plan.goal_at_creation?.replace("_", " ") || "General"}
              </span>
            </div>
          </button>
        ))}
      </div>
      {selectedPlan && (
        <div className="flex justify-around">
          <PlanToCalendar plan={selectedPlan} />
          <Button onClick={handleDeletePlan} variant="destructive" size="sm">
            <Ban className="h-4 w-4 mr-2" /> Delete Selected Plan
          </Button>
        </div>
      )}
    </div>
  );
}

function WorkoutStats({
  currentWorkout,
  selectedPlan,
}: {
  currentWorkout: WorkoutDay;
  selectedPlan: FitnessPlan;
}) {
  const { workoutTracking } = useData();

  const selectedDayStats = useMemo(() => {
    // Workout
    const completedToday =
      currentWorkout?.exercises.filter((e) =>
        workoutTracking.find((wt) => wt.exercise === e.id)
      ).length || 0;

    const totalToday = currentWorkout?.exercises.length || 0;

    const totalWeek = selectedPlan?.workout_days.reduce(
      (a, w) => a + w.exercises.length,
      0
    );
    const completedWeek = selectedPlan?.workout_days.reduce(
      (a, w) =>
        a +
        w.exercises.filter((e) =>
          workoutTracking.find((wt) => wt.exercise === e.id)
        ).length,
      0
    );
    const streak = selectedPlan?.workout_days.reduce(
      (a, w) =>
        a +
        (w.exercises.filter((e) =>
          workoutTracking.find((wt) => wt.exercise === e.id)
        ).length > 0
          ? 1
          : 0),
      0
    );

    return {
      workout: {
        completedToday,
        totalToday,
        completedWeek,
        totalWeek,
        streak,
      },
    };
  }, [currentWorkout, workoutTracking]);

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {selectedDayStats.workout.completedToday}
            </div>
            <div className="text-sm text-foreground">
              of {selectedDayStats.workout.totalToday} exercises
            </div>
          </div>
          {!currentWorkout.is_rest_day && (
            <Progress
              value={
                (selectedDayStats.workout.completedToday /
                  selectedDayStats.workout.totalToday) *
                100
              }
              className="h-3"
            />
          )}
          {selectedDayStats.workout.completedToday ===
            selectedDayStats.workout.totalToday &&
            selectedDayStats.workout.totalToday > 0 && (
              <div className="text-center p-4 rounded-lg animate-pulse">
                <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-400">
                  Workout Complete!
                </p>
              </div>
            )}
        </CardContent>
      </Card>
      {/* Quick Stats */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">This Week</span>
            <span className="text-sm font-semibold">
              {selectedDayStats.workout.completedWeek}/
              {selectedDayStats.workout.totalWeek} workouts
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Streak</span>
            <span className="text-sm font-semibold">
              {selectedDayStats.workout.streak} day(s)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Total Exercises</span>
            <span className="text-sm font-semibold">
              {selectedDayStats.workout.totalWeek}
            </span>
          </div>
        </CardContent>
      </Card>
      {/* Tips */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-foregroundround">
            <p>💡 Focus on proper form over speed</p>
            <p>💧 Stay hydrated throughout your workout</p>
            <p>⏰ Use the rest timer between sets</p>
            <p>🎯 Listen to your body and adjust as needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NutritionStats({
  currentNutrition,
}: {
  currentNutrition: NutritionDay;
}) {
  const { mealTracking, waterTracking, workoutTracking, track } = useData();

  const selectedDayStats = useMemo(() => {
    // Nutrition
    const consumedNutrients = currentNutrition?.meals
      .filter((meal) => mealTracking.find((mt) => mt.meal === meal.id))
      .reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein_grams,
          carbs: acc.carbs + meal.carbs_grams,
          fats: acc.fats + meal.fats_grams,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      ) || { calories: 0, protein: 0, carbs: 0, fats: 0 };

    const loggedMeals =
      currentNutrition?.meals.filter((m) =>
        mealTracking.find((mt) => mt.meal === m.id)
      ).length || 0;

    const totalMeals = currentNutrition?.meals.length || 0;

    // Water
    const waterIntake =
      waterTracking
        .filter((w) => w.nutrition_day === currentNutrition?.id)
        .reduce((a, w) => w.litres_consumed + a, 0) || 0;
    const waterTarget = currentNutrition?.target_water_litres || 0;

    return {
      nutrition: {
        consumedNutrients,
        loggedMeals,
        totalMeals,
        waterIntake,
        waterTarget,
      },
    };
  }, [currentNutrition, mealTracking, waterTracking, workoutTracking]);

  return (
    <div className="space-y-6">
      {/* Daily Targets */}
      {/* {consumedNutrients && currentNutrition && ()} */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Daily Targets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Calories</span>
              <span>
                {selectedDayStats.nutrition.consumedNutrients.calories}/
                {currentNutrition?.target_calories}
              </span>
            </div>
            <Progress
              value={
                (selectedDayStats.nutrition.consumedNutrients.calories /
                  currentNutrition.target_calories!) *
                100
              }
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Protein</span>
              <span>
                {selectedDayStats.nutrition.consumedNutrients.protein}
                g/
                {currentNutrition.target_protein_grams}g
              </span>
            </div>
            <Progress
              value={
                (selectedDayStats.nutrition.consumedNutrients.protein /
                  currentNutrition.target_protein_grams!) *
                100
              }
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Carbs</span>
              <span>
                {selectedDayStats.nutrition.consumedNutrients.carbs}
                g/
                {currentNutrition.target_carbs_grams}g
              </span>
            </div>
            <Progress
              value={
                (selectedDayStats.nutrition.consumedNutrients.carbs /
                  currentNutrition.target_carbs_grams!) *
                100
              }
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Fats</span>
              <span>
                {selectedDayStats.nutrition.consumedNutrients.fats}
                g/
                {currentNutrition.target_fats_grams}g
              </span>
            </div>
            <Progress
              value={
                (selectedDayStats.nutrition.consumedNutrients.fats /
                  currentNutrition.target_fats_grams!) *
                100
              }
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Water Intake */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            <span>Water Intake</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {selectedDayStats.nutrition.waterIntake}L
            </div>
            <div className="text-sm ">
              of {selectedDayStats.nutrition.waterTarget}L target
            </div>
          </div>
          <Progress
            value={
              (selectedDayStats.nutrition.waterIntake /
                selectedDayStats.nutrition.waterTarget) *
              100
            }
            className="h-3"
          />
          <Button
            onClick={() =>
              track(
                "track",
                "water",
                currentNutrition.id,
                0,
                0,
                0,
                0.25
              )
            }
            className="w-full text-foreground bg-blue-600 hover:bg-blue-700"
            // disabled={
            //   selectedDayStats.nutrition.waterIntake >=
            //   selectedDayStats.nutrition.waterTarget
            // }
          >
            <Droplets className="h-4 w-4 mr-2" />
            Add 250ml
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Nutrition Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-foreground">
            <p>🥘 Traditional Ghanaian meals are naturally balanced</p>
            <p>💧 Drink water before each meal</p>
            <p>🍌 Include local fruits for vitamins</p>
            <p>🐟 Fish provides excellent protein</p>
            <p>🌶️ Pepper sauce adds flavor without calories</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-component for the entire Nutrition View
function NutritionPlanView({ plan }: { plan: FitnessPlan }) {
  const { mealTracking, waterTracking, track } = useData();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7); // 1-7 for Mon-Sun

  const currentNutrition = useMemo(
    () => plan.nutrition_days.find((n) => n.day_of_week === selectedDay),
    [plan, selectedDay]
  );

  // ... calculations for nutrition stats ...

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Weekly Nutrition</CardTitle>
            <CardDescription>Your personalized meal plan.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {plan.nutrition_days.map((day) => (
              <Button
                key={day.day_of_week}
                variant={
                  selectedDay === day.day_of_week ? "default" : "outline"
                }
                onClick={() => setSelectedDay(day.day_of_week)}
                className="h-16 flex-col"
              >
                {dayNames[day.day_of_week - 1]}{" "}
                <span className="text-xs text-muted-foreground">
                  {day.target_calories}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {currentNutrition?.meals.map((meal) => {
          const trackedItem = mealTracking.find((t) => t.meal === meal.id);
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              trackedMeal={trackedItem}
              
            />
          );
        })}
      </div>
      <div className="lg:col-span-1 space-y-6">
        <NutritionStats currentNutrition={currentNutrition as NutritionDay} />
      </div>
    </motion.div>
  );
}

// Sub-component for the entire Workout View
function WorkoutPlanView({ plan }: { plan: FitnessPlan }) {
  const { workoutTracking, track } = useData();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);

  const currentWorkout = useMemo(
    () => plan.workout_days.find((w) => w.day_of_week === selectedDay),
    [plan, selectedDay]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Weekly Workout</CardTitle>
            <CardDescription>Your workout schedule.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {plan.workout_days.map((day) => (
              <Button
                key={day.day_of_week}
                variant={
                  selectedDay === day.day_of_week ? "default" : "outline"
                }
                onClick={() => setSelectedDay(day.day_of_week)}
                className="h-16 flex-col"
                // disabled={day.is_rest_day}
              >
                {dayNames[day.day_of_week - 1]}
                <span className="text-xs text-muted-foreground">
                  {day.is_rest_day ? "Rest" : `${day.exercises.length} Ex.`}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>
        {currentWorkout && !currentWorkout.is_rest_day ? (
          currentWorkout.exercises.map((exercise) => {
            const trackedItem = workoutTracking.find(
              (wt) => wt.exercise === exercise.id
            );
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                trackedExercise={trackedItem}
              />
            );
          })
        ) : (
          <Card className="glass lg:col-span-2 text-center p-8 flex flex-col items-center justify-center">
            <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold">Rest Day</h3>
            <p className="text-muted-foreground">
              Time to recover and grow stronger.
            </p>
          </Card>
        )}
      </div>
      <div className="lg:col-span-1 space-y-6">
        {/* Stats cards for workouts can go here */}
        <WorkoutStats
          currentWorkout={currentWorkout as WorkoutDay}
          selectedPlan={plan}
        />
      </div>
    </motion.div>
  );
}

export default function PlanPage() {
  const { plans, activePlan, removePlan, setGeneratePlanOpen } = useData();
  const [selectedPlan, setSelectedPlan] = useState<FitnessPlan | null>(null);

  useEffect(() => {
    setSelectedPlan(activePlan ?? (plans.length > 0 ? plans[0] : null));
  }, [activePlan, plans]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Plans</h1>
          <p className="text-muted-foreground">
            View and manage your AI-generated fitness plans.
          </p>
        </div>
        <Button
          onClick={() => setGeneratePlanOpen(true)}
          className="cyber-button"
        >
          <Plus className="h-4 w-4 mr-2" /> Generate New Plan
        </Button>
      </div>

      <PlanSelector
        plans={plans}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      {selectedPlan ? (
        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="gri w-full grid-cols-2 glass">
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Utensils /> Nutrition
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell /> Workout
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nutrition" className="mt-6">
            <NutritionPlanView plan={selectedPlan} />
          </TabsContent>
          <TabsContent value="workout" className="mt-6">
            <WorkoutPlanView plan={selectedPlan} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="glass text-center py-12">
          <CardHeader>
            <CardTitle>No Plan Selected</CardTitle>
            <CardDescription>
              Generate or select a plan to view its details.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
