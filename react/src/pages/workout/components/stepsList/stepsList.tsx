import { FC, useEffect, useState } from 'react';
import { WorkoutStep } from '../../../../models/workoutSteps';
import styles from './stepsList.module.scss';
import Step from '../step/step';
import { Workout } from '../../../../models/workout';

interface StepsListProps { 
  workout: Workout
}

const StepsList: FC<StepsListProps> = ({workout}) => {

  useEffect(() => {

  }, [])

  return (<>
    <div>
      {workout?.steps.map((step: WorkoutStep) => {
        return <Step step={step} workoutCategory={workout.category}></Step>
      })}

    </div>
  </>
  )
};

export default StepsList;
