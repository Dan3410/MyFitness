import { Option } from "../models/option";
import { stepType } from "../models/workoutSteps";

export const CONST_GYM_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Ejercicio', value: stepType.EXERCISE },
    { label: 'Intervalo', value: stepType.INTERVAL },
    { label: 'Calentamiento', value: stepType.WARMUP },
    { label: 'Enfriamiento', value: stepType.COOLDOWN },
]