import { FC, useEffect, useState } from 'react';
import {
  GymStep,
  RunStep,
  RestStep,
  SwimStep,
  WorkoutSet,
  WorkoutStep,
  StepType,
} from '../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import styles from './stepEditor.module.scss';
import RestStepEditor from './restStepEditor/RestStepEditor';
import SetStepEditor from './setStepEditor/SetStepEditor';
import SwimStepEditor from './swimStepEditor/SwimStepEditor';
import RunStepEditor from './runStepEditor/RunStepEditor';
import GymStepEditor from './gymStepEditor/GymStepEditor';

interface StepEditorProps {
  step: WorkoutStep | null;
  workoutCategory: WorkoutCategory;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const StepEditor: FC<StepEditorProps> = ({ step, workoutCategory, onChange, onDelete }) => {
  const [selectedNestedIndex, setSelectedNestedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (step && step.type === StepType.SET) {
      const setStep = step as WorkoutSet;
      if (setStep.steps.length > 0 && (selectedNestedIndex === null || selectedNestedIndex >= setStep.steps.length)) {
        setSelectedNestedIndex(0);
      }
    } else {
      setSelectedNestedIndex(null);
    }
  }, [step, selectedNestedIndex]);

  if (!step) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>Editar paso</h3>
        <p className={styles.emptyText}>Selecciona un paso de la lista para ver y modificar sus datos.</p>
      </div>
    );
  }

  const updateStep = (updatedStep: WorkoutStep) => {
    onChange(updatedStep);
  };

  if (step.type === StepType.REST) {
    return <RestStepEditor step={step as RestStep} onChange={updateStep} onDelete={onDelete} />;
  }

  if (step.type === StepType.SET) {
    return <SetStepEditor step={step as WorkoutSet} workoutCategory={workoutCategory} onChange={updateStep} onDelete={onDelete} />;
  }

  if (step.type === StepType.SWIMWARMUP || step.type === StepType.SWIMCOOLDOWN) {
    return <SwimStepEditor step={step as SwimStep} onChange={updateStep} onDelete={onDelete} />;

  }
  if (step.type === StepType.RUNWARMUP || step.type === StepType.RUNCOOLDOWN) {
    return <RunStepEditor step={step as RunStep} onChange={updateStep} onDelete={onDelete} />;
  }

  if (step.type === StepType.GYMWARMUP || step.type === StepType.GYMCOOLDOWN) {
    return <GymStepEditor step={step as GymStep} workoutCategory={workoutCategory} onChange={updateStep} onDelete={onDelete} />;
  }

  if (step.type === StepType.SWIMDISTANCE || step.type === StepType.SWIMTIME) {
    return <SwimStepEditor step={step as SwimStep} onChange={updateStep} onDelete={onDelete} />;
  }

  if (step.type === StepType.RUNDISTANCE || step.type === StepType.RUNTIME || step.type === StepType.RUNCALORIES) {
    return <RunStepEditor step={step as RunStep} onChange={updateStep} onDelete={onDelete} />;
  }

  return <GymStepEditor step={step as GymStep} workoutCategory={workoutCategory} onChange={updateStep} onDelete={onDelete} />;
};


export default StepEditor;
