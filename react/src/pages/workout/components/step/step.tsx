import { FC } from 'react';
import styles from './step.module.scss';
import {
  GymStep,
  RunStep,
  stepType,
  SwimStep,
  WorkoutSet,
  RestStep,
  WorkoutStep,
} from '../../../../models/workoutSteps';

interface StepProps {
  workoutCategory: string;
  step: WorkoutStep;
}

const Step: FC<StepProps> = ({ workoutCategory, step }) => {
  const renderSetStep = (setStep: WorkoutSet) => {
    console.log(setStep)
    return (
      <div className={`${styles.stepCard} ${styles.setStep}`}>
        <div className={styles.setHeader}>
          <div />
          <div className={styles.stepLabel}>{`Repeat ${setStep.repeat}x`}</div>
        </div>
        <div className={styles.nestedSteps}>
          {setStep.steps.map((innerStep, index) => (
            console.log(innerStep),
            <div key={`${innerStep.type}-${index}`} className={styles.nestedStep}>
              <Step step={innerStep} workoutCategory={workoutCategory} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRestStep = (restStep: RestStep) => {
    return (
      <div className={`${styles.stepCard} ${styles.gymStep}`}>
        <div className={styles.stepHeader}>
          <div className={styles.stepTitle}>{restStep.type}</div>
          <div className={styles.stepLabel}>Rest</div>
        </div>
        <div className={styles.stepDetail}>{`${restStep.seconds} seconds`}</div>
      </div>
    );
  };

  const renderGymStep = (currentStep: GymStep) => {
    const exerciseLabel = currentStep.exercise;
    const repetitionLabel = currentStep.byTime ? `${currentStep.time}s` : `${currentStep.reps} reps`;
    const detailText = currentStep.weight
      ? `${repetitionLabel} - ${currentStep.weight} kg`
      : repetitionLabel;

    return (
      <div className={`${styles.stepCard} ${styles.gymStep}`}>
        <div className={styles.stepHeader}>
          <div>
            <div className={styles.stepTitle}>{exerciseLabel}</div>
          </div>
          <div className={styles.stepLabel}>{currentStep.byTime ? 'By time' : 'By reps'}</div>
        </div>
        <div className={styles.stepDetail}>{detailText}</div>
      </div>
    );
  };

  const workoutHTML = () => {
    if (step.type === stepType.SET) {
      return renderSetStep(step as WorkoutSet);
    }
    if (step.type === stepType.REST) {
      return renderRestStep(step as RestStep);
    }

    switch (workoutCategory) {
      case 'gym':
        return renderGymStep(step as GymStep);
      case 'swim': {
        const swimStep = step as SwimStep;
        const title = swimStep.stroke ? `${swimStep.stroke}` : 'Swim';
        const label = swimStep.type === stepType.SWIMTIME ? 'By time' : 'By distance';
        const detail = swimStep.type === stepType.SWIMTIME
          ? `${swimStep.time}s`
          : `${swimStep.distance} m`;
        const gearText = swimStep.gear.length > 0 ? swimStep.gear.join(', ') : null;

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
      }
      case 'run': {
        const runStep = step as RunStep;
        const title = 'Run';
        const label = runStep.type === stepType.RUNTIME
          ? 'By time'
          : runStep.type === stepType.RUNDISTANCE
            ? 'By distance'
            : 'By calories';
        const detail = runStep.type === stepType.RUNTIME
          ? `${runStep.time}s`
          : runStep.type === stepType.RUNDISTANCE
            ? `${runStep.distance} m`
            : `${runStep.calories} kcal`;

        return (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div>
                <div className={styles.stepTitle}>{title}</div>
              </div>
              <div className={styles.stepLabel}>{label}</div>
            </div>
            <div className={styles.stepDetail}>{detail}</div>
            {runStep.speed !== null && runStep.speed !== undefined && (
              <div className={styles.stepDetail}>{`${runStep.speed} Km/h`}</div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <>{workoutHTML()}</>;
};

export default Step;
