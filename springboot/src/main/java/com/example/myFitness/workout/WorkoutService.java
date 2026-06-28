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

  // TODO: REST STEPS AND SETS WITH MORE THAN ONE STEP
  // Think of what can be a parent class that can have step and set at the same
  // time
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
        new WorkoutListItem(0, "Swim Swim", "swim", 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
        new WorkoutListItem(1, "Gym workout", "gym", 100, LocalDate.now(), LocalDate.now(), LocalDate.now())
    };

    // --- Swim steps ---
    List<Step> swimSteps = new ArrayList<>();

    swimSteps.add(this
        .createSet(Arrays.asList(createSwimStep(StepType.WARMUP, 300, null, Collections.<SwimGear> emptyList(), SwimStroke.CHOICE)), 1));
    swimSteps.add(this.createSet(
        Arrays.asList(
            createSwimStep(StepType.SWIM_DISTANCE, 200, null, Arrays.asList(SwimGear.PULLBUOY), SwimStroke.CHOICE)),
        4));
    swimSteps.add(this.createSet(
        Arrays.asList(createSwimStep(StepType.SWIM_TIME, 50, 50, Arrays.asList(SwimGear.FINS), SwimStroke.CHOICE)), 4));
    swimSteps.add(this
        .createSet(Arrays.asList(createSwimStep(StepType.COOLDOWN, 200, null, Collections.<SwimGear> emptyList(), SwimStroke.CHOICE)), 4));

    // --- Gym steps ---
    List<Step> gymSteps = new ArrayList<>();
    gymSteps.add(this.createSet(Arrays.asList(createGymStep(StepType.WARMUP, "Stationary Bike", true, 0, 5, 0.0),
        createGymStep(StepType.WARMUP, "Running", true, 0, 5, 0.0)), 4));
    gymSteps
        .add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_EXERCISE, "Back Squat", false, 6, 0, 100.0)), 4));
    gymSteps
        .add(this.createSet(Arrays.asList(createGymStep(StepType.GYM_EXERCISE, "Bench Press", false, 8, 0, 70.0)), 4));
    gymSteps.add(this
        .createSet(Arrays.asList(
            createGymStep(StepType.GYM_INTERVAL, "EMOM: 10 kettlebell swings", true, 0, 60, 16.0),
            createRestStep(30),
            createGymStep(StepType.GYM_INTERVAL, "Push ups", true, 0, 60, 20.0),
            createGymStep(StepType.GYM_INTERVAL, "Pull ups", true, 0, 60, 20.0),
            createRestStep(45),
            createGymStep(StepType.GYM_INTERVAL, "Squats", true, 0, 60, 70.0)), 4));
    gymSteps.add(this.createSet(Arrays.asList(createGymStep(StepType.COOLDOWN, "Stretching", true, 0, 5, 0.0)), 4));

    workouts = new Workout[] {
        new Workout("0", "Swim Swim", "swim", swimSteps),
        new Workout("1", "Gym workout", "gym", gymSteps)
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

  private RestStep createRestStep(int time) {
    return new RestStep(time);
  }


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