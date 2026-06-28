import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutEditor.module.scss';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';

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

  if(workout === undefined){
    return <div>Loading...</div>
  }else{
    const workoutTypeLabel = workout.category === 'swim'
      ? 'Swimming workout'
      : workout.category === 'gym'
        ? 'Gym workout'
        : workout.category === 'run'
          ? 'Running workout'
          : 'Workout';

    return (<>
    <h2 className={styles.title}>
      {`${workoutTypeLabel}: ${workout.name}`}
    </h2>
      <div>
        <div>
          <StepEditor></StepEditor>
        </div>
        <StepsList workout={workout}></StepsList>
  
      </div>
    </>
    )
  }
};

export default WorkoutEditor;
