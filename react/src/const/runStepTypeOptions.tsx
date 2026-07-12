import { Option } from "../models/option";
import { stepType } from "../models/workoutSteps";

export const CONST_RUN_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Distancia', value: stepType.RUNDISTANCE },
    { label: 'Tiempo', value: stepType.RUNTIME },
    { label: 'Calorías', value: stepType.RUNCALORIES },
    { label: 'Calentamiento', value: stepType.WARMUP },
    { label: 'Enfriamiento', value: stepType.COOLDOWN },
]