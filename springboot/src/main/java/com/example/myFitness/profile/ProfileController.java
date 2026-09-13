package com.example.myFitness.profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.example.myFitness.profile.model.User;
import com.example.myFitness.profile.model.WeightHistoryPoint;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @GetMapping("/weight-history")
  public List<WeightHistoryPoint> getWeightHistory(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return profileService.getWeightHistory(authService.requireUserId(authorization));
  }

  @PutMapping("")
  public User saveProfile(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestBody User profile){
    String userId = authService.requireUserId(authorization);
    authService.updateUsername(userId, profile.getUsername());
    return profileService.saveProfile(userId, profile);
  }

}