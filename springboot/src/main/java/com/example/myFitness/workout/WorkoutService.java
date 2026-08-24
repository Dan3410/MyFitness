package com.example.myFitness.workout;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.myFitness.workout.model.GymStep;
import com.example.myFitness.workout.model.RestStep;
import com.example.myFitness.workout.model.RunStep;
import com.example.myFitness.workout.model.Set;
import com.example.myFitness.workout.model.Step;
import com.example.myFitness.workout.model.StepType;
import com.example.myFitness.workout.model.SwimGear;
import com.example.myFitness.workout.model.SwimStep;
import com.example.myFitness.workout.model.SwimStroke;
import com.example.myFitness.workout.model.Workout;
import com.example.myFitness.workout.model.WorkoutCategory;
import com.example.myFitness.workout.model.WorkoutListItem;

import jakarta.annotation.PostConstruct;

@Service
public class WorkoutService {

  private WorkoutCategory[] categories;
  private WorkoutListItem[] workoutsListItems;
  private Workout[] workouts;

  @PostConstruct
  public void init() {
    // categories
    categories = new WorkoutCategory[] {
        new WorkoutCategory("Todos", "all"),
        new WorkoutCategory("Natación", "swim"),
        new WorkoutCategory("Gimnasio", "gym"),
        new WorkoutCategory("Correr", "run")
    };

    // workouts list items
    workoutsListItems = new WorkoutListItem[] {
        new WorkoutListItem(0, "Swim Swim", WorkoutListItem.Category.SWIM, 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
      new WorkoutListItem(1, "Lift heavy things", WorkoutListItem.Category.GYM, 100, LocalDate.now(), LocalDate.now(), LocalDate.now()),
      new WorkoutListItem(2, "Run training", WorkoutListItem.Category.RUN, 45, LocalDate.now(), LocalDate.now(), LocalDate.now())
    };

    // --- Swim steps ---
    List<Step> swimSteps = new ArrayList<>();

    swimSteps.add(this
        .createSet(Arrays.asList(createSwimStep(StepType.SWIM_WARMUP, 300, null, Collections.<SwimGear> emptyList(), SwimStroke.CHOICE)), 1));
    swimSteps.add(this.createSet(
        Arrays.asList(
            createSwimStep(StepType.SWIM_DISTANCE, 200, null, Arrays.asList(SwimGear.PULLBUOY), SwimStroke.CHOICE)),
        4));
    swimSteps.add(this.createSet(
        Arrays.asList(createSwimStep(StepType.SWIM_TIME, 50, 50, Arrays.asList(SwimGear.FINS), SwimStroke.CHOICE)), 4));
    swimSteps.add(this
        .createSet(Arrays.asList(createSwimStep(StepType.SWIM_COOLDOWN, 200, null, Collections.<SwimGear> emptyList(), SwimStroke.CHOICE)), 4));

    // --- Gym steps ---
    List<Step> gymSteps = new ArrayList<>();
    gymSteps.add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_WARMUP, "Stationary Bike", true, 0, 5, 0.0),
        createGymStep(StepType.GYM_WARMUP, "Running", true, 0, 5, 0.0)), 4));
    gymSteps
        .add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_EXERCISE, "Back Squat", false, 6, 0, 100.0)), 4));
    gymSteps
        .add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_EXERCISE, "Bench Press", false, 8, 0, 70.0)), 4));
    gymSteps.add(this
        .createSet(Arrays.asList(
            createGymStep(StepType.GYM_INTERVAL, "Kettlebell swings", true, 0, 60, 16.0),
            createRestStep(30),
            createGymStep(StepType.GYM_INTERVAL, "Push ups", true, 0, 60, 20.0),
            createGymStep(StepType.GYM_INTERVAL, "Pull ups", true, 0, 60, 20.0),
            createRestStep(45),
            createGymStep(StepType.GYM_INTERVAL, "Squats", true, 0, 60, 70.0)), 4));
    gymSteps.add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_COOLDOWN, "Stretching", true, 0, 5, 0.0)), 4));

    // --- Run steps ---
    List<Step> runSteps = new ArrayList<>();
    runSteps.add(this.createSet(Arrays.asList(createRunStep(StepType.RUN_WARMUP, 0, 0, 300, 8.0)), 1));
    runSteps.add(this.createSet(Arrays.asList(createRunStep(StepType.RUN_DISTANCE, 5000, 0, null, 10.0)), 1));
    runSteps.add(this.createSet(Arrays.asList(createRunStep(StepType.RUN_TIME, 0, 0, 1200, 10.0)), 2));
    runSteps.add(this.createSet(Arrays.asList(createRunStep(StepType.RUN_CALORIES, 0, 300, null, 9.0)), 1));
    runSteps.add(this.createSet(Arrays.asList(createRestStep(60)), 1));
    runSteps.add(this.createSet(Arrays.asList(createRunStep(StepType.RUN_COOLDOWN, 0, 0, 300, 6.0)), 1));

    workouts = new Workout[] {
        new Workout("0", "Swim Swim", "swim", swimSteps),
      new Workout("1", "Gym workout", "gym", gymSteps),
      new Workout("2", "Run training", "run", runSteps)
    };
  }

  private Set createSet(List<Step> step, int repeat) {
    Set s = new Set(step, repeat);
    s.setRepeat(repeat);
    return s;
  }

  // helper to create SwimStep and set repeat
  private SwimStep createSwimStep(StepType type, Integer distance, Integer time, List<SwimGear> gear,
      SwimStroke stroke) {
    return new SwimStep(type, distance, time, gear, stroke);
  }

  private GymStep createGymStep(StepType type, String exercise, boolean byTime, int reps, int time, double weight) {
    return new GymStep(type, exercise, byTime, reps, time, weight);
  }

  private RunStep createRunStep(StepType type, int distance, int calories, Integer time, Double speed) {
    return new RunStep(type, distance, calories, time, speed);
  }

  private RestStep createRestStep(int time) {
    return new RestStep(time);
  }


  public WorkoutCategory[] getCategories() {
    return categories;
  }

  public WorkoutListItem[] getWorkoutsListItems(String id, String category) {
    if (!category.equals("all")) {
      return Arrays.stream(workoutsListItems)
          .filter(item -> category.equalsIgnoreCase(item.getCategory().name()))
          .collect(Collectors.toList()).toArray(WorkoutListItem[]::new);
    } else
      return workoutsListItems;
  }

  public Workout createWorkout(String id, Workout workout) {
    if (workout == null) {
      return null;
    }

    if (workout.getId() == null || workout.getId().isBlank()) {
      workout.setId(String.valueOf(workouts.length));
    }

    Workout[] updatedWorkouts = Arrays.copyOf(workouts, workouts.length + 1);
    updatedWorkouts[workouts.length] = workout;
    workouts = updatedWorkouts;
    syncWorkoutListItem(workout);

    return workout;
  }

  private void syncWorkoutListItem(Workout updatedWorkout) {
    if (updatedWorkout == null) {
      return;
    }

    List<WorkoutListItem> list = new ArrayList<>(Arrays.asList(workoutsListItems));
    for (WorkoutListItem item : list) {
      if (item.getId().equals(Integer.parseInt(updatedWorkout.getId()))) {
        item.setName(updatedWorkout.getName());
        item.setCategory(WorkoutListItem.Category.valueOf(updatedWorkout.getCategory().toUpperCase()));
        item.setModifiedDate(LocalDate.now());
        workoutsListItems = list.toArray(new WorkoutListItem[0]);
        return;
      }
    }

    list.add(new WorkoutListItem(
        Integer.parseInt(updatedWorkout.getId()),
        updatedWorkout.getName(),
        WorkoutListItem.Category.valueOf(updatedWorkout.getCategory().toUpperCase()),
        updatedWorkout.getSteps() == null ? 0 : updatedWorkout.getSteps().stream().mapToInt(step -> 0).sum(),
        LocalDate.now(),
        LocalDate.now(),
        LocalDate.now()));
    workoutsListItems = list.toArray(new WorkoutListItem[0]);
  }

  public Workout getWorkout(String id) {
    return Arrays.stream(workouts)
        .filter(item -> id.equals(item.getId()))
        .findFirst().orElse(null);
  }

  public Workout editWorkout(String id, Workout newWorkout) {
    for (Workout workout : workouts) {
      if (id.equals(workout.getId())) {
        workout.setName(newWorkout.getName());
        workout.setCategory(newWorkout.getCategory());
        workout.setSteps(newWorkout.getSteps());
        syncWorkoutListItem(workout);
        return workout; // edit successful
      }
    }
    return null; // workout not found
  }

  public WorkoutListItem[] deleteWorkout(String id) {
    List<WorkoutListItem> list = new ArrayList<WorkoutListItem>(Arrays.asList(workoutsListItems));

    list.removeIf(workoutItem -> workoutItem.getId().equals(Integer.parseInt(id)));
    workoutsListItems = list.toArray(new WorkoutListItem[0]);

    return workoutsListItems;
  }

}