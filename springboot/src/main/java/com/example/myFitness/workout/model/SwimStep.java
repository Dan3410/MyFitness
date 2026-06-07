package com.example.myFitness.workout.model;

import java.util.List;

    public class SwimStep extends Step {
        private Integer distance; // nullable
        private Integer time;     // nullable
        private List<SwimGear> gear;

    // No-argument constructor
        public SwimStep() {}

        // Parameterized constructor
        public SwimStep(StepType type, Integer distance, Integer time, List<SwimGear> gear) {
            setType(type);
            this.distance = distance;
            this.time = time;
            this.gear = gear;
            
        }

        // Getter and Setter for distance
        public Integer getDistance() {
            return distance;
        }

        public void setDistance(Integer distance) {
            this.distance = distance;
        }

        // Getter and Setter for time
        public Integer getTime() {
            return time;
        }

        public void setTime(Integer time) {
            this.time = time;
        }

        // Getter and Setter for gear
        public List<SwimGear> getGear() {
            return gear;
        }

        public void setGear(List<SwimGear> gear) {
            this.gear = gear;
        }
    }