"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"

export default function Calendar21() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 17),
  })

  return (
    <Calendar
      mode="single"
      
      defaultMonth={new Date()}
      // selected={range}
      // onSelect={setRange}
      numberOfMonths={1}
      // captionLayout="dropdown"
      className="glass-popover w-full h-full rounded-lg shadow-sm [--cell-size:--spacing()] "
      formatters={{
        formatMonthDropdown: (date) => {
          return date.toLocaleString("default", { month: "long" })
        },
      }}
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6

          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props}>
              {children}
              {/* show a red dot and a blue dot, to indicate workout plan and nutrition plan */}
              <div className="flex gap-1">
              {!modifiers.workout && <span className="dot workout w-2 h-2 rounded-full bg-primary/80" />}
              {!modifiers.nutrition && <span className="dot nutrition w-2 h-2 rounded-full bg-accent/80" />}

              </div>
              {/* {!modifiers.outside && <span>{isWeekend ? "$220" : "$100"}</span>} */}
            </CalendarDayButton>
          )
        },
      }}
    />
  )
}
