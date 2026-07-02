import { FC } from 'react';
import styles from './restStep.module.scss';
import { RestStep as RestStepType } from '../../../../../models/workoutSteps';

interface RestStepProps {
  step: RestStepType;
}

const RestStep: FC<RestStepProps> = ({ step }) => {
  return (
    <div className={`${styles.stepCard} ${styles.step}`}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTitle}>Descanso</div>
        <div className={styles.stepLabel}>Descanso</div>
      </div>
      <div className={styles.stepDetail}>{`${step.seconds} segundos`}</div>
    </div>
  );
};

export default RestStep;
