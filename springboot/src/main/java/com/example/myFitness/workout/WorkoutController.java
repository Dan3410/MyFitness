package com.example.myFitness.workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.workout.model.Workout;
import com.example.myFitness.workout.model.WorkoutCategory;
import com.example.myFitness.workout.model.WorkoutListItem;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

  @Autowired
    private WorkoutService workoutService;

  @GetMapping("/categories")
  public WorkoutCategory[] getCategories() {
    return workoutService.getCategories();
  }

  @GetMapping("/list/{userId}")
  public WorkoutListItem[] getWorkouts(@PathVariable String userId, @RequestParam String category){
    return workoutService.getWorkoutsListItems(userId, category);
  }
  
  @PostMapping("/{workoutId}")
  public Workout createWorkout(@PathVariable String workoutId, @RequestBody Workout workout){
    return workoutService.createWorkout(workoutId, workout);
  }

  @PutMapping("/{workoutId}")
  public Workout editWorkout(@PathVariable String workoutId, @RequestBody Workout workout){
    return workoutService.editWorkout(workoutId, workout);
  }

  @DeleteMapping("/{workoutId}")
  public WorkoutListItem[] deleteWorkout(@PathVariable String workoutId){
    return workoutService.deleteWorkout(workoutId);
  }
}