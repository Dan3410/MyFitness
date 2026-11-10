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
    <div className={`${styles.StepCard} ${styles.StepCard__Step} ${styles['StepCard--Rest']} ${styles[`StepCard--${workoutCategory[0].toUpperCase()}${workoutCategory.slice(1)}`]}`}>
      <div className={styles.StepCard__StepHeader}>
        <div className={styles.StepCard__StepTitle}>Descanso</div>
        <div className={styles.StepCard__StepLabel}>Descanso</div>
      </div>
      {step.description && <div className={styles.StepCard__StepDescription}>{step.description}</div>}
      <div className={styles.StepCard__StepDetail}>{formatDuration(step.seconds)}</div>
    </div>
  );
};

export default RestStep;
