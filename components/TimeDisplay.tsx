"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TimeDisplay() {
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

  return (
    <div className="font-mono text-sm space-y-1">
      <div className="flex items-center space-x-2">
        <div className="text-2xl font-bold">
          {format(time, "hh:mm")}
          <span className="text-muted-foreground text-sm">{format(time, ":ss")}</span>
        </div>
        <div className="text-muted-foreground uppercase">{format(time, "a")}</div>
      </div>
    </div>
  );
}