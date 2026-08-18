package com.example.myFitness.workout.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collections;

import org.junit.jupiter.api.Test;

import com.example.myFitness.workout.WorkoutService;

class WorkoutListItemTest {

    @Test
    void shouldExposeSpanishCategoryLabels() {
        assertEquals("Natación", WorkoutListItem.Category.SWIM.getLabel());
        assertEquals("Gimnasio", WorkoutListItem.Category.GYM.getLabel());
        assertEquals("Correr", WorkoutListItem.Category.RUN.getLabel());
    }

    @Test
    void shouldUpdateListItemNameWhenWorkoutIsEdited() {
        WorkoutService service = new WorkoutService();
        service.init();

        Workout updatedWorkout = new Workout("0", "Swim updated", "swim", Collections.emptyList());
        service.editWorkout("0", updatedWorkout);

        assertEquals("Swim updated", service.getWorkoutsListItems("0", "all")[0].getName());
    }
}
