"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { getMealTracking, getPlans } from "@/lib/api-service";
import { useState, useEffect } from "react";
import { useData } from "@/context/data-context";

const chartData = [
  {
    category: "calories",
    consumed: 1850,
    target: 2200,
    fill: "var(--color-primary)",
  },
];

const chartConfig = {
  consumed: {
    label: "Consumed",
  },
  target: {
    label: "Target",
  },
  calories: {
    label: "Calories",
    color: "hsl(var(--color-primary))",
  },
} satisfies ChartConfig;

interface CalorieData {
  consumed: number;
  target: number;
  fill: string;
}

export default function CalorieTrackingRadial({
    className
}: { className?: string}) {

    const { todayStats } = useData();

    const calorieData: CalorieData = {
      consumed: todayStats?.calories_consumed || 0,
      target: todayStats?.target_calories || 0,
      fill: "var(--color-primary)"
    }

    const data = calorieData;
    const percentage = Math.round((data.consumed / data.target) * 100);
    const remaining = data.target - data.consumed;
  return (
    <Card className={cn("glass flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Daily Calorie Goal</CardTitle>
        <CardDescription>Today's calorie consumption</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadialBarChart
            data={[{ ...calorieData, consumed: percentage }]}
            startAngle={0}
            endAngle={percentage * 3.6}
            innerRadius={80}
            outerRadius={120}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="consumed"
              background
              cornerRadius={10}
              fill="var(--color-calories)"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-primary text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          of daily goal
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {remaining > 0
            ? `${remaining} calories remaining`
            : `${Math.abs(remaining)} calories over target`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {calorieData.consumed.toLocaleString()} /{" "}
          {calorieData.target.toLocaleString()} calories
        </div>
      </CardFooter>
    </Card>
  );
}
