import { ChangeEvent, FC, useEffect, useState } from 'react';
import { ComponentTheme } from '../../../themes/enums';
import { WEIGHTUNIT } from '../../../models/weightUnit';
import { HEIGHTUNIT } from '../../../models/heightUnit';
import styles from './profile.module.scss'
import MFButton from '../../../components/mf-button/mf-button';
import defaultProfileImage from '../../../assets/defaultProfileImage.jpg'
import { PHYSICALACTIVITYLVL } from '../../../models/physical-activity';
import { OBJECTIVE } from '../../../models/objective';
import { User } from '../../../models/user';
import WeightSection from '../components/weight-section/weight-section';
import PersonalDataSection from '../components/personal-data-section/personal-data-section';
import NutritionSection from '../components/nutrition-section/nutrition-section';
import HeightSection from '../components/height-section/height-section';
import { GENDER } from '../../../models/gender';
import { profileService } from '../../../services/profileService'

interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {

  const [form, setForm] = useState<User>({
    name: '',
    lastName: "",
    weight: 0,
    weightUnit: WEIGHTUNIT.KG,
    height: 0,
    heightUnit: HEIGHTUNIT.CM,
    gender: GENDER.MALE,
    birthDay: '',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objective: OBJECTIVE.MAINTAIN
  })

  const [originalData, setOriginalData] = useState<User>({
    name: '',
    lastName: "",
    weight: 0,
    weightUnit: WEIGHTUNIT.KG,
    height: 0,
    heightUnit: HEIGHTUNIT.CM,
    gender: GENDER.MALE,
    birthDay: '',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objective: OBJECTIVE.MAINTAIN
  })

  const [edit, setEdit] = useState<boolean>(false)

  const getData = async () => {
    const data = await profileService.getUserData('123')
    setOriginalData(data)
    setForm(data)
  }

  useEffect(() => {
    getData()
  }, [])

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
    if (name === "weightUnit") {
      let changes: User = { ...form }
      changes.weightUnit = value as WEIGHTUNIT
      changes.weight = value == WEIGHTUNIT.KG ? Math.round(changes.weight * 0.453592) : Math.round(changes.weight * 2.20462)
      setForm(() => (changes));
    } else
      setForm((prev: User) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    profileService.editUserData('123', form).then((userData: User) => {
      console.log(userData)
      setForm(userData)
      setOriginalData(userData)
      setEdit(false)
    })
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
            <MFButton type='submit' theme={ComponentTheme.profileAndHeath}><label>Guardar</label></MFButton>
          </div>)
        }
      </form>
    </div>)
};

export default Profile;
