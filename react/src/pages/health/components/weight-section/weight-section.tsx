import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../themes/enums';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { CONST_WEIGHTUNIT } from '../../../../const/weightUnit';
import styles from './weight-section.module.scss'
import { User } from '../../../../models/user';
import { WeightUnit } from '../../../../models/weightUnit';
import { objetive } from '../../../../models/objetive';
import { CONST_OBJETIVE } from '../../../../const/objetive';
import MFError from '../../../../components/mf-error/mf-error';


interface WeightSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const WeightSection: FC<WeightSectionProps> = ({ handleChange, edit, form }) => {

  const weightUnit: Array<WeightUnit> = CONST_WEIGHTUNIT
  const objetive: Array<objetive> = CONST_OBJETIVE

  return (<>

    <h6>Peso</h6>
    <div className={styles.profileFormSection}>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Unidad de medida del peso</label>
        <select name="weightUnit" value={form.weightUnit} onChange={handleChange}>
          {weightUnit.map((item: WeightUnit) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
      <div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
          <label>Peso</label>
          <input name="weight" value={form.weight} onChange={handleChange}>
          </input>
        </MFFormField>
        <MFError hidden={!edit || !!form.weight}>Este campo es obligatorio</MFError>
        <MFError hidden={!edit || !!form.height && form.weight <= 0}>El valor debe ser mayor a 0</MFError>
      </div>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Objetivo</label>
        <select name="objetive" value={form.objetive} onChange={handleChange}>
          {objetive.map((item: objetive) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
    </div>
  </>
  )
};

export default WeightSection;
