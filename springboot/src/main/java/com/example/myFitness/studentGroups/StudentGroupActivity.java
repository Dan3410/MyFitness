package com.example.myFitness.studentGroups;

import java.time.Instant;

public record StudentGroupActivity(String id, String type, String message, Instant createdAt) {
}
