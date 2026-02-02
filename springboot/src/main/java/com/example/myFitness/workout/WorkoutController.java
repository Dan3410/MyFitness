package com.example.myFitness.workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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

  @GetMapping("/list/{id}")
  public WorkoutListItem[] getWorkouts(@PathVariable String id, @RequestParam String category){
    return workoutService.getWorkoutsListItems(id, category);
  }

}