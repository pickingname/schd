import scheduleData from "@/data/schedule.json";
import { ScheduleView } from "@/components/ScheduleView";

export default function Home() {
  return <ScheduleView classes={scheduleData.classes} />;
}