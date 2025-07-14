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
    const [chartData, setChartData] = useState<CalorieData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    async function getDailyNutritionTargets(date: string) {
      const plans = await getPlans();
      if (!plans) return null;
      let nutritionDay = null;
      plans.map((plan)=> {
          const dayOfWeek = new Date(date).getDay() + 1; // Convert to 1-7 format
          nutritionDay = plan.nutrition_days.find(
            (day: any) => day.day_of_week === dayOfWeek
          );

      })


      return nutritionDay || null;
    }

    useEffect(() => {
      async function fetchCalorieData() {
        try {
          setLoading(true);
          const today = new Date().toISOString().split("T")[0];

          // Get today's meal tracking data
          const mealData = await getMealTracking(today);

          // Get nutrition targets for today
          const nutritionTargets = await getDailyNutritionTargets(today);

          // Calculate consumed calories
          const consumedCalories = mealData.reduce(
            (total: number, meal: any) => {
              return total + meal.meal.calories * meal.portion_consumed;
            },
            0
          );

          // Get target calories
          const targetCalories = nutritionTargets?.target_calories || 2200;

          setChartData([
            {
              consumed: Math.round(consumedCalories),
              target: targetCalories,
              fill: "var(--color-calories)",
            },
          ]);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch calorie data"
          );
        } finally {
          setLoading(false);
        }
      }

      fetchCalorieData();
    }, []);

    if (loading) {
      return (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Daily Calorie Goal</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Daily Calorie Goal</CardTitle>
            <CardDescription>Error loading data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center text-muted-foreground">
              {error}
            </div>
          </CardContent>
        </Card>
      );
    }

    const data = chartData[0];
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
            data={[{ ...chartData[0], consumed: percentage }]}
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
          {chartData[0].consumed.toLocaleString()} /{" "}
          {chartData[0].target.toLocaleString()} calories
        </div>
      </CardFooter>
    </Card>
  );
}
