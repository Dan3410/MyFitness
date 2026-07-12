import { FC, useMemo, useState } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import { ComponentTheme } from '../../../../../themes/enums';
import { WorkoutSet, WorkoutStep } from '../../../../../models/workoutSteps';
import styles from './../stepEditor.module.scss';
import StepEditor from '../stepEditor';
import { getStepLabel } from '../stepEditorUtils';

interface SetStepEditorProps {
  step: WorkoutSet;
  workoutCategory: string;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const SetStepEditor: FC<SetStepEditorProps> = ({ step, workoutCategory, onChange, onDelete }) => {
  const [selectedNestedIndex, setSelectedNestedIndex] = useState<number | null>(step.steps.length > 0 ? 0 : null);

  const selectedNestedStep = useMemo(() => {
    if (selectedNestedIndex === null) {
      return null;
    }

    return step.steps[selectedNestedIndex] ?? null;
  }, [selectedNestedIndex, step.steps]);

  const updateNestedStep = (index: number, updatedNestedStep: WorkoutStep) => {
    const nextSteps = [...step.steps];
    nextSteps[index] = updatedNestedStep;
    onChange({ ...step, steps: nextSteps });
  };

  const removeNestedStep = (index: number) => {
    const nextSteps = step.steps.filter((_, currentIndex) => currentIndex !== index);
    onChange({ ...step, steps: nextSteps });
    setSelectedNestedIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      if (currentIndex >= nextSteps.length) {
        return Math.max(nextSteps.length - 1, 0);
      }

      return currentIndex;
    });
  };

  return (
    <div className={styles.stepEditor}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Editar set</h3>
        <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
      <MFFormField theme={ComponentTheme.workout}>
        <label>Repeticiones</label>
        <input
          type="number"
          min="1"
          value={step.repeat}
          onChange={(event) => onChange({ ...step, repeat: Number(event.target.value) || 1 })}
        />
      </MFFormField>
      <div className={styles.nestedSection}>
        <div className={styles.nestedHeader}>
          <h4 className={styles.subTitle}>Pasos dentro del set</h4>
        </div>
        {step.steps.length === 0 ? (
          <p className={styles.helperText}>Este set aún no tiene pasos anidados.</p>
        ) : (
          <div className={styles.nestedList}>
            {step.steps.map((nestedStep, index) => (
              <button
                key={`${nestedStep.type}-${index}`}
                type="button"
                className={`${styles.nestedStepButton} ${selectedNestedIndex === index ? styles.selectedNested : ''}`}
                onClick={() => setSelectedNestedIndex(index)}
              >
                <span className={styles.nestedStepIndex}>{index + 1}</span>
                <span>{getStepLabel(nestedStep)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedNestedStep ? (
        <div className={styles.nestedEditor}>
          <StepEditor
            step={selectedNestedStep}
            workoutCategory={workoutCategory}
            onChange={(updatedNestedStep) => updateNestedStep(selectedNestedIndex!, updatedNestedStep)}
            onDelete={() => removeNestedStep(selectedNestedIndex!)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SetStepEditor;
