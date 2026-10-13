package com.example.myFitness.trainerStudent;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.profile.model.UserSearchResult;
import jakarta.annotation.PostConstruct;

@Service
public class TrainerStudentService {
  private final ProfileService profileService;
  private final Map<String, Set<String>> studentsByTrainer = new ConcurrentHashMap<>();

  public TrainerStudentService(ProfileService profileService) {
    this.profileService = profileService;
  }

  @PostConstruct
  public void seedDemoTrainerStudentLink() {
    linkStudent("1", "0");
    linkStudent("2", "1");
  }

  public UserSearchResult linkStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    UserSearchResult student = profileService.getUserSearchResult(studentId);
    if (trainerId.equals(studentId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "No puedes vincularte contigo mismo");
    }

    studentsByTrainer.computeIfAbsent(trainerId, ignored -> ConcurrentHashMap.newKeySet()).add(studentId);
    return student;
  }

  public List<UserSearchResult> getStudentsForTrainer(String trainerId) {
    requireTrainer(trainerId);
    return studentsByTrainer.getOrDefault(trainerId, Set.of()).stream()
        .map(profileService::getUserSearchResult)
        .collect(Collectors.toList());
  }

  public List<UserSearchResult> getTrainersForStudent(String studentId) {
    profileService.getUserSearchResult(studentId);
    return studentsByTrainer.entrySet().stream()
        .filter(entry -> entry.getValue().contains(studentId))
        .map(entry -> profileService.getUserSearchResult(entry.getKey()))
        .collect(Collectors.toList());
  }

  public List<TrainerStudentRelationship> getRelationshipsForProfile(String userId) {
    UserSearchResult profileUser = profileService.getUserSearchResult(userId);
    List<TrainerStudentRelationship> relationships = studentsByTrainer.entrySet().stream()
            .filter(entry -> entry.getValue().contains(userId))
            .map(entry -> asRelationship(
                profileService.getUserSearchResult(entry.getKey()),
                TrainerStudentRelationship.RelationshipType.TRAINER))
            .collect(Collectors.toList());
    if (profileUser.isTrainer()) {
      studentsByTrainer.getOrDefault(userId, Set.of()).stream()
          .map(profileService::getUserSearchResult)
          .map(student -> asRelationship(
              student, TrainerStudentRelationship.RelationshipType.STUDENT))
          .forEach(relationships::add);
    }
    return relationships;
  }

  private TrainerStudentRelationship asRelationship(
      UserSearchResult user,
      TrainerStudentRelationship.RelationshipType relationshipType) {
    return new TrainerStudentRelationship(
        user.id(), user.name(), user.profileImage(), user.isTrainer(), relationshipType);
  }

  public boolean isLinkedStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    return studentsByTrainer.getOrDefault(trainerId, Set.of()).contains(studentId);
  }

  public boolean areLinkedUsers(String firstUserId, String secondUserId) {
    return studentsByTrainer.getOrDefault(firstUserId, Set.of()).contains(secondUserId)
        || studentsByTrainer.getOrDefault(secondUserId, Set.of()).contains(firstUserId);
  }

  public List<UserSearchResult> unlinkStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    studentsByTrainer.computeIfPresent(trainerId, (ignored, students) -> {
      students.remove(studentId);
      return students.isEmpty() ? null : students;
    });
    return getStudentsForTrainer(trainerId);
  }

  public List<UserSearchResult> unlinkTrainer(String studentId, String trainerId) {
    requireTrainer(trainerId);
    studentsByTrainer.computeIfPresent(trainerId, (ignored, students) -> {
      students.remove(studentId);
      return students.isEmpty() ? null : students;
    });
    return getTrainersForStudent(studentId);
  }

  private void requireTrainer(String trainerId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Solo los entrenadores pueden gestionar alumnos");
    }
  }
}