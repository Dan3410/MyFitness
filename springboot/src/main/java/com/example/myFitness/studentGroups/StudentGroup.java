package com.example.myFitness.studentGroups;

import java.util.List;

import com.example.myFitness.profile.model.UserSearchResult;

public record StudentGroup(
    String id,
    String name,
    String trainerId,
    String trainerName,
    boolean administrator,
    List<UserSearchResult> members) {
}
