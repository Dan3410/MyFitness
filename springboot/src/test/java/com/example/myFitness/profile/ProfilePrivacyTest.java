package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.profile.model.User;

class ProfilePrivacyTest {
  @Test
  void privateProfileOnlyReturnsImageToOtherUsersAndBlocksWeightHistory() {
    ProfileService profileService = new ProfileService();
    profileService.init();
    User ownerProfile = profileService.getProfile("0");
    ownerProfile.setProfileImage("profile-image");
    ownerProfile.setIsProfilePrivate(true);
    profileService.saveProfile("0", ownerProfile);

    User visibleToOther = profileService.getUserById("0", "1");

    assertEquals("0", visibleToOther.getId());
    assertEquals("profile-image", visibleToOther.getProfileImage());
    assertEquals(true, visibleToOther.getIsProfilePrivate());
    assertNull(visibleToOther.getName());
    assertNull(visibleToOther.getWeight());
    assertEquals("John", profileService.getUserById("0", "0").getName());
    assertThrows(ResponseStatusException.class, () -> profileService.getWeightHistoryById("0", "1"));
  }
}