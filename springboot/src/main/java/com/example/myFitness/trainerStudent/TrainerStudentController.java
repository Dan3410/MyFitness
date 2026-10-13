package com.example.myFitness.trainerStudent;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.profile.model.UserSearchResult;

@RestController
@RequestMapping("/trainer/students")
public class TrainerStudentController {
  private final TrainerStudentService trainerStudentService;
  private final AuthService authService;
  private final NotificationService notificationService;

  public TrainerStudentController(
      TrainerStudentService trainerStudentService,
      AuthService authService,
      NotificationService notificationService) {
    this.trainerStudentService = trainerStudentService;
    this.authService = authService;
    this.notificationService = notificationService;
  }

  @GetMapping
  public List<UserSearchResult> getStudents(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return trainerStudentService.getStudentsForTrainer(authService.requireUserId(authorization));
  }

  @GetMapping("/trainers")
  public List<UserSearchResult> getTrainers(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return trainerStudentService.getTrainersForStudent(authService.requireUserId(authorization));
  }

  @GetMapping("/profile/{userId}")
  public List<TrainerStudentRelationship> getRelationshipsForProfile(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String userId) {
    authService.requireUserId(authorization);
    return trainerStudentService.getRelationshipsForProfile(userId);
  }

  @PostMapping("/{studentId}")
  public UserSearchResult linkStudent(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String studentId) {
    return trainerStudentService.linkStudent(authService.requireUserId(authorization), studentId);
  }

  @DeleteMapping("/{studentId}")
  public List<UserSearchResult> unlinkStudent(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String studentId) {
    String trainerId = authService.requireUserId(authorization);
    boolean wasLinked = trainerStudentService.isLinkedStudent(trainerId, studentId);
    List<UserSearchResult> students = trainerStudentService.unlinkStudent(trainerId, studentId);
    if (wasLinked) {
      notificationService.notifyStudentRemovedFromTrainer(trainerId, studentId);
    }
    return students;
  }

  @DeleteMapping("/trainers/{trainerId}")
  public List<UserSearchResult> unlinkTrainer(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String trainerId) {
    String studentId = authService.requireUserId(authorization);
    boolean wasLinked = trainerStudentService.isLinkedStudent(trainerId, studentId);
    List<UserSearchResult> trainers = trainerStudentService.unlinkTrainer(studentId, trainerId);
    if (wasLinked) {
      notificationService.notifyTrainerRemovedByStudent(trainerId, studentId);
    }
    return trainers;
  }
}