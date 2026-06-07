package com.example.myFitness.workout;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.myFitness.workout.model.Workout;
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
      new WorkoutListItem(0, "Swim Swim", "swim", 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
      new WorkoutListItem(1, "Gym workout", "gym", 100, LocalDate.now(), LocalDate.now(), LocalDate.now())
  };

  Workout[] workouts = {
      new Workout(0, "Swim Swim", "swim", new ArrayList<>()),
      new Workout(1, "Gym workout", "gym", new ArrayList<>())
  };

  public WorkoutCategory[] getCategories() {
    return categories;
  }

  public WorkoutListItem[] getWorkoutsListItems(String id, String category) {
    if (!category.equals("all")) {
      return Arrays.stream(workoutsListItems)
          .filter(item -> category.equals(item.getCategory()))
          .collect(Collectors.toList()).toArray(WorkoutListItem[]::new);
    } else
      return workoutsListItems;
  }

  public Workout createWorkout(String id, Workout workout) {
    return workouts[0];
  }

  public Workout editWorkout(int id, Workout workout) {
    return Arrays.stream(workouts)
        .filter(item -> id == item.getId())
        .findFirst().get();
  }

  public WorkoutListItem[] deleteWorkout(String id) {
    List<WorkoutListItem> list = new ArrayList<WorkoutListItem>(Arrays.asList(workoutsListItems));

    list.removeIf(workoutItem -> workoutItem.getId().equals(Integer.parseInt(id)));
    workoutsListItems = list.toArray(new WorkoutListItem[0]);

    return workoutsListItems;
  }

}