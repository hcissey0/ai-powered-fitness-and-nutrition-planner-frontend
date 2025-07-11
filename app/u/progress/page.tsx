"use client";
import { ProgressCalendar } from "@/components/progress-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyProgress } from "@/lib/api-service";
import { DailyProgress } from "@/interfaces";
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

export default function ProgressPage() {
  const [progress, setProgress] = React.useState<DailyProgress[]>([]);

  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await getDailyProgress();
        setProgress(progressData.progress);
      } catch (error) {
        console.error("Failed to fetch progress", error);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Progress</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workout and Meal Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressCalendar initialProgress={progress} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="workout_progress"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="nutrition_progress"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
