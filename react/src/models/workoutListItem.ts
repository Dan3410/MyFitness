export type WorkoutCategoryValue = 'Swim' | 'Gym' | 'Run';

export interface WorkoutListItem {
    id: string
    name: string
    category: WorkoutCategoryValue
    estimatedTime: number
    lastTimeDone: String
    createdDate: String
    modifiedDate: String
}