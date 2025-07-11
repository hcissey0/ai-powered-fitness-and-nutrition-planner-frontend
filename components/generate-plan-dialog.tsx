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
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { handleApiError } from "@/lib/error-handler";
import { getPlans, generatePlan } from "@/lib/api-service";
import { FitnessPlan } from "@/interfaces";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Zap } from "lucide-react";

interface GeneratePlanDialogProps {
  open: boolean;
  onClose: () => void;
  onPlanGenerated: () => void;
}

export function GeneratePlanDialog({
  open,
  onClose,
  onPlanGenerated,
}: GeneratePlanDialogProps) {
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6), // Default to a 7-day plan
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchPlans = async () => {
        try {
          const fetchedPlans = await getPlans();
          setPlans(fetchedPlans);
        } catch (error) {
          handleApiError(error, "Could not load existing plans.");
        }
      };
      fetchPlans();
    }
  }, [open]);

  const disabledDates = plans.flatMap((plan) => {
    const dates = [];
    const startDate = new Date(plan.start_date);
    const endDate = new Date(plan.end_date);
    
    // Adjust for timezone differences by using UTC dates
    let currentDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return dates;
  });

  const handleGenerate = async () => {
    if (!date?.from || !date?.to) {
      toast.error("Please select a valid date range.");
      return;
    }

    setIsLoading(true);
    try {
      await generatePlan({
        start_date: date.from.toISOString(),
        end_date: date.to.toISOString(),
      });
      toast.success("New plan generated successfully!");
      onPlanGenerated();
      onClose();
    } catch (error) {
        handleApiError(error, "Failed to generate plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" glass border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Generate New Fitness Plan
          </DialogTitle>
          <DialogDescription>
            Select the start and end date for your new plan. Dates with
            existing plans are disabled.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="range"
            selected={date}
            
            onSelect={setDate}
            disabled={disabledDates}
            className="rounded-md border bg-background/50"
            numberOfMonths={1}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="glass">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="cyber-button"
          >
            {isLoading ? "Generating..." : "Generate Plan"}
            {!isLoading && <Zap className="h-4 w-4 ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
