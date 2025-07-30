// components/today-stats.tsx
import { useData } from "@/context/data-context";
import { Dumbbell, Utensils, Droplets, Flame } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const statCards = [
  {
    title: "Meals Logged",
    getValue: (stats: any) => `${stats.meals_logged}/${stats.total_meals}`,
    unit: "Today",
    icon: Utensils,
    color: "text-green-400",
  },
  {
    title: "Today's Workouts",
    getValue: (stats: any) =>
      `${stats.workouts_completed}/${stats.total_workouts}`,
    unit: "Completed",
    icon: Dumbbell,
    color: "text-blue-400",
  },
  {
    title: "Calories",
    getValue: (stats: any) => stats.calories_consumed,
    unit: (stats: any) => `of ${stats.target_calories} kcal`,
    icon: Flame,
    color: "text-orange-400",
  },
  {
    title: "Water Intake",
    getValue: (stats: any) => `${stats.water_intake}L`,
    unit: (stats: any) => `of ${stats.target_water}L`,
    icon: Droplets,
    color: "text-cyan-400",
  },
];

export function TodayStats() {
  const { todayStats } = useData();

  if (!todayStats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="glass">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.getValue(todayStats)}
            </div>
            <p className="text-xs text-muted-foreground">
              {typeof stat.unit === "function"
                ? stat.unit(todayStats)
                : stat.unit}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
