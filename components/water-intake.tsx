import { Droplets } from "lucide-react";
import { Button } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { useData } from "@/context/data-context";

export function WaterIntake() {
  const { todayStats, todayNutrition, track } = useData();

  if (!todayStats || !todayNutrition) return <></>;

  return (
    <Card className="glas border-0 bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          <span>Water Intake</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-start">
          <div className="text-3xl font-bold text-blue-600">
            {todayStats.water_intake}L
          </div>
          <div className="text-sm ">of {todayStats.target_water}L target</div>
        </div>
        <Progress
          value={(todayStats.water_intake / todayStats.target_water) * 100}
          className="h-3"
        />
        <Button
          onClick={async () =>
            await track(
              "track",
              "water",
              todayNutrition.id,
              undefined,
              undefined,
              0.25
            )
          }
          className="w-full text-foreground bg-blue-600 hover:bg-blue-700"
          disabled={todayStats.water_intake >= todayStats.target_water}
        >
          <Droplets className="h-4 w-4 mr-2" />
          Add 250ml
        </Button>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
          {Array.from(
            { length: Math.round(todayStats.target_water / 0.25) },
            (_, i) => (
              <div
                key={i}
                className={`h-6 rounded ${
                  i < todayStats.water_intake * 4
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
