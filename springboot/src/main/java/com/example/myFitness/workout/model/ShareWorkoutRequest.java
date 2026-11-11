package com.example.myFitness.workout.model;

import java.util.List;

public record ShareWorkoutRequest(List<String> studentIds, List<String> groupIds) {
  public ShareWorkoutRequest(List<String> studentIds) {
    this(studentIds, List.of());
  }
}
