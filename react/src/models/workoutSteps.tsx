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

export enum stepType {
    REST = 'REST',
    WARMUP = 'WARMUP',
    COOLDOWN = 'COOLDOWN',
    SET = 'SET',
    EXERCISE = 'GYM_EXERCISE',
    INTERVAL = 'GYM_INTERVAL',
    SWIMDISTANCE = 'SWIM_DISTANCE',
    SWIMTIME = 'SWIM_TIME',
    RUNDISTANCE = 'RUN_DISTANCE',
    RUNTIME = 'RUN_TIME',
    RUNCALORIES = 'RUN_CALORIES'
}

export enum swimGear {
    FINS = 'Fins',
    PULLBOY = 'Pullboy',
    PADDLES = 'Paddles',
    SNORKEL = 'Snorkel',
}

export enum SwimStroke {
    IM = 'Combinado',
    FREESTYLE = 'Crol',
    BACKSTROKE = 'Espalda',
    BREASTSTROKE = 'Braza',
    BUTTERFLY = 'Mariposa',
    CHOICE = 'A elección'
}

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
    type: 'SWIM_DISTANCE' | 'SWIM_TIME' | 'WARMUP' | 'COOLDOWN';
    distance: number | null;
    time: number | null;
    gear: swimGear[];
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