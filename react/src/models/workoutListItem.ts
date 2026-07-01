export type WorkoutCategoryValue = 'Natación' | 'Gimnasio' | 'Correr' | 'swim' | 'gym' | 'run';

export interface WorkoutListItem {
    id: string
    name: string
    category: WorkoutCategoryValue
    estimatedTime: number
    lastTimeDone: String
    createdDate: String
    modifiedDate: String
}