// components/exercise-timer.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { beep } from "@/lib/utils"; // ✅ Import our beep function
import { Exercise } from "@/interfaces";
import { useData } from "@/context/data-context";
import { handleApiError } from "@/lib/error-handler";

function TimerToastContent({
  exerciseName,
  initialSeconds,
  onComplete,
  onCancel,
  playSound,
}: {
  exerciseName: string;
  initialSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
  playSound?: boolean;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;

        // Play beeps for the last 3 seconds
        if (playSound && next > 0 && next <= 3) {
          beep(880, 200);
        }

        if (next <= 0) {
          clearInterval(intervalRef.current!);
          // Delay parent update to avoid React warning
          setTimeout(onComplete, 0);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete, playSound]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="p-4 flex items-center justify-between w-full">
      <div>
        <div className="font-semibold text-sm mb-1 text-foreground">
          {exerciseName} Rest Timer
        </div>
        <div className="text-5xl font-mono font-bold text-primary">
          {formatTime(seconds)}
        </div>
      </div>
      <Button size="sm" variant="destructive" onClick={onCancel}>
        <X className="h-4 w-4 mr-1" /> Cancel
      </Button>
    </div>
  );
}

interface ExerciseTimerProps {
  type: 'rest'| 'exercise';
  exercise: Exercise;
  className?: string;
  onTimerComplete?: (exerciseName: string) => void;
  playSound?: boolean;
}

export function ExerciseTimer({
  type,
  exercise,
  className,
  onTimerComplete,
  playSound = true,
}: ExerciseTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);
  const {settings, track} = useData();

  const handleTimerComplete = () => {
    setIsActive(false);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);

    // Final beep
    if (playSound) beep(660, 300);

    if (onTimerComplete) onTimerComplete(exercise.name);
    
    if (settings.startRestTimerAfterExercise && type === 'exercise') {
      type = 'rest';
      startTimer();
    }
    if (settings.trackingEnabled && settings.trackAfterRestTimer && type === 'rest') {
      try {
        track('track', 'workout', exercise.id, 0, exercise.sets, exercise.calories_to_burn, 0);
      } catch (e) {
      }
    }
  };

  const handleTimerCancel = () => {
    setIsActive(false);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
  };

  const periodSeconds = useMemo(() => 
  type === 'exercise' ? exercise.duration_mins * 60 : exercise.rest_period_seconds, [type])


  const startTimer = () => {
    if (isActive) return;

    setIsActive(true);
    toastIdRef.current = toast(
      <TimerToastContent
        key={exercise.name} // ✅ unique key for React list
        exerciseName={exercise.name}
        initialSeconds={periodSeconds}
        onComplete={handleTimerComplete}
        onCancel={handleTimerCancel}
        playSound={playSound}
      />,
      { unstyled: true, duration: Infinity }
    );
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={startTimer}
      disabled={isActive}
      className={cn(
        `${type === 'exercise' ? 
          "text-accent" : 
          'text-primary hover:bg-primary'}`,
        "",
        className
      )}
    >
      <Play className="h-4 w-4 mr-2" />
      {type === 'exercise' ? `Ex. (${exercise.duration_mins}mins)` : `Rest (${exercise.rest_period_seconds}secs)`}
    </Button>
  );
}




// // components/exercise-timer.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Timer, Play, X } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// function TimerToastContent({
//   exerciseName,
//   initialSeconds,
//   onComplete,
//   onCancel,
// }: any) {
//   const [seconds, setSeconds] = useState(initialSeconds);
//   const intervalRef = useRef<NodeJS.Timeout>(undefined);

//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       setSeconds((prev: number) => {
//         if (prev <= 1) {
//           clearInterval(intervalRef.current!);
//           onComplete();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(intervalRef.current);
//   }, [onComplete]);

//   const formatTime = (s: number) =>
//     `${Math.floor(s / 60)
//       .toString()
//       .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

//   return (
//     <div className="p-4 flex items-center justify-between w-full">
//       <div>
//         <div className="font-semibold text-sm mb-1 text-foreground">
//           {exerciseName} Rest Timer
//         </div>
//         <div className="text-5xl font-mono font-bold text-primary">
//           {formatTime(seconds)}
//         </div>
//       </div>
//       <Button size="sm" variant="destructive" onClick={onCancel}>
//         <X className="h-4 w-4 mr-1" /> Cancel
//       </Button>
//     </div>
//   );
// }

// interface ExerciseTimerProps {
//   exerciseName: string;
//   restPeriodSeconds: number;
//   className?: string;
//   onTimerComplete?: (exerciseName: string) => void;
//   playSound?: boolean;
// }

// export function ExerciseTimer({
//   exerciseName,
//   restPeriodSeconds,
//   className,
//   onTimerComplete,
//   playSound = true,
// }: ExerciseTimerProps) {
//   const [isActive, setIsActive] = useState(false);
//   const toastIdRef = useRef<string | number | null>(null);

//   const playBeepSound = () => {
//     if (!playSound || typeof window === "undefined") return;
//     try {
//       const audioContext = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//       // ... (beep sound logic is fine, no changes needed)
//     } catch (e) {
//       console.warn("AudioContext not supported.", e);
//     }
//   };

//   const handleTimerComplete = () => {
//     setIsActive(false);
//     if (toastIdRef.current) toast.dismiss(toastIdRef.current);
//     playBeepSound();
//     if (onTimerComplete) onTimerComplete(exerciseName);
//     // toast.success(`Rest Complete for ${exerciseName}!`);
//   };

//   const handleTimerCancel = () => {
//     setIsActive(false);
//     if (toastIdRef.current) toast.dismiss(toastIdRef.current);
//   };

//   const startTimer = () => {
//     if (isActive) return;
//     setIsActive(true);
//     toastIdRef.current = toast(
//       <TimerToastContent
//         exerciseName={exerciseName}
//         initialSeconds={restPeriodSeconds}
//         onComplete={handleTimerComplete}
//         onCancel={handleTimerCancel}
//       />,
//       { unstyled: true, duration: Infinity }
//     );
//   };

//   return (
//     <Button
//       size="sm"
//       variant="ghost"
//       onClick={startTimer}
//       disabled={isActive}
//       className={cn(
//         "text-primary border-primary/50 hover:bg-primary/10 hover:text-primary",
//         className
//       )}
//     >
//       <Play className="h-4 w-4 mr-2" />
//       Timer
//     </Button>
//   );
// }
