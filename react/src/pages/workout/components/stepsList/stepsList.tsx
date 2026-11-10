import { FC } from 'react';
import { WorkoutStep } from '../../../../models/workoutSteps';
import styles from './stepsList.module.scss';
import Step from '../step/step';
import { Workout } from '../../../../models/workout';

interface StepsListProps {
  workout: Workout;
  selectedStepIndex: number | null;
  onSelectStep: (index: number) => void;
}

const StepsList: FC<StepsListProps> = ({ workout, selectedStepIndex, onSelectStep }) => {
  return (
    <div className={`${styles.StepsList} ${styles[`StepsList--${workout.category[0].toUpperCase()}${workout.category.slice(1)}`]}`}>
      <h3 className={styles.StepsList__SectionTitle}>Pasos del entrenamiento</h3>
      {workout.steps.length === 0 ? (
        <p className={styles.StepsList__EmptyState}>Todavía no hay pasos para editar.</p>
      ) : (
        workout.steps.map((step: WorkoutStep, index: number) => {
          const isSelected = selectedStepIndex === index;


          return (
            <div
              key={`${step.type}-${index}`}
              className={`${styles.StepsList__StepItem} ${isSelected ? styles['StepsList__StepItem--Selected'] : ''}`}
              onClick={() => onSelectStep(index)}
            >
              <Step step={step} workoutCategory={workout.category} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default StepsList;
