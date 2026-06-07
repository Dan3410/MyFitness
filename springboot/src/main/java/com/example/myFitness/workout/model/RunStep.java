package com.example.myFitness.workout.model;

public class RunStep extends Step {
    private int distance;
    private int calories;
    private Integer time; // nullable
    private Double speed; // nullable (undefined equivalent)

    // No-argument constructor
    public RunStep() {
        setType(type); // set the step type
    }

    // Parameterized constructor
        public RunStep(StepType type, int distance, int calories, Integer time, Double speed) {
        setType(type); // set the step type
        this.distance = distance;
        this.calories = calories;
        this.time = time;
        this.speed = speed;
    }

    // Getter and Setter for distance
    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    // Getter and Setter for calories
    public int getCalories() {
        return calories;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    // Getter and Setter for time
    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    // Getter and Setter for speed
    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }
}