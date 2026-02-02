package com.example.myFitness.workout.model;

import java.time.LocalDate;

public class WorkoutListItem {
    Number id;
    String name;
    String category;
    Number estimatedTime;
    LocalDate lastTimeDone;
    LocalDate createdDate;
    LocalDate modifiedDate;

    // Constructor
    public WorkoutListItem(Number id, String name, String category, Number estimatedTime,
            LocalDate lastTimeDone, LocalDate createdDate, LocalDate modifiedDate) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.estimatedTime = estimatedTime;
        this.lastTimeDone = lastTimeDone;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    // Getters
    public Number getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public Number getEstimatedTime() {
        return estimatedTime;
    }

    public LocalDate getLastTimeDone() {
        return lastTimeDone;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public LocalDate getModifiedDate() {
        return modifiedDate;
    }

    // Setters
    public void setId(Number id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setEstimatedTime(Number estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public void setLastTimeDone(LocalDate lastTimeDone) {
        this.lastTimeDone = lastTimeDone;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public void setModifiedDate(LocalDate modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

}
