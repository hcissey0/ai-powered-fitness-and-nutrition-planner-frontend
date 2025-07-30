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
    // toast.success(`Rest Complete for ${exerciseName}!`);
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
