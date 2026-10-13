package com.example.myFitness.notification;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.profile.model.UserSearchResult;
import com.example.myFitness.trainerStudent.TrainerStudentService;
import jakarta.annotation.PostConstruct;

@Service
public class NotificationService {
  private final Map<String, TrainerRequestNotification> notifications = new ConcurrentHashMap<>();
  private final ProfileService profileService;
  private final TrainerStudentService trainerStudentService;

  public NotificationService(ProfileService profileService, TrainerStudentService trainerStudentService) {
    this.profileService = profileService;
    this.trainerStudentService = trainerStudentService;
  }

  @PostConstruct
  void seedAcceptedTrainerRequestForTesting() {
    UserSearchResult trainer = profileService.getUserSearchResult("1");
    UserSearchResult student = profileService.getUserSearchResult("0");
    Instant respondedAt = Instant.now();
    TrainerRequestNotification acceptedRequest = new TrainerRequestNotification(
        "demo-gym-trainer-request-for-swim", trainer.id(), trainer.name(), student.id(),
        trainer.name() + " quiere ser tu entrenador", respondedAt, true, TrainerRequestStatus.ACCEPTED,
        NotificationType.TRAINER_REQUEST);
    notifications.putIfAbsent(acceptedRequest.id(), acceptedRequest);

    TrainerRequestNotification response = new TrainerRequestNotification(
        "demo-swim-accepted-gym-request", trainer.id(), trainer.name(), trainer.id(),
        student.name() + " ha aceptado la solicitud", respondedAt, false, TrainerRequestStatus.ACCEPTED,
        NotificationType.TRAINER_REQUEST_RESPONSE);
    notifications.putIfAbsent(response.id(), response);
  }

  public TrainerRequestNotification sendTrainerRequest(String trainerId, String recipientId) {
    if (!profileService.isTrainer(trainerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los entrenadores pueden enviar solicitudes");
    }
    if (trainerId.equals(recipientId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes enviarte una solicitud a ti mismo");
    }

    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    UserSearchResult recipient = profileService.getUserSearchResult(recipientId);
    if (recipient.isTrainer()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede vincular otro entrenador como alumno");
    }

    boolean alreadyPending = notifications.values().stream()
        .anyMatch(notification -> notification.trainerId().equals(trainerId)
            && notification.recipientId().equals(recipientId)
            && notification.status() == TrainerRequestStatus.PENDING);
    if (alreadyPending) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una solicitud pendiente");
    }

    TrainerRequestNotification notification = new TrainerRequestNotification(
        UUID.randomUUID().toString(), trainerId, trainer.name(), recipientId,
        trainer.name() + " quiere ser tu entrenador", Instant.now(), false, TrainerRequestStatus.PENDING,
        NotificationType.TRAINER_REQUEST);
    notifications.put(notification.id(), notification);
    return notification;
  }

  public List<TrainerRequestNotification> getNotifications(String recipientId) {
    return notifications.values().stream()
        .filter(notification -> notification.recipientId().equals(recipientId))
        .sorted(Comparator.comparing(TrainerRequestNotification::createdAt).reversed())
        .toList();
  }

  public void notifyWorkoutShared(String trainerId, String studentId, String workoutName) {
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    TrainerRequestNotification notification = new TrainerRequestNotification(
        UUID.randomUUID().toString(), trainerId, trainer.name(), studentId,
        trainer.name() + " te ha asignado la rutina " + workoutName,
        Instant.now(), false, null, NotificationType.WORKOUT_SHARED);
    notifications.put(notification.id(), notification);
  }

  public void notifyWorkoutUnshared(String trainerId, String studentId, String workoutName) {
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    TrainerRequestNotification notification = new TrainerRequestNotification(
        UUID.randomUUID().toString(), trainerId, trainer.name(), studentId,
        trainer.name() + " ha dejado de compartir la rutina " + workoutName + " contigo",
        Instant.now(), false, null, NotificationType.WORKOUT_UNSHARED);
    notifications.put(notification.id(), notification);
  }

  public void notifyStudentRemovedFromTrainer(String trainerId, String studentId) {
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    addRelationshipRemovalNotification(
        trainerId, trainer.name(), studentId, "Ya no eres estudiante de " + trainer.name());
  }

  public void notifyTrainerRemovedByStudent(String trainerId, String studentId) {
    UserSearchResult trainer = profileService.getUserSearchResult(trainerId);
    UserSearchResult student = profileService.getUserSearchResult(studentId);
    addRelationshipRemovalNotification(
        trainerId, trainer.name(), trainerId, "Ya no eres entrenador de " + student.name());
  }

  private void addRelationshipRemovalNotification(
      String trainerId,
      String trainerName,
      String recipientId,
      String message) {
    TrainerRequestNotification notification = new TrainerRequestNotification(
        UUID.randomUUID().toString(), trainerId, trainerName, recipientId,
        message, Instant.now(), false, null, NotificationType.TRAINER_STUDENT_UNLINKED);
    notifications.put(notification.id(), notification);
  }

  public TrainerRequestNotification acceptTrainerRequest(String recipientId, String notificationId) {
    TrainerRequestNotification notification = requirePendingNotification(recipientId, notificationId);
    trainerStudentService.linkStudent(notification.trainerId(), recipientId);
    return updateStatus(notification, TrainerRequestStatus.ACCEPTED);
  }

  public TrainerRequestNotification declineTrainerRequest(String recipientId, String notificationId) {
    TrainerRequestNotification notification = requirePendingNotification(recipientId, notificationId);
    return updateStatus(notification, TrainerRequestStatus.DECLINED);
  }

  private TrainerRequestNotification requirePendingNotification(String recipientId, String notificationId) {
    TrainerRequestNotification notification = notifications.get(notificationId);
    if (notification == null || !notification.recipientId().equals(recipientId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificación no encontrada");
    }
    if (notification.status() != TrainerRequestStatus.PENDING) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "La solicitud ya fue respondida");
    }
    return notification;
  }

  private TrainerRequestNotification updateStatus(
      TrainerRequestNotification notification,
      TrainerRequestStatus status) {
    TrainerRequestNotification updated = new TrainerRequestNotification(
        notification.id(), notification.trainerId(), notification.trainerName(), notification.recipientId(),
        notification.message(), notification.createdAt(), true, status, notification.type());
    notifications.put(updated.id(), updated);

    UserSearchResult student = profileService.getUserSearchResult(notification.recipientId());
    String response = status == TrainerRequestStatus.ACCEPTED ? "ha aceptado" : "ha rechazado";
    TrainerRequestNotification responseNotification = new TrainerRequestNotification(
        UUID.randomUUID().toString(), notification.trainerId(), notification.trainerName(),
        notification.trainerId(), student.name() + " " + response + " la solicitud",
        Instant.now(), false, status, NotificationType.TRAINER_REQUEST_RESPONSE);
    notifications.put(responseNotification.id(), responseNotification);
    return updated;
  }
}