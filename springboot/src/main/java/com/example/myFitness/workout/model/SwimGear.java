package com.example.myFitness.workout.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SwimGear {
    FINS("Aletas"),
    PULLBOY("Pullboy"),
    PADDLES("Manoplas"),
    SNORKEL("Snorkel");

    private final String value;

    SwimGear(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SwimGear fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("SwimGear value must not be empty");
        }

        for (SwimGear gear : values()) {
            if (gear.value.equalsIgnoreCase(value.trim())) {
                return gear;
            }
        }

        throw new IllegalArgumentException("Unknown SwimGear value: " + value);
    }

    @Override
    public String toString() {
        return value;
    }
}