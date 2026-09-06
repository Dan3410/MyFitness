package com.example.myFitness.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.server.ResponseStatusException;
import jakarta.annotation.PostConstruct;

import com.example.myFitness.auth.model.AuthResponse;

@Service
public class AuthService {
    private final Map<String, Account> accountsByEmail = new ConcurrentHashMap<>();
    private final Map<String, Account> accountsById = new ConcurrentHashMap<>();
    @Value("${jwt.secret}")
    private String tokenSecret;

    public AuthService() {
        seedUsers();
    }

    @PostConstruct
    public void seedUsers() {
        seedUser("Swim", "swimswam@email.com", "SwimSwam", "0");
        seedUser("Gym", "gym@email.com", "LiftHeavyThings", "1");
        seedUser("Run", "run@email.com", "WontStopRunning.", "2");
    }

    private void seedUser(String username, String email, String password, String userId) {
        String normalizedEmail = normalizeEmail(email);
        Account account = new Account(userId, username, normalizedEmail, hash(password));
        accountsByEmail.put(normalizedEmail, account);
        accountsByEmail.put(normalizeEmail(username), account);
        accountsById.put(userId, account);
    }

    public AuthResponse register(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        validateCredentials(normalizedEmail, password);
        if (accountsByEmail.containsKey(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Account account = new Account(UUID.randomUUID().toString(), normalizedEmail, normalizedEmail, hash(password));
        accountsByEmail.put(normalizedEmail, account);
        accountsById.put(account.userId(), account);
        return createSession(account);
    }

    public AuthResponse login(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        Account account = accountsByEmail.get(normalizedEmail);
        if (account == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }
        if (!MessageDigest.isEqual(
            account.passwordHash().getBytes(StandardCharsets.UTF_32),
            hash(password).getBytes(StandardCharsets.UTF_32))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }
        return createSession(account);
    }

    public String requireUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Se requiere iniciar sesión");
        }
        try {
            Claims claims = Jwts.parser()
                .verifyWith(signingKey())
                .requireIssuer("myfitness")
                .build()
                .parseSignedClaims(authorizationHeader.substring("Bearer ".length()))
                .getPayload();
            String userId = claims.getSubject();
            if (userId == null || !accountsById.containsKey(userId)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La sesión no es válida");
            }
            return userId;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La sesión no es válida");
        }
    }

    public String getEmail(String userId) {
        Account account = accountsById.get(userId);
        return account == null ? null : account.email();
    }

    public String getUserId(String email) {
        Account account = accountsByEmail.get(normalizeEmail(email));
        return account == null ? null : account.userId();
    }

    public void updateUsername(String userId, String username) {
        String normalizedUsername = normalizeEmail(username);
        if (normalizedUsername.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El username es obligatorio");
        }

        Account currentAccount = accountsById.get(userId);
        Account existingAccount = accountsByEmail.get(normalizedUsername);
        if (currentAccount == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta no existe");
        }
        if (existingAccount != null && !existingAccount.userId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El username ya está en uso");
        }

        accountsByEmail.remove(normalizeEmail(currentAccount.username()), currentAccount);
        Account updatedAccount = new Account(userId, username.trim(), currentAccount.email(), currentAccount.passwordHash());
        accountsById.put(userId, updatedAccount);
        accountsByEmail.put(normalizedUsername, updatedAccount);
        accountsByEmail.put(normalizeEmail(updatedAccount.email()), updatedAccount);
    }

    private AuthResponse createSession(Account account) {
        Date issuedAt = new Date();
        Date expiresAt = new Date(issuedAt.getTime() + 1000L * 60 * 60 * 24);
        String token = Jwts.builder()
            .subject(account.userId())
            .issuer("myfitness")
            .issuedAt(issuedAt)
            .expiration(expiresAt)
            .id(UUID.randomUUID().toString())
            .signWith(signingKey())
            .compact();
        return new AuthResponse(token, account.userId(), account.email());
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(tokenSecret.getBytes(StandardCharsets.UTF_32));
    }

    private static String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static void validateCredentials(String email, String password) {
        if (email.isBlank() || password == null || password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email y contraseña válida son obligatorios");
        }
    }

    private static String hash(String password) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(password.getBytes(StandardCharsets.UTF_32));
            StringBuilder result = new StringBuilder();
            for (byte value : digest) {
                result.append(String.format("%02x", value));
            }
            return result.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no está disponible", exception);
        }
    }

    private record Account(String userId, String username, String email, String passwordHash) {
    }
}