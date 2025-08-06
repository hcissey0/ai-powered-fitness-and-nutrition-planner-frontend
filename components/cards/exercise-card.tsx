import { Check, Clock, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ExerciseTimer } from "../exercise-timer";
import { useData } from "@/context/data-context";

export function ExerciseCard({
  exercise,
  isTracked,
  onTrack,
}: {
  exercise: any;
  isTracked: boolean;
  onTrack: () => void;
}) {
  const { trackingEnabled } = useData()
  return (
    <Card
      className={`transition-all ${
        isTracked ? "bg-transparent border-dashed border-muted" : "glass hover:border-primary/50"
      }`}
    >
      <CardContent className="flex flex-wrap gap-2 items-center justify-between p-">
        <div className="flex flex-col space-y-1">
          <h4
            className={`font-semibold ${
              isTracked
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {exercise.name}
          </h4>
          {!isTracked && (
            <>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps} reps</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{exercise.rest_period_seconds}s rest</span>
                </span>
              </div>
              {exercise.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {exercise.notes}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {!isTracked && (
            <ExerciseTimer
              exerciseName={exercise.name}
              restPeriodSeconds={exercise.rest_period_seconds}
            />
          )}
          {trackingEnabled && 
          <Button
          size="icon"
          variant={isTracked ? "ghost" : "default"}
          onClick={onTrack}
          className={`rounded-full ${
            isTracked
            ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
            : "bg-green-600 hover:bg-green-700 text-foreground"
            }`}
            >
            {isTracked ? <X /> : <Check />}
          </Button>
          }
        </div>
      </CardContent>
    </Card>
  );
}