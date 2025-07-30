"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useData } from "@/context/data-context";
import { useMemo } from "react";


const chartConfig = {
  completion_rate: {
    label: "Completion Rate",
    color: "var(--color-accent)",
  },
} satisfies ChartConfig;

export default function WeeklyWorkoutCompletion({
    className
}: {
    className?: string
}) {
  const { weeklyProgress } = useData();
  const charrtData = [
    { day: "Mon", completion_rate: 95, is_rest_day: false },
    { day: "Tue", completion_rate: 88, is_rest_day: false },
    { day: "Wed", completion_rate: 92, is_rest_day: false },
    { day: "Thu", completion_rate: 0, is_rest_day: true },
    { day: "Fri", completion_rate: 85, is_rest_day: false },
    { day: "Sat", completion_rate: 78, is_rest_day: false },
    { day: "Sun", completion_rate: 0, is_rest_day: true },
  ];

  const chartData = useMemo(() => {
    return weeklyProgress.map((wp)=> {
      return {
        day: new Date(wp.date).toLocaleDateString('en-US', { weekday: 'short'}),
        completion_rate: wp.workout_progress,
        is_rest_day: wp.is_rest_day
      }
    })
  }, [weeklyProgress]);
  const avgCompletion =
    chartData
      .filter((day) => !day.is_rest_day)
      .reduce((acc, day) => acc + day.completion_rate, 0) /
    chartData.filter((day) => !day.is_rest_day).length;

  return (
    <Card className={cn("glass", className)}>
      <CardHeader>
        <CardTitle>Weekly Workout Completion</CardTitle>
        <CardDescription>Your workout completion rate by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="completion_rate"
              fill="var(--color-completion_rate)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average completion: {avgCompletion.toFixed(1)}%{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Rest days are scheduled for recovery
        </div>
      </CardFooter>
    </Card>
  );
}
