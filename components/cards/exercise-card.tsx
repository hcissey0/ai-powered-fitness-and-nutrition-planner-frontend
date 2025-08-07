import { Check, Clock, Dumbbell, Flame, Loader2, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ExerciseTimer } from "../exercise-timer";
import { useData } from "@/context/data-context";
import { Exercise, WorkoutTracking } from "@/interfaces";
import { useState } from "react";

export function ExerciseCard({
  exercise,
  trackedExercise,
  onTrack,
}: {
  exercise: any;
  trackedExercise?: WorkoutTracking;
  onTrack?: () => void;
}) {
  const { track, settings } = useData();
  const [isTracking, setIsTracking] = useState(false);

  const isTracked = !!trackedExercise;

  const handleTrack = async () => {
    try {
      setIsTracking(true);
      await track(isTracked ? 'untrack' : 'track',
        'workout',
        exercise.id,
        trackedExercise?.id as number,
        exercise.sets,
        exercise.calories_to_burn,
        0
      );
      if (onTrack) {
        onTrack();
      }
    } catch(e) {

    } finally {
      setIsTracking(false);
    }
  }


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
          {!trackedExercise && (
            <>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps} reps</span>
                <span className="flex items-center space-x-1">
                  <Flame className="h-3 w-3 text-rose-400" />
                  <span>{exercise.calories_to_burn}kcal</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Dumbbell className="h-3 w-3 text-red-400" />
                  <span>{exercise.duration_mins}mins</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-primary" />
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
            <div>

              <ExerciseTimer
              type="exercise"
              
              exercise={exercise}
              
              />
            <ExerciseTimer
            type="rest"
            
              exercise={exercise}
              
              />
              </div>
          )}
          {settings.trackingEnabled && 
          <Button
          size="icon"
          variant={isTracked ? "ghost" : "default"}
          onClick={handleTrack}
          className={`rounded-full ${
            isTracked
            ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
            : "bg-green-600 hover:bg-green-700 text-foreground"
            }`}
            >
              {isTracking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ): (
                isTracked ? <X /> : <Check />
              )}
            {/* {isTracked ? <X /> : <Check />} */}
          </Button>
          }
        </div>
      </CardContent>
    </Card>
  );
}