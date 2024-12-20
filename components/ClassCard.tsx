"use client";

import { ClassSchedule, TimeStatus } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { formatDuration, formatTimeLeft } from "@/lib/time";

interface ClassCardProps {
  class: ClassSchedule;
  timeStatus: TimeStatus;
}

const codeColors = {
  P: "bg-purple-500/10 text-purple-500 ring-purple-500/20",
  R: "bg-red-500/10 text-red-500 ring-red-500/20",
  O: "bg-orange-500/10 text-orange-500 ring-orange-500/20",
  Y: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
  G: "bg-green-500/10 text-green-500 ring-green-500/20",
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ClassCard({ class: classItem, timeStatus }: ClassCardProps) {
  const totalMinutes = differenceInMinutes(
    parseISO(`2024-01-01T${classItem.endTime}`),
    parseISO(`2024-01-01T${classItem.startTime}`)
  );

  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all hover:border-primary",
        timeStatus.isActive && "border-primary bg-primary/5",
        timeStatus.isPast && "opacity-50"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  codeColors[classItem.classCode]
                )}
              >
                {classItem.classCode}
              </span>
              <h3 className="font-semibold leading-none tracking-tight">
                {classItem.subject}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{classItem.teacher}</p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(parseISO(`2024-01-01T${classItem.startTime}`), "h:mm a")}
              {" - "}
              {format(parseISO(`2024-01-01T${classItem.endTime}`), "h:mm a")}
            </span>
          </div>
        </div>

        <div className="space-y-2 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{classItem.days.map(day => dayNames[day]).join(", ")}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: {formatDuration(totalMinutes)}
          </div>
          {timeStatus.timeUntilNext && !timeStatus.isPast && (
            <div className="text-sm font-medium text-primary">
              Starts in {formatDuration(parseInt(timeStatus.timeUntilNext))}
            </div>
          )}
        </div>

        {timeStatus.isActive && (
          <div className="space-y-2">
            <div className="text-sm text-primary font-medium">
              {formatTimeLeft(parseInt(timeStatus.timeRemaining!), classItem.subject)}
            </div>
            <div className="relative h-1.5 rounded-full bg-primary/20">
              <div
                className="absolute h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${timeStatus.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}