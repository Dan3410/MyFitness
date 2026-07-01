import { FC } from 'react';
import styles from './setStep.module.scss';
import { WorkoutSet } from '../../../../../models/workoutSteps';
import Step from '../step';

interface SetStepProps {
  step: WorkoutSet;
  workoutCategory: string;
}

const SetStep: FC<SetStepProps> = ({ step, workoutCategory }) => {
  return (
    <div className={`${styles.stepCard} ${styles.setStep}`}>
      <div className={styles.setHeader}>
        <div className={styles.stepLabel}>{`Repeat ${step.repeat}x`}</div>
      </div>
      <div className={styles.nestedSteps}>
        {step.steps.map((innerStep, index) => (
          <div key={`${innerStep.type}-${index}`} className={styles.nestedStep}>
            <Step step={innerStep} workoutCategory={workoutCategory} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetStep;
