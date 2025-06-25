"use client";

import { motion } from "framer-motion";
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
import { Utensils, Dumbbell, Clock, Users, Play, Zap } from "lucide-react";
import Image from "next/image";

import { FuturisticCard } from "@/components/futuristic-card";
import { AnimatedBackground } from "@/components/animated-background";
import { useEffect, useState } from "react";
import { getPlans } from "@/lib/api-service";
import { toast } from "sonner";
import axios from "axios";
import { FitnessPlan } from "@/interfaces";
import { useAuth } from "@/context/auth-context";


const nutritionPlan = [
  {
    meal: "Breakfast",
    dish: "Waakye with Fish",
    calories: 420,
    protein: 25,
    carbs: 45,
    fat: 12,
    description:
      "Traditional rice and beans with grilled tilapia, boiled egg, and pepper sauce",
    time: "7:00 AM",
  },
  {
    meal: "Lunch",
    dish: "Jollof Rice with Grilled Chicken",
    calories: 580,
    protein: 35,
    carbs: 65,
    fat: 18,
    description:
      "Spiced rice with lean grilled chicken breast and mixed vegetables",
    time: "1:00 PM",
  },
  {
    meal: "Supper",
    dish: "Fufu with Light Soup",
    calories: 450,
    protein: 28,
    carbs: 55,
    fat: 8,
    description: "Cassava fufu with fish and vegetable light soup",
    time: "7:00 PM",
  },
];

const workoutPlan = [
  {
    exercise: "Push-ups",
    sets: 3,
    reps: "10-15",
    description: "Standard push-ups focusing on chest, shoulders, and triceps",
    duration: "2 minutes",
  },
  {
    exercise: "Squats",
    sets: 3,
    reps: "15-20",
    description: "Bodyweight squats for leg and glute strength",
    duration: "3 minutes",
  },
  {
    exercise: "Plank",
    sets: 3,
    reps: "30-60 seconds",
    description: "Core strengthening exercise, hold position",
    duration: "2 minutes",
  },
  {
    exercise: "Jumping Jacks",
    sets: 3,
    reps: "20-30",
    description: "Cardio exercise for heart rate and coordination",
    duration: "2 minutes",
  },
  {
    exercise: "Lunges",
    sets: 3,
    reps: "10 each leg",
    description: "Alternating forward lunges for leg strength and balance",
    duration: "3 minutes",
  },
];

export default function PlanPage() {
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    useEffect(() => {
        setLoading(true);
        const func = async () => {
            try {
                const plans = await getPlans();
                setPlans(plans);
            } catch (error) {
                let errorMessage = "An unexpected error occurred."; // Default message

        // Check if it's an Axios error and has a response from the server
        if (axios.isAxiosError(error) && error.response) {
            // Your backend sends { "error": "Your message here" }
            // So we access error.response.data.error
            // We add a fallback in case the 'error' key doesn't exist for some reason
            errorMessage = error.response.data.error || error.message;
        } else if (error instanceof Error) {
            // Handle other types of errors (e.g., network errors)
            errorMessage = error.message;
        }

        toast.error("Loading failed.", {
            description: errorMessage, // Use the extracted message
        });
        console.error("Loading failed:", error);
        // Handle login error (e.g., show error message)
            } finally {
                setLoading(false);
            }
        };
        func();
    }, [user]);

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
      <div className=" min-h-full relative">
        <div className="container mx-auto p-3 sm:p-4 lg:p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-neon-green bg-clip-text text-transparent">
                Your Personalized Plan 🎯
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                AI-generated nutrition and workout plan tailored for you
              </p>
            </div>

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
                  <FuturisticCard glowColor="blue">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                        <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                        {"Today's Meal Plan"}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Carefully crafted Ghanaian meals to meet your
                        nutritional goals
                      </CardDescription>
                    </CardHeader>
                  </FuturisticCard>

                  <div className="grid gap-4 sm:gap-6">
                    {nutritionPlan.map((meal, index) => (
                      <motion.div
                        key={meal.meal}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                      >
                        <FuturisticCard
                          glowColor={index % 2 === 0 ? "green" : "pink"}
                        >
                          <CardHeader className="pb-3 sm:pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Badge
                                  variant="outline"
                                  className="text-primary border-primary text-xs bg-primary/10"
                                >
                                  {meal.meal}
                                </Badge>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="text-xs sm:text-sm">
                                    {meal.time}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-accent to-neon-pink text-white text-xs w-fit">
                                {meal.calories} cal
                              </Badge>
                            </div>
                            <CardTitle className="text-lg sm:text-xl text-white">
                              {meal.dish}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                              {meal.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                              <div className="flex-shrink-0">
                                <Image
                                  src="/placeholder.svg?height=120&width=200"
                                  alt={meal.dish}
                                  width={200}
                                  height={120}
                                  className="rounded-lg object-cover w-full lg:w-48 h-32 lg:h-24 border border-white/10"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                  <div className="text-center">
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      Protein
                                    </p>
                                    <p className="text-base sm:text-lg font-bold text-primary text-glow">
                                      {meal.protein}g
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      Carbs
                                    </p>
                                    <p className="text-base sm:text-lg font-bold text-accent text-glow">
                                      {meal.carbs}g
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      Fat
                                    </p>
                                    <p className="text-base sm:text-lg font-bold text-neon-green text-glow">
                                      {meal.fat}g
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </FuturisticCard>
                      </motion.div>
                    ))}
                  </div>

                  {/* Daily Summary */}
                  <FuturisticCard glowColor="purple">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="text-lg sm:text-xl text-white">
                        Daily Nutrition Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Total Calories
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-primary text-glow">
                            1,450
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Protein
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-primary text-glow">
                            88g
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Carbs
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-accent text-glow">
                            165g
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Fat
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-neon-green text-glow">
                            38g
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </FuturisticCard>
                </motion.div>
              </TabsContent>

              <TabsContent value="workout">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <FuturisticCard glowColor="pink">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                        <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                        {"Today's Workout"}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Beginner-friendly exercises you can do at home
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm text-white">
                            Total Time: 15-20 minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm text-white">
                            Beginner Level
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </FuturisticCard>

                  <FuturisticCard glowColor="green">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="text-lg sm:text-xl text-white">
                        Exercise List
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {workoutPlan.map((exercise, index) => (
                          <AccordionItem
                            key={exercise.exercise}
                            value={`exercise-${index}`}
                            className="border-white/10"
                          >
                            <AccordionTrigger className="hover:no-underline text-left text-white hover:text-primary">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mr-4 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <Badge
                                    variant="outline"
                                    className="text-accent border-accent text-xs bg-accent/10"
                                  >
                                    {index + 1}
                                  </Badge>
                                  <span className="font-medium text-sm sm:text-base">
                                    {exercise.exercise}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                  <span>{exercise.sets} sets</span>
                                  <span>•</span>
                                  <span>{exercise.reps} reps</span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-4 space-y-3 sm:space-y-4">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {exercise.description}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                    <span className="text-xs sm:text-sm text-white">
                                      {exercise.duration}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm glass border-white/20 text-white hover:bg-white/10"
                                  >
                                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Watch Demo
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </FuturisticCard>

                  {/* Workout Tips */}
                  <FuturisticCard glowColor="yellow">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-neon-yellow animate-pulse" />
                        Workout Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span className="text-white">
                            Warm up for 2-3 minutes before starting
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span className="text-white">
                            Rest 30-60 seconds between sets
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span className="text-white">
                            Focus on proper form over speed
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span className="text-white">
                            Stay hydrated throughout your workout
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span className="text-white">
                            Cool down with light stretching
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </FuturisticCard>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
