"use client";

import { motion } from "framer-motion";
import { FuturisticCard } from "@/components/futuristic-card";
import { ProgressCalendar } from "@/components/progress-calendar";
import {
    Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Dumbbell,
  Clock,
  Play,
  Plus,
  Loader2,
  Calendar,
  Target,
  Check,
  Droplets,
  Timer,
  Trophy,
} from "lucide-react";
import {
  getWorkoutTracking,
  getMealTracking,
  deleteWorkoutTracking,
  deleteMealTracking,
  createWorkoutTracking,
  createMealTracking,
  getDailyProgress,
  getPlans,
  deletePlan,
} from "@/lib/api-service";
import {
  WorkoutTracking,
  MealTracking,
  FitnessPlan,
  DailyProgress,
} from "@/interfaces";
import { GeneratePlanDialog } from "@/components/generate-plan-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { set } from "date-fns";
import { rangeIncludesDate } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExerciseTimer } from "@/components/exercise-timer";


const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🍎",
  dinner: "🌙",
};

export default function PlanPage() {
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<FitnessPlan | null>(null);
  const [generatePlanOpen, setGeneratePlanOpen] = useState(false);
  const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
  const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [selectedNutritionDay, setSelectedNutritionDay] = useState<number>(new Date().getDay());
  const [waterIntake, setWaterIntake] = useState(2.1);

  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState<number>(new Date().getDay());
  
  
  const { user } = useAuth();
  
  // Nutrition variables
  const currentNutrition = selectedPlan?.nutrition_days.find((n) => 
  n.day_of_week === selectedNutritionDay);
  
  const consumedNutrients = currentNutrition?.meals
  .filter((meal) => mealTracking.find((mt)=>mt.meal === meal.id))
  .reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein_grams,
    carbs: acc.carbs + meal.carbs_grams,
    fats: acc.fats + meal.fats_grams,
  }), {calories:0, protein:0, carbs:0, fats:0}) ||
  {calories:0, protein:0, carbs:0, fats:0};

  const loggedMeals = currentNutrition?.meals.filter(
    (meal)=>mealTracking.find((mt)=>mt.meal===meal.id)).length;
    
    // Workout variables
    const currentWorkout = selectedPlan?.workout_days.find((n) => 
    n.day_of_week === selectedWorkoutDay);

  const completedToday = currentWorkout?.exercises
  .filter((e) => workoutTracking.find((wt) => wt.exercise === e.id)).length;
  // const completedExercises = workoutTracking.length;

  const totalToday = currentWorkout?.exercises.length || 0;

  const startTimer = (exerciseName: string, seconds: number) => {
    setActiveTimer(exerciseName);
    setTimerSeconds(seconds);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const addWater = () => {
    setWaterIntake((prev) => Math.min(prev + 0.25, 5))
  }

  const fetchAllData = async (initialLoad = false) => {
    if (initialLoad) setLoading(true);
    try {
      const fetchedPlans = await getPlans();
      setPlans(fetchedPlans);

      if (fetchedPlans.length > 0) {

        const activePlan = fetchedPlans.find((p) => p.is_active)

        setSelectedPlan((prev) => {
          const planExists = prev && fetchedPlans.some((p) => p.id === prev.id);
          return planExists ? prev : activePlan ? activePlan :  fetchedPlans[0];
        });
        setSelectedNutritionDay((prev) => {
          if (prev) return prev;
          if (activePlan) {

            const today = new Date()
            const planStart = new Date(activePlan.start_date);
            return Math.max(1, Math.min(7, today.getDate() - planStart.getDate()))
          }
        return 1;

        })


        const allDates = fetchedPlans.flatMap((p) => [
          new Date(p.start_date),
          new Date(p.end_date),
        ]);
        const minDate = new Date(
          Math.min(...allDates.map((date) => new Date(date).getTime()))
        );
        const maxDate = new Date(
          Math.max(...allDates.map((date) => new Date(date).getTime()))
        );

        const progress = await getDailyProgress({
          start_date: minDate.toISOString().split("T")[0],
          end_date: maxDate.toISOString().split("T")[0],
        });
        setDailyProgress(progress.progress);
      } else {
        setSelectedPlan(null);
        setDailyProgress([]);
      }

      const [workoutData, mealData] = await Promise.all([
        getWorkoutTracking(),
        getMealTracking(),
      ]);
      setWorkoutTracking(workoutData);
      setMealTracking(mealData);
    } catch (error) {
      handleApiError(error, "Data loading failed.");
    } finally {
      if (initialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllData(true);
    }
  }, [user]);

  const isToday = (plan: FitnessPlan, day: number): boolean => {
    const today = new Date();
    const planStart = new Date(plan.start_date);
    const planEnd = new Date(plan.end_date);
    if (!rangeIncludesDate({from:planStart, to:planEnd}, today)) 
      return false;
    if (day === today.getDay()) return true;
    return false
  }

  const handleTrackItem = async (
    action: "track" | "untrack",
    type: "meal" | "workout",
    itemId: number,
    trackingId?: number,
    sets?: number
  ) => {
    try {
      if (action === "untrack" && trackingId) {
        if (type === "meal") await deleteMealTracking(trackingId);
        if (type === "workout") await deleteWorkoutTracking(trackingId);
      } else if (action === "track") {
        const date = new Date().toISOString().split("T")[0];
        if (type === "meal")
          await createMealTracking({
            meal: itemId,
            date_completed: date,
            portion_consumed: 1,
            notes: "",
          });
        if (type === "workout")
          await createWorkoutTracking({
            exercise: itemId,
            date_completed: date,
            sets_completed: sets || 0,
            notes: "",
          });
      }
      await fetchAllData(); // Refresh all data
    } catch (error) {
      handleApiError(error, `Failed to ${action} ${type}.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-white mt-4">Loading Plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-full relative">
        <div className="containe mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-neon-green bg-clip-text text-transparent">
                    Your Personalized Plan 🎯
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    AI-generated nutrition and workout plan tailored for you
                  </p>
                </div>
                <Button
                  onClick={() => setGeneratePlanOpen(true)}
                  disabled={!user?.profile}
                  className="cyber-button h-10 sm:h-11 text-white font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Plan
                </Button>
              </div>

              {/* <ProgressCalendar
                className="mb-6"
                initialProgress={dailyProgress}
              /> */}

              {plans.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Select Plan ({plans.length} available):
                  </label>
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`flex-shrink-0 p-3 rounded-lg border text-sm transition-all ${
                          selectedPlan?.id === plan.id
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-white/20 bg-white/5 text-white hover:border-primary/50"
                        }`}
                      >
                        {plan.is_active && (
                          <div className="flex text-xs items-center justify-center p-0.5 mb-1 gap-2 border rounded-full border-green-500/20 bg-green-500/10 text-green-500">
                            <Check className="" size={15} /> <p>Active</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(plan.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Target className="h-3 w-3" />
                          <span className="text-xs capitalize">
                            {plan.goal_at_creation?.replace("_", " ") ||
                              "General"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {plans.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/20 rounded-lg mb-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Plans Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first AI-powered fitness and nutrition plan to
                    get started.
                  </p>
                </div>
              )}

              {/* Delete Selected Plan */}
              {selectedPlan && (
                <Button
                  onClick={async () => {
                    try {
                      await deletePlan(selectedPlan.id);
                      toast.success("Plan deleted.");
                      await fetchAllData(true);
                    } catch (error) {
                      handleApiError(error, "Failed to delete plan.");
                    }
                  }}
                  variant="destructive"
                  className="mb-4"
                >
                  Delete Selected Plan
                </Button>
              )}
            </div>

            {selectedPlan && (
              <Tabs defaultValue="nutrition" className="w-full">
                <TabsList className="glass-car grid w-full grid-cols-2 mb-4 sm:mb-6 h-9 sm:h-10 glass borde border-white/20">
                  <TabsTrigger
                    value="nutrition"
                    className=" flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white data-[state=active]:glass-card dark:data-[state=active]:glass-card data-[state=active]:text-accent dark:data-[state=active]:text-accent"
                  >
                    <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Nutrition Plan</span>
                    <span className="sm:hidden">Nutrition</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="workout"
                    className=" flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white data-[state=active]:glass-card dark:data-[state=active]:glass-card data-[state=active]:text-accent dark:data-[state=active]:text-accent"
                  >
                    <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Workout Plan</span>
                    <span className="sm:hidden">Workout</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nutrition">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Day Selector */}
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span>Weekly Nutrition Plan</span>
                        </CardTitle>
                        <CardDescription>
                          Your personalized meal plan with traditional Ghanaian
                          cuisine
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {Array.from({ length: 7 }, (_, index) => (
                            <Button
                              key={index + 1}
                              variant={
                                selectedNutritionDay === index + 1
                                  ? "default"
                                  : "outline"
                              }
                              className={`relative h-16 flex-col py-1 ${
                                selectedNutritionDay === index + 1
                                  ? "bg-green-800 text-white hover:bg-green-900"
                                  : "glass hover:bg-white/10"
                              }`}
                              onClick={() => setSelectedNutritionDay(index + 1)}
                            >
                              <div className="text-xs font-medium">
                                {dayNames[index]}
                              </div>
                              {isToday(selectedPlan, index + 1) && (
                                <div className="text-white absolute border bg-green-500 w-4 h-4 md:w-4 md:h-4 rounded-full top-1 left-1">
                                  <Check />
                                </div>
                              )}
                              <div className="text-xs">
                                {index === 0 ? "2200 kcal" : "2200 kcal"}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Day Nutrition */}
                    {currentNutrition && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          {/* Daily Overview */}
                          <Card className="glass">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                  <Utensils className="h-5 w-5 text-green-600" />
                                  <span>Today's Meals</span>
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800"
                                >
                                  {loggedMeals}/{currentNutrition.meals.length}{" "}
                                  Logged
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                {currentNutrition.notes}
                              </CardDescription>
                              <Progress
                                value={
                                  (loggedMeals /
                                    currentNutrition.meals.length) *
                                  100
                                }
                                className="h-2"
                              />
                            </CardHeader>
                          </Card>

                          {/* Meals List */}
                          <div className="space-y-4">
                            {currentNutrition &&
                              currentNutrition.meals.map((meal, index) => {
                                const mealKey = `${meal.meal_type}-${meal.description}`;

                                const trackedItem = mealTracking.find(
                                  (t) =>
                                    t.meal === meal.id 
                                  // &&
                                  //   new Date(
                                  //     t.date_completed
                                  //   ).toDateString() ===
                                  //     new Date().toDateString()
                                );
                                const isTracked = !!trackedItem;

                                return (
                                  <Card
                                    key={index}
                                    className={`transition-all ${
                                      isTracked
                                        ? "bg-muted border-none"
                                        : "glass hover:shadow-md"
                                    }`}
                                  >
                                    <CardContent className="flex flex-col p">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          {/* <Checkbox
                                      checked={isTracked}
                                      onCheckedChange={() =>
                                        handleTrackItem(
                                          isTracked ? "untrack" : "track",
                                          "meal",
                                          meal.id,
                                          trackedItem?.id
                                        )
                                      }
                                      className="h-5 w-5"
                                    /> */}
                                          <div className="flex items-center space-x-2">
                                            <span className="text-2xl">
                                              {
                                                mealIcons[
                                                  meal.meal_type as keyof typeof mealIcons
                                                ]
                                              }
                                            </span>
                                            <div>
                                              <h4
                                                className={`font-semibold capitalize ${
                                                  isTracked
                                                    ? "line-through text-gray-500"
                                                    : ""
                                                }`}
                                              >
                                                {meal.meal_type}
                                              </h4>
                                              <p
                                                className={`text-sm ${
                                                  isTracked
                                                    ? "line-through text-muted"
                                                    : "text-white"
                                                }`}
                                              >
                                                {meal.description}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        {!isTracked && (
                                          <div className="text-right">
                                            <div className="font-semibold text-lg">
                                              {meal.calories} kcal
                                            </div>
                                            <div className="text-xs text-white">
                                              {meal.portion_size}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {!isTracked && (
                                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                          <div className="text-center p-2 bg-rose-500/20 rounded-md">
                                            <div className="font-bold text-rose-600">
                                              {meal.protein_grams}g
                                            </div>
                                            <div className="text-xs text-white">
                                              Protein
                                            </div>
                                          </div>
                                          <div className="text-center p-2 bg-blue-500/20 rounded-md">
                                            <div className="font-bold text-blue-600">
                                              {meal.carbs_grams}g
                                            </div>
                                            <div className="text-xs text-white">
                                              Carbs
                                            </div>
                                          </div>
                                          <div className="text-center p-2 bg-yellow-500/20 rounded-md">
                                            <div className="font-bold text-yellow-600">
                                              {meal.fats_grams}g
                                            </div>
                                            <div className="text-xs text-white">
                                              Fats
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                      <Button
                                        className={` text-white border-green-500 ${
                                          isTracked
                                            ? "bg-green-500/10 hover:bg-green-500/20"
                                            : "bg-green-500/70 hover:bg-green-500/80"
                                        } `}
                                        onClick={() =>
                                          handleTrackItem(
                                            isTracked ? "untrack" : "track",
                                            "meal",
                                            meal.id,
                                            trackedItem?.id
                                          )
                                        }
                                      >
                                        {isTracked && <Check />}
                                        {isTracked ? "Done" : "Mark as Done"}
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                );
                              })}
                          </div>
                        </div>

                        {/* Nutrition Stats Sidebar */}
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
                                    {consumedNutrients.calories}/
                                    {currentNutrition?.target_calories}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (consumedNutrients.calories /
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
                                    {consumedNutrients.protein}g/
                                    {currentNutrition.target_protein_grams}g
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (consumedNutrients.protein /
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
                                    {consumedNutrients.carbs}g/
                                    {currentNutrition.target_carbs_grams}g
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (consumedNutrients.carbs /
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
                                    {consumedNutrients.fats}g/
                                    {currentNutrition.target_fats_grams}g
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (consumedNutrients.fats /
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
                                  {waterIntake}L
                                </div>
                                <div className="text-sm text-gray-600">
                                  of 3.0L target
                                </div>
                              </div>
                              <Progress
                                value={(waterIntake / 3.0) * 100}
                                className="h-3"
                              />
                              <Button
                                onClick={addWater}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={waterIntake >= 3.0}
                              >
                                <Droplets className="h-4 w-4 mr-2" />
                                Add 250ml
                              </Button>
                              <div className="grid grid-cols-4 gap-1">
                                {Array.from({ length: 12 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`h-6 rounded ${
                                      i < waterIntake * 4
                                        ? "bg-blue-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Quick Stats */}
                          <Card className="glass">
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Nutrition Tips
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm text-white">
                                <p>
                                  🥘 Traditional Ghanaian meals are naturally
                                  balanced
                                </p>
                                <p>💧 Drink water before each meal</p>
                                <p>🍌 Include local fruits for vitamins</p>
                                <p>🐟 Fish provides excellent protein</p>
                                <p>
                                  🌶️ Pepper sauce adds flavor without calories
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {/* {selectedPlan.nutrition_days.map(
                      (nutritionDay, dayIndex) => {
                        const dayDate = new Date(selectedPlan.start_date);
                        dayDate.setDate(
                          dayDate.getDate() + nutritionDay.day_of_week
                        );

                        const dayName = dayDate.toLocaleDateString("en-US", {
                          dateStyle: "full",
                        });

                        const dailyTotals = nutritionDay.meals.reduce(
                          (acc, meal) => {
                            acc.calories += meal.calories;
                            acc.protein += meal.protein_grams;
                            acc.carbs += meal.carbs_grams;
                            acc.fats += meal.fats_grams;
                            return acc;
                          },
                          { calories: 0, protein: 0, carbs: 0, fats: 0 }
                        );

                        return (
                          <FuturisticCard
                            key={nutritionDay.id}
                            glowColor={dayIndex % 2 === 0 ? "green" : "pink"}
                          >
                            <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                <span>
                                  Day {nutritionDay.day_of_week} ({dayName})
                                </span>
                                <Badge variant="outline" className="text-sm">
                                  {dailyTotals.calories.toFixed(0)} kcal
                                </Badge>
                              </CardTitle>
                              <CardDescription className="flex justify-around text-xs font-bold">
                                <span className="text-rose-400">
                                  Protein: {dailyTotals.protein.toFixed(0)}g
                                </span>
                                <span className="text-blue-400">
                                  Carbs: {dailyTotals.carbs.toFixed(0)}g
                                </span>
                                <span className="text-green-400">
                                  Fats: {dailyTotals.fats.toFixed(0)}g
                                </span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nutritionDay.meals.map((meal) => {
                                  const trackedItem = mealTracking.find(
                                    (t) =>
                                      t.meal === meal.id &&
                                      new Date(
                                        t.date_completed
                                      ).toDateString() ===
                                        new Date().toDateString()
                                  );
                                  const isTracked = !!trackedItem;
                                  return (
                                    <div
                                      key={meal.id}
                                      className="border border-white/10 rounded-lg p-4 flex flex-col justify-between"
                                    >
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className=" flex flex-col gap-2 items-start mb-2">
                                          <Badge
                                            variant="outline"
                                            className=" text-xs bg-primary-700 text-primary capitalize"
                                          >
                                            {meal.meal_type}
                                          </Badge>
                                          <h4 className="text-base font-semibold text-white">
                                            {meal.description}
                                          </h4>
                                        </div>

                                        <div className="border border-dashed border-primary rounded-lg p-4 text-xs text-muted-foreground space-y-1">
                                          <p className="text-primary">
                                            Calories: {meal.calories.toFixed(0)}
                                          </p>
                                          <p className="text-rose-400">
                                            Protein:{" "}
                                            {meal.protein_grams.toFixed(0)}g
                                          </p>
                                          <p className="text-blue-400">
                                            Carbs: {meal.carbs_grams.toFixed(0)}
                                            g
                                          </p>
                                          <p className="text-green-400">
                                            Fats: {meal.fats_grams.toFixed(0)}g
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant={
                                          isTracked ? "secondary" : "default"
                                        }
                                        size="sm"
                                        className={`w-full mt-4 flex items-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm ${
                                          isTracked
                                            ? "bg-green-500/20 text-green-400"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleTrackItem(
                                            isTracked ? "untrack" : "track",
                                            "meal",
                                            meal.id,
                                            trackedItem?.id
                                          )
                                        }
                                      >
                                        {isTracked ? "Undo" : "Done"}
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </FuturisticCard>
                        );
                      }
                    )} */}
                  </motion.div>
                </TabsContent>

                <TabsContent value="workout">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Day Picker */}
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>Weekly Workout Schedule</span>
                        </CardTitle>
                        <CardDescription>
                          Your personalized workout plan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {selectedPlan.workout_days.map((day, index) => (
                            <Button
                              key={day.day_of_week}
                              variant={
                                selectedWorkoutDay === day.day_of_week
                                  ? "default"
                                  : "outline"
                              }
                              className={`relative h-20 flex-col space-y-1 ${
                                selectedWorkoutDay === day.day_of_week
                                  ? "bg-cyan-800 text-white hover:bg-cyan-900"
                                  : day.is_rest_day
                                    ? "bg-green-500/50 text-gray-500"
                                     :"glass "
                              }`}
                              // disabled={day.is_rest_day}
                              onClick={() =>
                                setSelectedWorkoutDay(day.day_of_week)
                              }
                            >
                              {isToday(selectedPlan, day.day_of_week) && (
                                <div className="text-white absolute border bg-green-500 w-4 h-4 md:w-4 md:h-4 rounded-full top-1 left-1">
                                  <Check />
                                </div>
                              )}
                              <div className="text-xs font-medium">
                                {dayNames[index]}
                              </div>
                              <div className="text-xs text-center">
                                {day.is_rest_day
                                  ? "Rest"
                                  : day.title.split(" ")[0]}
                              </div>
                              {!day.is_rest_day && (
                                <div className="text-xs opacity-75">
                                  {day.exercises.length} exercises
                                </div>
                              )}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Day Workout */}
                    {currentWorkout && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <Card className="glass">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Dumbbell className="h-5 w-5 text-green-600" />
                                    <span>{currentWorkout.title}</span>
                                  </CardTitle>
                                  <CardDescription>
                                    {currentWorkout.description}
                                  </CardDescription>
                                </div>
                                {!currentWorkout.is_rest_day && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800"
                                  >
                                    {completedToday}/{totalToday} Complete
                                  </Badge>
                                )}
                              </div>
                              {!currentWorkout.is_rest_day && (
                                <Progress
                                  value={(completedToday / totalToday) * 100}
                                  className="h-2"
                                />
                              )}
                            </CardHeader>
                            <CardContent>
                              {currentWorkout.is_rest_day ? (
                                <div className="text-center py-12">
                                  <div className="text-6xl mb-4">🧘‍♂️</div>
                                  <h3 className="text-xl font-semibold mb-2">
                                    Rest Day
                                  </h3>
                                  <p className="text-white">
                                    Take time to recover and prepare for
                                    tomorrow's workout
                                  </p>
                                  <div className="mt-6 space-y-2">
                                    <p className="text-sm text-neutral-200">
                                      Suggested activities:
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 opacity-80">
                                      <Badge className="">
                                        Light stretching
                                      </Badge>
                                      <Badge className="">Walking</Badge>
                                      <Badge className="">
                                        Meditation
                                      </Badge>
                                      <Badge className="">Hydration</Badge>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {currentWorkout.exercises.map(
                                    (exercise, index) => {
                                      const trackedItem = workoutTracking.find((wt) => 
                                      wt.exercise === exercise.id)
                                      const isTracked = !!trackedItem;
                                      return (
                                        <Card
                                          key={index}
                                          className={`transition-all ${
                                            isTracked
                                              ? "bg-transparent border-none"
                                              : "glass"
                                          }`}
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-3">
                                                
                                                <div>
                                                  <h4
                                                    className={`font-semibold ${
                                                      isTracked
                                                        ? "line-through text-white"
                                                        : ""
                                                    }`}
                                                  >
                                                    {exercise.name}
                                                  </h4>
                                                  {!isTracked && 
                                                  <>
                                                  <div className="flex items-center space-x-4 text-sm text-white">
                                                    <span>
                                                      {exercise.sets} sets
                                                    </span>
                                                    <span>
                                                      {exercise.reps} reps
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                      <Clock className="h-3 w-3" />
                                                      <span>
                                                        {
                                                          exercise.rest_period_seconds
                                                        }
                                                        s rest
                                                      </span>
                                                    </span>
                                                  </div>
                                                  {exercise.notes && (
                                                    <p className="text-xs text-white mt-1">
                                                      {exercise.notes}
                                                    </p>
                                                  )}
                                                  </>
                                                }
                                                </div>
                                              </div>
                                              {!isTracked && 
                                              <ExerciseTimer 
                                              exerciseName={exercise.name}
                                              restPeriodSeconds={exercise.rest_period_seconds}
                                              activeTimer={activeTimer}
                                              setActiveTimer={setActiveTimer}
                                              timerSeconds={timerSeconds}
                                              setTimerSeconds={setTimerSeconds}
                                              onTimerComplete={(name) => console.log("Timer completed", name)}
                                              playSound
                                              />
                                              // <div className="flex items-center space-x-2">
                                              //   {activeTimer ===
                                              //   exercise.name ? (
                                              //     <div className="flex items-center space-x-2 text-orange-600">
                                              //       <Timer className="h-4 w-4" />
                                              //       <span className="font-mono font-bold">
                                              //         {formatTime(timerSeconds)}
                                              //       </span>
                                              //     </div>
                                              //   ) : (
                                              //     <Button
                                              //       size="sm"
                                                    
                                              //       onClick={() =>
                                              //         startTimer(
                                              //           exercise.name,
                                              //           exercise.rest_period_seconds
                                              //         )
                                              //       }
                                              //       className="flex items-center space-x-1 bg-accent/20 hover:bg-accent text-white"
                                              //     >
                                              //       <Play className="h-3 w-3" />
                                              //       <span>Timer</span>
                                              //     </Button>
                                              //   )}
                                              // </div>
                                              }
                                            </div>
                                          </CardContent>
                                          <CardFooter className="flex justify-end">
                                            <Button
                                              className={` text-white border-green-500 ${
                                                isTracked
                                                  ? "bg-green-500/10 hover:bg-green-500/20"
                                                  : "bg-green-500/70 hover:bg-green-500/80"
                                              } `}
                                              onClick={() =>
                                                handleTrackItem(
                                                  isTracked
                                                    ? "untrack"
                                                    : "track",
                                                  "workout",
                                                  exercise.id,
                                                  trackedItem?.id
                                                )
                                              }
                                            >
                                              {isTracked && <Check />}
                                              {isTracked
                                                ? "Done"
                                                : "Mark as Done"}
                                            </Button>
                                          </CardFooter>
                                        </Card>
                                      );}
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Workout Stats Sidebar */}
                        <div className="space-y-6">
                          <Card className="glass">
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Today's Progress
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">
                                  {completedToday}
                                </div>
                                <div className="text-sm text-white">
                                  of {totalToday} exercises
                                </div>
                              </div>
                              {!currentWorkout.is_rest_day && (
                                <Progress
                                  value={(completedToday / totalToday) * 100}
                                  className="h-3"
                                />
                              )}
                              {completedToday === totalToday &&
                                totalToday > 0 && (
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
                              <CardTitle className="text-lg">
                                Quick Stats
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  This Week
                                </span>
                                <span className="text-sm font-semibold">
                                  3/5 workouts
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Streak
                                </span>
                                <span className="text-sm font-semibold">
                                  7 days
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Total Exercises
                                </span>
                                <span className="text-sm font-semibold">
                                  156
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
                              <div className="space-y-2 text-sm text-white">
                                <p>💡 Focus on proper form over speed</p>
                                <p>💧 Stay hydrated throughout your workout</p>
                                <p>⏰ Use the rest timer between sets</p>
                                <p>
                                  🎯 Listen to your body and adjust as needed
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {/* {selectedPlan.workout_days.map((workoutDay, dayIndex) => {
                      const dayDate = new Date(selectedPlan.start_date);
                      dayDate.setDate(
                        dayDate.getDate() + workoutDay.day_of_week
                      );
                      const dayName = dayDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      });

                      return (
                        <FuturisticCard
                          key={workoutDay.id}
                          glowColor={dayIndex % 2 === 0 ? "green" : "yellow"}
                        >
                          <CardHeader>
                            <CardTitle>
                              {dayName}: {workoutDay.title}
                            </CardTitle>
                            {workoutDay.is_rest_day && <Badge>Rest Day</Badge>}
                          </CardHeader>
                          {!workoutDay.is_rest_day &&
                            workoutDay.exercises.length > 0 && (
                              <CardContent>
                                <Accordion
                                  type="single"
                                  collapsible
                                  className="w-full"
                                >
                                  {workoutDay.exercises.map((exercise) => {
                                    const trackedItem = workoutTracking.find(
                                      (t) =>
                                        t.exercise === exercise.id &&
                                        new Date(
                                          t.date_completed
                                        ).toDateString() ===
                                          new Date().toDateString()
                                    );
                                    const isTracked = !!trackedItem;
                                    return (
                                      <AccordionItem
                                        key={exercise.id}
                                        value={`exercise-${exercise.id}`}
                                      >
                                        <AccordionTrigger>
                                          {exercise.name}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <div className="pt-4 space-y-3 sm:space-y-4">
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                              {exercise.notes}
                                            </p>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                              <div className="flex items-center gap-1 sm:gap-2">
                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                <span className="text-xs sm:text-sm text-white">
                                                  Rest:{" "}
                                                  {exercise.rest_period_seconds}
                                                  s
                                                </span>
                                              </div>
                                              <Button
                                                variant={
                                                  isTracked
                                                    ? "secondary"
                                                    : "default"
                                                }
                                                size="sm"
                                                className={`flex items-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm ${
                                                  isTracked
                                                    ? "bg-green-500/20 text-green-400"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleTrackItem(
                                                    isTracked
                                                      ? "untrack"
                                                      : "track",
                                                    "workout",
                                                    exercise.id,
                                                    trackedItem?.id,
                                                    exercise.sets
                                                  )
                                                }
                                              >
                                                {isTracked ? "Undo" : "Done"}
                                              </Button>
                                            </div>
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    );
                                  })}
                                </Accordion>
                              </CardContent>
                            )}
                        </FuturisticCard>
                      );
                    })} */}
                  </motion.div>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </div>
      <GeneratePlanDialog
        open={generatePlanOpen}
        onClose={() => setGeneratePlanOpen(false)}
        onPlanGenerated={() => {
          fetchAllData(true);
        }}
      />
    </div>
  );
}
