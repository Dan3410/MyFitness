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
    <div className={`${styles.StepCard} ${styles.StepCard__Step} ${styles['StepCard--Gym']}`}>
      <div className={styles.StepCard__StepHeader}>
        <div>
          <div className={styles.StepCard__StepTitle}>{exerciseLabel}</div>
        </div>
        <div className={styles.StepCard__StepLabel}>{stepLabel}</div>
      </div>
      {step.description && <div className={styles.StepCard__StepDescription}>{step.description}</div>}
      <div className={styles.StepCard__StepDetail}>{detailText}</div>
    </div>
  );
};

export default GymStep;
