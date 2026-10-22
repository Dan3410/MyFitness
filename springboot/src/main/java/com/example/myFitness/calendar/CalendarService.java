package com.example.myFitness.calendar;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.profile.model.UserSearchResult;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.workout.WorkoutService;
import jakarta.annotation.PostConstruct;

@Service
public class CalendarService {
  private final Map<String, Map<LocalDate, List<PlannedWorkoutEntry>>> calendarByUser = new ConcurrentHashMap<>();
  private final Map<String, CalendarEvent> events = new ConcurrentHashMap<>();
  private final WorkoutService workoutService;
  private final ProfileService profileService;
  private final TrainerStudentService trainerStudentService;
  private final NotificationService notificationService;

  public CalendarService(
      WorkoutService workoutService,
      ProfileService profileService,
      TrainerStudentService trainerStudentService,
      NotificationService notificationService) {
    this.workoutService = workoutService;
    this.profileService = profileService;
    this.trainerStudentService = trainerStudentService;
    this.notificationService = notificationService;
  }

  @PostConstruct
  public void seedDemoEvent() {
    createEvent("1", LocalDate.now().toString(), "0", "15:00");
  }

  public Map<String, List<PlannedWorkout>> getCalendar(String userId) {
    return getCalendar(userId, null);
  }

  public Map<String, List<PlannedWorkout>> getCalendar(String userId, String month) {
    YearMonth requestedMonth = parseMonth(month);
    return calendarForUser(userId).entrySet().stream()
        .filter(entry -> requestedMonth == null || YearMonth.from(entry.getKey()).equals(requestedMonth))
        .collect(Collectors.toMap(entry -> entry.getKey().toString(), entry -> entry.getValue().stream()
            .map(planned -> {
              var workout = workoutService.getWorkout(userId, planned.workoutId());
              return workout == null ? null
                  : new PlannedWorkout(workout.getId(), workout.getName(), workout.getCategory(), planned.time());
            })
            .filter(Objects::nonNull)
            .toList()));
  }

  public Map<String, List<PlannedWorkout>> addToCalendar(String userId, String date, String workoutId) {
    return addToCalendar(userId, date, workoutId, null);
  }

  public Map<String, List<PlannedWorkout>> addToCalendar(String userId, String date, String workoutId, String time) {
    LocalDate calendarDate = parseDate(date);
    String normalizedTime = parseTime(time);
    if (!workoutService.hasWorkout(userId, workoutId)) {
      throw new IllegalArgumentException("La rutina no existe");
    }
    List<PlannedWorkoutEntry> workouts = calendarForUser(userId).computeIfAbsent(calendarDate, ignored -> new ArrayList<>());
    PlannedWorkoutEntry plannedWorkout = new PlannedWorkoutEntry(workoutId, normalizedTime);
    int existingIndex = -1;
    for (int index = 0; index < workouts.size(); index++) {
      if (workouts.get(index).workoutId().equals(workoutId)) {
        existingIndex = index;
        break;
      }
    }
    if (existingIndex >= 0) workouts.set(existingIndex, plannedWorkout);
    else workouts.add(plannedWorkout);
    return getCalendar(userId);
  }

  public Map<String, List<PlannedWorkout>> removeFromCalendar(String userId, String date, String workoutId) {
    LocalDate calendarDate = parseDate(date);
    Map<LocalDate, List<PlannedWorkoutEntry>> calendar = calendarForUser(userId);
    List<PlannedWorkoutEntry> workouts = calendar.get(calendarDate);
    if (workouts != null) {
      workouts.removeIf(workout -> workout.workoutId().equals(workoutId));
      if (workouts.isEmpty()) calendar.remove(calendarDate);
    }
    return getCalendar(userId);
  }

  public List<CalendarEvent> getEvents(String userId, String month) {
    YearMonth requestedMonth = parseMonth(month);
    return events.values().stream()
        .filter(event -> event.trainerId().equals(userId) || event.studentId().equals(userId))
        .filter(event -> requestedMonth == null || YearMonth.from(LocalDate.parse(event.date())).equals(requestedMonth))
        .sorted((first, second) -> {
          int dateComparison = first.date().compareTo(second.date());
          if (dateComparison != 0) return dateComparison;
          return Objects.toString(first.time(), "").compareTo(Objects.toString(second.time(), ""));
        })
        .toList();
  }

  public CalendarEvent createEvent(String trainerId, String date, String studentId) {
    return createEvent(trainerId, date, studentId, null);
  }

  public CalendarEvent createEvent(String trainerId, String date, String studentId, String time) {
    return createEvent(trainerId, date, studentId, time, null);
  }

  public CalendarEvent createEvent(
      String trainerId,
      String date,
      String studentId,
      String time,
      String workoutId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden crear eventos");
    }
    if (!trainerStudentService.isLinkedStudent(trainerId, studentId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes crear eventos con tus alumnos");
    }

    LocalDate eventDate = parseDate(date);
    String normalizedTime = parseTime(time);
    String workoutTitle = null;
    String workoutCategory = null;
    if (workoutId != null && !workoutId.isBlank()) {
      var workout = workoutService.getWorkout(trainerId, workoutId);
      if (workout == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rutina no encontrada");
      }
      workoutService.assignWorkoutToStudent(trainerId, workoutId, studentId);
      workoutTitle = workout.getName();
      workoutCategory = workout.getCategory();
    } else {
      workoutId = null;
    }
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    UserSearchResult student = profileService.getUserSearchResult(studentId);
    CalendarEvent event = new CalendarEvent(
        UUID.randomUUID().toString(), trainerId, trainer.name(), studentId, student.name(), eventDate.toString(),
        normalizedTime, workoutId, workoutTitle, workoutCategory);
    events.put(event.id(), event);
    notificationService.notifyEventCreated(event);
    return event;
  }

  public void cancelEvent(String userId, String eventId) {
    CalendarEvent event = events.get(eventId);
    if (event == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
    }
    if (!event.trainerId().equals(userId) && !event.studentId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes cancelar este evento");
    }
    if (events.remove(eventId, event)) {
      notificationService.notifyEventCancelled(event, userId);
    }
  }

  private Map<LocalDate, List<PlannedWorkoutEntry>> calendarForUser(String userId) {
    return calendarByUser.computeIfAbsent(userId, ignored -> new ConcurrentHashMap<>());
  }

  private String parseTime(String time) {
    if (time == null || time.isBlank()) return null;
    try {
      return LocalTime.parse(time).toString();
    } catch (DateTimeParseException exception) {
      throw new IllegalArgumentException("La hora no es válida", exception);
    }
  }

  private LocalDate parseDate(String date) {
    try {
      return LocalDate.parse(date);
    } catch (DateTimeParseException exception) {
      throw new IllegalArgumentException("La fecha no es válida", exception);
    }
  }

  private YearMonth parseMonth(String month) {
    if (month == null || month.isBlank()) return null;
    try {
      return YearMonth.parse(month);
    } catch (DateTimeParseException exception) {
      throw new IllegalArgumentException("El mes no es válido", exception);
    }
  }

  private record PlannedWorkoutEntry(String workoutId, String time) {}
}
