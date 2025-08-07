// components/today-workout-nutrition.tsx
"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { useData } from "@/context/data-context";
import { Progress } from "./ui/progress";
import { MealCard } from "./cards/meal-card";
import { ExerciseCard } from "./cards/exercise-card";
import { WaterIntakeCard } from "./cards/water-intake-card";
import { Trophy } from "lucide-react";

export function TodayWorkoutNutrition() {
  const {
    todayWorkout,
    todayNutrition,
    workoutTracking,
    mealTracking,
    todayStats,
    settings,
    activePlan,
    track,
  } = useData();

  if (!todayWorkout || !todayNutrition || !todayStats || !activePlan)
    return null;

  // Convert time string like '08:00:00' to a number of seconds since midnight
  const timeToSeconds = (timeStr: string): number => {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  // Get current time in seconds since midnight
  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const getCurrentMealType = (): "breakfast" | "lunch" | "dinner" | "snack" => {
    const mealTypes = ["breakfast", "lunch", "snack", "dinner"] as const;

    type MealType = (typeof mealTypes)[number];
    interface MealTime {
      meal: MealType;
      seconds: number;
      next?: MealTime;
    }

    // Build list of meals with their start time in seconds
    const mealsWithTime: MealTime[] = mealTypes.map((meal) => ({
      meal,
      seconds: timeToSeconds(
        settings.times[meal as keyof typeof settings.times] || "00:00:00"
      ),
    }));

    // Sort meals by time
    const sortedMeals = mealsWithTime.sort((a, b) => a.seconds - b.seconds);

    // Add nextMeal field for easier comparison
    for (let i = 0; i < sortedMeals.length; i++) {
      sortedMeals[i].next = sortedMeals[(i + 1) % sortedMeals.length];
    }

    // Find current meal based on currentSeconds
    for (let i = 0; i < sortedMeals.length; i++) {
      const { seconds, next, meal } = sortedMeals[i];

      if (!next) continue;
      // Wrap around midnight
      if (seconds <= currentSeconds && currentSeconds < next.seconds) {
        return meal;
      }
      if (
        next.seconds < seconds &&
        (currentSeconds >= seconds || currentSeconds < next.seconds)
      ) {
        return meal;
      }
    }

    // Fallback
    return "breakfast";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* current meal */}
      <Card className="glas lg:col-span-3 border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Current Meal</CardTitle>
          <CardDescription>
            Log your meals to track your nutrition.
          </CardDescription>
          <Progress
            value={(todayStats.meals_logged / todayStats.total_meals) * 100}
            className="h-2"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {(() => {
            const currentMealType = getCurrentMealType();
            return todayNutrition.meals
              .filter((meal) => meal.meal_type === currentMealType)
              .map((meal) => {
                const trackedItem = mealTracking.find(
                  (t) => t.meal === meal.id
                );
                return (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    trackedMeal={trackedItem}
                  />
                );
              });
          })()}

          {/* {todayNutrition.meals.map((meal) => {
            const trackedItem = mealTracking.find((t) => t.meal === meal.id);
            return (
              <MealCard
                key={meal.id}
                meal={meal}
                isTracked={!!trackedItem}
                onTrack={() =>
                  track(
                    trackedItem ? "untrack" : "track",
                    "meal",
                    meal.id,
                    trackedItem?.id
                  )
                }
              />
            );
          })} */}
        </CardContent>
      </Card>

      {/* water intake */}
      <WaterIntakeCard
        nutrition={todayNutrition}
        stats={todayStats}
        litres={0.25}
      />

      {/* current workout */}
      {currentSeconds >= timeToSeconds(settings.times.workout as string) ? (
        !todayWorkout.is_rest_day ? (
          <Card className="glas lg:col-span-4 border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Today's Workout</CardTitle>
              <CardDescription>{todayWorkout.description}</CardDescription>
              <Progress
                value={
                  (todayStats.workouts_completed / todayStats.total_workouts) *
                  100
                }
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {todayWorkout.exercises.map((exercise) => {
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
              })}
            </CardContent>
          </Card>
        ) : (
          <Card className="glass lg:col-span-4 text-center p-8 flex flex-col items-center justify-center">
            <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold">Rest Day</h3>
            <p className="text-muted-foreground">
              Time to recover and grow stronger.
            </p>
          </Card>
        )
      ) : null}
    </div>
  );
}
