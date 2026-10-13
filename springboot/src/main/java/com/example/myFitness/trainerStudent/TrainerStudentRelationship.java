package com.example.myFitness.trainerStudent;

public record TrainerStudentRelationship(
    String id,
    String name,
    String profileImage,
    boolean isTrainer,
    RelationshipType relationshipType) {
  public enum RelationshipType {
    TRAINER,
    STUDENT
  }
}
