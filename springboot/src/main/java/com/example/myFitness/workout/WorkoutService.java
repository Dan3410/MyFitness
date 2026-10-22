package com.example.myFitness.workout;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.auth.AuthService;

import jakarta.annotation.PostConstruct;

@Service
public class WorkoutService {

  private WorkoutCategory[] categories;
  private Workout[] workouts;
  private final Map<String, List<Workout>> workoutsByUser = new ConcurrentHashMap<>();
  private final Map<String, Map<String, String>> sharedWorkoutTrainersByStudent = new ConcurrentHashMap<>();
  private final AuthService authService;
  private final ProfileService profileService;
  private final TrainerStudentService trainerStudentService;
  private final NotificationService notificationService;

  public WorkoutService(
      AuthService authService,
      ProfileService profileService,
      TrainerStudentService trainerStudentService,
      NotificationService notificationService) {
    this.authService = authService;
    this.profileService = profileService;
    this.trainerStudentService = trainerStudentService;
    this.notificationService = notificationService;
  }

  @PostConstruct
  public void init() {
    // categories
    categories = new WorkoutCategory[] {
        new WorkoutCategory("Todos", "all"),
        new WorkoutCategory("Natación", "swim"),
        new WorkoutCategory("Gimnasio", "gym"),
        new WorkoutCategory("Correr", "run")
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
      new Workout("1", "Lift heavy things", "gym", gymSteps),
      new Workout("2", "Run training", "run", runSteps)
    };

    workoutsByUser.put(authService.getUserId("Swim"), new ArrayList<>(List.of(workouts[0])));
    workoutsByUser.put(authService.getUserId("Gym"), new ArrayList<>(List.of(workouts[1])));
    workoutsByUser.put(authService.getUserId("Run"), new ArrayList<>(List.of(workouts[2])));

    shareWorkout(authService.getUserId("Gym"), workouts[1].getId(), List.of(authService.getUserId("Swim")));
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

  private List<Workout> workoutsForUser(String userId) {
    return workoutsByUser.computeIfAbsent(userId, ignored -> new ArrayList<>());
  }

  private WorkoutListItem[] listItemsForUser(String userId) {
    List<Workout> workouts = new ArrayList<>(workoutsForUser(userId));
    List<WorkoutListItem> items = workouts.stream()
        .map(workout -> new WorkoutListItem(
            workout.getId(),
            workout.getName(),
            WorkoutListItem.Category.valueOf(workout.getCategory().toUpperCase()),
            workout.getSteps() == null ? 0 : workout.getSteps().size(),
            LocalDate.now(), LocalDate.now(), LocalDate.now(), workout.getSourceTrainerName()))
        .collect(Collectors.toCollection(ArrayList::new));
    sharedWorkoutTrainersByStudent.getOrDefault(userId, Map.of()).forEach((workoutId, trainerId) -> {
      Workout workout = findWorkout(trainerId, workoutId);
      if (workout != null) {
        items.add(new WorkoutListItem(
            workout.getId(),
            workout.getName(),
            WorkoutListItem.Category.valueOf(workout.getCategory().toUpperCase()),
            workout.getSteps() == null ? 0 : workout.getSteps().size(),
            LocalDate.now(), LocalDate.now(), LocalDate.now(),
            profileService.getUserSearchResult(trainerId).name()));
      }
    });
    return items.toArray(WorkoutListItem[]::new);
  }

  public WorkoutListItem[] getWorkoutsListItems(String userId, String category) {
    WorkoutListItem[] items = listItemsForUser(userId);
    if (!category.equals("all")) {
      return Arrays.stream(items)
          .filter(item -> category.equalsIgnoreCase(item.getCategory().name()))
          .collect(Collectors.toList()).toArray(WorkoutListItem[]::new);
    } else
      return items;
  }

  public Workout createWorkout(String userId, Workout workout) {
    if (workout == null) {
      return null;
    }

    workout.setId("workout-" + UUID.randomUUID());
    workout.setSourceTrainerName(null);

    workoutsForUser(userId).add(workout);

    return workout;
  }

  public Workout getWorkout(String userId, String id) {
    String trainerId = sharedWorkoutTrainersByStudent.getOrDefault(userId, Map.of()).get(id);
    if (trainerId != null) {
      Workout sharedWorkout = findWorkout(trainerId, id);
      return sharedWorkout == null ? null : copyForStudent(sharedWorkout, trainerId);
    }

    Workout ownedWorkout = workoutsForUser(userId).stream()
        .filter(item -> id.equals(item.getId()))
        .findFirst().orElse(null);
    return ownedWorkout;
  }

  private Workout findWorkout(String ownerId, String workoutId) {
    return workoutsForUser(ownerId).stream()
        .filter(workout -> workoutId.equals(workout.getId()))
        .findFirst()
        .orElse(null);
  }

  private Workout copyForStudent(Workout workout, String trainerId) {
    Workout studentView = new Workout(
        workout.getId(),
        workout.getName(),
        workout.getCategory(),
        workout.getSteps() == null ? List.of() : new ArrayList<>(workout.getSteps()));
    studentView.setSourceTrainerName(profileService.getUserSearchResult(trainerId).name());
    return studentView;
  }

  public boolean hasWorkout(String userId, String id) {
    return getWorkout(userId, id) != null;
  }

  public Workout editWorkout(String userId, String id, Workout newWorkout) {
    if (sharedWorkoutTrainersByStudent.getOrDefault(userId, Map.of()).containsKey(id)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes editar una rutina asignada por tu entrenador");
    }
    for (Workout workout : workoutsForUser(userId)) {
      if (id.equals(workout.getId())) {
        workout.setName(newWorkout.getName());
        workout.setCategory(newWorkout.getCategory());
        workout.setSteps(newWorkout.getSteps());
        return workout; // edit successful
      }
    }
    return null; // workout not found
  }

  public WorkoutListItem[] deleteWorkout(String userId, String id) {
    if (sharedWorkoutTrainersByStudent.getOrDefault(userId, Map.of()).containsKey(id)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes eliminar una rutina asignada por tu entrenador");
    }
    workoutsForUser(userId).removeIf(workout -> workout.getId().equals(id));
    return listItemsForUser(userId);
  }

  public List<String> shareWorkout(String trainerId, String workoutId, List<String> studentIds) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden compartir rutinas");
    }
    Workout sourceWorkout = workoutsForUser(trainerId).stream()
        .filter(workout -> workoutId.equals(workout.getId()))
        .findFirst()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rutina no encontrada"));
    List<String> uniqueStudentIds = studentIds == null ? List.of() : studentIds.stream().distinct().toList();
    if (uniqueStudentIds.stream().anyMatch(studentId -> !trainerStudentService.isLinkedStudent(trainerId, studentId))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes compartir rutinas con tus alumnos");
    }

