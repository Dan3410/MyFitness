package com.example.myFitness.calendar;

import java.time.LocalDate;
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
  private final Map<String, Map<LocalDate, List<String>>> calendarByUser = new ConcurrentHashMap<>();
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
    createEvent("1", LocalDate.now().toString(), "0");
  }

  public Map<String, List<PlannedWorkout>> getCalendar(String userId) {
    return getCalendar(userId, null);
  }

  public Map<String, List<PlannedWorkout>> getCalendar(String userId, String month) {
    YearMonth requestedMonth = parseMonth(month);
    return calendarForUser(userId).entrySet().stream()
        .filter(entry -> requestedMonth == null || YearMonth.from(entry.getKey()).equals(requestedMonth))
        .collect(Collectors.toMap(entry -> entry.getKey().toString(), entry -> entry.getValue().stream()
            .map(id -> workoutService.getWorkout(userId, id))
            .filter(Objects::nonNull)
            .map(workout -> new PlannedWorkout(workout.getId(), workout.getName(), workout.getCategory()))
            .toList()));
  }

  public Map<String, List<PlannedWorkout>> addToCalendar(String userId, String date, String workoutId) {
    LocalDate calendarDate = parseDate(date);
    if (!workoutService.hasWorkout(userId, workoutId)) {
      throw new IllegalArgumentException("La rutina no existe");
    }
    List<String> workouts = calendarForUser(userId).computeIfAbsent(calendarDate, ignored -> new ArrayList<>());
    if (!workouts.contains(workoutId)) workouts.add(workoutId);
    return getCalendar(userId);
  }

  public Map<String, List<PlannedWorkout>> removeFromCalendar(String userId, String date, String workoutId) {
    LocalDate calendarDate = parseDate(date);
    Map<LocalDate, List<String>> calendar = calendarForUser(userId);
    List<String> workouts = calendar.get(calendarDate);
    if (workouts != null) {
      workouts.removeIf(id -> id.equals(workoutId));
      if (workouts.isEmpty()) calendar.remove(calendarDate);
    }
    return getCalendar(userId);
  }

  public List<CalendarEvent> getEvents(String userId, String month) {
    YearMonth requestedMonth = parseMonth(month);
    return events.values().stream()
        .filter(event -> event.trainerId().equals(userId) || event.studentId().equals(userId))
        .filter(event -> requestedMonth == null || YearMonth.from(LocalDate.parse(event.date())).equals(requestedMonth))
        .sorted((first, second) -> first.date().compareTo(second.date()))
        .toList();
  }

  public CalendarEvent createEvent(String trainerId, String date, String studentId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden crear eventos");
    }
    if (!trainerStudentService.isLinkedStudent(trainerId, studentId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes crear eventos con tus alumnos");
    }

    LocalDate eventDate = parseDate(date);
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    UserSearchResult student = profileService.getUserSearchResult(studentId);
    CalendarEvent event = new CalendarEvent(
        UUID.randomUUID().toString(), trainerId, trainer.name(), studentId, student.name(), eventDate.toString());
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

  private Map<LocalDate, List<String>> calendarForUser(String userId) {
    return calendarByUser.computeIfAbsent(userId, ignored -> new ConcurrentHashMap<>());
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
}
