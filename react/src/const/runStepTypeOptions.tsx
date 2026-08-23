import { Option } from "../models/option";
import { StepType } from "../models/workoutSteps";

export const CONST_RUN_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Distancia', value: StepType.RUNDISTANCE },
    { label: 'Tiempo', value: StepType.RUNTIME },
    { label: 'Calorías', value: StepType.RUNCALORIES },
    { label: 'Calentamiento', value: StepType.RUNWARMUP },
    { label: 'Enfriamiento', value: StepType.RUNCOOLDOWN },
]