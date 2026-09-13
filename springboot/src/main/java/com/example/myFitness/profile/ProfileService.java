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

    private static final Map<String, List<WeightUpdate>> UPDATES_BY_USER = Map.of(
      "0", List.of(
        update(-1.9, LocalDate.now().minusDays(105)), update(-1.6, LocalDate.now().minusDays(98)), update(-1.7, LocalDate.now().minusDays(91)), update(-1.3, LocalDate.now().minusDays(84)), update(-1.4, LocalDate.now().minusDays(77)),
        update(-1.0, LocalDate.now().minusDays(70)), update(-1.2, LocalDate.now().minusDays(63)), update(-0.9, LocalDate.now().minusDays(56)), update(-0.7, LocalDate.now().minusDays(49)), update(-0.8, LocalDate.now().minusDays(42)),
        update(-0.5, LocalDate.now().minusDays(35)), update(-0.6, LocalDate.now().minusDays(28)), update(-0.2, LocalDate.now().minusDays(21)), update(-0.3, LocalDate.now().minusDays(14)), update(0.0, LocalDate.now())
      ),
      "1", List.of(
        update(0.0, LocalDate.now().minusDays(112)), update(0.3, LocalDate.now().minusDays(104)), update(0.1, LocalDate.now().minusDays(96)), update(0.5, LocalDate.now().minusDays(88)), update(0.4, LocalDate.now().minusDays(80)),
        update(0.7, LocalDate.now().minusDays(72)), update(0.6, LocalDate.now().minusDays(64)), update(0.9, LocalDate.now().minusDays(56)), update(0.8, LocalDate.now().minusDays(48)), update(1.1, LocalDate.now().minusDays(40)),
        update(0.9, LocalDate.now().minusDays(32)), update(1.3, LocalDate.now().minusDays(24)), update(1.2, LocalDate.now().minusDays(16)), update(1.5, LocalDate.now().minusDays(8)), update(1.4, LocalDate.now())
      ),
      "2", List.of(
        update(-0.8, LocalDate.now().minusDays(120)), update(-0.4, LocalDate.now().minusDays(111)), update(-0.6, LocalDate.now().minusDays(102)), update(-0.2, LocalDate.now().minusDays(93)), update(-0.3, LocalDate.now().minusDays(84)),
        update(0.1, LocalDate.now().minusDays(75)), update(-0.1, LocalDate.now().minusDays(66)), update(0.2, LocalDate.now().minusDays(57)), update(0.0, LocalDate.now().minusDays(48)), update(0.4, LocalDate.now().minusDays(39)),
        update(0.2, LocalDate.now().minusDays(30)), update(0.5, LocalDate.now().minusDays(21)), update(0.3, LocalDate.now().minusDays(12)), update(0.7, LocalDate.now().minusDays(6)), update(0.6, LocalDate.now())
      )
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
      weightHistoryByUser.put("0", createWeightHistory("0", swimUser));
      weightHistoryByUser.put("1", createWeightHistory("1", gymUser));
      weightHistoryByUser.put("2", createWeightHistory("2", runUser));
    }

    public User getProfile(String id) {
        return savedUsers.computeIfAbsent(id, ignored -> new User(null, null, null, null, null, null, null, null, null, null, null, null, null));
    }

    public synchronized User saveProfile(String id, User user) {
      savedUsers.put(id, user);
      List<WeightHistoryPoint> history = new ArrayList<>(getWeightHistory(id));
      WeightHistoryPoint latestPoint = new WeightHistoryPoint(LocalDate.now(), user.getWeight());
      int sameDayIndex = -1;

      for (int index = 0; index < history.size(); index++) {
        if (history.get(index).date().equals(latestPoint.date())) {
          sameDayIndex = index;
          break;
        }
      }

      if (sameDayIndex >= 0) {
        history.set(sameDayIndex, latestPoint);
      } else {
        if (history.size() >= WEIGHT_HISTORY_LIMIT) {
          history.remove(0);
        }
        history.add(latestPoint);
      }
      weightHistoryByUser.put(id, history);
      return user;
    }

    public synchronized List<WeightHistoryPoint> getWeightHistory(String id) {
      User user = getProfile(id);
      List<WeightHistoryPoint> history = weightHistoryByUser.computeIfAbsent(id, ignored -> createWeightHistory(id, user));
      return List.copyOf(history);
    }

    private List<WeightHistoryPoint> createWeightHistory(String userId, User user) {
      double currentWeight = user.getWeight() == null ? 0.0 : user.getWeight();
      List<WeightUpdate> updates = UPDATES_BY_USER.getOrDefault(userId, List.of());
      List<WeightHistoryPoint> history = new ArrayList<>();

      for (WeightUpdate update : updates) {
        history.add(new WeightHistoryPoint(
            update.date(),
            Math.round((currentWeight + update.weightChange()) * 10.0) / 10.0));
      }

      return history;
    }

    private static WeightUpdate update(double weightChange, LocalDate date) {
      return new WeightUpdate(weightChange, date);
    }

    private record WeightUpdate(double weightChange, LocalDate date) {
    }
}