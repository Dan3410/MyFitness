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
import com.example.myFitness.workout.model.ShareWorkoutRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import com.example.myFitness.auth.AuthService;
import com.example.myFitness.studentGroups.StudentGroupsService;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

  @Autowired
    private WorkoutService workoutService;

  @Autowired
    private AuthService authService;

  @Autowired
    private StudentGroupsService studentGroupsService;

  @GetMapping("/categories")
  public WorkoutCategory[] getCategories() {
    return workoutService.getCategories();
  }

  @GetMapping("/list/{userId}")
  public WorkoutListItem[] getWorkouts(@PathVariable String userId, @RequestParam String category,
      @RequestHeader(value = "Authorization", required = false) String authorization){
    return workoutService.getWorkoutsListItems(authService.requireUserId(authorization), category);
  }

  @GetMapping("/{workoutId}")
  public Workout createWorkout(@PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization){
    return workoutService.getWorkout(authService.requireUserId(authorization), workoutId);
  }

  @PostMapping("/{workoutId}/share")
  public java.util.List<String> shareWorkout(
      @PathVariable String workoutId,
      @RequestBody ShareWorkoutRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    String trainerId = authService.requireUserId(authorization);
    java.util.List<String> groupIds = request.groupIds() == null
        ? java.util.List.of() : request.groupIds().stream().distinct().toList();
    java.util.List<String> studentIds = request.studentIds() == null
        ? java.util.List.of() : request.studentIds();
    java.util.List<String> sharedStudentIds = workoutService.shareWorkout(
        trainerId, workoutId, studentIds, groupIds);
    String workoutName = workoutService.getWorkout(trainerId, workoutId).getName();
    groupIds.forEach(groupId -> studentGroupsService.recordActivity(
        trainerId, groupId, "WORKOUT_SHARED", "Se compartió la rutina " + workoutName + " con el grupo."));
    return sharedStudentIds;
  }

  @GetMapping("/{workoutId}/shared-students")
  public java.util.List<String> getSharedStudentIds(
      @PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return workoutService.getSharedStudentIds(authService.requireUserId(authorization), workoutId);
  }

  @GetMapping("/{workoutId}/shared-groups")
  public java.util.List<String> getSharedGroupIds(
      @PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return workoutService.getSharedGroupIds(authService.requireUserId(authorization), workoutId);
  }
  @PostMapping("/{workoutId}")
  public Workout createWorkout(@PathVariable String workoutId, @RequestBody Workout workout,
      @RequestHeader(value = "Authorization", required = false) String authorization){
    return workoutService.createWorkout(authService.requireUserId(authorization), workout);
  }

  @PutMapping("/{workoutId}")
  public Workout editWorkout(@PathVariable String workoutId, @RequestBody Workout workout,
      @RequestHeader(value = "Authorization", required = false) String authorization){
    return workoutService.editWorkout(authService.requireUserId(authorization), workoutId, workout);
  }

  @DeleteMapping("/{workoutId}")
  public WorkoutListItem[] deleteWorkout(@PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization){
    return workoutService.deleteWorkout(authService.requireUserId(authorization), workoutId);
  }

}