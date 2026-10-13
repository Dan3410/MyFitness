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
  }

  public UserSearchResult linkStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    UserSearchResult student = profileService.getUserSearchResult(studentId);
    if (trainerId.equals(studentId) || student.isTrainer()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "El usuario seleccionado no puede ser vinculado como alumno");
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
    requireStudent(studentId);
    return studentsByTrainer.entrySet().stream()
        .filter(entry -> entry.getValue().contains(studentId))
        .map(entry -> profileService.getUserSearchResult(entry.getKey()))
        .collect(Collectors.toList());
  }

  public List<UserSearchResult> getRelationshipsForProfile(String userId) {
    UserSearchResult profileUser = profileService.getUserSearchResult(userId);
    return profileUser.isTrainer()
        ? getStudentsWithoutRoleCheck(userId)
        : studentsByTrainer.entrySet().stream()
            .filter(entry -> entry.getValue().contains(userId))
            .map(entry -> profileService.getUserSearchResult(entry.getKey()))
            .collect(Collectors.toList());
  }

  private List<UserSearchResult> getStudentsWithoutRoleCheck(String trainerId) {
    return studentsByTrainer.getOrDefault(trainerId, Set.of()).stream()
        .map(profileService::getUserSearchResult)
        .collect(Collectors.toList());
  }

  public boolean isLinkedStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    return studentsByTrainer.getOrDefault(trainerId, Set.of()).contains(studentId);
  }

  public boolean areLinkedUsers(String firstUserId, String secondUserId) {
    String trainerId = profileService.isTrainer(firstUserId) ? firstUserId : secondUserId;
    String studentId = trainerId.equals(firstUserId) ? secondUserId : firstUserId;
    return profileService.isTrainer(trainerId)
        && !profileService.isTrainer(studentId)
        && studentsByTrainer.getOrDefault(trainerId, Set.of()).contains(studentId);
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
    requireStudent(studentId);
    studentsByTrainer.computeIfPresent(trainerId, (ignored, students) -> {
      students.remove(studentId);
      return students.isEmpty() ? null : students;
    });
    return getTrainersForStudent(studentId);
  }

  private void requireStudent(String studentId) {
    if (profileService.isTrainer(studentId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Solo los alumnos pueden gestionar sus entrenadores");
    }
  }

  private void requireTrainer(String trainerId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Solo los entrenadores pueden gestionar alumnos");
    }
  }
}