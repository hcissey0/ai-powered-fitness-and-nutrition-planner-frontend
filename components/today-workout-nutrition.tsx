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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass border-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Today's Meals</CardTitle>
          <CardDescription>
            Log your meals to track your nutrition.
          </CardDescription>
          <Progress
            value={(todayStats.meals_logged / todayStats.total_meals) * 100}
            className="h-2"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {todayNutrition.meals.map((meal) => {
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
          })}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass border-none bg-transparent">
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
      </div>
    </div>
  );
}

///////////////// old code ///////////////////////////

// import { Check, Clock, Droplets, Plus, X, Zap } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "./ui/card";
// import { useData } from "@/context/data-context";
// import { Badge } from "./ui/badge";
// import { ExerciseTimer } from "./exercise-timer";
// import { useState } from "react";
// import { Progress } from "./ui/progress";

// const mealIcons = {
//   breakfast: "🌅",
//   lunch: "☀️",
//   snack: "🍎",
//   dinner: "🌙",
// };

// export function TodayWorkoutNutrition() {
//   const [activeTimer, setActiveTimer] = useState<string | null>(null);
//   const [timerSeconds, setTimerSeconds] = useState<number>(0);
//   const {
//     todayWorkout,
//     todayNutrition,
//     workoutTracking,
//     mealTracking,
//     todayStats,
//     track,
//   } = useData();

//   if (!todayWorkout || !todayNutrition || !todayStats) return <></>;

//   const breakfast = todayNutrition.meals.find(
//     (m) => m.meal_type === "breakfast"
//   );
//   const lunch = todayNutrition.meals.find((m) => m.meal_type === "lunch");
//   const dinner = todayNutrition.meals.find((m) => m.meal_type === "dinner");
//   const snack = todayNutrition.meals.find((m) => m.meal_type === "snack");

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//       <Card className="glas border-0 bg-transparent">
//         <CardHeader>
//           <CardTitle className="text-xl">Today's Meals</CardTitle>
//           <CardDescription>Today's meal schedule</CardDescription>
//           {todayStats && (
//             <Progress
//               value={(todayStats?.meals_logged / todayStats?.total_meals) * 100}
//               className="h-2"
//             />
//           )}
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-3">
//             {todayNutrition.meals.map((meal, index) => {
//               const mealKey = `${meal.meal_type}-${meal.description}`;

//               const trackedItem = mealTracking.find((t) => t.meal === meal.id);
//               const isTracked = !!trackedItem;

//               return (
//                 <Card
//                   key={index}
//                   className={`transition-all ${
//                     isTracked
//                       ? "bg-transparent border-none"
//                       : "glass hover:shadow-md"
//                   }`}
//                 >
//                   <CardContent className="flex flex-col p">
//                     <div className="flex flex-col items-start justify-betwee">
//                       <div className="flex items-center space-x-3">
//                         <div className="flex flex-col items-start space-x-2">
//                           <div className="flex gap-4">
//                             <span className="text-2xl">
//                               {
//                                 mealIcons[
//                                   meal.meal_type as keyof typeof mealIcons
//                                 ]
//                               }
//                             </span>
//                             <Badge
//                               className={`font-semibold capitaliz uppercase ${
//                                 isTracked ? "line-through text-gray-500" : ""
//                               }`}
//                             >
//                               {meal.meal_type}
//                             </Badge>
//                           </div>
//                           <div>
//                             <h4></h4>
//                             <p
//                               className={`text-3xl font-black ${
//                                 isTracked
//                                   ? "line-through text-muted"
//                                   : "text-white"
//                               }`}
//                             >
//                               {meal.description}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       {!isTracked && (
//                         <div className="text-righ mt-2 flex items-end gap-4">
//                           <div className="font-semibol text-sm">
//                             {meal.calories} kcal
//                           </div>
//                           -
//                           <div className="text-sm text-white">
//                             {meal.portion_size}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     {!isTracked && (
//                       <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
//                         <div className="text-center p-2 bg-rose-900/40 rounded-md">
//                           <div className="font-bold text-rose-400">
//                             {meal.protein_grams}g
//                           </div>
//                           <div className="text-xs text-white">Protein</div>
//                         </div>
//                         <div className="text-center p-2 bg-blue-900/40 rounded-md">
//                           <div className="font-bold text-blue-400">
//                             {meal.carbs_grams}g
//                           </div>
//                           <div className="text-xs text-white">Carbs</div>
//                         </div>
//                         <div className="text-center p-2 bg-yellow-900/40 rounded-md">
//                           <div className="font-bold text-yellow-400">
//                             {meal.fats_grams}g
//                           </div>
//                           <div className="text-xs text-white">Fats</div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                   <CardFooter className="flex justify-end">
//                     <Button
//                       className={` text-white border-green-500 ${
//                         isTracked
//                           ? "bg-green-500/10 hover:bg-green-500/20"
//                           : "bg-green-500/70 hover:bg-green-500/80"
//                       } `}
//                       onClick={async () =>
//                         await track(
//                           isTracked ? "untrack" : "track",
//                           "meal",
//                           meal.id,
//                           trackedItem?.id
//                         )
//                       }
//                     >
//                       {isTracked && <Check />}
//                       {isTracked ? "Tracked" : "Track"}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               );
//             })}
//           </div>

