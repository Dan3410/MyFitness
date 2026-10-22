export interface PlannedWorkout {
  id: string;
  title: string;
  category: string;
  time?: string | null;
}

export type PlannedWorkouts = Record<string, PlannedWorkout[]>;

export interface CalendarEvent {
  id: string;
  trainerId: string;
  trainerName: string;
  studentId: string;
  studentName: string;
  date: string;
  time?: string | null;
  workoutId?: string | null;
  workoutTitle?: string | null;
  workoutCategory?: string | null;
}