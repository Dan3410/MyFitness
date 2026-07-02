package com.example.myFitness.workout.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SwimStroke {
    IM("Combinado"),
    FREESTYLE("Crol"),
    BACKSTROKE("Espalda"),
    BREASTSTROKE("Braza"),
    BUTTERFLY("Mariposa"),
    CHOICE("A elección");

    private final String displayName;

    SwimStroke(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

     @JsonCreator
    public static SwimStroke fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("SwimStroke value must not be empty");
        }

        for (SwimStroke stroke : values()) {
            if (stroke.displayName.equalsIgnoreCase(value.trim())) {
                return stroke;
            }
        }

        throw new IllegalArgumentException("Unknown SwimStroke value: " + value);
    }

    @Override
    public String toString() {
        return displayName;
    }
}
