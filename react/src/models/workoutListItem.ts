import { WorkoutCategory } from './workoutCategories';

export interface WorkoutListItem {
    id: string
    name: string
    category: WorkoutCategory
    estimatedTime: number
    lastTimeDone: string
    createdDate: string
    modifiedDate: string
    sourceTrainerName?: string
}