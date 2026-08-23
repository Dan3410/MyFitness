import { Option } from "../models/option";
import { StepType } from "../models/workoutSteps";

export const CONST_GYM_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Ejercicio', value: StepType.EXERCISE },
    { label: 'Intervalo', value: StepType.INTERVAL },
    { label: 'Calentamiento', value: StepType.GYMWARMUP },
    { label: 'Enfriamiento', value: StepType.GYMCOOLDOWN },
]