"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyProgress } from "@/lib/api-service";
import { DailyProgress } from "@/interfaces";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/error-handler";


interface ProgressCalendarProps {
  className?: string;
  initialProgress?: DailyProgress[];
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  progress?: DailyProgress;
}

export function ProgressCalendar({ className, initialProgress }: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [progressData, setProgressData] = useState<DailyProgress[]>(initialProgress || []);
  const [isLoading, setIsLoading] = useState(!initialProgress);

  const fetchProgressData = async (month: Date) => {
    setIsLoading(true);
    try {
      const start = format(startOfMonth(month), 'yyyy-MM-dd');
      const end = format(endOfMonth(month), 'yyyy-MM-dd');
      
      const response = await getDailyProgress({
        start_date: start,
        end_date: end,
      });
      
      setProgressData(response.progress);
    } catch (error) {
      // console.error("Failed to fetch progress data:", error);
      handleApiError(error, "Failed to fetch progress data.")
      setProgressData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If initialProgress is not provided, fetch the data
    if (!initialProgress) {
      fetchProgressData(currentMonth);
    } else {
      // If initialProgress is provided, use it
      setProgressData(initialProgress);
    }
  }, [currentMonth, initialProgress]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? subMonths(currentMonth, 1) 
      : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    fetchProgressData(newMonth);
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start week on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const progress = progressData.find(p => p.date === dateStr);
      
      return {
        date,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isSameDay(date, new Date()),
        progress,
      };
    });
  };

  const calendarDays = generateCalendarDays();
  const weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',];

  const ProgressBar = ({ value, color }: { value: number; color: string }) => (
    <div className={`h-1 sm:h-2 w-full ${color} bg-muted rounded-full overflow-hidden`}>
      <div 
        className="h-full bg-current transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  return (
    <div className={cn("glass rounded-xl max-w-3xl p-3", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg text-white">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400 animate-pulse" />
            Progress Calendar
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {format(currentMonth, 'MMM yyyy')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0 text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-xs text-muted-foreground text-center font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    relative aspect-square min-h-[20px] p-1 rounded-sm sm:rounded-md border transition-all duration-200
                    ${day.isCurrentMonth 
                      ? 'border-white/20 hover:border-white/40' 
                      : 'border-white/5'
                    }
                    ${day.isToday 
                      ? 'ring-2 ring-primary bg-primary-400/10' 
                      : ''
                    }
                  `}
                >
                  {/* Date number */}
                  <div className={`
                    text-xs font-medium sm:mb-2
                    ${day.isCurrentMonth 
                      ? day.isToday 
                        ? 'text-primary-300' 
                        : 'text-white' 
                      : 'text-muted-foreground'
                    }
                  `}>
                    {format(day.date, 'd')}
                  </div>
                  
                  {/* Progress bars */}
                  {day.progress && day.isCurrentMonth && (
                    <div className="space-y-1 sm:space-y-2">
                      {/* Nutrition progress (blue, top) */}
                      <ProgressBar 
                        value={day.progress.nutrition_progress} 
                        color="text-blue-400" 
                      />
                      {/* Workout progress (red, bottom) */}
                      <ProgressBar 
                        value={day.progress.workout_progress} 
                        color="text-red-400" 
                      />
                    </div>
                  )}
                  
                  {/* Rest day indicator */}
                  {day.progress?.is_rest_day && day.isCurrentMonth && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex text-xs md:text-lg items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 ">
                <div className="w-3 h-1 md:w-6 md:h-2 bg-blue-400 rounded-full" />
                <span className="text-muted-foreground">Nutrition</span>
              </div>
              <div className="flex items-center gap-2 ">
                <div className="w-3 h-1 md:w-6 md:h-2 bg-red-400 rounded-full" />
                <span className="text-muted-foreground">Workout</span>
              </div>
              <div className="flex items-center gap-2 ">
                <div className="w-2 h-2 md:w-4 md:h-4 bg-yellow-400 rounded-full" />
                <span className="text-muted-foreground">Rest Day</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
