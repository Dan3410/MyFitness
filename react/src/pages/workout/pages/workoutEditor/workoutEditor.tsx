import { FC, useEffect, useState } from 'react';
import styles from './workoutEditor.module.scss';
import { useParams, useSearchParams } from 'react-router-dom';
import Step from '../../components/step/step';
import { Workout } from '../../../../models/workout';
import { workoutService } from '../../../../services/workoutService';
import { gymStep, runStep, set, swimStep } from '../../../../models/workoutSteps';
import StepEditor from '../../components/stepEditor/stepEditor';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {

  const [workout, setWorkout] = useState<Workout>()
  const id = useParams().id

  const getWorkout = async () => {
    const res = await workoutService.getWorkoutSteps(id!);
    setWorkout(res)
  }

  useEffect(() => {
    getWorkout()

  }, [])

  return (<>
  <div>
    <div>
      <StepEditor></StepEditor>
    </div>
    <div>
      {workout?.steps.map((step: set | gymStep | swimStep | runStep) => {
        return <Step step={step} workoutCategory={workout.category}></Step>
      })}
      
    </div>
  </div>
  </>
  )
};

export default WorkoutEditor;
