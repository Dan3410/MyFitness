package com.example.myFitness.workout.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import tools.jackson.databind.ObjectMapper;


class SwimGearTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldParseGearValuesIgnoringCase() throws Exception {
        assertEquals(SwimGear.FINS, SwimGear.fromValue("Aletas"));
        assertEquals(SwimGear.FINS, SwimGear.fromValue("AleTas"));
        assertEquals(SwimGear.PULLBOY, SwimGear.fromValue("Pullboy"));
        assertEquals(SwimGear.PULLBOY, SwimGear.fromValue("PuLlBoY"));
    }

    @Test
    void shouldDeserializeJsonValuesIgnoringCase() throws Exception {
        assertEquals(SwimGear.PADDLES, objectMapper.readValue("\"Manoplas\"", SwimGear.class));
        assertEquals(SwimGear.SNORKEL, objectMapper.readValue("\"Snorkel\"", SwimGear.class));
    }

    @Test
    void shouldThrowForUnknownGearValue() {
        assertThrows(IllegalArgumentException.class, () -> SwimGear.fromValue("unknown"));
    }
}
