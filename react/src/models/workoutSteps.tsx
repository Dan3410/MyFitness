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
    description?: string;
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
    gear: swimGear[];
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