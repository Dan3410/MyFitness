import { FC } from 'react';
import MFButton from '../../../../components/mf-button/mf-button';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import MFSelector from '../../../../components/mf-selector/mf-selector';
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
        <MFSelector
          label="Tipo"
          theme={ComponentTheme.workout}
          options={[
            { label: 'Distancia', value: stepType.SWIMDISTANCE },
            { label: 'Tiempo', value: stepType.SWIMTIME },
            { label: 'Calentamiento', value: stepType.WARMUP },
            { label: 'Enfriamiento', value: stepType.COOLDOWN },
          ]}
          value={step.type}
          onChange={(value) => onChange({ ...step, type: value as SwimStep['type'] })}
        />
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
        <MFSelector
          label="Estilo"
          theme={ComponentTheme.workout}
          options={Object.entries(SwimStroke).map(([key, value]) => ({ label: value, value }))}
          value={step.stroke}
          onChange={(value) => onChange({ ...step, stroke: value as SwimStroke })}
        />
        <MFSelector
          label="Equipo"
          theme={ComponentTheme.workout}
          options={Object.values(swimGear).map((gear) => ({ label: gear, value: gear }))}
          value={step.gear}
          multiple
          onChange={(value) => onChange({ ...step, gear: value as swimGear[] })}
        />
    </div>
  );
};

export default SwimStepEditor;
