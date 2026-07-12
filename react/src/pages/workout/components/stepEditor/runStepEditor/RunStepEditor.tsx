import { FC } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import MFSelector from '../../../../../components/mf-selector/mf-selector';
import { ComponentTheme } from '../../../../../themes/enums';
import { RunStep, WorkoutStep, stepType } from '../../../../../models/workoutSteps';
import styles from './../stepEditor.module.scss';
import { CONST_RUN_STEP_TYPE_OPTIONS } from '../../../../../const/runStepTypeOptions';

interface RunStepEditorProps {
  step: RunStep;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const RunStepEditor: FC<RunStepEditorProps> = ({ step, onChange, onDelete }) => {
  return (
    <div className={styles.stepEditor}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Editar paso de carrera</h3>
        <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
        <MFSelector
          label="Tipo"
          theme={ComponentTheme.workout}
          options={CONST_RUN_STEP_TYPE_OPTIONS}
          value={step.type}
          onChange={(value) => onChange({ ...step, type: value as RunStep['type'] })}
        />

      <MFFormField theme={ComponentTheme.workout}>
        <label>Distancia</label>
        <input
          type="number"
          min="0"
          value={step.distance}
          onChange={(event) => onChange({ ...step, distance: Number(event.target.value) || 0 })}
        />
      </MFFormField>
      {step.type === stepType.RUNTIME ? (
        <>
          <MFFormField theme={ComponentTheme.workout}>
            <label>Tiempo</label>
            <input
              type="number"
              min="0"
              value={step.time ?? 0}
              onChange={(event) => onChange({ ...step, time: event.target.value === '' ? 0 : Number(event.target.value) })}
            />
          </MFFormField>
          <MFFormField theme={ComponentTheme.workout}>
            <label>Velocidad</label>
            <input
              type="number"
              min="0"
              value={step.speed ?? 0}
              onChange={(event) => onChange({ ...step, speed: event.target.value === '' ? 0 : Number(event.target.value) })}
            />
          </MFFormField>
        </>
      ) : null}
      {step.type === stepType.RUNCALORIES ? (
        <MFFormField theme={ComponentTheme.workout}>
          <label>Calorías</label>
          <input
            type="number"
            min="0"
            value={step.calories}
            onChange={(event) => onChange({ ...step, calories: Number(event.target.value) || 0 })}
          />
        </MFFormField>
      ) : null}
    </div>
  );
};

export default RunStepEditor;
