import { Meal } from "@/interfaces";
import { Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🍎",
  dinner: "🌙",
};

export function MealCard({
  meal,
  isTracked,
  onTrack,
}: {
  meal: Meal;
  isTracked: boolean;
  onTrack: () => void;
}) {
  return (
    <Card
      className={`transition-all ${
        isTracked ? "bg-card/50 border-dashed" : "glass hover:border-primary/50"
      }`}
    >
      <CardContent className="flex flex-col p-4">
        <div className="flex flex-wrap gap-2 items-start justify-between">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {mealIcons[meal.meal_type as keyof typeof mealIcons]}
              </span>
              <Badge
                variant="secondary"
                className={`font-semibold uppercase ${
                  isTracked ? "line-through text-muted-foreground" : ""
                }`}
              >
                {meal.meal_type}
              </Badge>
            </div>
            <p
              className={`text-2xl font-bold ${
                isTracked
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {meal.description}
            </p>
            {!isTracked && (
              <div className="text-sm text-muted-foreground">
                <span>{meal.calories} kcal</span> -{" "}
                <span>{meal.portion_size}</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant={isTracked ? "ghost" : "default"}
            onClick={onTrack}
            className={`rounded-full w-24 ${
              isTracked
                ? "border-green-500 text-green-500"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isTracked ? <Check className="mr-2 h-4 w-4" /> : null}
            {isTracked ? "Tracked" : "Track"}
          </Button>
        </div>
        {!isTracked && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-rose-900/40 rounded-md">
              <div className="font-bold text-rose-400">
                {meal.protein_grams}g
              </div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="text-center p-2 bg-blue-900/40 rounded-md">
              <div className="font-bold text-blue-400">{meal.carbs_grams}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center p-2 bg-yellow-900/40 rounded-md">
              <div className="font-bold text-yellow-400">
                {meal.fats_grams}g
              </div>
              <div className="text-xs text-muted-foreground">Fats</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
