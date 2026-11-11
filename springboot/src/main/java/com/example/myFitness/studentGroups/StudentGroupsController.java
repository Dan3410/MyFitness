package com.example.myFitness.studentGroups;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.myFitness.auth.AuthService;
import com.example.myFitness.profile.model.UserSearchResult;

@RestController
@RequestMapping("/groups")
public class StudentGroupsController {
  private final StudentGroupsService studentGroupsService;
  private final AuthService authService;

  public StudentGroupsController(StudentGroupsService studentGroupsService, AuthService authService) {
    this.studentGroupsService = studentGroupsService;
    this.authService = authService;
  }

  @GetMapping
  public List<StudentGroup> getGroups(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.getGroups(authService.requireUserId(authorization));
  }

  @PostMapping
  public StudentGroup createGroup(
      @RequestBody StudentGroupRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.createGroup(
        authService.requireUserId(authorization), request.name(), request.memberIds());
  }

  @GetMapping("/{groupId}")
  public StudentGroup getGroup(
      @PathVariable String groupId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.getGroup(authService.requireUserId(authorization), groupId);
  }

  @GetMapping("/{groupId}/members")
  public List<UserSearchResult> getMembers(
      @PathVariable String groupId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.getMembers(authService.requireUserId(authorization), groupId);
  }

  @GetMapping("/{groupId}/activities")
  public List<StudentGroupActivity> getActivities(
      @PathVariable String groupId,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.getActivities(authService.requireUserId(authorization), groupId);
  }

  @PutMapping("/{groupId}")
  public StudentGroup updateGroup(
      @PathVariable String groupId,
      @RequestBody StudentGroupRequest request,
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return studentGroupsService.updateGroup(
        authService.requireUserId(authorization), groupId, request.name(), request.memberIds());
  }
}
