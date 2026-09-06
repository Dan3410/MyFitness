package com.example.myFitness.workout;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class CalendarService {
  private final Map<String, Map<LocalDate, List<String>>> calendarByUser = new ConcurrentHashMap<>();
  private final WorkoutService workoutService;

  public CalendarService(WorkoutService workoutService) {
    this.workoutService = workoutService;
  }

  public Map<String, List<String>> getCalendar(String userId) {
    return calendarForUser(userId).entrySet().stream()
        .collect(Collectors.toMap(entry -> entry.getKey().toString(), entry -> List.copyOf(entry.getValue())));
  }

  public Map<String, List<String>> addToCalendar(String userId, String date, String workoutId) {
    LocalDate calendarDate = parseDate(date);
    if (!workoutService.hasWorkout(userId, workoutId)) {
      throw new IllegalArgumentException("La rutina no existe");
    }
    List<String> workouts = calendarForUser(userId).computeIfAbsent(calendarDate, ignored -> new ArrayList<>());
    if (!workouts.contains(workoutId)) workouts.add(workoutId);
    return getCalendar(userId);
  }

  public Map<String, List<String>> removeFromCalendar(String userId, String date, String workoutId) {
    LocalDate calendarDate = parseDate(date);
    Map<LocalDate, List<String>> calendar = calendarForUser(userId);
    List<String> workouts = calendar.get(calendarDate);
    if (workouts != null) {
      workouts.removeIf(id -> id.equals(workoutId));
      if (workouts.isEmpty()) calendar.remove(calendarDate);
    }
    return getCalendar(userId);
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
}
