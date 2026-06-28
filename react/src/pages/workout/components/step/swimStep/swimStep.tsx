import { FC } from 'react';
import styles from './swimStep.module.scss';
import { SwimStep as SwimStepType, stepType } from '../../../../../models/workoutSteps';

interface SwimStepProps {
  step: SwimStepType;
}

const SwimStep: FC<SwimStepProps> = ({ step }) => {
  const title = step.stroke ? `${step.stroke}` : 'Swim';
  const label = step.type === stepType.SWIMTIME ? 'By time' : 'By distance';
  const detail = step.type === stepType.SWIMTIME
    ? `${step.time}s`
    : `${step.distance} m`;
  const gearText = step.gear.length > 0 ? step.gear.join(', ') : null;

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div>
          <div className={styles.stepTitle}>{title}</div>
        </div>
        <div className={styles.stepLabel}>{label}</div>
      </div>
      <div className={styles.stepDetail}>{detail}</div>
      {gearText && <div className={styles.stepDetail}>{gearText}</div>}
    </div>
  );
};

export default SwimStep;
