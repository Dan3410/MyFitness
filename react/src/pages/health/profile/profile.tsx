import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComponentTheme } from '../../../models/componentTheme';
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
import MFBreadcrumb from '../../../components/mf-breadcrumb/mf-breadcrumb';
import { GET_DATA_ERROR_MESSAGE } from '../../../const/errorMessages';
import MFSpinner from '../../../components/mf-spinner/mf-spinner';
import MFNotification, { type MFNotificationType } from '../../../components/mf-notification/mf-notification';
import MFCheckbox from '../../../components/mf-checkbox/mf-checkbox';

interface ProfileProps {
  readOnly?: boolean
}

const MAX_PROFILE_IMAGE_SIZE_BYTES = 1024 * 1024

const Profile: FC<ProfileProps> = ({ readOnly = false }) => {
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState<User>({
    id: '',
    username: '',
    email: '',
    name: '',
    lastName: "",
    weight: 0,
    weightUnit: WEIGHTUNIT.KG,
    height: 0,
    heightUnit: HEIGHTUNIT.CM,
    gender: GENDER.MALE,
    birthDay: '',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objective: OBJECTIVE.MAINTAIN,
    isProfilePrivate: false
  })

  const [originalData, setOriginalData] = useState<User>({
    id: '',
    username: '',
    email: '',
    name: '',
    lastName: "",
    weight: 0,
    weightUnit: WEIGHTUNIT.KG,
    height: 0,
    heightUnit: HEIGHTUNIT.CM,
    gender: GENDER.MALE,
    birthDay: '',
    physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
    objective: OBJECTIVE.MAINTAIN,
    isProfilePrivate: false
  })

  const [edit, setEdit] = useState<boolean>(false)
  const [loadError, setLoadError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [weightHistoryRefresh, setWeightHistoryRefresh] = useState(0)
  const [notification, setNotification] = useState<{ type: MFNotificationType, message: string } | null>(null)
  const notificationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current)
    }
  }, [])

  const showNotification = (type: MFNotificationType, message: string) => {
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current)
    setNotification({ type, message })
    notificationTimeout.current = setTimeout(() => setNotification(null), 5000)
  }

  const getData = async () => {
    try {
      setLoadError(false)
      const id = searchParams.get('id')
      const data = readOnly && id
        ? await profileService.getUserById(id)
        : await profileService.getUserData()
      setOriginalData(data)
      setForm(data)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [readOnly, searchParams])

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
      const changes: User = { ...form }
      changes.weightUnit = value as WEIGHTUNIT
      changes.weight = value == WEIGHTUNIT.KG ? Math.round(changes.weight * 0.453592) : Math.round(changes.weight * 2.20462)
      setForm(() => (changes));
    } else
      setForm((prev: User) => ({ ...prev, [name]: value }));
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      event.target.value = ''
      showNotification('failure', 'La imagen es demasiado grande. El tamaño máximo permitido es 1 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, profileImage: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const userData = await profileService.editUserData(form)
      setForm(userData)
      setOriginalData(userData)
      setEdit(false)
      setWeightHistoryRefresh((current) => current + 1)
      showNotification('success', 'Perfil guardado correctamente')
    } catch {
      showNotification('failure', 'No se pudo guardar el perfil')
    }
  }

  if (loading) return <MFSpinner />;
  if (loadError) return <p>{GET_DATA_ERROR_MESSAGE}</p>;
  const breadcrumbItems = readOnly
    ? [
      { label: 'Inicio', to: '/' },
      { label: 'Usuarios', to: `/users?name=${encodeURIComponent(searchParams.get('name') || '')}` },
      { label: 'Perfil de usuario' },
    ]
    : [{ label: 'Inicio', to: '/' }, { label: 'Perfil' }];

  if (readOnly && form.isProfilePrivate) {
    return (
      <div className="profile">
        <div className="pageHeader">
          <MFBreadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.privateProfile}>
          {form.isTrainer && <span className={styles.trainerLabel}>Entrenador</span>}
          <img className={styles.profileImg} src={form.profileImage || defaultProfileImage} alt="Perfil" />
          <p>Esta información es privada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="pageHeader">
        <MFBreadcrumb items={breadcrumbItems} />
        <div className="pageTitleBar">
          <h2>{readOnly ? 'Perfil de usuario' : 'Perfil'}</h2>
          <div className="headerActions">
            {!readOnly && !edit && <MFButton onClickEvent={clickEdit} theme={ComponentTheme.profileAndHealth}><label>Editar</label></MFButton>}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {notification && (
          <div className={styles.profileNotification}>
            <MFNotification type={notification.type} message={notification.message} />
          </div>
        )}
        {form.isTrainer && <span className={styles.trainerLabel}>Entrenador</span>}
        <div
          className={`${styles.profileImgContainer} ${edit ? styles.profileImgEditable : ''}`}
          onClick={() => edit && imageInputRef.current?.click()}
          role={edit ? 'button' : undefined}
          tabIndex={edit ? 0 : undefined}
          onKeyDown={(event) => {
            if (edit && (event.key === 'Enter' || event.key === ' ')) imageInputRef.current?.click()
          }}
        >
          <img className={styles.profileImg} src={form.profileImage || defaultProfileImage} alt="Perfil" />
          {edit && <span className={styles.profileImgEditLabel}>Editar</span>}
          {edit && <input
            ref={imageInputRef}
            className={styles.profileImgInput}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Seleccionar imagen de perfil"
          />}
        </div>
        <div >
          <PersonalDataSection handleChange={handleChange} form={form} edit={edit}></PersonalDataSection>
        </div>
        <div >
          <HeightSection handleChange={handleChange} form={form} edit={edit}></HeightSection>
        </div>
        <div>
          <WeightSection
            handleChange={handleChange}
            form={form}
            edit={edit}
            refreshWeightHistory={weightHistoryRefresh}
          ></WeightSection>
        </div>
        <div>
          <NutritionSection form={form}></NutritionSection>
        </div>

        {edit && <MFCheckbox
          theme={ComponentTheme.profileAndHealth}
          checked={form.isProfilePrivate}
          onChange={(event) => setForm((prev) => ({ ...prev, isProfilePrivate: event.target.checked }))}
        >
          Ocultar mi información a otros usuarios
        </MFCheckbox>}

        {
          edit && (<div className="form-buttons-container">
            <MFButton theme={ComponentTheme.generic} onClickEvent={cancelEdit}><label>Cancelar</label></MFButton>
            <MFButton type='submit' theme={ComponentTheme.profileAndHealth}><label>Guardar</label></MFButton>
          </div>)
        }
      </form>
    </div>)
};

export default Profile;
