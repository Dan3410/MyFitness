import { FC } from 'react';
import styles from '../step.module.scss';
import { GymStep as GymStepType, StepType } from '../../../../../models/workoutSteps';
import { formatDuration } from '../../../utils/stepFormatters';

interface GymStepProps {
  step: GymStepType;
}

const GymStep: FC<GymStepProps> = ({ step }) => {
  const exerciseLabel = step.exercise;
  const stepLabel = step.type === StepType.GYMWARMUP
    ? 'Calentamiento'
    : step.type === StepType.GYMCOOLDOWN
      ? 'Ablande'
      : step.byTime ? 'Por tiempo' : 'Por repeticiones';
  const repetitionLabel = step.byTime ? formatDuration(step.time) : `${step.reps} repeticiones`;
  const detailText = step.weight
    ? `${repetitionLabel} - ${step.weight} kg`
    : repetitionLabel;

  return (
    <div className={`${styles.stepCard} ${styles.step} ${styles.gymStep}`}>
      <div className={styles.stepHeader}>
        <div>
          <div className={styles.stepTitle}>{exerciseLabel}</div>
        </div>
        <div className={styles.stepLabel}>{stepLabel}</div>
      </div>
      {step.description && <div className={styles.stepDescription}>{step.description}</div>}
      <div className={styles.stepDetail}>{detailText}</div>
    </div>
  );
};

export default GymStep;
