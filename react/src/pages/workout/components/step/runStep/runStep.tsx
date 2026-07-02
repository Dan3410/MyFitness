import { FC } from 'react';
import styles from './runStep.module.scss';
import { RunStep as RunStepType, stepType } from '../../../../../models/workoutSteps';

interface RunStepProps {
  step: RunStepType;
}

const RunStep: FC<RunStepProps> = ({ step }) => {
  const title = 'Correr';
  const label = step.type === stepType.RUNTIME
    ? 'Por tiempo'
    : step.type === stepType.RUNDISTANCE
      ? 'Por distancia'
      : 'Por calorías';
  const detail = step.type === stepType.RUNTIME
    ? `${step.time} segundos`
    : step.type === stepType.RUNDISTANCE
      ? `${step.distance} m`
      : `${step.calories} kcal`;

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div>
          <div className={styles.stepTitle}>{title}</div>
        </div>
        <div className={styles.stepLabel}>{label}</div>
      </div>
      <div className={styles.stepDetail}>{detail}</div>
      {step.speed !== null && step.speed !== undefined && (
        <div className={styles.stepDetail}>{`${step.speed} Km/h`}</div>
      )}
    </div>
  );
};

export default RunStep;
