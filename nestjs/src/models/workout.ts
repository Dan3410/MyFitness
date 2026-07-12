export type WorkoutCategoryValue = 'SWIM' | 'GYM' | 'RUN';

export interface WorkoutListItem {
    id: number;
    name: string;
    category: WorkoutCategoryValue;
    estimatedTime: number;
    lastTimeDone: Date;
    createdDate: Date;
    modifiedDate: Date;
}

export type StepType =
    | 'REST'
    | 'WARMUP'
    | 'COOLDOWN'
    | 'SET'
    | 'GYM_EXERCISE'
    | 'GYM_INTERVAL'
    | 'SWIM_DISTANCE'
    | 'SWIM_TIME'
    | 'RUN_DISTANCE'
    | 'RUN_TIME'
    | 'RUN_CALORIES';

export type SwimGear = 'FINS' | 'PULLBUOY' | 'PADDLES' | 'SNORKEL' | 'KICKBOARD' | 'NONE';
export type SwimStroke =
    | 'IM'
    | 'FREESTYLE'
    | 'BACKSTROKE'
    | 'BREASTSTROKE'
    | 'BUTTERFLY'
    | 'CHOICE';

export interface BaseStep {
    type: StepType;
}

export interface RestStep extends BaseStep {
    type: 'REST';
    seconds: number;
}

export interface WorkoutSet extends BaseStep {
    type: 'SET';
    repeat: number;
    steps: WorkoutStep[];
}

export interface SwimStep extends BaseStep {
    type: 'SWIM_DISTANCE' | 'SWIM_TIME';
    distance: number | null;
    time: number | null;
    gear: SwimGear[];
    stroke: SwimStroke;
}

export interface RunStep extends BaseStep {
    type: 'RUN_DISTANCE' | 'RUN_TIME' | 'RUN_CALORIES';
    distance: number;
    calories: number;
    time: number | null;
    speed: number | null;
}

export interface GymStep extends BaseStep {
    type: 'GYM_EXERCISE' | 'GYM_INTERVAL';
    exercise: string;
    byTime: boolean;
    reps: number;
    time: number;
    weight: number;
}

export type WorkoutStep =
    | RestStep
    | WorkoutSet
    | SwimStep
    | RunStep
    | GymStep;

export interface Workout {
    id: string;
    name: string;
    category: string;
    steps: WorkoutStep[];
}