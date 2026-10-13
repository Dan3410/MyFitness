package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.profile.model.User;
import com.example.myFitness.trainerStudent.TrainerStudentService;

class ProfilePrivacyTest {
  @Test
  void privateProfileOnlyReturnsImageToOtherUsersAndBlocksWeightHistory() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    User ownerProfile = profileService.getProfile("0");
    ownerProfile.setProfileImage("profile-image");
    ownerProfile.setIsProfilePrivate(true);
    profileService.saveProfile("0", ownerProfile);

    User visibleToOther = profileService.getUserById("0", "2");

    assertEquals("0", visibleToOther.getId());
    assertEquals("profile-image", visibleToOther.getProfileImage());
    assertEquals(true, visibleToOther.getIsProfilePrivate());
    assertNull(visibleToOther.getName());
    assertNull(visibleToOther.getWeight());
    assertEquals("John", profileService.getUserById("0", "0").getName());
    assertThrows(ResponseStatusException.class, () -> profileService.getWeightHistoryById("0", "2"));

    assertEquals("John", profileService.getUserById("0", "1").getName());
    assertEquals(15, profileService.getWeightHistoryById("0", "1").size());
  }

  @Test
  void linkedStudentCanViewPrivateTrainerProfileAndWeightHistory() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    TrainerStudentService trainerStudentService = new TrainerStudentService(profileService);
    trainerStudentService.seedDemoTrainerStudentLink();

    User trainer = profileService.getProfile("1");
    trainer.setIsProfilePrivate(true);
    profileService.saveProfile("1", trainer);

    boolean areLinked = trainerStudentService.areLinkedUsers("0", "1");
    assertEquals("John", profileService.getUserById("1", "0", areLinked).getName());
    assertEquals(15, profileService.getWeightHistoryById("1", "0", areLinked).size());
    assertEquals(false, trainerStudentService.areLinkedUsers("2", "1"));
  }
}