import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_DATA_ERROR_MESSAGE } from '../../../../const/errorMessages';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
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

  if (loading) return <MFSpinner theme="primary" />;

  return (
    <div className={styles.WorkoutView}>
      <div className="PageHeader">
        <MFBreadcrumb items={[
          { label: 'Inicio', to: '/' },
          { label: 'Rutina' },
        ]} />
      </div>
      {loadError || !workout ? <p>{GET_DATA_ERROR_MESSAGE}</p> : <>
        <header className={styles.WorkoutView__WorkoutHeader}>
          <p>{workout.category}</p>
          <div className={styles.WorkoutView__TitleRow}>
            <h1>{workout.name}</h1>
            {!workout.sourceTrainerName && (
              <MFButton
                theme="primary"
                onClickEvent={() => navigate(`/workout/edit/${workout.id}`)}
              >
                Editar
              </MFButton>
            )}
          </div>
          {workout.sourceTrainerName && <p className={styles.WorkoutView__TrainerAttribution}>Rutina asignada por {workout.sourceTrainerName}. No puedes editarla.</p>}
        </header>
        <section className={styles.WorkoutView__Steps}>
          <h2>Pasos del entrenamiento</h2>
          {workout.steps.length === 0 ? <p className={styles.WorkoutView__EmptyState}>Esta rutina todavía no tiene pasos.</p> :
            workout.steps.map((step, index) => (
              <div className={styles.WorkoutView__Step} key={`${step.type}-${index}`}>
                <Step step={step} workoutCategory={workout.category} />
              </div>
            ))}
        </section>
      </>}
    </div>
  );
};

export default WorkoutView;