package com.example.myFitness.profile;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.example.myFitness.profile.model.Gender;
import com.example.myFitness.profile.model.HeightUnit;
import com.example.myFitness.profile.model.Objective;
import com.example.myFitness.profile.model.PhysicalActivityLvl;
import com.example.myFitness.profile.model.User;
import com.example.myFitness.profile.model.WeightUnit;

import jakarta.annotation.PostConstruct;

@Service
public class ProfileService {

    private final Map<String, User> savedUsers = new ConcurrentHashMap<>();

    private User swimUser = new User(
        "0",
        "Swim",
        "swimswam@email.com",
        "Nombre",
        "Apellido",
        62.00,
        WeightUnit.kg,
        150.00,
        HeightUnit.cm,
        "1985-12-10",
        Gender.male,
        PhysicalActivityLvl.medium,
        Objective.maintain
      );

      private User gymUser = new User(
        "1",
        "Gym",
        "gym@email.com",
        "Nombre",
        "Apellido",
        85.00,
        WeightUnit.kg,
        180.00,
        HeightUnit.cm,
        "1985-12-10",
        Gender.male,
        PhysicalActivityLvl.medium,
        Objective.maintain
      );

      private User runUser = new User(
        "2",
        "Run",
        "run@email.com",
        "Nombre",
        "Apellido",
        70.00,
        WeightUnit.kg,
        175.00,
        HeightUnit.cm,
        "1985-12-10",
        Gender.female,
        PhysicalActivityLvl.medium,
        Objective.maintain
      );

    @PostConstruct
    public void init() {
        savedUsers.put("0", swimUser);
        savedUsers.put("1", gymUser);
        savedUsers.put("2", runUser);
    }

    public User getProfile(String id) {
        return savedUsers.computeIfAbsent(id, ignored -> new User(null, null, null, null, null, null, null, null, null, null, null, null, null));
    }

    public User saveProfile(String id, User user) {
      savedUsers.put(id, user);
      return user;
    }
}