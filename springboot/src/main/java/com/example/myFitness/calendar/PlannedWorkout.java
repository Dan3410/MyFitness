package com.example.myFitness.calendar;

public record PlannedWorkout(String id, String title, String category, String time) {
  public PlannedWorkout(String id, String title, String category) {
    this(id, title, category, null);
  }
}