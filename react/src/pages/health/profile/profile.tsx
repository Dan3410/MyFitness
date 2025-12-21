import { ChangeEvent, FC, FormEvent, useState } from 'react';
import styles from './profile.module.scss';
import { weightUnit } from '../../../const/weightUnit';
import { gender } from '../../../const/gender';
import MFDate from '../../../components/mf-date/mf-date';
import MFInput from '../../../components/mf-input/mf-input';
import MFSelect from '../../../components/mf-select/mf-select';
import { profileAndHealthInputTheme } from '../../../themes/profileHealth';
import { ComponentTheme } from '../../../themes/enums';

interface User{
  name: string
  weight: number
  weightUnit: weightUnit
  birthDay: Date,
  gender: gender
}

interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {
  
  const [form, setForm] = useState<User>({
    name: 'Test test', 
    weight: 0, 
    weightUnit: weightUnit.KILOGRAMS, 
    gender: gender.MALE, 
    birthDay: new Date()})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prev: User) => ({...prev, [name]: value}));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
  }

  return (
  <div className="profile">
    <h2>
      Perfil
    </h2>
    <MFInput theme={ComponentTheme.profileAndHeath}>
      <label>Nombre</label>
      <input value={form.name} onChange={handleChange}></input>
    </MFInput>
    <MFSelect></MFSelect>
    <MFDate></MFDate>
  </div>)
};

export default Profile;
