import { FC, useEffect, useState } from 'react';
import styles from './step.module.scss';
import { gymStep, runStep, stepType, swimGear, swimStep } from '../../../../models/workoutSteps';

interface StepProps {
  workoutType: string
  step: gymStep | swimStep | runStep
}

const Step: FC<StepProps> = ({
  workoutType,
  step
}) => {

  useEffect(() => {

  }, [])

  function workoutHTML() {
    switch (workoutType) {
      case "gym":
        let gymStep = step as gymStep
        return (
          <>
            <div>{gymStep.type}</div>
            {gymStep.type == stepType.EXERCISE && <div>{gymStep.exercise}</div>}
            <div>{gymStep.byTime ? gymStep.time + "s" : gymStep.reps + " reps"}</div>
            {gymStep.type == stepType.EXERCISE && <div>{gymStep.weight}</div>}
          </>
        );

      case "swim":
        let swimStep = step as swimStep
        return (
          <>
            <div>{swimStep.type}</div>
            <div>{swimStep.type == stepType.REST || swimStep.type == stepType.SWIMTIME ? swimStep.time + "s" : swimStep.distance + " m"}</div>
            {swimStep.type != stepType.REST && <div>{swimStep.gear.map((gear: swimGear) => <div>{gear}</div>)}</div>}
          </>
        );

      case "run":
        let runStep = step as runStep
        return (
          <>
            <div>{runStep.type}</div>
            <div>{runStep.type == stepType.REST || runStep.type == stepType.RUNTIME ? runStep.time + "s"
              : runStep.type == stepType.RUNDISTANCE ? runStep.distance + " m"
                : runStep.calories + "kcal"}</div>
            {runStep.speed && <div>{runStep.speed} Km/h</div>}
          </>
        );
    }
  }


  return (<>
    {
      workoutHTML()
    }
  </>
  )
};

export default Step;
