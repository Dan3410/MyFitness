package com.example.myFitness.profile;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.example.myFitness.profile.model.Gender;
import com.example.myFitness.profile.model.HeightUnit;
import com.example.myFitness.profile.model.Objective;
import com.example.myFitness.profile.model.PhysicalActivityLvl;
import com.example.myFitness.profile.model.User;
import com.example.myFitness.profile.model.WeightHistoryPoint;
import com.example.myFitness.profile.model.WeightUnit;

import jakarta.annotation.PostConstruct;

@Service
public class ProfileService {

    private static final int WEIGHT_HISTORY_LIMIT = 15;

    private static final Map<String, double[]> WEIGHT_CHANGES_BY_USER = Map.of(
      "0", new double[] {-1.9, -1.6, -1.7, -1.3, -1.4, -1.0, -1.2, -0.9, -0.7, -0.8, -0.5, -0.6, -0.2, -0.3, 0.0},
      "1", new double[] {0.0, 0.3, 0.1, 0.5, 0.4, 0.7, 0.6, 0.9, 0.8, 1.1, 0.9, 1.3, 1.2, 1.5, 1.4},
      "2", new double[] {-0.8, -0.4, -0.6, -0.2, -0.3, 0.1, -0.1, 0.2, 0.0, 0.4, 0.2, 0.5, 0.3, 0.7, 0.6}
    );

    private final Map<String, User> savedUsers = new ConcurrentHashMap<>();
    private final Map<String, List<WeightHistoryPoint>> weightHistoryByUser = new ConcurrentHashMap<>();

    private User swimUser = new User(
        "0",
        "Swim",
        "swimswam@email.com",
        "John",
        "Swim",
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
        "John",
        "Gym",
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
        "Jane",
        "Run",
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
      weightHistoryByUser.put("0", createMockWeightHistory("0", swimUser));
      weightHistoryByUser.put("1", createMockWeightHistory("1", gymUser));
      weightHistoryByUser.put("2", createMockWeightHistory("2", runUser));
    }

    public User getProfile(String id) {
        return savedUsers.computeIfAbsent(id, ignored -> new User(null, null, null, null, null, null, null, null, null, null, null, null, null));
    }

    public synchronized User saveProfile(String id, User user) {
      savedUsers.put(id, user);
      List<WeightHistoryPoint> history = new ArrayList<>(getWeightHistory(id));
      WeightHistoryPoint latestPoint = new WeightHistoryPoint(LocalDate.now(), user.getWeight());

      if (!history.isEmpty() && history.get(history.size() - 1).date().equals(latestPoint.date())) {
        history.set(history.size() - 1, latestPoint);
      } else {
        history.add(latestPoint);
      }

      while (history.size() > WEIGHT_HISTORY_LIMIT) {
        history.remove(0);
      }
      weightHistoryByUser.put(id, history);
      return user;
    }

    public synchronized List<WeightHistoryPoint> getWeightHistory(String id) {
      User user = getProfile(id);
      List<WeightHistoryPoint> history = weightHistoryByUser.computeIfAbsent(id, ignored -> createMockWeightHistory(id, user));
      return List.copyOf(history);
    }

    private List<WeightHistoryPoint> createMockWeightHistory(String userId, User user) {
      double currentWeight = user.getWeight() == null ? 0.0 : user.getWeight();
      double[] weightChanges = WEIGHT_CHANGES_BY_USER.getOrDefault(userId, new double[0]);
      LocalDate lastDate = LocalDate.now();
      List<WeightHistoryPoint> history = new ArrayList<>();

      for (int index = 0; index < weightChanges.length; index++) {
        history.add(new WeightHistoryPoint(
            lastDate.minusDays(weightChanges.length - 1L - index),
            Math.round((currentWeight + weightChanges[index]) * 10.0) / 10.0));
      }

      return history;
    }
}