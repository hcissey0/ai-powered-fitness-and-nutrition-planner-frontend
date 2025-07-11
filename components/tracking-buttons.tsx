"use client";

import { useState } from "react";
import { Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createWorkoutTracking, createMealTracking } from "@/lib/api-service";
import { Exercise, Meal } from "@/interfaces";

interface WorkoutTrackingButtonProps {
  exercise: Exercise;
  onTrackingUpdate?: () => void;
  isCompleted?: boolean;
  dateCompleted?: string;
}

interface MealTrackingButtonProps {
  meal: Meal;
  onTrackingUpdate?: () => void;
  isCompleted?: boolean;
  dateCompleted?: string;
}

export function WorkoutTrackingButton({ 
  exercise, 
  onTrackingUpdate, 
  isCompleted = false,
  dateCompleted 
}: WorkoutTrackingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await createWorkoutTracking({
        exercise: exercise.id,
        date_completed: dateCompleted || today,
        sets_completed: exercise.sets,
        notes: `Completed ${exercise.sets} sets of ${exercise.reps} reps`
      });

      toast.success("Workout Logged!", {
        description: `${exercise.name} marked as complete`
      });

      onTrackingUpdate?.();
    } catch (error) {
      console.error("Failed to track workout:", error);
      toast.error("Error", {
        description: "Failed to log workout. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="h-8 w-8 p-0 border-green-500/50 bg-green-500/10 text-green-400"
      >
        <Check className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleMarkComplete}
      disabled={isLoading}
      className="h-8 w-8 p-0 border-white/20 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 transition-colors"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  );
}

export function MealTrackingButton({ 
  meal, 
  onTrackingUpdate, 
  isCompleted = false,
  dateCompleted 
}: MealTrackingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await createMealTracking({
        meal: meal.id,
        date_completed: dateCompleted || today,
        portion_consumed: 1.0,
        notes: `Completed full portion of ${meal.description}`
      });

      toast.success("Meal Logged!", {
        description: `${meal.description} marked as eaten`
      });

      onTrackingUpdate?.();
    } catch (error) {
      console.error("Failed to track meal:", error);
      toast.error("Error", {
        description: "Failed to log meal. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="h-8 w-8 p-0 border-blue-500/50 bg-blue-500/10 text-blue-400"
      >
        <Check className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleMarkComplete}
      disabled={isLoading}
      className="h-8 w-8 p-0 border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  );
}
