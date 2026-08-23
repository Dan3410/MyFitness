import { Option } from "../models/option";
import { StepType } from "../models/workoutSteps";

export const CONST_SWIM_STEP_TYPE_OPTIONS: Array<Option> = [
    { label: 'Distancia', value: StepType.SWIMDISTANCE },
    { label: 'Tiempo', value: StepType.SWIMTIME },
    { label: 'Calentamiento', value: StepType.SWIMWARMUP },
    { label: 'Enfriamiento', value: StepType.SWIMCOOLDOWN },
]