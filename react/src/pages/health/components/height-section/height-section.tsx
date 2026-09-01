import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../models/componentTheme';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import styles from './height-section.module.scss'
import { User } from '../../../../models/user';
import { CONST_HEIGHTUNIT_OPTIONS } from '../../../../const/heightUnitOptions';
import MFError from '../../../../components/mf-error/mf-error';
import MFExpandablePanel from '../../../../components/mf-expandable-panel/mf-expandable-panel';
import { Option } from '../../../../models/option';


interface HeightSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const HeightSection: FC<HeightSectionProps> = ({ handleChange, edit, form }) => {

  const heightUnit: Array<Option> = CONST_HEIGHTUNIT_OPTIONS

  return (
  <>
    <MFExpandablePanel title="Estatura" defaultOpen={edit} theme={ComponentTheme.profileAndHealth}>
      <div className={styles.profileFormSection}>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Unidad de medida de la Altura</label>
          <select name="heightUnit" value={form.heightUnit} onChange={handleChange}>
            {heightUnit.map((item: Option) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </MFFormField>

        <div>
          <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
            <label>Altura</label>
            <input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
            />
          </MFFormField>
          <MFError hidden={!edit || !!form.height}>Este campo es obligatorio</MFError>
          <MFError hidden={!edit || (!!form.height && form.height > 0)}>
            El valor debe ser mayor a 0
          </MFError>
        </div>
      </div>
    </MFExpandablePanel>
  </>)
};

export default HeightSection;
