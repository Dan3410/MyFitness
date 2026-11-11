package com.example.myFitness.calendar;

import java.util.List;

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
    String workoutCategory,
    String groupId,
    String groupName,
    List<String> recipientIds) {
  public CalendarEvent(
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
    this(id, trainerId, trainerName, studentId, studentName, date, time, workoutId, workoutTitle, workoutCategory,
        null, null, studentId == null ? List.of() : List.of(studentId));
  }

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
