import { FC } from 'react';
import styles from './runStep.module.scss';
import { RunStep as RunStepType, stepType } from '../../../../../models/workoutSteps';

interface RunStepProps {
  step: RunStepType;
}

const RunStep: FC<RunStepProps> = ({ step }) => {
  const title = 'Run';
  const label = step.type === stepType.RUNTIME
    ? 'By time'
    : step.type === stepType.RUNDISTANCE
      ? 'By distance'
      : 'By calories';
  const detail = step.type === stepType.RUNTIME
    ? `${step.time}s`
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
