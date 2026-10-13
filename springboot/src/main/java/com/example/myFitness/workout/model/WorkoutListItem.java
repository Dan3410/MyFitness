package com.example.myFitness.workout.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonValue;

public class WorkoutListItem {
    public enum Category {
        SWIM("Natación"),
        GYM("Gimnasio"),
        RUN("Correr");

        private final String label;

        Category(String label) {
            this.label = label;
        }

        @JsonValue
        public String getLabel() {
            return label;
        }

        @Override
        public String toString() {
            return label;
        }
    }

    String id;
    String name;
    Category category;
    Integer estimatedTime;
    LocalDate lastTimeDone;
    LocalDate createdDate;
    LocalDate modifiedDate;
    String sourceTrainerName;

    // Constructor
    public WorkoutListItem(String id, String name, Category category, Integer estimatedTime,
            LocalDate lastTimeDone, LocalDate createdDate, LocalDate modifiedDate, String sourceTrainerName) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.estimatedTime = estimatedTime;
        this.lastTimeDone = lastTimeDone;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.sourceTrainerName = sourceTrainerName;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getSourceTrainerName() {
        return sourceTrainerName;
    }

    public String getName() {
        return name;
    }

    public Category getCategory() {
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
    public void setId(String id) {
        this.id = id;
    }

    public void setSourceTrainerName(String sourceTrainerName) {
        this.sourceTrainerName = sourceTrainerName;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(Category category) {
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
