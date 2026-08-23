export enum WorkoutCategory {
    ALL = 'all',
    SWIM = 'swim',
    GYM = 'gym',
    RUN = 'run'
}

export interface WorkoutCategoryOption {
    label: string
    value: WorkoutCategory
}