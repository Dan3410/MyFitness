package com.example.myFitness.calendar;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.notification.NotificationType;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.workout.WorkoutService;
import com.example.myFitness.workout.model.Workout;

class CalendarServiceTest {
  private CalendarFixture createCalendarFixture(AuthService authService) {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();
    NotificationService notificationService = new NotificationService(profileService, trainerStudentService);
    WorkoutService workoutService = new WorkoutService(
        authService, profileService, trainerStudentService, notificationService);
    workoutService.init();
    return new CalendarFixture(
        new CalendarService(workoutService, profileService, trainerStudentService, notificationService),
        notificationService,
        workoutService);
  }

  private CalendarService createCalendarService(AuthService authService) {
    return createCalendarFixture(authService).calendarService();
  }

  private record CalendarFixture(
      CalendarService calendarService,
      NotificationService notificationService,
      WorkoutService workoutService) {}

  @Test
  void shouldReturnWorkoutIdAndTitleForPlannedWorkout() {
    AuthService authService = new AuthService();
    CalendarService calendarService = createCalendarService(authService);
    String userId = authService.getUserId("Swim");

    var calendar = calendarService.addToCalendar(userId, "2026-10-11", "0");

    assertEquals(List.of(new PlannedWorkout("0", "Swim Swim", "swim")), calendar.get("2026-10-11"));
  }

  @Test
  void plannedWorkoutTimeCanBeSetAndUpdated() {
    AuthService authService = new AuthService();
    CalendarService calendarService = createCalendarService(authService);
    String userId = authService.getUserId("Swim");

    calendarService.addToCalendar(userId, "2026-10-11", "0", "08:30");
    var calendar = calendarService.addToCalendar(userId, "2026-10-11", "0", "09:15");

    assertEquals(List.of(new PlannedWorkout("0", "Swim Swim", "swim", "09:15")), calendar.get("2026-10-11"));
  }

