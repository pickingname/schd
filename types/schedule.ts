export type ClassCode = 'P' | 'R' | 'O' | 'Y' | 'G';

export interface ClassSchedule {
  id: string;
  subject: string;
  startTime: string; // 24-hour format "HH:mm"
  endTime: string; // 24-hour format "HH:mm"
  teacher: string;
  classCode: ClassCode;
  days: number[]; // 0-6, where 0 is Sunday
}

export interface TimeStatus {
  isActive: boolean;
  isPast: boolean;
  progress: number;
  timeUntilNext?: string;
  timeRemaining?: string;
}