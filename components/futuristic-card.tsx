"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type React from "react";

interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "pink" | "green" | "purple" | "yellow";
  animated?: boolean;
}

export function FuturisticCard({
  children,
  className,
  glowColor = "blue",
  animated = true,
}: FuturisticCardProps) {
  const glowColors = {
    blue: "border-primary/30 hover:border-primary/50",
    pink: "border-accent/30 hover:border-accent/50",
    green: "border-neon-green/30 hover:border-neon-green/50",
    purple: "border-neon-purple/30 hover:border-neon-purple/50",
    yellow: "border-neon-yellow/30 hover:border-neon-yellow/50",
  };

  const CardComponent = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        whileHover: { y: -5, scale: 1.02 },
        transition: { duration: 0.1 },
      }
    : {};

  return (
    <CardComponent
      className={cn(
        "glass-card p-3 relative overflow-hidden transition-all duration-300 border",
        glowColors[glowColor],
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className
      )}
      {...animationProps}
    >
      <div className="relative ">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </CardComponent>
  );
}
