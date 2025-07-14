"use client";

import { ArrowRightCircle, Dumbbell, Target, TrendingUp } from "lucide-react";
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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@radix-ui/react-separator";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "A radial chart with text";

const chart1Data = [
  { browser: "safari", meals: 200, fill: "var(--color-primary)" },
];

const chart1Config = {
  meals: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;
const chart2Data = [
  { browser: "safari", visitors: 200, fill: "var(--color-accent)" },
];

const chart2Config = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--color-accent)",
  },
} satisfies ChartConfig;

export function ChartRadialText() {

  return (
    <Card className="glass flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center w-fit gap-5 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            <Target className="text-primary"/>
        
            Today's Progress</CardTitle>
        <CardDescription>{new Date().toDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="border">
          <ChartContainer config={chart1Config} className="mx-auto border ">
            <RadialBarChart
              
              data={chart1Data}
              startAngle={0}
              endAngle={250}
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
              <RadialBar dataKey="meals" background cornerRadius={10} />
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
                            {chart1Data[0].meals.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 leading-none font-medium">
              Meal Progress
            </div>
            
          </div>
        </div>
       
        <div className="border">
          <ChartContainer config={chart2Config} className="mx-auto borde ">
            <RadialBarChart
              data={chart2Data}
              startAngle={0}
              endAngle={250}
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
              <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                            className="fill-accent text-4xl font-bold"
                          >
                            <Dumbbell />
                            {chart2Data[0].visitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 leading-none font-medium">
              Workout Progress
            </div>
            
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
