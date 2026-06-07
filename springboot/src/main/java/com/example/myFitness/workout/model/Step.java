package com.example.myFitness.workout.model;

public abstract class Step {
    protected StepType type;

    public StepType getType() {
        return type;
    }

    public void setType(StepType type) {
        this.type = type;
    }
}


