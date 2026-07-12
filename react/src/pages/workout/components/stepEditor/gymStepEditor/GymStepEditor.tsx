import { FC } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import MFSelector from '../../../../../components/mf-selector/mf-selector';
import { ComponentTheme } from '../../../../../themes/enums';
import { GymStep, WorkoutStep, stepType } from '../../../../../models/workoutSteps';
import styles from './../stepEditor.module.scss';
import { CONST_GYM_STEP_TYPE_OPTIONS } from '../../../../../const/gymStepTypeOptions';

interface GymStepEditorProps {
  step: GymStep;
  workoutCategory: string;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const GymStepEditor: FC<GymStepEditorProps> = ({ step, workoutCategory, onChange, onDelete }) => {
  return (
    <div className={styles.stepEditor}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{workoutCategory === 'gym' ? 'Editar ejercicio' : 'Editar paso'}</h3>
        <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
      <MFSelector
        label="Tipo"
        theme={ComponentTheme.workout}
        options={
          CONST_GYM_STEP_TYPE_OPTIONS
        }
        value={step.type}
        onChange={(value) => {
          const nextType = value as GymStep['type'];
          onChange({ ...step, type: nextType, byTime: nextType === stepType.INTERVAL || nextType === stepType.EXERCISE || nextType === stepType.WARMUP || nextType === stepType.COOLDOWN ? false : step.byTime });
        }}
      />
      <MFFormField theme={ComponentTheme.workout}>
        <label>Ejercicio</label>
        <input
          type="text"
          value={step.exercise}
          onChange={(event) => onChange({ ...step, exercise: event.target.value })}
        />
      </MFFormField>
      {!step.byTime ? (
        <MFFormField theme={ComponentTheme.workout}>
          <label>Repeticiones</label>
          <input
            type="number"
            min="0"
            value={step.reps}
            onChange={(event) => onChange({ ...step, reps: Number(event.target.value) || 0 })}
          />
        </MFFormField>
      ) : null}
      {step.byTime ? (
        <MFFormField theme={ComponentTheme.workout}>
          <label>Tiempo</label>
          <input
            type="number"
            min="0"
            value={step.time}
            onChange={(event) => onChange({ ...step, time: Number(event.target.value) || 0 })}
          />
        </MFFormField>
      ) : null}
      <MFFormField theme={ComponentTheme.workout}>
        <label>Peso</label>
        <input
          type="number"
          min="0"
          value={step.weight}
          onChange={(event) => onChange({ ...step, weight: Number(event.target.value) || 0 })}
        />
      </MFFormField>
    </div>
  );
};

export default GymStepEditor;
