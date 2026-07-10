import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import { WorkoutStep } from '../../../../models/workoutSteps';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutEditor.module.scss';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {
  const [workout, setWorkout] = useState<Workout | undefined>();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const id = useParams().id;

  const getWorkout = async () => {
    if (!id) {
      return;
    }

    const res = await workoutService.getWorkoutSteps(id);
    setWorkout(res);
    setSelectedStepIndex(res?.steps?.length ? 0 : null);
  };

  useEffect(() => {
    void getWorkout();
  }, [id]);

  const updateSelectedStep = (updatedStep: WorkoutStep) => {
    if (workout === undefined || selectedStepIndex === null) {
      return;
    }

    const nextSteps = [...workout.steps];
    nextSteps[selectedStepIndex] = updatedStep;
    setWorkout({ ...workout, steps: nextSteps });
  };

  const deleteSelectedStep = () => {
    if (workout === undefined || selectedStepIndex === null) {
      return;
    }

    const nextSteps = workout.steps.filter((_, index) => index !== selectedStepIndex);
    const nextIndex = selectedStepIndex >= nextSteps.length ? Math.max(nextSteps.length - 1, 0) : selectedStepIndex;

    setWorkout({ ...workout, steps: nextSteps });
    setSelectedStepIndex(nextSteps.length > 0 ? nextIndex : null);
  };

  if (workout === undefined) {
    return <div>Cargando...</div>;
  }

  const workoutTypeLabel = workout.category === 'swim'
    ? 'Entrenamiento de natación'
    : workout.category === 'gym'
      ? 'Entrenamiento de gimnasio'
      : workout.category === 'run'
        ? 'Entrenamiento de carrera'
        : 'Entrenamiento';

  const selectedStep = selectedStepIndex === null ? null : workout.steps[selectedStepIndex] ?? null;

  return (
    <>
      <div className="pageHeader">
        <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Rutinas de Ejercicio', to: '/workout/list' }, { label: workout.name }]} />
        <h2 className={styles.title}>
          {`${workoutTypeLabel}: ${workout.name}`}
        </h2>
      </div>
      <div className={styles.editorLayout}>
        <div className={styles.stepsColumn}>
          <StepsList
            workout={workout}
            selectedStepIndex={selectedStepIndex}
            onSelectStep={setSelectedStepIndex}
          />
        </div>
        <div className={styles.editorColumn}>
          <StepEditor
            step={selectedStep}
            workoutCategory={workout.category}
            onChange={updateSelectedStep}
            onDelete={deleteSelectedStep}
          />
        </div>
      </div>
    </>
  );
};

export default WorkoutEditor;