//         </CardContent>
//       </Card>

//       <Card className="glas border-0 bg-transparent">
//         <CardHeader>
//           <CardTitle className="text-xl">Today's Workout</CardTitle>
//           <CardDescription>{todayWorkout.description}</CardDescription>
//           {todayStats && (
//             <Progress
//               value={
//                 (todayStats?.workouts_completed / todayStats?.total_workouts) *
//                 100
//               }
//               className="h-2"
//             />
//           )}
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             {todayWorkout.exercises.map((exercise, index) => {
//               const trackedItem = workoutTracking.find(
//                 (wt) => wt.exercise === exercise.id
//               );
//               const isTracked = !!trackedItem;
//               return (
//                 <Card
//                   key={index}
//                   className={`transition-all ${
//                     isTracked ? "bg-transparent border-none" : "glass"
//                   }`}
//                 >
//                   <CardContent className="p-">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div>
//                           <h4
//                             className={`font-semibold ${
//                               isTracked ? "line-through text-white" : ""
//                             }`}
//                           >
//                             {exercise.name}
//                           </h4>
//                           {!isTracked && (
//                             <>
//                               <div className="flex items-center space-x-4 text-sm text-white">
//                                 <span>{exercise.sets} sets</span>
//                                 <span>{exercise.reps} reps</span>
//                                 <span className="flex items-center space-x-1">
//                                   <Clock className="h-3 w-3" />
//                                   <span>
//                                     {exercise.rest_period_seconds}s rest
//                                   </span>
//                                 </span>
//                               </div>
//                               {exercise.notes && (
//                                 <p className="text-xs text-white mt-1">
//                                   {exercise.notes}
//                                 </p>
//                               )}
//                             </>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end justify-center gap-4">
//                         {!isTracked && (
//                           <ExerciseTimer
//                             exerciseName={exercise.name}
//                             restPeriodSeconds={exercise.rest_period_seconds}
//                             activeTimer={activeTimer}
//                             setActiveTimer={setActiveTimer}
//                             timerSeconds={timerSeconds}
//                             setTimerSeconds={setTimerSeconds}
//                             onTimerComplete={(name) =>
//                               console.log("Timer completed", name)
//                             }
//                             playSound
//                           />
//                         )}
//                         <Button
//                           className={` text-white border-green-500 ${
//                             isTracked
//                               ? "bg-green-500/10 hover:bg-green-500/20"
//                               : "bg-green-500/70 hover:bg-green-500/80"
//                           } `}
//                           onClick={async () =>
//                             await track(
//                               isTracked ? "untrack" : "track",
//                               "workout",
//                               exercise.id,
//                               trackedItem?.id
//                             )
//                           }
//                         >
//                           {isTracked ? <X /> : <Check />}
//                           {/* {isTracked ? "Done" : "Mark as Done"} */}
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div><Card className="glas border-0 bg-transparent ">
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <Droplets className="h-5 w-5 text-blue-600" />
//                     <span>Water Intake</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="text-start">
//                     <div className="text-3xl font-bold text-blue-600">
//                       {todayStats.water_intake}L
//                     </div>
//                     <div className="text-sm ">
//                       of {todayStats.target_water}L target
//                     </div>
//                   </div>
//                   <Progress
//                     value={
//                       (todayStats.water_intake / todayStats.target_water) * 100
//                     }
//                     className="h-3"
//                   />
//                   <Button
//                     onClick={async () =>
//                       await track(
//                         "track",
//                         "water",
//                         todayNutrition.id,
//                         undefined,
//                         undefined,
//                         0.25
//                       )
//                     }
//                     className="w-full text-white bg-blue-600 hover:bg-blue-700"
//                     disabled={todayStats.water_intake >= todayStats.target_water}
//                     >
//                     <Droplets className="h-4 w-4 mr-2" />
//                     Add 250ml
//                   </Button>
//                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
//                     {Array.from(
//                       { length: Math.round(todayStats.target_water / 0.25) },
//                       (_, i) => (
//                         <div
//                           key={i}
//                           className={`h-6 rounded ${
//                             i < todayStats.water_intake * 4
//                             ? "bg-blue-500"
//                             : "bg-gray-200"
//                           }`}
//                           />
//                       )
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//         </CardContent>
//       </Card>

//     </div>
//   );
// }
