package com.example.myFitness.workout;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.notification.NotificationType;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.studentGroups.StudentGroupsService;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.workout.model.Workout;

class WorkoutSharingTest {
  @Test
  void seedsExampleWorkoutFromJohnGymToJohnSwim() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    StudentGroupsService studentGroupsService =
        new StudentGroupsService(profileService, trainerStudentService, notificationService);
    WorkoutService workoutService = new WorkoutService(
        new AuthService(), profileService, trainerStudentService, studentGroupsService, notificationService);

    trainerStudentService.seedDemoTrainerStudentLink();
    workoutService.init();

    assertTrue(trainerStudentService.isLinkedStudent("1", "0"));
    assertEquals(List.of("0"), workoutService.getSharedStudentIds("1", "1"));
    WorkoutListAssertions.assertAssignedWorkout(workoutService, notificationService, "Lift heavy things", "1",
        "Lift heavy things");
  }

  @Test
  void sharesReadOnlyWorkoutWithLinkedStudentAndNotifiesThem() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    StudentGroupsService studentGroupsService =
        new StudentGroupsService(profileService, trainerStudentService, notificationService);
    WorkoutService workoutService = new WorkoutService(
        new AuthService(), profileService, trainerStudentService, studentGroupsService, notificationService);
    trainerStudentService.seedDemoTrainerStudentLink();
    workoutService.init();
    Workout workout = workoutService.createWorkout("1", new Workout(null, "Plan personalizado", "gym", List.of()));

    workoutService.shareWorkout("1", workout.getId(), List.of("0"));
    assertEquals(List.of("0"), workoutService.getSharedStudentIds("1", workout.getId()));
    workoutService.editWorkout("1", workout.getId(), new Workout(workout.getId(), "Rutina modificada", "gym", List.of()));

    WorkoutListAssertions.assertAssignedWorkout(
        workoutService, notificationService, "Rutina modificada", workout.getId(), "Plan personalizado");
  }

  @Test
  void rejectsSharingWithSomeoneWhoIsNotLinked() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    StudentGroupsService studentGroupsService =
        new StudentGroupsService(profileService, trainerStudentService, notificationService);
    WorkoutService workoutService = new WorkoutService(
        new AuthService(), profileService, trainerStudentService, studentGroupsService, notificationService);
    trainerStudentService.seedDemoTrainerStudentLink();
    workoutService.init();

    assertThrows(ResponseStatusException.class,
        () -> workoutService.shareWorkout("1", "1", List.of("unlinked-user")));
  }

  @Test
  void deselectingAllStudentsRemovesWorkoutSharing() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    StudentGroupsService studentGroupsService =
        new StudentGroupsService(profileService, trainerStudentService, notificationService);
    WorkoutService workoutService = new WorkoutService(
        new AuthService(), profileService, trainerStudentService, studentGroupsService, notificationService);
    trainerStudentService.seedDemoTrainerStudentLink();
    workoutService.init();

    workoutService.shareWorkout("1", "1", List.of());

    assertEquals(List.of(), workoutService.getSharedStudentIds("1", "1"));
    assertTrue(Arrays.stream(workoutService.getWorkoutsListItems("0", "all"))
        .noneMatch(item -> "1".equals(item.getId())));
    var unsharedNotification = notificationService.getNotifications("0").stream()
        .filter(item -> item.type() == NotificationType.WORKOUT_UNSHARED)
        .findFirst()
        .orElseThrow();
    assertEquals("John Gym ha dejado de compartir la rutina Lift heavy things contigo",
        unsharedNotification.message());
  }

  @Test
  void groupSharingIsNotExpandedToStudentsAndNewMembersCanSeeTheWorkout() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    StudentGroupsService studentGroupsService =
        new StudentGroupsService(profileService, trainerStudentService, notificationService);
    WorkoutService workoutService = new WorkoutService(
        new AuthService(), profileService, trainerStudentService, studentGroupsService, notificationService);
    workoutService.init();
    var group = studentGroupsService.createGroup("1", "Grupo de prueba", List.of("0"));
    Workout workout = workoutService.createWorkout("1", new Workout(null, "Rutina del grupo", "gym", List.of()));

    workoutService.shareWorkout("1", workout.getId(), List.of(), List.of(group.id()));

    assertTrue(workoutService.getSharedStudentIds("1", workout.getId()).isEmpty());
    assertEquals(List.of(group.id()), workoutService.getSharedGroupIds("1", workout.getId()));
    assertTrue(notificationService.getNotifications("0").stream()
        .anyMatch(item -> item.type() == NotificationType.GROUP_WORKOUT_SHARED
            && item.message().equals("Se compartió la rutina Rutina del grupo con el grupo Grupo de prueba.")));
    assertTrue(notificationService.getNotifications("2").stream()
        .noneMatch(item -> item.type() == NotificationType.GROUP_WORKOUT_SHARED
            && item.message().contains("Rutina del grupo")));
    assertTrue(Arrays.stream(workoutService.getWorkoutsListItems("0", "all"))
        .anyMatch(item -> workout.getId().equals(item.getId())));

    studentGroupsService.updateGroup("1", group.id(), group.name(), List.of("0", "2"));

    assertTrue(Arrays.stream(workoutService.getWorkoutsListItems("2", "all"))
        .anyMatch(item -> workout.getId().equals(item.getId())));
    assertEquals("Rutina del grupo", workoutService.getWorkout("2", workout.getId()).getName());
    assertTrue(notificationService.getNotifications("2").stream()
        .anyMatch(item -> item.type() == NotificationType.GROUP_MEMBER_ADDED
            && item.message().equals("Se agregó a Jane Run al grupo Grupo de prueba.")));
    assertTrue(notificationService.getNotifications("0").stream()
        .anyMatch(item -> item.type() == NotificationType.GROUP_MEMBER_ADDED
            && item.message().equals("Se agregó a Jane Run al grupo Grupo de prueba.")));
  }

  private static class WorkoutListAssertions {
    private static void assertAssignedWorkout(
        WorkoutService workoutService,
        NotificationService notificationService,
        String workoutName,
        String sourceWorkoutId,
        String notificationWorkoutName) {
      var assignedItem = Arrays.stream(workoutService.getWorkoutsListItems("0", "all"))
          .filter(item -> workoutName.equals(item.getName()))
          .findFirst()
          .orElseThrow();
      assertEquals(workoutName, assignedItem.getName());
      assertEquals("John Gym", assignedItem.getSourceTrainerName());
      assertEquals(sourceWorkoutId, assignedItem.getId());
      assertEquals(sourceWorkoutId, Arrays.stream(workoutService.getWorkoutsListItems("1", "all"))
          .filter(item -> workoutName.equals(item.getName()))
          .findFirst()
          .orElseThrow()
          .getId());

      Workout assignedWorkout = workoutService.getWorkout("0", assignedItem.getId());
      assertEquals(sourceWorkoutId, assignedWorkout.getId());
      assertEquals(workoutName, assignedWorkout.getName());
      assertEquals("John Gym", assignedWorkout.getSourceTrainerName());
      assertThrows(ResponseStatusException.class,
          () -> workoutService.editWorkout("0", assignedItem.getId(), new Workout()));
      assertThrows(ResponseStatusException.class,
          () -> workoutService.deleteWorkout("0", assignedItem.getId()));

      var notification = notificationService.getNotifications("0").stream()
          .filter(item -> item.type() == NotificationType.WORKOUT_SHARED
              && item.message().endsWith(notificationWorkoutName))
          .findFirst()
          .orElseThrow();
      assertEquals("John Gym te ha asignado la rutina " + notificationWorkoutName, notification.message());
      assertEquals("0", notification.recipientId());
    }
  }
}
