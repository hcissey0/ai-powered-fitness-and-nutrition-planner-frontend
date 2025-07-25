import { useData } from "@/context/data-context";
import { Dumbbell, Utensils, Droplets, FlameIcon as Fire } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function TodayStats() {
    const { todayStats } = useData();

    if (!todayStats) return <></>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Workouts */}
        <Card className="glass bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Today's Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {todayStats.workouts_completed}/{todayStats.total_workouts}
                </div>
                <p className="text-xs opacity-90">Completed</p>
              </div>
              <Dumbbell className="h-8 w-8 opacity-80 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Meals Logged */}
        <Card className="glass bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Meals Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {todayStats.meals_logged}/{todayStats.total_meals}
                </div>
                <p className="text-xs opacity-90">Today</p>
              </div>
              <Utensils className="h-8 w-8 opacity-80 text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="glass bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {todayStats.calories_consumed}
                </div>
                <p className="text-xs opacity-90">
                  of {todayStats.target_calories} kcal
                </p>
              </div>
              <Fire className="h-8 w-8 opacity-80 text-red-400" />
            </div>
          </CardContent>
        </Card>

        {/* Water Intake */}
        <Card className="glass bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {todayStats.water_intake}L
                </div>
                <p className="text-xs opacity-90">
                  of {todayStats.target_water}L
                </p>
              </div>

              <Droplets className="h-8 w-8 opacity-80 text-blue-400" />
              {/* <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  💧
                </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
}