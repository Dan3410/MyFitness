
export interface set{
    repeat: number

    steps: Array<swimStep | runStep | gymStep>
}

export enum stepType{
    //general
    REST = "Rest",

    //gym
    EXERCISE = "Exercise",
    
    //swim
    SWIMDISTANCE = "Distance",
    SWIMTIME = "Time",

    RUNDISTANCE = "Distance",
    RUNTIME = "Time",
    RUNCALORIES = "Calories"
}

export enum swimGear {
    FINS = "Fins",
    PULLBOY = "Pullboy",
    PADDLES = "Paddles",
    SNORKEL = "Snorkel"
}

export interface swimStep{
    //Rest, swim distance or swim time
    type: stepType
    
    distance: number | null

    time: number | null

    //Can make a type of this
    gear: Array<swimGear>
}

export interface runStep{
    //Rest, run distance, run time or calories
    type: stepType
    
    distance: number

    calories: number

    time: number | null

    //Km/h
    speed: number | undefined

}

export interface gymStep{
    type: stepType

    exercise: string
    
    //Set to true when setting type rest
    byTime: boolean

    reps: number

    time: number

    weight: number
}