    sharedWorkoutTrainersByStudent.forEach((studentId, sharedWorkouts) -> {
      if (!uniqueStudentIds.contains(studentId) && sharedWorkouts.remove(workoutId, trainerId)) {
        notificationService.notifyWorkoutUnshared(trainerId, studentId, sourceWorkout.getName());
      }
    });

    for (String studentId : uniqueStudentIds) {
      boolean hasWorkoutWithSameId = workoutsForUser(studentId).stream()
          .anyMatch(workout -> workoutId.equals(workout.getId()));
      String existingTrainerId = sharedWorkoutTrainersByStudent
          .getOrDefault(studentId, Map.of())
          .get(workoutId);
      if (hasWorkoutWithSameId || (existingTrainerId != null && !existingTrainerId.equals(trainerId))) {
        throw new ResponseStatusException(
            HttpStatus.CONFLICT, "El alumno ya tiene una rutina con el mismo identificador");
      }
    }

    for (String studentId : uniqueStudentIds) {
      String previousTrainerId = sharedWorkoutTrainersByStudent
          .computeIfAbsent(studentId, ignored -> new ConcurrentHashMap<>())
          .putIfAbsent(workoutId, trainerId);
      if (previousTrainerId == null) {
        notificationService.notifyWorkoutShared(trainerId, studentId, sourceWorkout.getName());
      }
    }
    return uniqueStudentIds;
  }

  public void assignWorkoutToStudent(String trainerId, String workoutId, String studentId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden compartir rutinas");
    }
    Workout sourceWorkout = findWorkout(trainerId, workoutId);
    if (sourceWorkout == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rutina no encontrada");
    }
    if (!trainerStudentService.isLinkedStudent(trainerId, studentId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes compartir rutinas con tus alumnos");
    }

    boolean hasWorkoutWithSameId = workoutsForUser(studentId).stream()
        .anyMatch(workout -> workoutId.equals(workout.getId()));
    String existingTrainerId = sharedWorkoutTrainersByStudent
        .getOrDefault(studentId, Map.of())
        .get(workoutId);
    if (hasWorkoutWithSameId || (existingTrainerId != null && !existingTrainerId.equals(trainerId))) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "El alumno ya tiene una rutina con el mismo identificador");
    }

    String previousTrainerId = sharedWorkoutTrainersByStudent
        .computeIfAbsent(studentId, ignored -> new ConcurrentHashMap<>())
        .putIfAbsent(workoutId, trainerId);
    if (previousTrainerId == null) {
      notificationService.notifyWorkoutShared(trainerId, studentId, sourceWorkout.getName());
    }
  }

  public List<String> getSharedStudentIds(String trainerId, String workoutId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden gestionar rutinas");
    }
    if (findWorkout(trainerId, workoutId) == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rutina no encontrada");
    }
    return sharedWorkoutTrainersByStudent.entrySet().stream()
        .filter(entry -> trainerId.equals(entry.getValue().get(workoutId)))
        .map(Map.Entry::getKey)
        .toList();
  }

}