package com.example.myFitness.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ProfileSearchTest {
  @Test
  void searchesFullNamesAndNormalizesRepeatedWhitespace() {
    ProfileService profileService = new ProfileService();
    profileService.init();

    assertEquals("1", profileService.searchUsers("John Gym", "0").get(0).id());
    assertEquals("1", profileService.searchUsers("  John   Gym  ", "0").get(0).id());
  }
}
