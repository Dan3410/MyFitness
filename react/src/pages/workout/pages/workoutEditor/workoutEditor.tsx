import { FC, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutEditor.module.scss';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';
import MFButton from '../../../../components/mf-button/mf-button';
import { ComponentTheme } from '../../../../themes/enums';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {

  const [workout, setWorkout] = useState<Workout>()
  const id = useParams().id
  const navigate: NavigateFunction = useNavigate();

  const goBack = () => {
    navigate('/workout/list');
  }

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
    <div className="pageHeader">
      <h2 className={styles.title}>
        {`${workoutTypeLabel}: ${workout.name}`}
      </h2>
      <MFButton theme={ComponentTheme.generic} onClickEvent={goBack}><label>Volver</label></MFButton>
    </div>
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
