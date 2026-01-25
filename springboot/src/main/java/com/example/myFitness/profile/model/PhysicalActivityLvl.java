package com.example.myFitness.profile.model;

public enum PhysicalActivityLvl {
    none("none"),
    low("low"),
    medium("medium"),
    high("high");

    private String physicalActivityLvl;

    private PhysicalActivityLvl(String physicalActivityLvl) {
        this.physicalActivityLvl = physicalActivityLvl;
    }

    public String  getPhysicalActivityLvl() {
        return physicalActivityLvl;
    }
}
