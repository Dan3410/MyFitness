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
import com.example.myFitness.profile.model.UserSearchResult;

@RestController
@RequestMapping("/trainer/students")
public class TrainerStudentController {
  private final TrainerStudentService trainerStudentService;
  private final AuthService authService;

  public TrainerStudentController(TrainerStudentService trainerStudentService, AuthService authService) {
    this.trainerStudentService = trainerStudentService;
    this.authService = authService;
  }

  @GetMapping
  public List<UserSearchResult> getStudents(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return trainerStudentService.getStudentsForTrainer(authService.requireUserId(authorization));
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
    return trainerStudentService.unlinkStudent(authService.requireUserId(authorization), studentId);
  }
}