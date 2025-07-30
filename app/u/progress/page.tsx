

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
