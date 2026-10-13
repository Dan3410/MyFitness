package com.example.myFitness.notification;

import java.time.Instant;

public record TrainerRequestNotification(
    String id,
    String trainerId,
    String trainerName,
    String recipientId,
    String message,
    Instant createdAt,
    boolean seen,
    TrainerRequestStatus status,
    NotificationType type) {
}