import { FC } from 'react';
import {
  GymStep as GymStepType,
  RunStep as RunStepType,
  StepType,
  SwimStep as SwimStepType,
  WorkoutSet,
  RestStep as RestStepType,
  WorkoutStep,
} from '../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import GymStep from './gymStep/gymStep';
import SwimStep from './swimStep/swimStep';
import RunStep from './runStep/runStep';
import RestStep from './restStep/restStep';
import SetStep from './setStep/setStep';

interface StepProps {
  workoutCategory: WorkoutCategory;
  step: WorkoutStep;
}

const Step: FC<StepProps> = ({ workoutCategory, step }) => {
  if (step.type === StepType.SET) {
    return <SetStep step={step as WorkoutSet} workoutCategory={workoutCategory} />;
  }
  if (step.type === StepType.REST) {
    return <RestStep step={step as RestStepType} workoutCategory={workoutCategory} />;
  }

  switch (workoutCategory) {
    case WorkoutCategory.GYM:
      return <GymStep step={step as GymStepType} />;
    case WorkoutCategory.SWIM:
      return <SwimStep step={step as SwimStepType} />;
    case WorkoutCategory.RUN:
      return <RunStep step={step as RunStepType} />;
    default:
      return null;
  }
};

export default Step;

