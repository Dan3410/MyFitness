package com.example.myFitness.calendar;

public record CalendarEvent(
    String id,
    String trainerId,
    String trainerName,
    String studentId,
    String studentName,
    String date,
    String time,
    String workoutId,
    String workoutTitle,
    String workoutCategory) {
  public CalendarEvent(
      String id,
      String trainerId,
      String trainerName,
      String studentId,
      String studentName,
      String date) {
    this(id, trainerId, trainerName, studentId, studentName, date, null, null, null, null);
  }

  public CalendarEvent(
      String id,
      String trainerId,
      String trainerName,
      String studentId,
      String studentName,
      String date,
      String time) {
    this(id, trainerId, trainerName, studentId, studentName, date, time, null, null, null);
  }
}
