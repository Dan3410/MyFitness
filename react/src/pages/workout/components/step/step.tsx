import { FC } from 'react';
import {
  GymStep as GymStepType,
  RunStep as RunStepType,
  stepType,
  SwimStep as SwimStepType,
  WorkoutSet,
  RestStep as RestStepType,
  WorkoutStep,
} from '../../../../models/workoutSteps';
import GymStep from './gymStep/gymStep';
import SwimStep from './swimStep/swimStep';
import RunStep from './runStep/runStep';
import RestStep from './restStep/restStep';
import SetStep from './setStep/setStep';

interface StepProps {
  workoutCategory: string;
  step: WorkoutStep;
}

const Step: FC<StepProps> = ({ workoutCategory, step }) => {
  if (step.type === stepType.SET) {
    return <SetStep step={step as WorkoutSet} workoutCategory={workoutCategory} />;
  }
  if (step.type === stepType.REST) {
    return <RestStep step={step as RestStepType} />;
  }

  switch (workoutCategory) {
    case 'gym':
      return <GymStep step={step as GymStepType} />;
    case 'swim':
      return <SwimStep step={step as SwimStepType} />;
    case 'run':
      return <RunStep step={step as RunStepType} />;
    default:
      return null;
  }
};

export default Step;

