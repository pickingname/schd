"use client";

import { ClassSchedule, TimeStatus } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

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

export function ClassCard({ class: classItem, timeStatus }: ClassCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all hover:border-primary",
        timeStatus.isActive && "border-primary bg-primary/5",
        timeStatus.isPast && "opacity-50"
      )}
    >
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
        <div className="text-sm text-muted-foreground">
          {format(parseISO(`2024-01-01T${classItem.startTime}`), "h:mm a")}{" "}
          {" to "}
          {format(parseISO(`2024-01-01T${classItem.endTime}`), "h:mm a")}
        </div>
      </div>

      {timeStatus.isActive && timeStatus.timeRemaining && (
        <div className="mt-2 text-sm text-muted-foreground">
          {timeStatus.timeRemaining} remaining
        </div>
      )}
      {timeStatus.isActive && (
        <div className="relative mt-1 h-1 rounded-full bg-primary/20">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${timeStatus.progress}%` }}
          />
        </div>
      )}
      {!timeStatus.isActive &&
        timeStatus.timeUntilNext &&
        !timeStatus.isPast && (
          <div className="mt-2 text-sm text-muted-foreground">
            Starts in {timeStatus.timeUntilNext}
          </div>
        )}
    </div>
  );
}
