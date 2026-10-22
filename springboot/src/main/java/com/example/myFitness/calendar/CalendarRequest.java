package com.example.myFitness.calendar;

public record CalendarRequest(String date, String workoutId, String time) {
  public CalendarRequest(String date, String workoutId) {
    this(date, workoutId, null);
  }
}
