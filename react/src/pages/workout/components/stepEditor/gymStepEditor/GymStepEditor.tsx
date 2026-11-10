import { FC } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import MFSelector from '../../../../../components/mf-selector/mf-selector';
import { GymStep, WorkoutStep, StepType } from '../../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../../models/workoutCategories';
import styles from './../stepEditor.module.scss';
import { CONST_GYM_STEP_TYPE_OPTIONS } from '../../../../../const/gymStepTypeOptions';

interface GymStepEditorProps {
  step: GymStep;
  workoutCategory: WorkoutCategory;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const GymStepEditor: FC<GymStepEditorProps> = ({ step, workoutCategory, onChange, onDelete }) => {
  return (
    <div className={styles.StepEditor}>
      <div className={styles.StepEditor__HeaderRow}>
        <h3 className={styles.StepEditor__Title}>{workoutCategory === WorkoutCategory.GYM ? 'Editar ejercicio' : 'Editar paso'}</h3>
        <MFButton theme="primary" type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
      <MFSelector
        label="Tipo"
        theme="primary"
        options={
          CONST_GYM_STEP_TYPE_OPTIONS
        }
        value={step.type}
        onChange={(value) => {
          const nextType = value as GymStep['type'];
          onChange({ ...step, type: nextType, byTime: nextType === StepType.INTERVAL || nextType === StepType.EXERCISE || nextType === StepType.GYMWARMUP || nextType === StepType.GYMCOOLDOWN ? false : step.byTime });
        }}
      />
      <MFFormField theme="primary">
        <label>Descripción</label>
        <textarea
          value={step.description ?? ''}
          onChange={(event) => onChange({ ...step, description: event.target.value })}
        />
      </MFFormField>
      <MFFormField theme="primary">
        <label>Ejercicio</label>
        <input
          type="text"
          value={step.exercise}
          onChange={(event) => onChange({ ...step, exercise: event.target.value })}
        />
      </MFFormField>
      {!step.byTime ? (
        <MFFormField theme="primary">
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
        <MFFormField theme="primary">
          <label>Tiempo</label>
          <input
            type="number"
            min="0"
            value={step.time}
            onChange={(event) => onChange({ ...step, time: Number(event.target.value) || 0 })}
          />
        </MFFormField>
      ) : null}
      <MFFormField theme="primary">
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