  @Test
  void shouldReturnFullCalendarOrOnlyTheRequestedMonth() {
    AuthService authService = new AuthService();
    CalendarService calendarService = createCalendarService(authService);
    String userId = authService.getUserId("Swim");
    calendarService.addToCalendar(userId, "2026-10-11", "0");
    calendarService.addToCalendar(userId, "2026-11-11", "0");

    assertEquals(Map.of(
        "2026-10-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim")),
        "2026-11-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim"))), calendarService.getCalendar(userId));
      assertEquals(Map.of("2026-10-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim"))),
        calendarService.getCalendar(userId, "2026-10"));
  }

  @Test
  void trainerCanCreateEventForLinkedStudentAndBothCanCancelWithNotifications() {
    AuthService authService = new AuthService();
    CalendarFixture fixture = createCalendarFixture(authService);
    CalendarService calendarService = fixture.calendarService();
    String trainerId = authService.getUserId("Gym");
    String studentId = authService.getUserId("Swim");

    CalendarEvent event = calendarService.createEvent(trainerId, "2026-10-20", studentId, "10:30", "1");
    CalendarEvent secondEvent = calendarService.createEvent(trainerId, "2026-10-21", studentId, "14:00");

    assertTrue(calendarService.getEvents(studentId, "2026-10").contains(event));
    assertEquals("10:30", event.time());
    assertEquals("1", event.workoutId());
    assertEquals("Lift heavy things", event.workoutTitle());
    assertEquals("gym", event.workoutCategory());
    assertEquals("14:00", secondEvent.time());
    assertEquals(
        "El entrenador John Gym creo un evento el dia 2026-10-20 a las 10:30 con la rutina Lift heavy things",
        fixture.notificationService().getNotifications(studentId).stream()
            .filter(notification -> notification.message().equals(
                "El entrenador John Gym creo un evento el dia 2026-10-20 a las 10:30 con la rutina Lift heavy things"))
            .findFirst().orElseThrow().message());
    assertTrue(fixture.notificationService().getNotifications(studentId).stream()
        .anyMatch(notification -> notification.type() == NotificationType.EVENT_CREATED
            && notification.message().contains("2026-10-20 a las 10:30")
            && notification.message().contains("Lift heavy things")));
    calendarService.cancelEvent(studentId, event.id());
    assertEquals(List.of(secondEvent), calendarService.getEvents(trainerId, "2026-10"));
    assertEquals(
        "John Swim ha cancelado un evento del dia 2026-10-20 a las 10:30",
        fixture.notificationService().getNotifications(trainerId).get(0).message());
    assertTrue(fixture.notificationService().getNotifications(studentId).stream()
        .anyMatch(notification -> notification.type() == NotificationType.EVENT_CANCELLED
            && notification.message().equals("Has cancelado un evento del dia 2026-10-20 a las 10:30")));
    calendarService.cancelEvent(trainerId, secondEvent.id());
    assertTrue(fixture.notificationService().getNotifications(studentId).stream()
        .anyMatch(notification -> notification.type() == NotificationType.EVENT_CANCELLED
            && notification.message().equals("John Gym ha cancelado un evento del dia 2026-10-21 a las 14:00")));
    assertEquals(List.of(), calendarService.getEvents(trainerId, "2026-10"));
  }

  @Test
  void studentCannotCreateEventsAndUnrelatedUsersCannotCancelThem() {
    AuthService authService = new AuthService();
    CalendarService calendarService = createCalendarService(authService);
    String trainerId = authService.getUserId("Gym");
    String studentId = authService.getUserId("Swim");
    String unrelatedUserId = authService.getUserId("Run");

    ResponseStatusException createException = assertThrows(
        ResponseStatusException.class,
        () -> calendarService.createEvent(studentId, "2026-10-20", trainerId));
    assertEquals(HttpStatus.FORBIDDEN, createException.getStatusCode());

    ResponseStatusException unlinkedStudentException = assertThrows(
        ResponseStatusException.class,
        () -> calendarService.createEvent(trainerId, "2026-10-20", unrelatedUserId));
    assertEquals(HttpStatus.FORBIDDEN, unlinkedStudentException.getStatusCode());

    CalendarEvent event = calendarService.createEvent(trainerId, "2026-10-20", studentId);
    assertNull(event.time());
    ResponseStatusException cancelException = assertThrows(
        ResponseStatusException.class,
        () -> calendarService.cancelEvent(unrelatedUserId, event.id()));
    assertEquals(HttpStatus.FORBIDDEN, cancelException.getStatusCode());
  }

  @Test
  void trainerCannotAttachAnotherUsersWorkoutToAnEvent() {
    AuthService authService = new AuthService();
    CalendarService calendarService = createCalendarService(authService);

    ResponseStatusException exception = assertThrows(
        ResponseStatusException.class,
        () -> calendarService.createEvent(
            authService.getUserId("Gym"), "2026-10-20", authService.getUserId("Swim"), null, "0"));

    assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
  }

  @Test
  void attachingWorkoutToEventMakesItAvailableToTheStudent() {
    AuthService authService = new AuthService();
    CalendarFixture fixture = createCalendarFixture(authService);
    String trainerId = authService.getUserId("Gym");
    String studentId = authService.getUserId("Swim");
    Workout workout = fixture.workoutService().createWorkout(
        trainerId, new Workout(null, "Event workout", "gym", List.of()));

    CalendarEvent event = fixture.calendarService().createEvent(
        trainerId, "2026-10-20", studentId, "15:00", workout.getId());

    assertEquals(workout.getId(), event.workoutId());
    assertEquals("Event workout", event.workoutTitle());
    assertEquals("Event workout", fixture.workoutService().getWorkout(studentId, workout.getId()).getName());
  }

  @Test
  void seedsDemoEventBetweenJohnGymAndJohnSwim() {
    AuthService authService = new AuthService();
    CalendarFixture fixture = createCalendarFixture(authService);
    CalendarService calendarService = fixture.calendarService();

    calendarService.seedDemoEvent();

    List<CalendarEvent> trainerEvents = calendarService.getEvents("1", null);
    assertEquals(1, trainerEvents.size());
    CalendarEvent event = trainerEvents.get(0);
    assertEquals("John Gym", event.trainerName());
    assertEquals("John Swim", event.studentName());
    assertEquals(LocalDate.now().toString(), event.date());
    assertEquals("15:00", event.time());
    assertEquals(
        "El entrenador John Gym creo un evento el dia " + LocalDate.now() + " a las 15:00",
        fixture.notificationService().getNotifications("0").stream()
            .filter(notification -> notification.type() == NotificationType.EVENT_CREATED)
            .findFirst().orElseThrow().message());
  }
}