package com.example.myFitness.calendar;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.studentGroups.StudentGroupsService;

@RestController
@RequestMapping("/workout/calendar")
public class CalendarController {

  @Autowired
  private CalendarService calendarService;

  @Autowired
  private AuthService authService;

  @Autowired
  private StudentGroupsService studentGroupsService;

  @GetMapping
  public Map<String, List<PlannedWorkout>> getCalendar(
      @RequestParam(value = "month", required = false) String month,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.getCalendar(authService.requireUserId(authorization), month);
  }

  @PostMapping
  public Map<String, List<PlannedWorkout>> addToCalendar(@RequestBody CalendarRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.addToCalendar(
        authService.requireUserId(authorization), request.date(), request.workoutId(), request.time());
  }

  @DeleteMapping("/{date}/{workoutId}")
  public Map<String, List<PlannedWorkout>> removeFromCalendar(@PathVariable String date, @PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.removeFromCalendar(authService.requireUserId(authorization), date, workoutId);
  }

  @GetMapping("/events")
  public List<CalendarEvent> getEvents(
      @RequestParam(value = "month", required = false) String month,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.getEvents(authService.requireUserId(authorization), month);
  }

  @PostMapping("/events")
  public CalendarEvent createEvent(
      @RequestBody CalendarEventRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    String trainerId = authService.requireUserId(authorization);
    if (request.groupId() == null || request.groupId().isBlank()) {
      return calendarService.createEvent(
          trainerId, request.date(), request.studentId(), request.time(), request.workoutId());
    }
    CalendarEvent event = calendarService.createGroupEvent(
        trainerId, request.date(), request.groupId(), request.time(), request.workoutId());
    studentGroupsService.recordActivity(
        trainerId, request.groupId(), "EVENT_CREATED",
        "Se ha creado un evento para el grupo " + event.groupName() + " el " + event.date()
            + (event.time() == null ? "" : " a las " + event.time()) + ".");
    return event;
  }

  @DeleteMapping("/events/{eventId}")
  public void cancelEvent(
      @PathVariable String eventId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    calendarService.cancelEvent(authService.requireUserId(authorization), eventId);
  }

}
