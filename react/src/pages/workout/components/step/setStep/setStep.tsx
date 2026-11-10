import { FC } from 'react';
import styles from '../step.module.scss';
import { WorkoutSet } from '../../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../../models/workoutCategories';
import Step from '../step';

interface SetStepProps {
  step: WorkoutSet;
  workoutCategory: WorkoutCategory;
}

const SetStep: FC<SetStepProps> = ({ step, workoutCategory }) => {
  return (
    <div className={`${styles.StepCard} ${styles['StepCard--Set']} ${styles[`StepCard--${workoutCategory[0].toUpperCase()}${workoutCategory.slice(1)}`]}`}>
      <div className={styles.StepCard__SetHeader}>
        <div className={styles.StepCard__StepLabel}>{`Repetir ${step.repeat}x`}</div>
      </div>
      {step.description && <div className={styles.StepCard__SetDescription}>{step.description}</div>}
      <div className={styles.StepCard__NestedSteps}>
        {step.steps.map((innerStep, index) => (
          <div key={`${innerStep.type}-${index}`} className={styles.StepCard__NestedStep}>
            <Step step={innerStep} workoutCategory={workoutCategory} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetStep;
