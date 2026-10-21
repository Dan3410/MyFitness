import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_DATA_ERROR_MESSAGE } from '../../../../const/errorMessages';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
import { ComponentTheme } from '../../../../models/componentTheme';
import MFButton from '../../../../components/mf-button/mf-button';
import type { Workout } from '../../../../models/workout';
import Step from '../../components/step/step';
import { workoutService } from '../../../../services/workoutService';
import styles from './workoutView.module.scss';

const WorkoutView: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadWorkout = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        setWorkout(await workoutService.getWorkoutSteps(id));
      } catch {
        setWorkout(undefined);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    void loadWorkout();
  }, [id]);

  if (loading) return <MFSpinner theme={ComponentTheme.workout} />;

  return (
    <div className={styles.workoutView}>
      <div className="pageHeader">
        <MFBreadcrumb items={[
          { label: 'Inicio', to: '/' },
          { label: 'Rutina' },
        ]} />
      </div>
      {loadError || !workout ? <p>{GET_DATA_ERROR_MESSAGE}</p> : <>
        <header className={styles.workoutHeader}>
          <p>{workout.category}</p>
          <div className={styles.titleRow}>
            <h1>{workout.name}</h1>
            {!workout.sourceTrainerName && (
              <MFButton
                theme={ComponentTheme.workout}
                onClickEvent={() => navigate(`/workout/edit/${workout.id}`)}
              >
                Editar
              </MFButton>
            )}
          </div>
          {workout.sourceTrainerName && <p className={styles.trainerAttribution}>Rutina asignada por {workout.sourceTrainerName}. No puedes editarla.</p>}
        </header>
        <section className={styles.steps}>
          <h2>Pasos del entrenamiento</h2>
          {workout.steps.length === 0 ? <p className={styles.emptyState}>Esta rutina todavía no tiene pasos.</p> :
            workout.steps.map((step, index) => (
              <div className={styles.step} key={`${step.type}-${index}`}>
                <Step step={step} workoutCategory={workout.category} />
              </div>
            ))}
        </section>
      </>}
    </div>
  );
};

export default WorkoutView;