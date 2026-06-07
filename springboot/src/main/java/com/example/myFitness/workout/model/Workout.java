package com.example.myFitness.workout.model;

import java.util.ArrayList;
import java.util.List;

// Main Workout class
public class Workout {
    private int id;
    private String name;
    private String category;
    private List<Step> steps;

    // Getters and setters
    // Getter and Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for category
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // Getter and Setter for steps
    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

     public Workout(int id, String name, String category, List<Step> steps) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.steps = steps;
    }

}