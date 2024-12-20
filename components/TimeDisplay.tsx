"use client";

import { useEffect, useState } from "react";
import { format, differenceInMinutes, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ClassSchedule } from "@/types/schedule";
import { Timer, Calendar, Clock } from "lucide-react";
import { formatTimeLeft } from "@/lib/time";

interface TimeDisplayProps {
  classes: ClassSchedule[];
}

export function TimeDisplay({ classes }: TimeDisplayProps) {
  const [time, setTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  const todayClasses = classes
    .filter((c) => c.days.includes(time.getDay()))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getCurrentStatus = () => {
    const currentTimeStr = format(time, "HH:mm");
    const activeClass = todayClasses.find(
      (c) => c.startTime <= currentTimeStr && currentTimeStr <= c.endTime
    );

    if (activeClass) {
      const endTime = parseISO(`2024-01-01T${activeClass.endTime}`);
      const currentTime = parseISO(`2024-01-01T${currentTimeStr}`);
      const minutesLeft = differenceInMinutes(endTime, currentTime);
      return {
        text: formatTimeLeft(minutesLeft, activeClass.subject),
        progress: (minutesLeft / differenceInMinutes(
          parseISO(`2024-01-01T${activeClass.endTime}`),
          parseISO(`2024-01-01T${activeClass.startTime}`)
        )) * 100,
      };
    }

    const nextClass = todayClasses.find((c) => c.startTime > currentTimeStr);
    if (nextClass) {
      const startTime = parseISO(`2024-01-01T${nextClass.startTime}`);
      const currentTime = parseISO(`2024-01-01T${currentTimeStr}`);
      const minutesUntil = differenceInMinutes(startTime, currentTime);
      return {
        text: formatTimeLeft(minutesUntil),
        progress: ((minutesUntil - differenceInMinutes(
          parseISO(`2024-01-01T${nextClass.startTime}`),
          currentTime
        )) / minutesUntil) * 100,
      };
    }

    return {
      text: "No more classes today",
      progress: 100,
    };
  };

  const lastClass = todayClasses[todayClasses.length - 1];
  const status = getCurrentStatus();

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{format(time, "EEEE")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="font-mono">
              <span className="text-2xl font-bold">{format(time, "hh:mm")}</span>
              <span className="text-muted-foreground">{format(time, ":ss")}</span>
              <span className="ml-1 text-sm text-muted-foreground">
                {format(time, "a")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{status.text}</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="absolute h-full bg-primary transition-all duration-300"
              style={{ width: `${100 - status.progress}%` }}
            />
          </div>
        </div>

        {lastClass && (
          <div className="text-sm text-muted-foreground">
            All classes end at {format(parseISO(`2024-01-01T${lastClass.endTime}`), "h:mm a")}
          </div>
        )}
      </div>
    </div>
  );
}