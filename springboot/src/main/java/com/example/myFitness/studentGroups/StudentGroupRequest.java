package com.example.myFitness.studentGroups;

import java.util.List;

public record StudentGroupRequest(String name, List<String> memberIds) {
}
