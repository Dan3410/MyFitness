import { FC } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import MFSelector from '../../../../../components/mf-selector/mf-selector';
import { SwimStep, SwimStroke, WorkoutStep, StepType, swimGear } from '../../../../../models/workoutSteps';
import styles from './../stepEditor.module.scss';
import { CONST_SWIM_STEP_TYPE_OPTIONS } from '../../../../../const/swimStepTypeOptions';
import { CONST_SWIMMING_GEAR_OPTIONS } from '../../../../../const/swimmingGearOptions';
import { CONST_SWIM_STROKE_OPTIONS } from '../../../../../const/swimStrokeOptions';

interface SwimStepEditorProps {
  step: SwimStep;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const SwimStepEditor: FC<SwimStepEditorProps> = ({ step, onChange, onDelete }) => {
  return (
    <div className={styles.StepEditor}>
      <div className={styles.StepEditor__HeaderRow}>
        <h3 className={styles.StepEditor__Title}>Editar paso de natación</h3>
        <MFButton theme="primary" type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
        <MFSelector
          label="Tipo"
          theme="primary"
          options={CONST_SWIM_STEP_TYPE_OPTIONS}
          value={step.type}
          onChange={(value) => onChange({ ...step, type: value as SwimStep['type'] })}
        />
      <MFFormField theme="primary">
        <label>Descripción</label>
        <textarea
          value={step.description ?? ''}
          onChange={(event) => onChange({ ...step, description: event.target.value })}
        />
      </MFFormField>
      {step.type !== StepType.SWIMTIME ? (
        <MFFormField theme="primary">
          <label>Distancia</label>
          <input
            type="number"
            min="0"
            value={step.distance ?? 0}
            onChange={(event) => onChange({ ...step, distance: event.target.value === '' ? null : Number(event.target.value) })}
          />
        </MFFormField>
      ) : null}
      {step.type === StepType.SWIMTIME ? (
        <MFFormField theme="primary">
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
          theme="primary"
          options={CONST_SWIM_STROKE_OPTIONS}
          value={step.stroke}
          onChange={(value) => onChange({ ...step, stroke: value as SwimStroke })}
        />
        <MFSelector
          label="Equipo"
          theme="primary"
          options={CONST_SWIMMING_GEAR_OPTIONS}
          value={step.gear}
          multiple
          onChange={(value) => onChange({ ...step, gear: value as swimGear[] })}
        />
    </div>
  );
};

export default SwimStepEditor;
