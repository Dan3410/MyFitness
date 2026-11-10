import { FC } from 'react';
import styles from '../step.module.scss';
import { RunStep as RunStepType, StepType } from '../../../../../models/workoutSteps';
import { formatDistance, formatDuration } from '../../../utils/stepFormatters';

interface RunStepProps {
  step: RunStepType;
}

const RunStep: FC<RunStepProps> = ({ step }) => {
  const title = 'Correr';
  const label = step.type === StepType.RUNTIME
    ? 'Por tiempo'
    : step.type === StepType.RUNDISTANCE
      ? 'Por distancia'
      : step.type === StepType.RUNCALORIES
        ? 'Por calorías'
        : step.type === StepType.RUNWARMUP
          ? 'Calentamiento'
          : 'Ablande';
  const detail = step.type === StepType.RUNTIME
    ? formatDuration(step.time)
    : step.type === StepType.RUNDISTANCE
      ? formatDistance(step.distance)
      : `${step.calories} kcal`;

  return (
    <div className={`${styles.StepCard} ${styles['StepCard--Run']}`}>
      <div className={styles.StepCard__StepHeader}>
        <div>
          <div className={styles.StepCard__StepTitle}>{title}</div>
        </div>
        <div className={styles.StepCard__StepLabel}>{label}</div>
      </div>
      {step.description && <div className={styles.StepCard__StepDescription}>{step.description}</div>}
      <div className={styles.StepCard__StepDetail}>{detail}</div>
      {step.speed !== null && step.speed !== undefined && (
        <div className={styles.StepCard__StepDetail}>{`${step.speed} Km/h`}</div>
      )}
    </div>
  );
};

export default RunStep;
