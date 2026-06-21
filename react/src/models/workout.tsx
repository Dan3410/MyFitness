import { WorkoutStep } from './workoutSteps';

export interface Workout {
    id: string;
    name: string;
    category: string;
    steps: WorkoutStep[];
}
