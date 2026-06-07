package com.example.myFitness.workout.model;

public class GymStep extends Step {
    private String exercise;
    private boolean byTime;
    private int reps;
    private int time;
    private double weight;

    // Parameterized constructor
    public GymStep(StepType type, String exercise, boolean byTime, int reps, int time, double weight) {
        super(type);
        this.exercise = exercise;
        this.byTime = byTime;
        this.reps = reps;
        this.time = time;
        this.weight = weight;
    }

    // Getter and Setter for exercise
    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    // Getter and Setter for byTime
    public boolean isByTime() {
        return byTime;
    }

    public void setByTime(boolean byTime) {
        this.byTime = byTime;
    }

    // Getter and Setter for reps
    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    // Getter and Setter for time
    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    // Getter and Setter for weight
    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

}