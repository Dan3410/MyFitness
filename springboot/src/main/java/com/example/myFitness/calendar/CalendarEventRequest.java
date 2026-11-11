package com.example.myFitness.calendar;

public record CalendarEventRequest(String date, String studentId, String time, String workoutId, String groupId) {
  public CalendarEventRequest(String date, String studentId) {
    this(date, studentId, null, null, null);
  }

  public CalendarEventRequest(String date, String studentId, String time) {
    this(date, studentId, time, null, null);
  }

  public CalendarEventRequest(String date, String studentId, String time, String workoutId) {
    this(date, studentId, time, workoutId, null);
  }
}
