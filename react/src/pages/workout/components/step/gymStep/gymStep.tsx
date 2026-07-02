import { FC } from 'react';
import styles from './gymStep.module.scss';
import { GymStep as GymStepType } from '../../../../../models/workoutSteps';

interface GymStepProps {
  step: GymStepType;
}

const GymStep: FC<GymStepProps> = ({ step }) => {
  const exerciseLabel = step.exercise;
  const repetitionLabel = step.byTime ? `${step.time} segundos` : `${step.reps} repeticiones`;
  const detailText = step.weight
    ? `${repetitionLabel} - ${step.weight} kg`
    : repetitionLabel;

  return (
    <div className={`${styles.stepCard} ${styles.step}`}>
      <div className={styles.stepHeader}>
        <div>
          <div className={styles.stepTitle}>{exerciseLabel}</div>
        </div>
        <div className={styles.stepLabel}>{step.byTime ? 'Por tiempo' : 'Por repeticiones'}</div>
      </div>
      <div className={styles.stepDetail}>{detailText}</div>
    </div>
  );
};

export default GymStep;
