export interface PlannedWorkout {
  id: string;
  title: string;
  category: string;
}

export type PlannedWorkouts = Record<string, PlannedWorkout[]>;

export interface CalendarEvent {
  id: string;
  trainerId: string;
  trainerName: string;
  studentId: string;
  studentName: string;
  date: string;
}