package com.example.myFitness.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.myFitness.auth.model.AuthRequest;
import com.example.myFitness.auth.model.AuthResponse;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:5173", "https://localhost:5173" })
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {
        return authService.register(request.email(), request.password());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request.email(), request.password());
    }
}