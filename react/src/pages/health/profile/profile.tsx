import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { ComponentTheme } from '../../../themes/enums';
import { WEIGHTUNIT } from '../../../models/weightUnit';
import { HEIGHTUNIT } from '../../../models/heightUnit';
import styles from './profile.module.scss'
import MFButton from '../../../components/mf-button/mf-button';
import defaultProfileImage from '../../../assets/defaultProfileImage.jpg'
import { PHYSICALACTIVITYLVL } from '../../../models/physical-activity';
import { OBJETIVE } from '../../../models/objetive';
import { User } from '../../../models/user';
import WeightSection from '../components/weight-section/weight-section';
import HeightSection from '../components/personal-data-section/personal-data-section';
import PersonalDataSection from '../components/personal-data-section/personal-data-section';
import NutritionSection from '../components/nutrition-section/nutrition-section';

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
    birthDay: '10/12/1985',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objetive: OBJETIVE.MAINTAIN
  })

  const [originalData, setOriginalData] = useState<User>({
    name: 'Nombre',
    lastName: "Apellido",
    weight: 62,
    weightUnit: WEIGHTUNIT.KG,
    height: 150,
    heightUnit: HEIGHTUNIT.CM,
    gender: "MALE",
    birthDay: '10/12/1985',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objetive: OBJETIVE.MAINTAIN
  })

  const [edit, setEdit] = useState<boolean>(false)

  const clickEdit = () => {
    setOriginalData(form)
    setEdit(true)
  }

  const cancelEdit = () => {
    setForm(originalData)
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
          <PersonalDataSection handleChange={handleChange} form={form} edit={edit}></PersonalDataSection>
        </div>
        <div >
          <HeightSection handleChange={handleChange} form={form} edit={edit}></HeightSection>
        </div>
        <div>
          <WeightSection handleChange={handleChange} form={form} edit={edit}></WeightSection>
        </div>
        <div>
          <NutritionSection form={form}></NutritionSection>
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
