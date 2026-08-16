export type StepType =
    | 'REST'
    | 'SET'
    | 'GYM_EXERCISE'
    | 'GYM_INTERVAL'
    | 'GYM_WARMUP'
    | 'GYM_COOLDOWN'
    | 'SWIM_DISTANCE'
    | 'SWIM_TIME'
    | 'SWIM_WARMUP'
    | 'SWIM_COOLDOWN'
    | 'RUN_DISTANCE'
    | 'RUN_TIME'
    | 'RUN_CALORIES'
    | 'RUN_WARMUP'
    | 'RUN_COOLDOWN';

export enum stepType {
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

export enum swimGear {
    FINS = 'Fins',
    PULLBUOY = 'Pullbuoy',
    PADDLES = 'Paddles',
    SNORKEL = 'Snorkel',
    KICKBOARD = 'Kickboard',
    NONE = 'None'

}

export enum SwimStroke {
    IM = 'Combinado',
    FREESTYLE = 'Crol',
    BACKSTROKE = 'Espalda',
    BREASTSTROKE = 'Pecho',
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
    type: 'SWIM_DISTANCE' | 'SWIM_TIME' | 'SWIM_WARMUP' | 'SWIM_COOLDOWN';
    distance: number | null;
    time: number | null;
    gear: swimGear[];
    stroke: SwimStroke;
}

export interface RunStep extends BaseStep {
    type: 'RUN_DISTANCE' | 'RUN_TIME' | 'RUN_CALORIES' | 'RUN_WARMUP' | 'RUN_COOLDOWN';
    distance: number;
    calories: number;
    time: number | null;
    speed: number | null;
}

export interface GymStep extends BaseStep {
    type: 'GYM_EXERCISE' | 'GYM_INTERVAL' | 'GYM_WARMUP' | 'GYM_COOLDOWN';
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