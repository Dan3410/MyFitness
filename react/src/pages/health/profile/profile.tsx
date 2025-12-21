import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { weightUnit } from '../../../const/weightUnit';
import { GENDER } from '../../../const/gender';
import { ComponentTheme } from '../../../themes/enums';
import MFFormField from '../../../components/mf-form-field/mf-form-field';
import { Gender } from '../../../models/gender';

interface User {
  name: string
  weight: number
  weightUnit: weightUnit
  birthDay: '',
  gender: string
}

interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {

  const [form, setForm] = useState<User>({
    name: 'Test test',
    weight: 0,
    weightUnit: weightUnit.KILOGRAMS,
    gender: '',
    birthDay: ''
  })

  const gender: Array<Gender> = GENDER

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(e.target)
    console.log(value)
    console.log(name)
    setForm((prev: User) => ({ ...prev, [name]: value }));
    console.log(form)
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
      <form onSubmit={handleSubmit}>
        <MFFormField disabled={true} theme={ComponentTheme.profileAndHeath}>
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange}></input>
        </MFFormField>
        <MFFormField theme={ComponentTheme.profileAndHeath}>
          <label>Genero</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            {gender.map((item: Gender) => (
              <option value={item.value}>{item.label}</option>
            ))}
          </select>
        </MFFormField>
        <MFFormField theme={ComponentTheme.profileAndHeath}>
          <label>Fecha de nacimiento</label>
          <input name="birthDay" type='date' value={form.birthDay} onChange={handleChange}></input>
        </MFFormField>
      </form>
    </div>)
};

export default Profile;
