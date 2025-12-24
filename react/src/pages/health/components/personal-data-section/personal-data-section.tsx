import { ChangeEvent, FC } from 'react';
import { ComponentTheme } from '../../../../themes/enums';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import styles from './personal-data-section.module.scss'
import { User } from '../../../../models/user';
import { physicalActivityLvl } from '../../../../models/physical-activity';
import { CONST_PHYSICALACTIVITYLVL } from '../../../../const/physical-activity';
import { Gender } from '../../../../models/gender';
import { CONST_GENDER } from '../../../../const/gender';



interface PersonalDataSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
}

const PersonalDataSection: FC<PersonalDataSectionProps> = ({ handleChange, edit, form }) => {

  const physicalActivityLvl: Array<physicalActivityLvl> = CONST_PHYSICALACTIVITYLVL
  const gender: Array<Gender> = CONST_GENDER
  
  return (<>

    <h6>Información General</h6>
    <div className={styles.profileFormSection}>

      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handleChange}></input>
      </MFFormField>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Apellido</label>
        <input name="lastName" value={form.lastName} onChange={handleChange}></input>
      </MFFormField>

      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Genero</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          {gender.map((item: Gender) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Fecha de nacimiento</label>
        <input name="birthDay" type='date' value={form.birthDay} onChange={handleChange}></input>
      </MFFormField>
      <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
        <label>Nivel de actividad física</label>
        <select name="physicalActivityLvl" value={form.physicalActivityLvl} onChange={handleChange}>
          {physicalActivityLvl.map((item: physicalActivityLvl) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </MFFormField>
    </div>
  </>
  )
};

export default PersonalDataSection;
