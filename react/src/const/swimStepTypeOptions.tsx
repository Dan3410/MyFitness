import { Option } from "../models/option";
import { stepType } from "../models/workoutSteps";

export const CONST_SWIM_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Distancia', value: stepType.SWIMDISTANCE },
    { label: 'Tiempo', value: stepType.SWIMTIME },
    { label: 'Calentamiento', value: stepType.WARMUP },
    { label: 'Enfriamiento', value: stepType.COOLDOWN },
]