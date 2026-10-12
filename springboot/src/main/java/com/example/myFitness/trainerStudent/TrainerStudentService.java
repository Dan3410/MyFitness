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

@Service
public class TrainerStudentService {
  private final ProfileService profileService;
  private final Map<String, Set<String>> studentsByTrainer = new ConcurrentHashMap<>();

  public TrainerStudentService(ProfileService profileService) {
    this.profileService = profileService;
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

  public List<UserSearchResult> unlinkStudent(String trainerId, String studentId) {
    requireTrainer(trainerId);
    studentsByTrainer.computeIfPresent(trainerId, (ignored, students) -> {
      students.remove(studentId);
      return students.isEmpty() ? null : students;
    });
    return getStudentsForTrainer(trainerId);
  }

  private void requireTrainer(String trainerId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Solo los entrenadores pueden gestionar alumnos");
    }
  }
}