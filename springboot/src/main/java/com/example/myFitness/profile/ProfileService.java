package com.example.myFitness.profile;

import org.springframework.stereotype.Service;

import com.example.myFitness.profile.model.Gender;
import com.example.myFitness.profile.model.HeightUnit;
import com.example.myFitness.profile.model.Objective;
import com.example.myFitness.profile.model.PhysicalActivityLvl;
import com.example.myFitness.profile.model.User;
import com.example.myFitness.profile.model.WeightUnit;

@Service
public class ProfileService {
    public User getProfile(String id) {
        return new User(
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
    }
}