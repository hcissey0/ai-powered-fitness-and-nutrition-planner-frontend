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
    track,
  } = useData();

  if (!todayWorkout || !todayNutrition || !todayStats) return null;

 const getCurrentMealType = (): "breakfast" | "lunch" | "dinner" | "snack" => {
   const currentHour = new Date().getHours();

   if (currentHour >= 5 && currentHour < 12) {
     return "breakfast"; // 5:00 AM - 11:59 AM
   } else if (currentHour >= 12 && currentHour < 15) {
     return "lunch"; // 12:00 PM - 2:59 PM
   } else if (currentHour >= 15 && currentHour < 17) {
     return "snack"; // 3:00 PM - 4:59 PM
   } else {
     return "dinner"; // 5:00 PM - 4:59 AM
   }
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
        onTrack={(litres) =>
          track(
            "track",
            "water",
            todayNutrition.id,
            undefined,
            undefined,
            litres
          )
        }
      />

      {/* current workout */}
      {!todayWorkout.is_rest_day ? (
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
                  isTracked={!!trackedItem}
                  onTrack={() =>
                    track(
                      trackedItem ? "untrack" : "track",
                      "workout",
                      exercise.id,
                      trackedItem?.id
                    )
                  }
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
      )}
    </div>
  );
}