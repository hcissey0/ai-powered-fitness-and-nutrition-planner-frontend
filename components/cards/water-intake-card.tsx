import { NutritionDay } from "@/interfaces";
import { Droplets } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useData } from "@/context/data-context";

export function WaterIntakeCard({
  nutrition,
  stats,
  litres,
  onTrack,
}: {
  nutrition: NutritionDay;
  stats: any;
  litres?: number;
  onTrack?: () => void;
}) {
  const {track, settings } = useData();

  const handleTrack = async () => {
    await track('track', 'water', nutrition.id, 0, 0, 0, litres || 0.25)
    if (onTrack) onTrack();
  }
  return (
    <Card className="glas flex justify-center border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base">
          <Droplets className="h-5 w-5 text-blue-400" />
          <span>Water Intake</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-blue-400">
            {stats.water_intake}
          </span>
          <span className="text-lg text-muted-foreground">
            {" "}
            / {stats.target_water}L
          </span>
        </div>
        <Progress
          value={(stats.water_intake / stats.target_water) * 100}
          className="h-2 bg-blue-500/20"
          // indicatorClassName="bg-blue-500"
        />
        {settings.trackingEnabled ?
        <Button
        onClick={handleTrack}
        className="w-full bg-blue-600 hover:bg-blue-700 text-foreground"
        // disabled={stats.water_intake >= stats.target_water}
        >
          <Droplets className="h-4 w-4 mr-2" /> Add 250ml
        </Button> : <p className="text-xs text-muted-foreground text-center">tracking disabled</p>
        }
      </CardContent>
    </Card>
  );
}
