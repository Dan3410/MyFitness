package com.example.myFitness.calendar;

public record CalendarEvent(
    String id,
    String trainerId,
    String trainerName,
    String studentId,
    String studentName,
    String date) {
}
