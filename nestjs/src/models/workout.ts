export interface WorkoutListItem {
    id: number
    name: string
    category: string
    estimatedTime: number
    lastTimeDone: Date
    createdDate: Date
    modifiedDate: Date
}

export interface Workout{
    id: number
    name: string
    category: string

}

export interface set{
    repeat: number

    steps: Array<swimStep | runStep | gymStep>
}

export interface swimStep{
    //Rest, swim distance or swim time
    type: string
    
    distance: number | null

    time: number | null

    //Can make a type of this
    gear: Array<string>
}

export interface runStep{
    //Rest, run distance, run time or calories
    type: string
    
    distance: number | null

    time: number | null

}

export interface gymStep{
    exercise: string
    
    repsOrTime: number
}