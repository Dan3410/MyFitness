package com.example.myFitness.profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.profile.model.User;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/profile")
public class ProfileController {

  @Autowired
    private ProfileService profileService;

  @GetMapping("")
  public User getProfile(@RequestParam String id) {
    return profileService.getProfile(id);
  }

  @PutMapping("")
  public String saveProfile(@RequestParam String id, @RequestBody User profile){
    return "";
  }

}