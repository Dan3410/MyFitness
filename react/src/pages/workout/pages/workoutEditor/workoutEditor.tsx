import { FC, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import {
  WorkoutStep,
  WorkoutSet,
  GymStep,
  RunStep,
  SwimStep,
  RestStep,
  StepType,
  SwimStroke,
} from '../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import MFButton from '../../../../components/mf-button/mf-button';
import { ComponentTheme } from '../../../../themes/enums';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutEditor.module.scss';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import MFModal from '../../../../components/mf-modal/mf-modal';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {
  const [workout, setWorkout] = useState<Workout | undefined>();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useParams().id;
  const [searchParams] = useSearchParams();
  const navigate: NavigateFunction = useNavigate();

  const getWorkout = async () => {
    if (!id) {
      return;
    }

    if (id === 'new') {
      const categoryFromQuery = searchParams.get('category');
      const category = Object.values(WorkoutCategory).includes(categoryFromQuery as WorkoutCategory)
        && categoryFromQuery !== WorkoutCategory.ALL
        ? categoryFromQuery as WorkoutCategory
        : WorkoutCategory.GYM;

      setWorkout({
        id: '',
        name: 'Nueva rutina',
        category,
        steps: []
      });
      setSelectedStepIndex(null);
      return;
    }

    const res = await workoutService.getWorkoutSteps(id);
    setWorkout(res);
    setSelectedStepIndex(res?.steps?.length ? 0 : null);
  };

  useEffect(() => {
    void getWorkout();
  }, [id, searchParams]);

  const updateSelectedStep = (updatedStep: WorkoutStep) => {
    if (workout === undefined || selectedStepIndex === null) {
      return;
    }

    const nextSteps = [...workout.steps];
    nextSteps[selectedStepIndex] = updatedStep;
    setWorkout({ ...workout, steps: nextSteps });
  };

  const addSet = () => {
    if (!workout) return;

    const newSet: WorkoutSet = { type: StepType.SET, repeat: 1, steps: [] };
    const nextSteps = [...workout.steps, newSet];
    setWorkout({ ...workout, steps: nextSteps });
    setSelectedStepIndex(nextSteps.length - 1);
  };

  const addExercise = () => {
    if (!workout) return;

    let newStep: WorkoutStep;

    if (workout.category === WorkoutCategory.GYM) {
      newStep = { type: StepType.EXERCISE, exercise: '', byTime: false, reps: 10, time: 0, weight: 0 } as GymStep;
    } else if (workout.category === WorkoutCategory.SWIM) {
      newStep = { type: StepType.SWIMDISTANCE, distance: 0, time: 0, gear: [], stroke: SwimStroke.CHOICE } as SwimStep;
    } else if (workout.category === WorkoutCategory.RUN) {
      newStep = { type: StepType.RUNDISTANCE, distance: 0, calories: 0, time: 0, speed: 0 } as RunStep;
    } else {
      newStep = { type: StepType.REST, seconds: 30 };
    }

    const nextSteps = [...workout.steps, newStep];
    setWorkout({ ...workout, steps: nextSteps });
    setSelectedStepIndex(nextSteps.length - 1);
  };

  const addRestStep = () => {
    if (!workout) return;

    const newStep: RestStep = { type: StepType.REST, seconds: 30 };
    const nextSteps = [...workout.steps, newStep];
    setWorkout({ ...workout, steps: nextSteps });
    setSelectedStepIndex(nextSteps.length - 1);
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

  const saveWorkout = async () => {
    if (!workout) return;
    setSaving(true);
    try {
      const payload = {
        ...workout,
        name: workout.name.trim() || 'Nueva rutina',
        category: workout.category || WorkoutCategory.GYM
      };

      const currentWorkoutId = id ?? 'new';
      const res = currentWorkoutId === 'new'
        ? await workoutService.createWorkout('0', payload)
        : await workoutService.editWorkout(currentWorkoutId, payload);

      if (res && res.id) {
        setWorkout(res);
      }

      setSaved(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al guardar la rutina';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setSaved(false);
    navigate('/workout/list');
  };

  const handleErrorClose = () => {
    setError(null);
  };

  if (workout === undefined) {
    return <div>Cargando...</div>;
  }

  const workoutTypeLabel = workout.category === WorkoutCategory.SWIM
    ? 'Entrenamiento de natación'
    : workout.category === WorkoutCategory.GYM
      ? 'Entrenamiento de gimnasio'
      : workout.category === WorkoutCategory.RUN
        ? 'Entrenamiento de carrera'
        : 'Entrenamiento';

  const selectedStep = selectedStepIndex === null ? null : workout.steps[selectedStepIndex] ?? null;

  return (
    <div className={styles.editorPage}>
      <div className="pageHeader">
        <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Rutinas de Ejercicio', to: '/workout/list' }, { label: workout.name }]} />
        <div className={styles.nameEditor}>
          <MFFormField theme={ComponentTheme.workout}>
            <label>Nombre de la rutina</label>
            <input
              type="text"
              value={workout.name}
              onChange={(event) => setWorkout({ ...workout, name: event.target.value })}
              placeholder="Escribe el nombre de la rutina"
            />
          </MFFormField>
        </div>
        <h2 className={styles.title}>
          {`${workoutTypeLabel}: ${workout.name || 'Nueva rutina'}`}
        </h2>

      </div>

      <div className={styles.editorLayout}>
        <div className={styles.stepsColumn}>
          <StepsList
            workout={workout}
            selectedStepIndex={selectedStepIndex}
            onSelectStep={setSelectedStepIndex}
          />
          <div className={styles.stepsActions}>
            <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={addSet}>Agregar set</MFButton>
            <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={addExercise}>Agregar ejercicio</MFButton>
            <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={addRestStep}>Agregar descanso</MFButton>
          </div>
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
      <div className='footerActions'>
        <MFButton theme={ComponentTheme.generic} type="button" isDisabled={saving} onClickEvent={saveWorkout}>
          {saving ? 'Guardando...' : 'Guardar'}
        </MFButton>
      </div>
      <MFModal isOpen={saved} onClose={handleModalClose}>
        <h2>Guardado con éxito</h2>
        <div className={styles.successMessage}>La rutina de ejercicio ha sido guardada con éxito.</div>
      </MFModal>
      <MFModal isOpen={!!error} onClose={handleErrorClose}>
        <h2>Error</h2>
        <div className={styles.errorMessage}>{error}</div>
      </MFModal>
    </div>
  );
};

export default WorkoutEditor;
