import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../themes/enums';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import styles from './personal-data-section.module.scss'
import { User } from '../../../../models/user';
import { CONST_PHYSICALACTIVITYLVL_OPTIONS } from '../../../../const/physicalActivityOptions';
import { CONST_GENDER_OPTIONS } from '../../../../const/genderOptions';
import MFError from '../../../../components/mf-error/mf-error';



interface PersonalDataSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const PersonalDataSection: FC<PersonalDataSectionProps> = ({ handleChange, edit, form }) => {

  const physicalActivityLvl: Array<{ label: string; value: string }> = CONST_PHYSICALACTIVITYLVL_OPTIONS
  const gender: Array<{ label: string; value: string }> = CONST_GENDER_OPTIONS

  return (<>

    <h6>Información General</h6>
    <div className={styles.profileFormSection}>

      <div>

        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange}></input>
        </MFFormField>
        <MFError hidden={!edit || !!form.name}>Este campo es obligatorio</MFError>
      </div>
      <div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Apellido</label>
          <input name="lastName" value={form.lastName} onChange={handleChange}></input>
        </MFFormField>
        <MFError hidden={!edit || !!form.lastName}>Este campo es obligatorio</MFError>
      </div>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
        <label>Genero</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          {gender.map((item: { label: string; value: string }) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
      <div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Fecha de nacimiento</label>
          <input name="birthDay" type='date' value={form.birthDay} onChange={handleChange}></input>
        </MFFormField>
        <MFError hidden={!edit || !!form.birthDay}>Este campo es obligatorio</MFError>
      </div>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
        <label>Nivel de actividad física</label>
        <select name="physicalActivityLvl" value={form.physicalActivityLvl} onChange={handleChange}>
          {physicalActivityLvl.map((item: { label: string; value: string }) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
    </div>
  </>
  )
};

export default PersonalDataSection;
