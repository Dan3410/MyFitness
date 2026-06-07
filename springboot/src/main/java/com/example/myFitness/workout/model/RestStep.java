package com.example.myFitness.workout.model;

public class RestStep extends Step {
    private int seconds;

    public RestStep(int seconds){
        super(StepType.REST);
        setSeconds(seconds);
    }

    public void setSeconds(int seconds){
        this.seconds = seconds;
    }

    public int getSeconds(){
        return this.seconds;
    }
}
