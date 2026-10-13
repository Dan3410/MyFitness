package com.example.myFitness.notification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.example.myFitness.profile.model.User;
import com.example.myFitness.profile.ProfileService;
import com.example.myFitness.trainerStudent.TrainerStudentService;

class NotificationServiceTest {
  private NotificationService createService() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    return new NotificationService(profileService, new TrainerStudentService(profileService));
  }

  @Test
  void acceptingTrainerRequestMarksItSeenAndCreatesStudentLink() {
    NotificationService service = createService();

    TrainerRequestNotification sent = service.sendTrainerRequest("1", "0");
    assertEquals("John Gym quiere ser tu entrenador", sent.message());
    assertFalse(sent.seen());

    TrainerRequestNotification accepted = service.acceptTrainerRequest("0", sent.id());

    assertTrue(accepted.seen());
    assertEquals(TrainerRequestStatus.ACCEPTED, accepted.status());
    assertEquals(1, service.getNotifications("0").size());
    var trainerNotifications = service.getNotifications("1");
    assertEquals(1, trainerNotifications.size());
    assertEquals("John Swim ha aceptado la solicitud", trainerNotifications.get(0).message());
    assertEquals(NotificationType.TRAINER_REQUEST_RESPONSE, trainerNotifications.get(0).type());
  }

  @Test
  void decliningRequestMarksItSeenWithoutCreatingStudentLink() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService service = new NotificationService(profileService, trainerStudentService);
    TrainerRequestNotification sent = service.sendTrainerRequest("1", "0");

    TrainerRequestNotification declined = service.declineTrainerRequest("0", sent.id());

    assertTrue(declined.seen());
    assertEquals(TrainerRequestStatus.DECLINED, declined.status());
    assertTrue(trainerStudentService.getStudentsForTrainer("1").isEmpty());
    assertEquals(1, service.getNotifications("0").size());
    var trainerNotifications = service.getNotifications("1");
    assertEquals(1, trainerNotifications.size());
    assertEquals("John Swim ha rechazado la solicitud", trainerNotifications.get(0).message());
    assertEquals(NotificationType.TRAINER_REQUEST_RESPONSE, trainerNotifications.get(0).type());
  }

  @Test
  void seedsAcceptedRequestForJohnSwimAndAcceptanceNotificationForJohnGym() {
    NotificationService service = createService();

    service.seedAcceptedTrainerRequestForTesting();
    var studentNotifications = service.getNotifications("0");
    var trainerNotifications = service.getNotifications("1");

    assertEquals(1, studentNotifications.size());
    assertEquals("1", studentNotifications.get(0).trainerId());
    assertEquals("John Gym", studentNotifications.get(0).trainerName());
    assertEquals("John Gym quiere ser tu entrenador", studentNotifications.get(0).message());
    assertTrue(studentNotifications.get(0).seen());
    assertEquals(TrainerRequestStatus.ACCEPTED, studentNotifications.get(0).status());
    assertEquals(NotificationType.TRAINER_REQUEST, studentNotifications.get(0).type());

    assertEquals(1, trainerNotifications.size());
    assertEquals("John Swim ha aceptado la solicitud", trainerNotifications.get(0).message());
    assertFalse(trainerNotifications.get(0).seen());
    assertEquals(TrainerRequestStatus.ACCEPTED, trainerNotifications.get(0).status());
    assertEquals(NotificationType.TRAINER_REQUEST_RESPONSE, trainerNotifications.get(0).type());
  }

  @Test
  void notifiesStudentAndTrainerWhenRelationshipIsRemoved() {
    NotificationService service = createService();

    service.notifyStudentRemovedFromTrainer("1", "0");
    service.notifyTrainerRemovedByStudent("1", "0");

    var studentNotification = service.getNotifications("0").get(0);
    assertEquals("Ya no eres estudiante de John Gym", studentNotification.message());
    assertEquals(NotificationType.TRAINER_STUDENT_UNLINKED, studentNotification.type());

    var trainerNotification = service.getNotifications("1").get(0);
    assertEquals("Ya no eres entrenador de John Swim", trainerNotification.message());
    assertEquals(NotificationType.TRAINER_STUDENT_UNLINKED, trainerNotification.type());
  }

  @Test
  void trainerCanRequestAnotherTrainerAndLinkIsCreatedWhenAccepted() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    User secondTrainer = profileService.getProfile("2");
    secondTrainer.setIsTrainer(true);
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    NotificationService service = new NotificationService(profileService, trainerStudentService);

    TrainerRequestNotification request = service.sendTrainerRequest("1", "2");

    assertEquals("John Gym quiere que seas su entrenador", request.message());
    service.acceptTrainerRequest("2", request.id());
    var gymRelationships = trainerStudentService.getRelationshipsForProfile("1");
    var runRelationships = trainerStudentService.getRelationshipsForProfile("2");
    assertTrue(gymRelationships.stream().anyMatch(item -> "2".equals(item.id())
        && item.relationshipType() == com.example.myFitness.trainerStudent.TrainerStudentRelationship.RelationshipType.TRAINER));
    assertTrue(runRelationships.stream().anyMatch(item -> "1".equals(item.id())
        && item.relationshipType() == com.example.myFitness.trainerStudent.TrainerStudentRelationship.RelationshipType.STUDENT));
  }
}