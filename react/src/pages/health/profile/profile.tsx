import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { ComponentTheme } from '../../../themes/enums';
import MFFormField from '../../../components/mf-form-field/mf-form-field';
import { Gender } from '../../../models/gender';
import { WeightUnit, WEIGHTUNIT } from '../../../models/weightUnit';
import { HeightUnit, HEIGHTUNIT } from '../../../models/heightUnit';
import { CONST_GENDER } from '../../../const/gender';
import { CONST_WEIGHTUNIT } from '../../../const/weightUnit';
import { CONST_HEIGHTUNIT } from '../../../const/heightUnit';
import styles from './profile.module.scss'
import MFButton from '../../../components/mf-button/mf-button';
import defaultProfileImage from '../../../assets/defaultProfileImage.jpg'

interface User {
  name: string
  lastName: string
  weight: number
  weightUnit: WEIGHTUNIT.KG | WEIGHTUNIT.LB
  height: number
  heightUnit: HEIGHTUNIT.CM | HEIGHTUNIT.FEET
  birthDay: string
  gender: "MALE" | "FEMALE"
}

interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {

  const [form, setForm] = useState<User>({
    name: 'Nombre',
    lastName: "Apellido",
    weight: 62,
    weightUnit: WEIGHTUNIT.KG,
    height: 150,
    heightUnit: HEIGHTUNIT.CM,
    gender: "MALE",
    birthDay: '10/12/1985'
  })

  const gender: Array<Gender> = CONST_GENDER
  const weightUnit: Array<WeightUnit> = CONST_WEIGHTUNIT
  const heightUnit: Array<HeightUnit> = CONST_HEIGHTUNIT

  const [edit, setEdit] = useState<boolean>(false)

  const clickEdit = () => {
    setEdit(true)
  }

  const cancelEdit = () => {
    setEdit(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: User) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
    setEdit(false)
  }

  return (
    <div className="profile">
      <h2>
        Perfil
        {!edit && <label className={styles.profileEditButton} onClick={clickEdit}> Editar </label>}
      </h2>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.profileImgContainer}>
          <img className={styles.profileImg} src={defaultProfileImage}></img>
        </div>
        <div >
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
          </div>
        </div>
        <div>
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
            <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
              <label>Peso</label>
              <input name="weight" value={form.weight} onChange={handleChange}>
              </input>
            </MFFormField>
          </div>
        </div>
        <div >
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

            <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHeath}>
              <label>Altura</label>
              <input name="height" value={form.height} onChange={handleChange}>
              </input>
            </MFFormField>
          </div>
        </div>
        {
          edit && (<div className="form-buttons-container">
            <MFButton theme={ComponentTheme.generic} onClickEvent={cancelEdit}><label>Cancelar</label></MFButton>
            <MFButton theme={ComponentTheme.profileAndHeath} onClickEvent={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}><label>Guardar</label></MFButton>
          </div>)
        }
      </form>
    </div>)
};

export default Profile;
