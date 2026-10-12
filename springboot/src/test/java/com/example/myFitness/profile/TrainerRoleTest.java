package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.example.myFitness.profile.model.User;

class TrainerRoleTest {
  @Test
  void trainerRoleIsIncludedInSearchAndCannotBeChangedByProfileUpdates() {
    ProfileService profileService = new ProfileService();
    profileService.init();

    User regularUser = profileService.getProfile("0");
    User forgedUpdate = new User(
        regularUser.getId(), regularUser.getUsername(), regularUser.getEmail(), regularUser.getName(),
        regularUser.getLastName(), regularUser.getWeight(), regularUser.getWeightUnit(), regularUser.getHeight(),
        regularUser.getHeightUnit(), regularUser.getBirthDay(), regularUser.getGender(),
        regularUser.getPhysicalActivityLvl(), regularUser.getObjective(), regularUser.getProfileImage(),
        regularUser.getIsProfilePrivate(), true);
    profileService.saveProfile("0", forgedUpdate);

    assertFalse(profileService.getProfile("0").getIsTrainer());
    assertTrue(profileService.searchUsers("Gym", "0").get(0).isTrainer());
  }
}