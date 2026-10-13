package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.trainerStudent.TrainerStudentService;
import com.example.myFitness.trainerStudent.TrainerStudentRelationship;
import com.example.myFitness.profile.model.User;

class TrainerStudentLinkTest {
  @Test
  void seedsJohnGymAsJohnSwimsTrainer() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);

    trainerStudentService.seedDemoTrainerStudentLink();

    assertTrue(trainerStudentService.isLinkedStudent("1", "0"));
    assertEquals("0", trainerStudentService.getStudentsForTrainer("1").get(0).id());
  }

  @Test
  void trainerCanLinkListAndUnlinkAStudent() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);

    var linkedStudent = trainerStudentService.linkStudent("1", "0");

    assertEquals("0", linkedStudent.id());
    assertEquals("John Swim", linkedStudent.name());
    assertEquals("0", trainerStudentService.getStudentsForTrainer("1").get(0).id());

    assertEquals(0, trainerStudentService.unlinkStudent("1", "0").size());
  }

  @Test
  void studentCanListAndUnlinkTheirTrainers() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();

    assertEquals("1", trainerStudentService.getTrainersForStudent("0").get(0).id());
    assertEquals(0, trainerStudentService.unlinkTrainer("0", "1").size());
    assertTrue(trainerStudentService.getStudentsForTrainer("1").isEmpty());
  }

  @Test
  void profileRelationshipLookupDoesNotRequireViewerToHaveTheProfilesRole() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();

    assertEquals("0", trainerStudentService.getRelationshipsForProfile("1").get(0).id());
    assertEquals("1", trainerStudentService.getRelationshipsForProfile("0").get(0).id());
  }

  @Test
  void trainersCanLinkToOtherTrainersAndAppearInBothRelationshipGroups() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    User secondTrainer = profileService.getProfile("2");
    secondTrainer.setIsTrainer(true);
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();

    trainerStudentService.linkStudent("1", "2");

    var firstTrainerRelationships = trainerStudentService.getRelationshipsForProfile("1");
    var trainerStudentLink = firstTrainerRelationships.stream()
        .filter(relationship -> "2".equals(relationship.id()))
        .findFirst()
        .orElseThrow();
    assertEquals(TrainerStudentRelationship.RelationshipType.STUDENT, trainerStudentLink.relationshipType());
    assertTrue(trainerStudentLink.isTrainer());

    var secondTrainerRelationships = trainerStudentService.getRelationshipsForProfile("2");
    assertEquals("1", secondTrainerRelationships.get(0).id());
    assertEquals(TrainerStudentRelationship.RelationshipType.TRAINER,
        secondTrainerRelationships.get(0).relationshipType());
  }

  @Test
  void regularUserCannotLinkStudentsAndTrainerCannotLinkAnotherTrainer() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);

    assertThrows(ResponseStatusException.class, () -> trainerStudentService.linkStudent("0", "2"));
    assertThrows(ResponseStatusException.class, () -> trainerStudentService.linkStudent("1", "1"));
    assertThrows(ResponseStatusException.class, () -> trainerStudentService.unlinkTrainer("1", "0"));
  }
}