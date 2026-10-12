package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.trainerStudent.TrainerStudentService;

class TrainerStudentLinkTest {
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
  void regularUserCannotLinkStudentsAndTrainerCannotLinkAnotherTrainer() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);

    assertThrows(ResponseStatusException.class, () -> trainerStudentService.linkStudent("0", "2"));
    assertThrows(ResponseStatusException.class, () -> trainerStudentService.linkStudent("1", "1"));
  }
}