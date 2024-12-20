"use client";

import { useEffect, useRef, useState } from "react";
import { ClassSchedule } from "@/types/schedule";
import { ClassCard } from "./ClassCard";
import { TimeDisplay } from "./TimeDisplay";
import { differenceInMinutes, format, parse, parseISO } from "date-fns";

interface ScheduleViewProps {
  classes: ClassSchedule[];
}

export function ScheduleView({ classes }: ScheduleViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeStatus = (classItem: ClassSchedule) => {
    const now = currentTime;
    const today = format(now, "yyyy-MM-dd");
    const startTime = parse(classItem.startTime, "HH:mm", new Date());
    const endTime = parse(classItem.endTime, "HH:mm", new Date());
    const currentTimeOnly = parse(format(now, "HH:mm"), "HH:mm", new Date());

    const start = parseISO(`${today}T${classItem.startTime}`);
    const end = parseISO(`${today}T${classItem.endTime}`);

    const isActive = currentTimeOnly >= startTime && currentTimeOnly <= endTime;
    const isPast = currentTimeOnly > endTime;

    let progress = 0;
    let timeUntilNext = "";
    let timeRemaining = "";

    if (isActive) {
      const totalDuration = differenceInMinutes(end, start);
      const elapsed = differenceInMinutes(now, start);
      progress = (elapsed / totalDuration) * 100;
      timeRemaining = `${differenceInMinutes(end, now)}min`;
    } else if (!isPast) {
      const minutesUntilStart = differenceInMinutes(start, now);
      timeUntilNext = `${minutesUntilStart}min`;
    }

    return { isActive, isPast, progress, timeUntilNext, timeRemaining };
  };

  useEffect(() => {
    const activeClass = containerRef.current?.querySelector(
      '[data-active="true"]'
    );
    if (activeClass) {
      activeClass.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentTime]);

  const todayClasses = classes
    .filter((c) => c.days.includes(currentTime.getDay()))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <TimeDisplay classes={classes} />

        <div ref={containerRef} className="space-y-4">
          {todayClasses.map((classItem) => {
            const timeStatus = calculateTimeStatus(classItem);
            return (
              <div key={classItem.id} data-active={timeStatus.isActive}>
                <ClassCard class={classItem} timeStatus={timeStatus} />
              </div>
            );
          })}

          {todayClasses.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No classes scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
}