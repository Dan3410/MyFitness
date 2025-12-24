import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../themes/enums';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import styles from './height-section.module.scss'
import { User } from '../../../../models/user';
import { CONST_HEIGHTUNIT } from '../../../../const/heightUnit';
import { HeightUnit } from '../../../../models/heightUnit';
import MFError from '../../../../components/mf-error/mf-error';


interface HeightSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const HeightSection: FC<HeightSectionProps> = ({ handleChange, edit, form }) => {

  const heightUnit: Array<HeightUnit> = CONST_HEIGHTUNIT

  return (<>

    <h6>Estatura</h6>
    <div className={styles.profileFormSection}>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Unidad de medida de la Altura</label>
        <select name="heightUnit" value={form.heightUnit} onChange={handleChange}>
          {heightUnit.map((item: HeightUnit) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>

      <div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
          <label>Altura</label>
          <input name="height" type='number' value={form.height} onChange={handleChange}></input>
        </MFFormField>
        <MFError hidden={!edit || !!form.height}>Este campo es obligatorio</MFError>
        <MFError hidden={!edit || !!form.height && form.height <= 0}>El valor debe ser mayor a 0</MFError>
      </div>
    </div>
  </>
  )
};

export default HeightSection;
