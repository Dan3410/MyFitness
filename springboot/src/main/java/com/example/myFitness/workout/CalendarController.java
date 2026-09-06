package com.example.myFitness.workout;

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
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.auth.AuthService;

@RestController
@RequestMapping("/workout/calendar")
public class CalendarController {

  @Autowired
  private CalendarService calendarService;

  @Autowired
  private AuthService authService;

  @GetMapping
  public Map<String, List<String>> getCalendar(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.getCalendar(authService.requireUserId(authorization));
  }

  @PostMapping
  public Map<String, List<String>> addToCalendar(@RequestBody CalendarRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.addToCalendar(authService.requireUserId(authorization), request.date(), request.workoutId());
  }

  @DeleteMapping("/{date}/{workoutId}")
  public Map<String, List<String>> removeFromCalendar(@PathVariable String date, @PathVariable String workoutId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return calendarService.removeFromCalendar(authService.requireUserId(authorization), date, workoutId);
  }

  public record CalendarRequest(String date, String workoutId) {
  }
}
