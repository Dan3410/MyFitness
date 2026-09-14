package com.example.myFitness.auth.model;

public record Account(String userId, String username, String email, String passwordHash, String name, String lastName) {
}
