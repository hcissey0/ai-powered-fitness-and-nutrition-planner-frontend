// components/exercise-timer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Play, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function TimerToastContent({
  exerciseName,
  initialSeconds,
  onComplete,
  onCancel,
}: any) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev: number) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

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
  exerciseName: string;
  restPeriodSeconds: number;
  className?: string;
  onTimerComplete?: (exerciseName: string) => void;
  playSound?: boolean;
}

export function ExerciseTimer({
  exerciseName,
  restPeriodSeconds,
  className,
  onTimerComplete,
  playSound = true,
}: ExerciseTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  const playBeepSound = () => {
    if (!playSound || typeof window === "undefined") return;
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      // ... (beep sound logic is fine, no changes needed)
    } catch (e) {
      console.warn("AudioContext not supported.", e);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    playBeepSound();
    if (onTimerComplete) onTimerComplete(exerciseName);
    toast.success(`Rest Complete for ${exerciseName}!`);
  };

  const handleTimerCancel = () => {
    setIsActive(false);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
  };

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    toastIdRef.current = toast(
      <TimerToastContent
        exerciseName={exerciseName}
        initialSeconds={restPeriodSeconds}
        onComplete={handleTimerComplete}
        onCancel={handleTimerCancel}
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
        "text-primary border-primary/50 hover:bg-primary/10 hover:text-primary",
        className
      )}
    >
      <Play className="h-4 w-4 mr-2" />
      Timer
    </Button>
  );
}
//////////////////////////////// old code //////////////////////////
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Timer, Play, X } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// // Custom toast content component that manages its own countdown
// function TimerToastContent({
//   timerSeconds,
//   setTimerSeconds,
//   exerciseName,
//   onComplete,
//   onCancel,
// }: {
//   exerciseName: string;
//   timerSeconds: number;
//   setTimerSeconds: (num:number)=>void;
//   onComplete: () => void;
//   onCancel: () => void;
// }) {
//   const [seconds, setSeconds] = useState(timerSeconds);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       setSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(intervalRef.current!);
//           setTimerSeconds(0)
//           onComplete();
//           return 0;
//         }
//         setTimerSeconds(prev-1)
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [onComplete]);

//   const handleCancel = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//     onCancel();
//   };

//   return (
//     <div className="p-4 flex items-center justify-between w-full">
//       <div className="flex flex-col">
//         <div className="font-semibold text-sm mb-1">
//           {exerciseName} Rest Timer
//         </div>
//         <div className="text-5xl font-mono font-bold text-orange-600">
//           {formatTime(seconds)}
//         </div>
//       </div>
//       <Button
//         size="sm"
//         variant="ghost"
//         onClick={handleCancel}
//         className="bg-red-700 hover:bg-red-900 hover:text-white"
//       >
//         <X className="h-4 w-4" /> Cancel
//       </Button>
//     </div>
//   );
// }

// interface ExerciseTimerProps {
//   exerciseName: string;
//   restPeriodSeconds: number;
//   activeTimer: string | null;
//   setActiveTimer: (timer: string | null) => void;
//   timerSeconds: number;
//   setTimerSeconds: (seconds: number) => void;
//   className?: string;
//   showInlineTimer?: boolean;
//   onTimerComplete?: (exerciseName: string) => void;
//   completionMessage?: string;
//   playSound?: boolean;
// }

// export function ExerciseTimer({
//   exerciseName,
//   restPeriodSeconds,
//   activeTimer,
//   setActiveTimer,
//   timerSeconds,
//   setTimerSeconds,
//   className = "flex items-center space-x-1 bg-accent/20 hover:bg-accent text-white",
//   showInlineTimer = true,
//   onTimerComplete,
//   completionMessage,
//   playSound = true,
// }: ExerciseTimerProps) {
//   const toastIdRef = useRef<string | number | null>(null);

//   // Function to play beep sound
//   const playBeepSound = () => {
//     const audioContext = new (window.AudioContext ||
//       (window as any).webkitAudioContext)();

//     const createBeep = (frequency = 800, duration = 200) => {
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);

//       oscillator.frequency.value = frequency;
//       oscillator.type = "sine";

//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(
//         0.01,
//         audioContext.currentTime + duration / 1000
//       );

