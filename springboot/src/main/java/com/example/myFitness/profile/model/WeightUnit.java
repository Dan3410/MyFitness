package com.example.myFitness.profile.model;

public enum WeightUnit {
    kg("kg"), 
    lb("lb");

    private String weightUnit;

    private WeightUnit(String weightUnit) {
        this.weightUnit = weightUnit;
    }

    public String getWeightUnit() {
        return weightUnit;
    }

}
