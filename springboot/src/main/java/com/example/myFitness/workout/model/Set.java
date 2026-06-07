package com.example.myFitness.workout.model;

import java.util.List;

public class Set {
    private int repeat;
    private List<Step> steps;

    public int getRepeat() {
        return repeat;
    }

    public void setRepeat(int repeat) {
        this.repeat = repeat;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    // Parameterized constructor
    public Set(List<Step> set, int repeat) {
        setSteps(steps);
        setRepeat(repeat);
    }
}