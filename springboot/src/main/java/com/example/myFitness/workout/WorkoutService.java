package com.example.myFitness.workout;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
      new WorkoutListItem(0, "Swim workout", "swim", 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
      new WorkoutListItem(1, "Gym workout", "gym", 100, LocalDate.now(), LocalDate.now(), LocalDate.now())
  };

  Workout[] workouts = {
    new Workout()
  };

  public WorkoutCategory[] getCategories() {
    return categories;
  }

  public WorkoutListItem[] getWorkoutsListItems(String id, String categories) {
    return workoutsListItems;
  }

  //Create type for workout
  public Workout createWorkout(String id, Workout workout) {
    return workouts[0];
  }

  //Create type for workout
  public Workout editWorkout(String id, Workout workout) {
    return workouts[0];
  }

  public WorkoutListItem[] deleteWorkout(String id) {
    List<WorkoutListItem> list = new ArrayList<WorkoutListItem>(Arrays.asList(workoutsListItems));

    list.removeIf(workoutItem -> workoutItem.getId().equals(Integer.parseInt(id)));
    workoutsListItems = list.toArray(new WorkoutListItem[0]);

    return workoutsListItems;
  }

}