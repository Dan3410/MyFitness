import { FC } from 'react';
import { GymStep, RunStep, stepType, SwimStep, WorkoutStep } from '../../../../models/workoutSteps';

interface StepProps {
  workoutCategory: string;
  step: WorkoutStep;
}

const Step: FC<StepProps> = ({ workoutCategory, step }) => {
  function workoutHTML() {
    switch (workoutCategory) {
      case 'gym': {
        const gymStep = step as GymStep;
        return (
          <>
            <div>{gymStep.type}</div>
            {gymStep.type === stepType.EXERCISE && <div>{gymStep.exercise}</div>}
            <div>{gymStep.byTime ? `${gymStep.time}s` : `${gymStep.reps} reps`}</div>
            {gymStep.type === stepType.EXERCISE && <div>{gymStep.weight}</div>}
          </>
        );
      }

      case 'swim': {
        const swimStep = step as SwimStep;
        return (
          <>
            <div>{swimStep.type}</div>
            <div>
              {swimStep.type === stepType.SWIMTIME
                ? `${swimStep.time}s`
                : `${swimStep.distance} m`}
            </div>
            <div>
              {swimStep.gear.map((gear) => (
                <div key={gear}>{gear}</div>
              ))}
            </div>
          </>
        );
      }

      case 'run': {
        const runStep = step as RunStep;
        return (
          <>
            <div>{runStep.type}</div>
            <div>
              {runStep.type === stepType.RUNTIME
                ? `${runStep.time}s`
                : runStep.type === stepType.RUNDISTANCE
                  ? `${runStep.distance} m`
                  : `${runStep.calories} kcal`}
            </div>
            {runStep.speed !== null && runStep.speed !== undefined && (
              <div>{runStep.speed} Km/h</div>
            )}
          </>
        );
      }

      default:
        return null;
    }
  }

  return <>{workoutHTML()}</>;
};

export default Step;
