package com.example.myFitness.calendar;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.workout.WorkoutService;

class CalendarServiceTest {
  private WorkoutService createWorkoutService(AuthService authService) {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();
    return new WorkoutService(
        authService, profileService, trainerStudentService,
        new NotificationService(profileService, trainerStudentService));
  }

  @Test
  void shouldReturnWorkoutIdAndTitleForPlannedWorkout() {
    AuthService authService = new AuthService();
    WorkoutService workoutService = createWorkoutService(authService);
    workoutService.init();
    CalendarService calendarService = new CalendarService(workoutService);
    String userId = authService.getUserId("Swim");

    var calendar = calendarService.addToCalendar(userId, "2026-10-11", "0");

    assertEquals(List.of(new PlannedWorkout("0", "Swim Swim", "swim")), calendar.get("2026-10-11"));
  }

  @Test
  void shouldReturnFullCalendarOrOnlyTheRequestedMonth() {
    AuthService authService = new AuthService();
    WorkoutService workoutService = createWorkoutService(authService);
    workoutService.init();
    CalendarService calendarService = new CalendarService(workoutService);
    String userId = authService.getUserId("Swim");
    calendarService.addToCalendar(userId, "2026-10-11", "0");
    calendarService.addToCalendar(userId, "2026-11-11", "0");

    assertEquals(Map.of(
        "2026-10-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim")),
        "2026-11-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim"))), calendarService.getCalendar(userId));
      assertEquals(Map.of("2026-10-11", List.of(new PlannedWorkout("0", "Swim Swim", "swim"))),
        calendarService.getCalendar(userId, "2026-10"));
  }
}