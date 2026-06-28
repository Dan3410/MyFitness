package com.example.myFitness.workout.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import tools.jackson.databind.ObjectMapper;


class SwimGearTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldParseGearValuesIgnoringCase() throws Exception {
        assertEquals(SwimGear.FINS, SwimGear.fromValue("Fins"));
        assertEquals(SwimGear.FINS, SwimGear.fromValue("FiNs"));
        assertEquals(SwimGear.PULLBOY, SwimGear.fromValue("Pullboy"));
        assertEquals(SwimGear.PULLBOY, SwimGear.fromValue("PuLlBoY"));
    }

    @Test
    void shouldDeserializeJsonValuesIgnoringCase() throws Exception {
        assertEquals(SwimGear.PADDLES, objectMapper.readValue("\"Paddles\"", SwimGear.class));
        assertEquals(SwimGear.SNORKEL, objectMapper.readValue("\"Snorkel\"", SwimGear.class));
    }

    @Test
    void shouldThrowForUnknownGearValue() {
        assertThrows(IllegalArgumentException.class, () -> SwimGear.fromValue("unknown"));
    }
}
