package com.example.myFitness.profile.model;

public enum Objective{
    reduce("reduce"),
    maintain("maintain"),
    increase("increase");

    private String objective;

    private Objective(String objective) {
        this.objective = objective;
    }

    public String getObjective() {
        return objective;
    }
}