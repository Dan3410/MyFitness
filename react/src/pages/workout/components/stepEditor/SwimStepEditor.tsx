import { FC } from 'react';
import MFButton from '../../../../components/mf-button/mf-button';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { ComponentTheme } from '../../../../themes/enums';
import { SwimStep, SwimStroke, WorkoutStep, stepType, swimGear } from '../../../../models/workoutSteps';
import styles from './stepEditor.module.scss';

interface SwimStepEditorProps {
  step: SwimStep;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const SwimStepEditor: FC<SwimStepEditorProps> = ({ step, onChange, onDelete }) => {
  return (
    <div className={styles.stepEditor}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Editar paso de natación</h3>
        <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
      <MFFormField theme={ComponentTheme.workout}>
        <label>Tipo</label>
        <select
          value={step.type}
          onChange={(event) => onChange({ ...step, type: event.target.value as SwimStep['type'] })}
        >
          <option value={stepType.SWIMDISTANCE}>Distancia</option>
          <option value={stepType.SWIMTIME}>Tiempo</option>
          <option value={stepType.WARMUP}>Calentamiento</option>
          <option value={stepType.COOLDOWN}>Enfriamiento</option>
        </select>
      </MFFormField>
      {step.type !== stepType.SWIMTIME ? (
        <MFFormField theme={ComponentTheme.workout}>
          <label>Distancia</label>
          <input
            type="number"
            min="0"
            value={step.distance ?? ''}
            onChange={(event) => onChange({ ...step, distance: event.target.value === '' ? null : Number(event.target.value) })}
          />
        </MFFormField>
      ) : null}
      {step.type === stepType.SWIMTIME ? (
        <MFFormField theme={ComponentTheme.workout}>
          <label>Tiempo</label>
          <input
            type="number"
            min="0"
            value={step.time ?? 0}
            onChange={(event) => onChange({ ...step, time: event.target.value === '' ? null : Number(event.target.value) })}
          />
        </MFFormField>
      ) : null}
      <MFFormField theme={ComponentTheme.workout}>
        <label>Estilo</label>
        <select
          value={step.stroke}
          onChange={(event) => onChange({ ...step, stroke: event.target.value as SwimStroke })}
        >
          {Object.entries(SwimStroke).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </MFFormField>
      <MFFormField theme={ComponentTheme.workout}>
        <label>Equipo</label>
        <select
          multiple
          value={step.gear}
          onChange={(event) => {
            const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value as swimGear);
            onChange({ ...step, gear: selectedValues });
          }}
        >
          {Object.values(swimGear).map((gear) => (
            <option key={gear} value={gear}>
              {gear}
            </option>
          ))}
        </select>
      </MFFormField>
    </div>
  );
};

export default SwimStepEditor;
