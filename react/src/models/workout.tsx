import { gymStep, runStep, swimStep } from "./workoutSteps"

export interface Workout{
    id: number
    name: string
    category: string
    steps: Array<gymStep | swimStep | runStep>
}
