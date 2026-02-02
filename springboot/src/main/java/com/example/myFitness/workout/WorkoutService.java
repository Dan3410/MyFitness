package com.example.myFitness.workout;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.example.myFitness.workout.model.WorkoutCategory;
import com.example.myFitness.workout.model.WorkoutListItem;

@Service
public class WorkoutService {

  WorkoutCategory[] categories = {
      new WorkoutCategory("Todos", "all"),
      new WorkoutCategory("Natación", "swim"),
      new WorkoutCategory("Gimnasio", "gym"),
      new WorkoutCategory("Correr", "run"),
  };

  WorkoutListItem[] workoutsListItems = {
      new WorkoutListItem(0, "Swim workout", "swim", 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
      new WorkoutListItem(1, "Gym workout", "gym", 100, LocalDate.now(), LocalDate.now(), LocalDate.now())
  };

  public WorkoutCategory[] getCategories() {
    return categories;
  }

  // Separar por categorias al hacer la query a la bd
  public WorkoutListItem[] getWorkoutsListItems(String id, String categories) {
    return workoutsListItems;
  }
}