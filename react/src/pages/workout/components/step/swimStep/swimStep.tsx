import { FC } from 'react';
import styles from './swimStep.module.scss';
import { SwimStep as SwimStepType, stepType } from '../../../../../models/workoutSteps';

interface SwimStepProps {
  step: SwimStepType;
}

const SwimStep: FC<SwimStepProps> = ({ step }) => {
  const title = step.stroke || 'Nadar';
  const label = step.type === stepType.SWIMTIME ? 'Por tiempo' : 'Por distancia';
  const detail = step.type === stepType.SWIMTIME
    ? `${step.time ?? 0} segundos`
    : `${step.distance ?? 0} m`;
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
