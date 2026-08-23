export type WorkoutCategoryValue = 'swim' | 'gym' | 'run';

export interface WorkoutListItem {
    id: number;
    name: string;
    category: WorkoutCategoryValue;
    estimatedTime: number;
    lastTimeDone: Date;
    createdDate: Date;
    modifiedDate: Date;
}

export enum StepType {
    REST = 'REST',
    SET = 'SET',
    EXERCISE = 'GYM_EXERCISE',
    INTERVAL = 'GYM_INTERVAL',
    GYMWARMUP = 'GYM_WARMUP',
    GYMCOOLDOWN = 'GYM_COOLDOWN',
    SWIMDISTANCE = 'SWIM_DISTANCE',
    SWIMTIME = 'SWIM_TIME',
    SWIMWARMUP = 'SWIM_WARMUP',
    SWIMCOOLDOWN = 'SWIM_COOLDOWN',
    RUNDISTANCE = 'RUN_DISTANCE',
    RUNTIME = 'RUN_TIME',
    RUNCALORIES = 'RUN_CALORIES',
    RUNWARMUP = 'RUN_WARMUP',
    RUNCOOLDOWN = 'RUN_COOLDOWN'
}

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
    type: StepType.REST;
    seconds: number;
}

export interface WorkoutSet extends BaseStep {
    type: StepType.SET;
    repeat: number;
    steps: WorkoutStep[];
}

export interface SwimStep extends BaseStep {
    type: StepType.SWIMDISTANCE | StepType.SWIMTIME | StepType.SWIMWARMUP | StepType.SWIMCOOLDOWN;
    distance: number | null;
    time: number | null;
    gear: SwimGear[];
    stroke: SwimStroke;
}

export interface RunStep extends BaseStep {
    type: StepType.RUNDISTANCE | StepType.RUNTIME | StepType.RUNCALORIES | StepType.RUNWARMUP | StepType.RUNCOOLDOWN;
    distance: number;
    calories: number;
    time: number | null;
    speed: number | null;
}

export interface GymStep extends BaseStep {
    type: StepType.EXERCISE | StepType.INTERVAL | StepType.GYMWARMUP | StepType.GYMCOOLDOWN;
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