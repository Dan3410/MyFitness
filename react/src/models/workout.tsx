import { gymStep, runStep, set, swimStep } from "./workoutSteps"

export interface Workout{
    id: number
    name: string
    category: string
    steps: Array<set | gymStep | swimStep | runStep>
}
