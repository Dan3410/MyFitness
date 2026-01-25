package com.example.myFitness.profile.model;

public enum HeightUnit {
    cm("cm"), 
    feet("feet");

    private String heightUnit;

    private HeightUnit(String heightUnit) {
        this.heightUnit = heightUnit;
    }

    public String  getHeightUnit() {
        return heightUnit;
    }

}
