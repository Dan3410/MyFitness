package com.example.myFitness.profile.model;

public enum Gender{
    male("male"),
    female("female");

    private String gender;

    private Gender(String gender) {
        this.gender = gender;
    }

    public String  getGender() {
        return gender;
    }
}
