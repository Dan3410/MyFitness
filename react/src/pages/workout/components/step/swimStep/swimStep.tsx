import { FC } from 'react';
import styles from '../step.module.scss';
import { SwimStep as SwimStepType, StepType } from '../../../../../models/workoutSteps';
import { formatDistance, formatDuration } from '../../../utils/stepFormatters';

interface SwimStepProps {
  step: SwimStepType;
}

const SwimStep: FC<SwimStepProps> = ({ step }) => {
  const title = step.stroke || 'Nadar';
  const label = step.type === StepType.SWIMWARMUP
    ? 'Calentamiento'
    : step.type === StepType.SWIMCOOLDOWN
      ? 'Ablande'
      : step.type === StepType.SWIMTIME ? 'Por tiempo' : 'Por distancia';
  const detail = step.type === StepType.SWIMTIME
    ? formatDuration(step.time)
    : formatDistance(step.distance);
  const gearText = step.gear.length > 0 ? step.gear.join(', ') : null;

  return (
    <div className={`${styles.stepCard} ${styles.swimStep}`}>
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
