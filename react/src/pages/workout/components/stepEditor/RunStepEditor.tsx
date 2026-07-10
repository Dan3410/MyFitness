import { FC } from 'react';
import MFButton from '../../../../components/mf-button/mf-button';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { ComponentTheme } from '../../../../themes/enums';
import { RunStep, WorkoutStep, stepType } from '../../../../models/workoutSteps';
import styles from './stepEditor.module.scss';

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
      <MFFormField theme={ComponentTheme.workout}>
        <label>Tipo</label>
        <select
          value={step.type}
          onChange={(event) => onChange({ ...step, type: event.target.value as RunStep['type'] })}
        >
          <option value={stepType.RUNDISTANCE}>Distancia</option>
          <option value={stepType.RUNTIME}>Tiempo</option>
          <option value={stepType.RUNCALORIES}>Calorías</option>
          <option value={stepType.WARMUP}>Calentamiento</option>
          <option value={stepType.COOLDOWN}>Enfriamiento</option>
        </select>
      </MFFormField>
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
