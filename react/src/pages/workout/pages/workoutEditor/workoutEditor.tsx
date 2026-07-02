import { FC, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutEditor.module.scss';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';
import MFButton from '../../../../components/mf-button/mf-button';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
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
    return <div>Cargando...</div>
  }else{
    const workoutTypeLabel = workout.category === 'swim'
      ? 'Entrenamiento de natación'
      : workout.category === 'gym'
        ? 'Entrenamiento de gimnasio'
        : workout.category === 'run'
          ? 'Entrenamiento de carrera'
          : 'Entrenamiento';

    return (<>
    <div className="pageHeader">
      <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Rutinas de Ejercicio', to: '/workout/list' }, { label: workout.name }]} />
      <h2 className={styles.title}>
        {`${workoutTypeLabel}: ${workout.name}`}
      </h2>
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
