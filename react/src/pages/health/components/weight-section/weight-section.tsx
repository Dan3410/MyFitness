import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../models/componentTheme';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { CONST_WEIGHTUNIT_OPTIONS } from '../../../../const/weightUnitOptions';
import styles from './weight-section.module.scss'
import { User } from '../../../../models/user';
import { CONST_OBJETIVE_OPTIONS } from '../../../../const/objectiveOptions';
import MFError from '../../../../components/mf-error/mf-error';
import MFExpandablePanel from '../../../../components/mf-expandable-panel/mf-expandable-panel';
import { Option } from '../../../../models/option';


interface WeightSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const WeightSection: FC<WeightSectionProps> = ({ handleChange, edit, form }) => {

  const weightUnit: Array<Option> = CONST_WEIGHTUNIT_OPTIONS
  const objective: Array<Option> = CONST_OBJETIVE_OPTIONS

  return (<>

    <MFExpandablePanel title="Peso" theme={ComponentTheme.profileAndHealth}>
      <div className={styles.profileFormSection}>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Unidad de medida del peso</label>
          <select name="weightUnit" value={form.weightUnit} onChange={handleChange}>
            {weightUnit.map((item: Option) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </MFFormField>
        <div>
          <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
            <label>Peso</label>
            <input name="weight" value={form.weight} onChange={handleChange}>
            </input>
          </MFFormField>
          <MFError hidden={!edit || !!form.weight}>Este campo es obligatorio</MFError>
          <MFError hidden={!edit || !!form.height && form.weight > 0}>El valor debe ser mayor a 0</MFError>
        </div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Objetivo</label>
          <select name="objective" value={form.objective} onChange={handleChange}>
            {objective.map((item: Option) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </MFFormField>
      </div>
    </MFExpandablePanel>
  </>
  )
};

export default WeightSection;
