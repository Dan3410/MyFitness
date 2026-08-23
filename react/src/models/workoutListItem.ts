import { WorkoutCategory } from './workoutCategories';

export interface WorkoutListItem {
    id: string
    name: string
    category: WorkoutCategory
    estimatedTime: number
    lastTimeDone: String
    createdDate: String
    modifiedDate: String
}