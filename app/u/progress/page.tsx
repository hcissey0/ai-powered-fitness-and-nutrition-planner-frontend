// // /u/progress/page.tsx
// "use client";
// import { ProgressCalendar } from "@/components/progress-calendar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useData } from "@/context/data-context";
// import { useTheme } from "next-themes";
// import { resolve } from "path";

// export default function ProgressPage() {
//   const { progress } = useData();
//   const { resolvedTheme } = useTheme();
//   const [chartColors, setChartColors] = useState({
//     grid: "",
//     workout: "",
//     nutrition: "",
//     text: "",
//   });

//   useEffect(() => {
//     // We must wait for the component to mount to safely access CSS variables
//     const workoutColor = getComputedStyle(document.documentElement)
//       .getPropertyValue("--primary")
//       .trim();
//     const nutritionColor = getComputedStyle(document.documentElement)
//       .getPropertyValue("--accent")
//       .trim();
//     const gridColor = getComputedStyle(document.documentElement)
//       .getPropertyValue("--border")
//       .trim();
//     const textColor = getComputedStyle(document.documentElement)
//       .getPropertyValue("--muted-foreground")
//       .trim();

//     setChartColors({
//       grid: `hsl(${gridColor})`,
//       workout: `hsl(${workoutColor})`,
//       nutrition: `hsl(${nutritionColor})`,
//       text: `hsl(${textColor})`,
//     });
//   }, [resolvedTheme]); // Rerun when theme changes

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Your Progress</h1>
//         <p className="text-muted-foreground">
//           Visualize your workout and nutrition consistency over time.
//         </p>
//       </div>

//       <Card className="glass">
//         <CardHeader>
//           <CardTitle>Consistency Calendar</CardTitle>
//           <CardDescription>
//             Each green square represents a day you tracked an activity.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ProgressCalendar initialProgress={progress} />
//         </CardContent>
//       </Card>

//       <Card className="glass">
//         <CardHeader>
//           <CardTitle>Performance Over Time</CardTitle>
//           <CardDescription>
//             Tracking your daily workout and nutrition completion percentage.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart
//               data={progress}
//               margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
//             >
//               <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fill: chartColors.text }}
//                 tickLine={{ stroke: chartColors.text }}
//               />
//               <YAxis
//                 unit="%"
//                 tick={{ fill: chartColors.text }}
//                 tickLine={{ stroke: chartColors.text }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--background))",
//                   borderColor: "hsl(var(--border))",
//                   color: "hsl(var(--foreground))",
//                 }}
//                 cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
//               />
//               <Legend wrapperStyle={{ color: chartColors.text }} />
//               <Line
//                 type="monotone"
//                 dataKey="workout_progress"
//                 name="Workout"
//                 stroke={chartColors.workout}
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="nutrition_progress"
//                 name="Nutrition"
//                 stroke={chartColors.nutrition}
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//////////// old code ///////////////////

"use client";
import { ProgressCalendar } from "@/components/progress-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useData } from "@/context/data-context";

export default function ProgressPage() {
  const { progress } = useData();

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500">Your Progress</h1>
      <div className="flex flex-col gap-4 ">

      <div>
          <ProgressCalendar />
      </div>
      <div className={"glass p-4 rounded-xl flex flex-col gap-4"}>
        <CardTitle>Progress Over Time</CardTitle>
          <ResponsiveContainer width="100%" height={300} >
            <LineChart data={progress}>
              <CartesianGrid stroke="" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="workout_progress"
                stroke="#ff6b6b"
              />
              <Line
                type="monotone"
                dataKey="nutrition_progress"
                stroke="#00d4ff"
                />
            </LineChart>
          </ResponsiveContainer>

      </div>
                </div>
    </div>
  );
}
