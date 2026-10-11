export interface PlannedWorkout {
  id: string;
  title: string;
  category: string;
}

export type PlannedWorkouts = Record<string, PlannedWorkout[]>;