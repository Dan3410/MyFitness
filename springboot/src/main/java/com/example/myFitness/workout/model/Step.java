package com.example.myFitness.workout.model;

public abstract class Step {
    private StepType type;

    public StepType getType() {
        return type;
    }

    public void setType(StepType type) {
        this.type = type;
    }

    public Step(StepType type){
        this.type = type;
    }
}


