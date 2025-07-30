
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange, rangeIncludesDate } from "react-day-picker";
import { addDays, endOfWeek, startOfWeek } from "date-fns";
import { handleApiError } from "@/lib/error-handler";
import { getPlans, generatePlan } from "@/lib/api-service";
import type { FitnessPlan } from "@/interfaces";
import { toast } from "sonner";
import {
  CalendarIcon,
  Zap,
  Dumbbell,
  Apple,
  Heart,
  Target,
  Flame,
  Droplets,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useData } from "@/context/data-context";

interface GeneratePlanDialogProps {
  open: boolean;
  onClose: () => void;
  onPlanGenerated: () => void;
}

const fitnessNutritionTips = [
  {
    icon: Dumbbell,
    title: "Building Your Workout Plan",
    description:
      "Creating a personalized routine that matches your fitness level and goals.",
    color: "text-blue-500",
  },
  {
    icon: Apple,
    title: "Nutrition Planning",
    description:
      "Calculating optimal macronutrients and meal timing for your lifestyle.",
    color: "text-green-500",
  },
  {
    icon: Heart,
    title: "Health Assessment",
    description: "Analyzing your current fitness level and health metrics.",
    color: "text-red-500",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Establishing realistic and achievable fitness milestones.",
    color: "text-purple-500",
  },
  {
    icon: Flame,
    title: "Calorie Optimization",
    description: "Balancing energy intake with your activity level and goals.",
    color: "text-orange-500",
  },
  {
    icon: Droplets,
    title: "Hydration Strategy",
    description: "Planning optimal water intake for peak performance.",
    color: "text-cyan-500",
  },
  {
    icon: Clock,
    title: "Schedule Integration",
    description: "Fitting workouts seamlessly into your daily routine.",
    color: "text-indigo-500",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Setting up metrics to monitor your fitness journey.",
    color: "text-emerald-500",
  },
];

export function GeneratePlanDialog({
  open,
  onClose,
  onPlanGenerated,
}: GeneratePlanDialogProps) {
  // const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const { plans, refresh, createPlan } = useData();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6), // Default to a 7-day plan
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto-select current week when dialog opens
  useEffect(() => {
    if (open) {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

      setSelectedWeek({
        from: weekStart,
        to: weekEnd,
      });
    }
  }, [open]);

  // Slideshow effect for tips during loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % fitnessNutritionTips.length);
      }, 3000); // Change tip every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const disabledDates = plans.flatMap((plan) => {
    const dates = [];
    const startDate = new Date(plan.start_date);
    const endDate = new Date(plan.end_date);

    // Adjust for timezone differences by using UTC dates
    const currentDate = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      )
    );
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return dates;
  });

  const handleGenerate = async () => {
    if (!selectedWeek?.from || !selectedWeek?.to) {
      toast.error("Please select a valid date range.");
      return;
    }

    setIsLoading(true);
    try {
    // toast.info("Generating Plan. This may take a while...");
    await createPlan(selectedWeek.from.toISOString())
    toast.success("New plan generated successfully!");
    onPlanGenerated();
    onClose();
    } catch (error) {
      // handleApiError(error, "Failed to generate plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentTip = fitnessNutritionTips[currentTipIndex];
  const IconComponent = currentTip.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Generate New Fitness Plan
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Creating your personalized fitness and nutrition plan..."
              : "Select the week for your new plan. Dates with existing plans are disabled."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          {isLoading ? (
            // Slideshow during loading
            <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4 min-h-[300px]">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 w-20 h-20"></div>
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20">
                  <IconComponent
                    className={`h-10 w-10 ${currentTip.color} animate-pulse`}
                  />
                </div>
              </div>

              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-xl font-semibold text-foreground transition-all duration-500 ease-in-out">
                  {currentTip.title}
                </h3>
                <p className="text-muted-foreground transition-all duration-500 ease-in-out">
                  {currentTip.description}
                </p>
              </div>

              <div className="flex space-x-2">
                {fitnessNutritionTips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentTipIndex
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span>Generating your plan...</span>
              </div>
            </div>
          ) : (
            // Calendar when not loading
            <Calendar
              weekStartsOn={1}
              disabled={disabledDates}
              className="rounded-md bg-transparent"
              numberOfMonths={1}
              modifiers={{
                selected: selectedWeek,
                range_start: selectedWeek?.from,
                range_end: selectedWeek?.to,
                range_middle: (date: Date) =>
                  selectedWeek
                    ? rangeIncludesDate(selectedWeek, date, true)
                    : false,
              }}
              onDayClick={(day, modifiers) => {
                if (modifiers.selected) {
                  setSelectedWeek(undefined);
                  return;
                }
                setSelectedWeek({
                  from: startOfWeek(day, { weekStartsOn: 1 }),
                  to: endOfWeek(day, { weekStartsOn: 1 }),
                });
              }}
            />
          )}
        </div>

        {!isLoading && selectedWeek && (
          <div className="text-center text-sm text-muted-foreground">
            Week from {selectedWeek.from?.toLocaleDateString()} to{" "}
            {selectedWeek.to?.toLocaleDateString()}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="glas bg-transparent"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !selectedWeek}
            className="cyber-button"
          >
            {!isLoading && <Zap className="h-4 w-4 ml-2 animate-pulse" />}
            {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            {isLoading ? "Generating..." : "Generate Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