//       oscillator.start(audioContext.currentTime);
//       oscillator.stop(audioContext.currentTime + duration / 1000);
//     };

//     // First set of 3 beeps
//     createBeep(800, 150); // First beep
//     setTimeout(() => createBeep(800, 150), 200); // Second beep
//     setTimeout(() => createBeep(800, 150), 400); // Third beep

//     // Pause, then second set of 3 beeps
//     setTimeout(() => createBeep(800, 150), 800); // Fourth beep (after pause)
//     setTimeout(() => createBeep(800, 150), 1000); // Fifth beep
//     setTimeout(() => createBeep(800, 150), 1200); // Sixth beep
//   };
// //   const playBeepSound = () => {
// //     if (!playSound) return;

// //     try {
// //       const audioContext = new (window.AudioContext ||
// //         (window as any).webkitAudioContext)();
// //       const oscillator = audioContext.createOscillator();
// //       const gainNode = audioContext.createGain();

// //       oscillator.connect(gainNode);
// //       gainNode.connect(audioContext.destination);

// //       oscillator.frequency.value = 800;
// //       oscillator.type = "sine";

// //       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
// //       gainNode.gain.exponentialRampToValueAtTime(
// //         0.01,
// //         audioContext.currentTime + 0.5
// //       );

// //       oscillator.start(audioContext.currentTime);
// //       oscillator.stop(audioContext.currentTime + 0.5);
// //     } catch (error) {
// //       console.warn("Could not play sound:", error);
// //     }
// //   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleTimerComplete = () => {
//     setActiveTimer(null);
//     setTimerSeconds(0);

//     // Dismiss the countdown toast
//     if (toastIdRef.current) {
//       toast.dismiss(toastIdRef.current);
//       toastIdRef.current = null;
//     }

//     // Play beep sound
//     playBeepSound();

//     // Call custom completion callback if provided
//     if (onTimerComplete) {
//       onTimerComplete(exerciseName);
//     }

//     // Show completion toast
//     toast.success(
//       <div className="flex flex-col">
//         <div className="font-semibold">Rest Complete!</div>
//         <div className="text-sm text-muted-foreground">
//           {completionMessage || `${exerciseName} timer finished`}
//         </div>
//       </div>,
//       {
//         duration: 4000,
//       }
//     );
//   };

//   const handleTimerCancel = () => {
//     setActiveTimer(null);
//     setTimerSeconds(0);

//     if (toastIdRef.current) {
//       toast.dismiss(toastIdRef.current);
//       toastIdRef.current = null;
//     }
//   };

//   const startTimer = () => {
//     // Clear any existing timer
//     if (toastIdRef.current) {
//       toast.dismiss(toastIdRef.current);
//     }

//     setActiveTimer(exerciseName);
//     setTimerSeconds(restPeriodSeconds);

//     // Create ONE stable toast that will update internally
//     toastIdRef.current = toast(
//       <TimerToastContent
//         exerciseName={exerciseName}
//         timerSeconds={restPeriodSeconds}
//         setTimerSeconds={setTimerSeconds}
//         onComplete={handleTimerComplete}
//         onCancel={handleTimerCancel}
//       />,
//       {
//         unstyled: true,
//         duration: Number.POSITIVE_INFINITY,
//       }
//     );
//   };

//   const isActive = activeTimer === exerciseName;

//   return (
//     <div className="flex items-center space-x-2">
//       {isActive && showInlineTimer ? (
//         <div className="flex flex-col justify-center items-center space-x-2 text-orange-600">
//           <Timer className="h-4 w-4" />
//           <span className="font-mono font-bold">
//             {formatTime(timerSeconds)}
//           </span>

//           <Button
//             size="sm"
//             variant="outline"
//             onClick={handleTimerCancel}
//             className="ml-2 bg-transparent"
//           >
//             Cancel
//           </Button>
//         </div>
//       ) : (
//         <Button
//           size="sm"
//           onClick={startTimer}
//           className={cn(className)}
//           disabled={activeTimer !== null && !isActive}
//         >
//           <Play className="h-3 w-3" />
//           <span>Timer</span>
//         </Button>
//       )}
//     </div>
//   );
// }
