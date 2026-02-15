package com.example.myFitness.workout.model;

import java.time.LocalDate;

public class WorkoutListItem {
    Integer id;
    String name;
    String category;
    Integer estimatedTime;
    LocalDate lastTimeDone;
    LocalDate createdDate;
    LocalDate modifiedDate;

    // Constructor
    public WorkoutListItem(Integer id, String name, String category, Integer estimatedTime,
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
    public Integer getId() {
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
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setEstimatedTime(Integer estimatedTime) {
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
