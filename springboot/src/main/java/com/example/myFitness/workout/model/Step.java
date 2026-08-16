package com.example.myFitness.workout.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", include = JsonTypeInfo.As.PROPERTY, visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = RestStep.class, name = "REST"),
    @JsonSubTypes.Type(value = Set.class, name = "SET"),
    @JsonSubTypes.Type(value = SwimStep.class, name = "SWIM_DISTANCE"),
    @JsonSubTypes.Type(value = SwimStep.class, name = "SWIM_TIME"),
    @JsonSubTypes.Type(value = SwimStep.class, name = "SWIM_WARMUP"),
    @JsonSubTypes.Type(value = SwimStep.class, name = "SWIM_COOLDOWN"),
    @JsonSubTypes.Type(value = RunStep.class, name = "RUN_DISTANCE"),
    @JsonSubTypes.Type(value = RunStep.class, name = "RUN_TIME"),
    @JsonSubTypes.Type(value = RunStep.class, name = "RUN_CALORIES"),
    @JsonSubTypes.Type(value = RunStep.class, name = "RUN_WARMUP"),
    @JsonSubTypes.Type(value = RunStep.class, name = "RUN_COOLDOWN"),
    @JsonSubTypes.Type(value = GymStep.class, name = "GYM_EXERCISE"),
    @JsonSubTypes.Type(value = GymStep.class, name = "GYM_INTERVAL"),
    @JsonSubTypes.Type(value = GymStep.class, name = "GYM_WARMUP"),
    @JsonSubTypes.Type(value = GymStep.class, name = "GYM_COOLDOWN")
})
public abstract class Step {
    private StepType type;

    public StepType getType() {
        return type;
    }

    public void setType(StepType type) {
        this.type = type;
    }

    public Step() {
    }

    public Step(StepType type){
        this.type = type;
    }
}


