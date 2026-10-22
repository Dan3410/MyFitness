package com.example.myFitness.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.example.myFitness.auth.model.AuthResponse;

class AuthServiceTest {
  private AuthService authService;

  @BeforeEach
  void setUp() {
    authService = new AuthService();
    ReflectionTestUtils.setField(authService, "tokenSecret", "test-secret-key-for-auth-tests");
  }

  @Test
  void loginNormalizesEmailAndReturnsAUsableSessionToken() {
    AuthResponse response = authService.login("  SWIMSWAM@EMAIL.COM ", "SwimSwam");

    assertEquals("0", response.userId());
    assertEquals("swimswam@email.com", response.email());
    assertFalse(response.token().isBlank());
    assertEquals("0", authService.requireUserId("Bearer " + response.token()));
  }

  @Test
  void loginRejectsUnknownUsersAndIncorrectPasswords() {
    ResponseStatusException unknownUser = assertThrows(
        ResponseStatusException.class,
        () -> authService.login("missing@example.com", "secret"));
    ResponseStatusException wrongPassword = assertThrows(
        ResponseStatusException.class,
        () -> authService.login("swimswam@email.com", "incorrect"));

    assertEquals(HttpStatus.UNAUTHORIZED, unknownUser.getStatusCode());
    assertEquals(HttpStatus.UNAUTHORIZED, wrongPassword.getStatusCode());
  }

  @Test
  void registerCreatesSessionAndRejectsInvalidOrDuplicateCredentials() {
    AuthResponse response = authService.register(" NewUser@Example.com ", "strong-password");

    assertEquals("newuser@example.com", response.email());
    assertEquals(response.userId(), authService.requireUserId("Bearer " + response.token()));
    assertEquals(response.userId(), authService.getUserId("NEWUSER@EXAMPLE.COM"));

    ResponseStatusException duplicateEmail = assertThrows(
        ResponseStatusException.class,
        () -> authService.register("newuser@example.com", "another-password"));
    ResponseStatusException invalidPassword = assertThrows(
        ResponseStatusException.class,
        () -> authService.register("another@example.com", "short"));

    assertEquals(HttpStatus.CONFLICT, duplicateEmail.getStatusCode());
    assertEquals(HttpStatus.BAD_REQUEST, invalidPassword.getStatusCode());
  }

  @Test
  void rejectsMissingAndInvalidBearerTokens() {
    ResponseStatusException missingToken = assertThrows(
        ResponseStatusException.class,
        () -> authService.requireUserId(null));
    ResponseStatusException invalidToken = assertThrows(
        ResponseStatusException.class,
        () -> authService.requireUserId("Bearer not-a-jwt"));

    assertTrue(missingToken.getStatusCode().is4xxClientError());
    assertEquals(HttpStatus.UNAUTHORIZED, invalidToken.getStatusCode());
  }
}
