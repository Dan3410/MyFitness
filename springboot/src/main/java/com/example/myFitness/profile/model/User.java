package com.example.myFitness.profile.model;

//Profile object
public class User {
    private String name;
    private String lastName;
    private Double weight;
    private WeightUnit weightUnit;
    private Double height;
    private HeightUnit heightUnit;
    private String birthDay;
    private Gender gender;
    private PhysicalActivityLvl physicalActivityLvl;
    private Objective objective;

    // Constructor
    public User(String name, String lastName, Double weight, WeightUnit weightUnit,
                Double height, HeightUnit heightUnit, String birthDay, Gender gender,
                PhysicalActivityLvl physicalActivityLvl, Objective objective) {
        this.name = name;
        this.lastName = lastName;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.height = height;
        this.heightUnit = heightUnit;
        this.birthDay = birthDay;
        this.gender = gender;
        this.physicalActivityLvl = physicalActivityLvl;
        this.objective = objective;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public WeightUnit getWeightUnit() {
        return weightUnit;
    }

    public void setWeightUnit(WeightUnit weightUnit) {
        this.weightUnit = weightUnit;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public HeightUnit getHeightUnit() {
        return heightUnit;
    }

    public void setHeightUnit(HeightUnit heightUnit) {
        this.heightUnit = heightUnit;
    }

    public String getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(String birthDay) {
        this.birthDay = birthDay;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public PhysicalActivityLvl getPhysicalActivityLvl() {
        return physicalActivityLvl;
    }

    public void setPhysicalActivityLvl(PhysicalActivityLvl physicalActivityLvl) {
        this.physicalActivityLvl = physicalActivityLvl;
    }

    public Objective getObjective() {
        return objective;
    }

    public void setObjective(Objective objective) {
        this.objective = objective;
    }
}