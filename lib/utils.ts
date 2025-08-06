import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/beep.js
export function beep(frequency = 440, duration = 200) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = 'sine'; // sine, square, sawtooth, triangle
  oscillator.frequency.value = frequency;

  oscillator.start();
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

  // Stop after duration
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}
