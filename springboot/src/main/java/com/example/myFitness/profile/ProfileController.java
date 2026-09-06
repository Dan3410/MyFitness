package com.example.myFitness.profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.profile.model.User;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.myFitness.auth.AuthService;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  @Autowired
    private ProfileService profileService;

  @Autowired
    private AuthService authService;

  @GetMapping("")
  public User getProfile(@RequestHeader(value = "Authorization", required = false) String authorization) {
    return profileService.getProfile(authService.requireUserId(authorization));
  }

  @PutMapping("")
  public User saveProfile(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestBody User profile){
    String userId = authService.requireUserId(authorization);
    authService.updateUsername(userId, profile.getUsername());
    return profileService.saveProfile(userId, profile);
  }

}