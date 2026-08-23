import { WorkoutStep } from './workoutSteps';
import { WorkoutCategory } from './workoutCategories';

export interface Workout {
    id: string;
    name: string;
    category: WorkoutCategory;
    steps: WorkoutStep[];
}
