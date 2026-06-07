package com.example.myFitness.workout.model;

public abstract class Step {
    protected StepType type;
    protected int repeat;

    public StepType getType() {
        return type;
    }

    public void setType(StepType type) {
        this.type = type;
    }

    public int getRepeat(){
        return repeat;
    }

    public void setRepeat(int repeat) {
        this.repeat = repeat;
    }
}


