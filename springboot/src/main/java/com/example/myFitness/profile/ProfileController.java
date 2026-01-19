package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

  @GetMapping("/profile/:id")
  public getProfile() {
    return "Greetings from Spring Boot!";
  }

  @PutMapping("/profile/:id")
  public saveProfile(){
    return ""
  }

}