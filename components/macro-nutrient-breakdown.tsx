"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

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


const chartConfig = {
  grams: {
    label: "Grams",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-1))",
  },
  carbs: {
    label: "Carbohydrates",
    color: "hsl(var(--chart-2))",
  },
  fats: {
    label: "Fats",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function MacronutrientBreakdown({className}:{className?:string}) {
  const { todayStats } = useData();
  
  const chartData = [
    { nutrient: "protein", grams: todayStats?.total_protein || 0, fill: "var(--color-rose-400)" },
    { nutrient: "carbs", grams: todayStats?.total_carbs || 0, fill: "var(--color-blue-400)" },
    { nutrient: "fats", grams: todayStats?.total_fats || 0, fill: "var(--color-green-400)" },
  ];

  const totalGrams = chartData.reduce((acc, curr) => acc + curr.grams, 0);

  return (
    <Card className={cn("glass flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Macronutrient Breakdown</CardTitle>
        <CardDescription>Today's nutrition distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="grams"
              nameKey="nutrient"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalGrams.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          grams
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Balanced macro distribution <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total: {totalGrams}g consumed today
        </div>
      </CardFooter>
    </Card>
  );
}
