package com.example.myFitness.workout.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class WorkoutListItemTest {

    @Test
    void shouldExposeSpanishCategoryLabels() {
        assertEquals("Natación", WorkoutListItem.Category.SWIM.getLabel());
        assertEquals("Gimnasio", WorkoutListItem.Category.GYM.getLabel());
        assertEquals("Correr", WorkoutListItem.Category.RUN.getLabel());
    }
}
