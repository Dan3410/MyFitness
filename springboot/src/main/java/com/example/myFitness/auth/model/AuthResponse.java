package com.example.myFitness.auth.model;

public record AuthResponse(String token, String userId, String email, String name, String lastName) {
}