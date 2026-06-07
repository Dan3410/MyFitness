package com.example.myFitness.workout;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.myFitness.workout.model.GymStep;
import com.example.myFitness.workout.model.Step;
import com.example.myFitness.workout.model.StepType;
import com.example.myFitness.workout.model.SwimGear;
import com.example.myFitness.workout.model.SwimStep;
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
            new WorkoutListItem(0, "Swim Swim", "swim", 60, LocalDate.now(), LocalDate.now(), LocalDate.now()),
            new WorkoutListItem(1, "Gym workout", "gym", 100, LocalDate.now(), LocalDate.now(), LocalDate.now())
        };

        // --- Swim steps ---
        List<Step> swimSteps = new ArrayList<>();

        // Use actual enum names from your SwimGear
        swimSteps.add(createSwimStep(StepType.WARMUP, 300, null, Arrays.asList(), 1));
        swimSteps.add(createSwimStep(StepType.SWIM_DISTANCE, 200, null, Arrays.asList(SwimGear.PULLBUOY), 6));
        swimSteps.add(createSwimStep(StepType.SWIM_TIME, 50, 50, Arrays.asList(SwimGear.FINS), 8));
        swimSteps.add(createSwimStep(StepType.COOLDOWN, 200, null, Arrays.asList(), 1));

        // --- Gym steps ---
        List<Step> gymSteps = new ArrayList<>();
        gymSteps.add(createGymStep(StepType.WARMUP, "Stationary Bike", true, 0, 5, 0.0, 1));
        gymSteps.add(createGymStep(StepType.GYM_EXERCISE, "Back Squat", false, 6, 0, 100.0, 4));
        gymSteps.add(createGymStep(StepType.GYM_EXERCISE, "Bench Press", false, 8, 0, 70.0, 4));
        gymSteps.add(createGymStep(StepType.GYM_INTERVAL, "EMOM: 10 kettlebell swings", true, 0, 10, 0.0,3));
        gymSteps.add(createGymStep(StepType.COOLDOWN, "Stretching", true, 0, 5, 0.0, 1));

        // --- Workouts array and assignment ---
        workouts = new Workout[] {
            new Workout("0", "Swim Swim", "swim", swimSteps),
            new Workout("1", "Gym workout", "gym", gymSteps)
        };
    }

    // helper to create SwimStep and set repeat
    private SwimStep createSwimStep(StepType type, Integer distance, Integer time, List<SwimGear> gear, int repeat) {
        SwimStep s = new SwimStep(type, distance, time, gear);
        s.setRepeat(repeat);
        return s;
    }

    private GymStep createGymStep(StepType type, String exercise, boolean byTime, int reps, int time, double weight, int repeat) {
        GymStep g = new GymStep(type, exercise, byTime, reps, time, weight);
        g.setRepeat(repeat);
        return g;
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