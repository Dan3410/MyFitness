package com.example.myFitness.studentGroups;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
class StudentGroupsServiceTest {
  @Autowired
  private StudentGroupsService studentGroupsService;

  @Test
  void seedsJohnGymsGroupWithJaneRunAndJohnSwim() {
    StudentGroup group = studentGroupsService.getGroups("1").stream()
        .filter(item -> item.name().equals("Grupo de John Gym"))
        .findFirst()
        .orElseThrow();

    assertEquals("1", group.trainerId());
    assertEquals(List.of("1", "2", "0"), group.members().stream().map(member -> member.id()).toList());
    assertEquals(List.of("John Gym", "Jane Run", "John Swim"),
        group.members().stream().map(member -> member.name()).toList());
  }

  @Test
  void managesMembersActivitiesAndAccess() {
    StudentGroup group = studentGroupsService.createGroup("1", "Equipo", List.of("0"));

    assertEquals(List.of("0"), studentGroupsService.getMemberIdsForTrainer("1", group.id()));
    assertEquals("MEMBER_ADDED", studentGroupsService.getActivities("0", group.id()).get(0).type());
    assertThrows(ResponseStatusException.class, () -> studentGroupsService.getGroup("2", group.id()));

    studentGroupsService.updateGroup("1", group.id(), "Nuevo equipo", List.of());

    assertEquals("Nuevo equipo", studentGroupsService.getGroup("1", group.id()).name());
    assertTrue(studentGroupsService.getActivities("1", group.id()).stream()
        .anyMatch(activity -> activity.type().equals("MEMBER_REMOVED")));
    StudentGroup secondGroup = studentGroupsService.createGroup("1", "Otro equipo", List.of("0"));
    studentGroupsService.removeUnlinkedStudent("1", "0");
    assertEquals(List.of("1"), studentGroupsService.getGroup("1", group.id()).members().stream()
        .map(member -> member.id()).toList());
    assertEquals(List.of("1"), studentGroupsService.getGroup("1", secondGroup.id()).members().stream()
        .map(member -> member.id()).toList());
  }
}
