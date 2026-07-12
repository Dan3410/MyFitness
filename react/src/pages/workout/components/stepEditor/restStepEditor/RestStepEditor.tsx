import { FC } from 'react';
import MFButton from '../../../../../components/mf-button/mf-button';
import MFFormField from '../../../../../components/mf-form-field/mf-form-field';
import { ComponentTheme } from '../../../../../themes/enums';
import { RestStep, WorkoutStep } from '../../../../../models/workoutSteps';
import styles from './../stepEditor.module.scss';

interface RestStepEditorProps {
  step: RestStep;
  onChange: (step: WorkoutStep) => void;
  onDelete: () => void;
}

const RestStepEditor: FC<RestStepEditorProps> = ({ step, onChange, onDelete }) => {
  return (
    <div className={styles.stepEditor}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Editar paso</h3>
        <MFButton theme={ComponentTheme.generic} type="button" onClickEvent={onDelete}>Eliminar</MFButton>
      </div>
      <MFFormField theme={ComponentTheme.workout}>
        <label>Segundos</label>
        <input
          type="number"
          min="0"
          value={step.seconds}
          onChange={(event) => onChange({ ...step, seconds: Number(event.target.value) || 0 })}
        />
      </MFFormField>
    </div>
  );
};

export default RestStepEditor;
