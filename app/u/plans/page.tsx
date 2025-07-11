"use client";

import { motion } from "framer-motion";
import { FuturisticCard } from "@/components/futuristic-card";
import { ProgressCalendar } from "@/components/progress-calendar";
import {
  CardContent,
  CardDescription,
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
import { Utensils, Dumbbell, Clock, Play, Plus, Loader2, Calendar, Target } from "lucide-react";
import {
    getWorkoutTracking,
    getMealTracking,
    deleteWorkoutTracking,
    deleteMealTracking,
    createWorkoutTracking,
    createMealTracking,
    getDailyProgress,
    getPlans,
    deletePlan
} from "@/lib/api-service";
import { WorkoutTracking, MealTracking, FitnessPlan, DailyProgress } from "@/interfaces";
import { GeneratePlanDialog } from "@/components/generate-plan-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";

export default function PlanPage() {
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<FitnessPlan | null>(null);
    const [generatePlanOpen, setGeneratePlanOpen] = useState(false);
    const [workoutTracking, setWorkoutTracking] = useState<WorkoutTracking[]>([]);
    const [mealTracking, setMealTracking] = useState<MealTracking[]>([]);
    const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);

    const { user } = useAuth();

    const fetchAllData = async (initialLoad = false) => {
        if (initialLoad) setLoading(true);
        try {
            const fetchedPlans = await getPlans();
            setPlans(fetchedPlans);

            if (fetchedPlans.length > 0) {
                setSelectedPlan(prev => {
                    const planExists = prev && fetchedPlans.some(p => p.id === prev.id);
                    return planExists ? prev : fetchedPlans[0];
                });

                const allDates = fetchedPlans.flatMap(p => [new Date(p.start_date), new Date(p.end_date)]);
                const minDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime())));
                const maxDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime())));

                const progress = await getDailyProgress({
                    start_date: minDate.toISOString().split('T')[0],
                    end_date: maxDate.toISOString().split('T')[0],
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

    const handleTrackItem = async (action: 'track' | 'untrack', type: 'meal' | 'workout', itemId: number, trackingId?: number, sets?: number) => {
        try {
            if (action === 'untrack' && trackingId) {
                if (type === 'meal') await deleteMealTracking(trackingId);
                if (type === 'workout') await deleteWorkoutTracking(trackingId);
            } else if (action === 'track') {
                const date = new Date().toISOString().split('T')[0];
                if (type === 'meal') await createMealTracking({ meal: itemId, date_completed: date, portion_consumed: 1 });
                if (type === 'workout') await createWorkoutTracking({ exercise: itemId, date_completed: date, sets_completed: sets || 0 });
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

                            <ProgressCalendar className="mb-6" initialProgress={dailyProgress} />

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
                                                className={`flex-shrink-0 p-3 rounded-lg border text-sm transition-all ${selectedPlan?.id === plan.id
                                                        ? "border-primary bg-primary/20 text-primary"
                                                        : "border-white/20 bg-white/5 text-white hover:border-primary/50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(plan.start_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Target className="h-3 w-3" />
                                                    <span className="text-xs capitalize">
                                                        {plan.goal_at_creation?.replace('_', ' ') || 'General'}
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
                                        Generate your first AI-powered fitness and nutrition plan to get started.
                                    </p>
                                </div>
                            )}
                        </div>

                        {selectedPlan &&
                            <Tabs defaultValue="nutrition" className="w-full">
                                <TabsList className="glass-car grid w-full grid-cols-2 mb-4 sm:mb-6 h-9 sm:h-10 glass borde border-white/20">
                                    <TabsTrigger value="nutrition" className=" flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white data-[state=active]:glass-card dark:data-[state=active]:glass-card data-[state=active]:text-accent dark:data-[state=active]:text-accent">
                                        <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline">Nutrition Plan</span>
                                        <span className="sm:hidden">Nutrition</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="workout" className=" flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white data-[state=active]:glass-card dark:data-[state=active]:glass-card data-[state=active]:text-accent dark:data-[state=active]:text-accent">
                                        <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline">Workout Plan</span>
                                        <span className="sm:hidden">Workout</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="nutrition">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4 sm:space-y-6">
                                        {selectedPlan.nutrition_days.map((nutritionDay, dayIndex) => {
                                            const dayDate = new Date(selectedPlan.start_date);
                                            dayDate.setDate(dayDate.getDate() + nutritionDay.day_of_week - 1);

                                            const dayName = dayDate.toLocaleDateString('en-US', { dateStyle: 'full' });

                                            const dailyTotals = nutritionDay.meals.reduce((acc, meal) => {
                                                acc.calories += meal.calories;
                                                acc.protein += meal.protein_grams;
                                                acc.carbs += meal.carbs_grams;
                                                acc.fats += meal.fats_grams;
                                                return acc;
                                            }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

                                            return (
                                                <FuturisticCard key={nutritionDay.id} glowColor={dayIndex % 2 === 0 ? "green" : "pink"}>
                                                    <CardHeader>
                                                        <CardTitle className="flex justify-between items-center">
                                                            <span>Day {nutritionDay.day_of_week} ({dayName})</span>
                                                            <Badge variant="outline" className="text-sm">
                                                                {dailyTotals.calories.toFixed(0)} kcal
                                                            </Badge>
                                                        </CardTitle>
                                                        <CardDescription className="flex justify-between text-xs">
                                                            <span>Protein: {dailyTotals.protein.toFixed(0)}g</span>
                                                            <span>Carbs: {dailyTotals.carbs.toFixed(0)}g</span>
                                                            <span>Fats: {dailyTotals.fats.toFixed(0)}g</span>
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {nutritionDay.meals.map((meal) => {
                                                                const trackedItem = mealTracking.find(t => t.meal === meal.id && new Date(t.date_completed).toDateString() === new Date().toDateString());
                                                                const isTracked = !!trackedItem;
                                                                return (
                                                                    <div key={meal.id} className="border border-white/10 rounded-lg p-4 flex flex-col justify-between">
                                                                        <div>
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <h4 className="text-base font-semibold text-white">{meal.description}</h4>
                                                                                <Badge variant="outline" className="text-primary border-primary text-xs bg-primary/10 capitalize">{meal.meal_type}</Badge>
                                                                            </div>
                                                                            <div className="text-xs text-muted-foreground space-y-1">
                                                                                <p>Calories: {meal.calories.toFixed(0)}</p>
                                                                                <p>Protein: {meal.protein_grams.toFixed(0)}g</p>
                                                                                <p>Carbs: {meal.carbs_grams.toFixed(0)}g</p>
                                                                                <p>Fats: {meal.fats_grams.toFixed(0)}g</p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant={isTracked ? "secondary" : "default"}
                                                                            size="sm"
                                                                            className={`w-full mt-4 flex items-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm ${isTracked ? 'bg-green-500/20 text-green-400' : ''}`}
                                                                            onClick={() => handleTrackItem(isTracked ? 'untrack' : 'track', 'meal', meal.id, trackedItem?.id)}
                                                                        >
                                                                            {isTracked ? 'Undo' : 'Done'}
                                                                        </Button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </CardContent>
                                                </FuturisticCard>
                                            );
                                        })}
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="workout">
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4 sm:space-y-6">
                                        {selectedPlan.workout_days.map((workoutDay, dayIndex) => {
                                            const dayDate = new Date(selectedPlan.start_date);
                                            dayDate.setDate(dayDate.getDate() + workoutDay.day_of_week - 1);
                                            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

                                            return (
                                                <FuturisticCard key={workoutDay.id} glowColor={dayIndex % 2 === 0 ? "green" : "yellow"}>
                                                    <CardHeader>
                                                        <CardTitle>{dayName}: {workoutDay.title}</CardTitle>
                                                        {workoutDay.is_rest_day && <Badge>Rest Day</Badge>}
                                                    </CardHeader>
                                                    {!workoutDay.is_rest_day && workoutDay.exercises.length > 0 && (
                                                        <CardContent>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                {workoutDay.exercises.map((exercise) => {
                                                                    const trackedItem = workoutTracking.find(t => t.exercise === exercise.id && new Date(t.date_completed).toDateString() === new Date().toDateString());
                                                                    const isTracked = !!trackedItem;
                                                                    return (
                                                                        <AccordionItem key={exercise.id} value={`exercise-${exercise.id}`}>
                                                                            <AccordionTrigger>{exercise.name}</AccordionTrigger>
                                                                            <AccordionContent>
                                                                                <div className="pt-4 space-y-3 sm:space-y-4">
                                                                                    <p className="text-xs sm:text-sm text-muted-foreground">{exercise.notes}</p>
                                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                                                            <span className="text-xs sm:text-sm text-white">Rest: {exercise.rest_period_seconds}s</span>
                                                                                        </div>
                                                                                        <Button
                                                                                            variant={isTracked ? "secondary" : "default"}
                                                                                            size="sm"
                                                                                            className={`flex items-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm ${isTracked ? 'bg-green-500/20 text-green-400' : ''}`}
                                                                                            onClick={() => handleTrackItem(isTracked ? 'untrack' : 'track', 'workout', exercise.id, trackedItem?.id, exercise.sets)}
                                                                                        >
                                                                                            {isTracked ? 'Undo' : 'Done'}
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
                                        })}
                                    </motion.div>
                                </TabsContent>
                            </Tabs>
                        }
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
