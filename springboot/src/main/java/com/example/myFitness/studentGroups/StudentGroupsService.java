package com.example.myFitness.studentGroups;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.profile.model.UserSearchResult;
import com.example.myFitness.notification.NotificationService;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import jakarta.annotation.PostConstruct;

@Service
public class StudentGroupsService {
  private final Map<String, GroupState> groups = new ConcurrentHashMap<>();
  private final Map<String, List<StudentGroupActivity>> activitiesByGroup = new ConcurrentHashMap<>();
  private final ProfileService profileService;
  private final TrainerStudentService trainerStudentService;
  private final NotificationService notificationService;

  public StudentGroupsService(
      ProfileService profileService,
      TrainerStudentService trainerStudentService,
      NotificationService notificationService) {
    this.profileService = profileService;
    this.trainerStudentService = trainerStudentService;
    this.notificationService = notificationService;
  }

  @PostConstruct
  public void seedDemoGroup() {
    createGroup("1", "Grupo de John Gym", List.of("2", "0"));
  }

  public List<StudentGroup> getGroups(String userId) {
    return groups.values().stream()
        .filter(group -> group.trainerId.equals(userId) || group.memberIds.contains(userId))
        .map(group -> toStudentGroup(group, userId))
        .toList();
  }

  public StudentGroup createGroup(String trainerId, String name) {
    return createGroup(trainerId, name, List.of());
  }

  public StudentGroup createGroup(String trainerId, String name, List<String> memberIds) {
    requireTrainer(trainerId);
    String groupName = validateName(name);
    GroupState group = new GroupState(UUID.randomUUID().toString(), groupName, trainerId);
    List<String> initialMemberIds = memberIds == null ? List.of() : memberIds.stream().distinct().toList();
    for (String studentId : initialMemberIds) {
      if (!trainerStudentService.isLinkedStudent(trainerId, studentId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes agregar a tus alumnos al grupo");
      }
    }
    group.memberIds.addAll(initialMemberIds);
    groups.put(group.id, group);
    activitiesByGroup.put(group.id, new CopyOnWriteArrayList<>());
    for (String studentId : initialMemberIds) {
      UserSearchResult student = profileService.getUserSearchResult(studentId);
      addActivity(group.id, "MEMBER_ADDED", "Se agregó a " + student.name() + " al grupo.");
      notificationService.notifyGroupMemberAdded(
          trainerId, group.name, student.name(), initialMemberIds);
    }
    return toStudentGroup(group, trainerId);
  }

  public StudentGroup getGroup(String userId, String groupId) {
    GroupState group = requireGroup(groupId);
    requireMemberOrAdministrator(group, userId);
    return toStudentGroup(group, userId);
  }

  public List<UserSearchResult> getMembers(String userId, String groupId) {
    return getGroup(userId, groupId).members();
  }

  public List<StudentGroupActivity> getActivities(String userId, String groupId) {
    getGroup(userId, groupId);
    return activitiesByGroup.getOrDefault(groupId, List.of()).stream()
        .sorted((first, second) -> second.createdAt().compareTo(first.createdAt()))
        .toList();
  }

  public StudentGroup updateGroup(String trainerId, String groupId, String name, List<String> memberIds) {
    requireTrainer(trainerId);
    GroupState group = requireAdministrator(groupId, trainerId);
    String groupName = validateName(name);
    List<String> nextMemberIds = memberIds == null ? List.of() : memberIds.stream().distinct().toList();
    for (String studentId : nextMemberIds) {
      if (!trainerStudentService.isLinkedStudent(trainerId, studentId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes agregar a tus alumnos al grupo");
      }
    }

    List<String> previouslyMembers = new ArrayList<>(group.memberIds);
    group.name = groupName;
    group.memberIds.clear();
    group.memberIds.addAll(nextMemberIds);
    List<String> addedStudentIds = new ArrayList<>();
    for (String studentId : nextMemberIds) {
      if (!previouslyMembers.contains(studentId)) {
        UserSearchResult student = profileService.getUserSearchResult(studentId);
        addActivity(groupId, "MEMBER_ADDED", "Se agregó a " + student.name() + " al grupo.");
        addedStudentIds.add(studentId);
      }
    }
    for (String studentId : addedStudentIds) {
      UserSearchResult student = profileService.getUserSearchResult(studentId);
      notificationService.notifyGroupMemberAdded(
          trainerId, group.name, student.name(), nextMemberIds);
    }
    for (String studentId : previouslyMembers) {
      if (!nextMemberIds.contains(studentId)) {
        UserSearchResult student = profileService.getUserSearchResult(studentId);
        addActivity(groupId, "MEMBER_REMOVED", "Se quitó a " + student.name() + " del grupo.");
      }
    }
    return toStudentGroup(group, trainerId);
  }

  public List<String> getMemberIdsForTrainer(String trainerId, String groupId) {
    GroupState group = requireAdministrator(groupId, trainerId);
    return List.copyOf(group.memberIds);
  }

  public void recordActivity(String trainerId, String groupId, String type, String message) {
    requireAdministrator(groupId, trainerId);
    addActivity(groupId, type, message);
  }

  public void removeUnlinkedStudent(String trainerId, String studentId) {
    groups.values().stream()
        .filter(group -> group.trainerId.equals(trainerId) && group.memberIds.remove(studentId))
        .forEach(group -> {
          String name = profileService.getUserSearchResult(studentId).name();
          addActivity(group.id, "MEMBER_REMOVED", "Se quitó a " + name + " del grupo al finalizar el vínculo.");
        });
  }

  private void addActivity(String groupId, String type, String message) {
    activitiesByGroup.computeIfAbsent(groupId, ignored -> new CopyOnWriteArrayList<>())
        .add(new StudentGroupActivity(UUID.randomUUID().toString(), type, message, Instant.now()));
  }

  private StudentGroup toStudentGroup(GroupState group, String userId) {
    List<UserSearchResult> members = new ArrayList<>();
    members.add(profileService.getUserSearchResult(group.trainerId));
    members.addAll(group.memberIds.stream()
        .map(profileService::getUserSearchResult)
        .toList());
    return new StudentGroup(
        group.id, group.name, group.trainerId, profileService.getUserSearchResult(group.trainerId).name(),
        group.trainerId.equals(userId), members);
  }

  private GroupState requireGroup(String groupId) {
    GroupState group = groups.get(groupId);
    if (group == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado");
    }
    return group;
  }

  private GroupState requireAdministrator(String groupId, String trainerId) {
    GroupState group = requireGroup(groupId);
    if (!group.trainerId.equals(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el administrador puede editar este grupo");
    }
    return group;
  }

  private void requireMemberOrAdministrator(GroupState group, String userId) {
    if (!group.trainerId.equals(userId) && !group.memberIds.contains(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este grupo");
    }
  }

  private void requireTrainer(String trainerId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden gestionar grupos");
    }
  }

  private String validateName(String name) {
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del grupo es obligatorio");
    }
    return name.trim();
  }

  private static final class GroupState {
    private final String id;
    private String name;
    private final String trainerId;
    private final List<String> memberIds = new CopyOnWriteArrayList<>();

    private GroupState(String id, String name, String trainerId) {
      this.id = id;
      this.name = name;
      this.trainerId = trainerId;
    }
  }
}
