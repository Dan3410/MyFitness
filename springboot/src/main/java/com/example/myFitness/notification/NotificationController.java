package com.example.myFitness.notification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.auth.AuthService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
  private final NotificationService notificationService;
  private final AuthService authService;

  public NotificationController(NotificationService notificationService, AuthService authService) {
    this.notificationService = notificationService;
    this.authService = authService;
  }

  @GetMapping
  public List<TrainerRequestNotification> getNotifications(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return notificationService.getNotifications(authService.requireUserId(authorization));
  }

  @PostMapping("/trainer-request/{recipientId}")
  public TrainerRequestNotification sendTrainerRequest(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String recipientId) {
    return notificationService.sendTrainerRequest(authService.requireUserId(authorization), recipientId);
  }

  @PatchMapping("/{notificationId}/accept")
  public TrainerRequestNotification acceptTrainerRequest(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String notificationId) {
    return notificationService.acceptTrainerRequest(authService.requireUserId(authorization), notificationId);
  }

  @PatchMapping("/{notificationId}/decline")
  public TrainerRequestNotification declineTrainerRequest(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String notificationId) {
    return notificationService.declineTrainerRequest(authService.requireUserId(authorization), notificationId);
  }
}