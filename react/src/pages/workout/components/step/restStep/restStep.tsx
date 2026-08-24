import { FC } from 'react';
import styles from '../step.module.scss';
import { RestStep as RestStepType } from '../../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../../models/workoutCategories';
import { formatDuration } from '../../../utils/stepFormatters';

interface RestStepProps {
  step: RestStepType;
  workoutCategory: WorkoutCategory;
}

const RestStep: FC<RestStepProps> = ({ step, workoutCategory }) => {
  return (
    <div className={`${styles.stepCard} ${styles.step} ${styles.restStep} ${styles[`${workoutCategory}Step`]}`}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTitle}>Descanso</div>
        <div className={styles.stepLabel}>Descanso</div>
      </div>
      <div className={styles.stepDetail}>{formatDuration(step.seconds)}</div>
    </div>
  );
};

export default RestStep;
