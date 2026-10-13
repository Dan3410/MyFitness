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
import MFModal from '../../../components/mf-modal/mf-modal';
import type { UserSearchResult } from '../../../models/user';
import { trainerStudentService } from '../../../services/trainerStudentService';
import TrainerStudentSection from '../components/trainer-student-section/trainer-student-section';
import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services/notificationService';

interface ProfileProps {
  readOnly?: boolean
}

const MAX_PROFILE_IMAGE_SIZE_BYTES = 1024 * 1024

const Profile: FC<ProfileProps> = ({ readOnly = false }) => {
  const [searchParams] = useSearchParams()
  const { session } = useAuth()

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
  const [relationships, setRelationships] = useState<UserSearchResult[]>([])
  const [originalRelationships, setOriginalRelationships] = useState<UserSearchResult[]>([])
  const [selectedRelationshipIds, setSelectedRelationshipIds] = useState<string[]>([])
  const [relationshipError, setRelationshipError] = useState(false)
  const [canViewPrivateProfile, setCanViewPrivateProfile] = useState(false)
  const [viewerIsTrainer, setViewerIsTrainer] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestSending, setRequestSending] = useState(false)
  const [confirmRelationshipRemoval, setConfirmRelationshipRemoval] = useState(false)
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
      setRelationships([])
      setOriginalRelationships([])
      setRelationshipError(false)
      setCanViewPrivateProfile(false)
      setViewerIsTrainer(false)
      setRequestSent(false)
      const id = searchParams.get('id')
      const data = readOnly && id
        ? await profileService.getUserById(id)
        : await profileService.getUserData()
      setOriginalData(data)
      setForm(data)
      const isProfileOwner = data.id === session?.userId
      if (readOnly && !isProfileOwner) {
        try {
          const viewer = await profileService.getUserData()
          setViewerIsTrainer(viewer.isTrainer)
          if (viewer.isTrainer) {
            const linkedStudents = await trainerStudentService.getStudents()
            const isLinked = linkedStudents.some((user) => user.id === id)
            setCanViewPrivateProfile(isLinked)
          } else if (data.isProfilePrivate) {
            const linkedTrainers = await trainerStudentService.getTrainers()
            setCanViewPrivateProfile(linkedTrainers.some((user) => user.id === id))
          }
        } catch {
          setCanViewPrivateProfile(false)
        }
        try {
          const linkedUsers = await trainerStudentService.getRelationshipsForProfile(data.id)
          setRelationships(linkedUsers)
          setRelationshipError(false)
        } catch {
          setRelationshipError(true)
        }
      } else if (!readOnly || isProfileOwner) {
        try {
          const linkedUsers = data.isTrainer
            ? await trainerStudentService.getStudents()
            : await trainerStudentService.getTrainers()
          setRelationships(linkedUsers)
          setOriginalRelationships(linkedUsers)
          setSelectedRelationshipIds(linkedUsers.map((user) => user.id))
          setRelationshipError(false)
        } catch {
          setRelationshipError(true)
        }
      }
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [readOnly, searchParams, session?.userId])

  const clickEdit = () => {
    setOriginalData(form)
    setSelectedRelationshipIds(originalRelationships.map((user) => user.id))
    setEdit(true)
  }

  const cancelEdit = () => {
    setForm(originalData)
    setSelectedRelationshipIds(originalRelationships.map((user) => user.id))
    setConfirmRelationshipRemoval(false)
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

  const saveProfile = async () => {
    try {
      const removedIds = originalRelationships
        .filter((linkedUser) => !selectedRelationshipIds.includes(linkedUser.id))
        .map((linkedUser) => linkedUser.id)
      if (removedIds.length > 0) {
        let updatedRelationships = originalRelationships
        for (const id of removedIds) {
          updatedRelationships = form.isTrainer
            ? await trainerStudentService.unlinkStudent(id)
            : await trainerStudentService.unlinkTrainer(id)
          setRelationships(updatedRelationships)
          setOriginalRelationships(updatedRelationships)
          setSelectedRelationshipIds(updatedRelationships.map((user) => user.id))
        }
      }
      const userData = await profileService.editUserData(form)
      setForm(userData)
      setOriginalData(userData)
      setEdit(false)
      setConfirmRelationshipRemoval(false)
      setWeightHistoryRefresh((current) => current + 1)
      showNotification('success', 'Perfil guardado correctamente')
    } catch {
      showNotification('failure', 'No se pudo guardar el perfil')
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const hasRelationshipRemovals = originalRelationships.some(
      (linkedUser) => !selectedRelationshipIds.includes(linkedUser.id),
    )
    if (hasRelationshipRemovals) {
      setConfirmRelationshipRemoval(true)
      return
    }
    void saveProfile()
  }

  const requestTrainerLink = async () => {
    if (requestSending) return
    setRequestSending(true)
    try {
      await notificationService.sendTrainerRequest(form.id)
      setRequestSent(true)
      showNotification('success', 'Solicitud de vinculación enviada')
    } catch {
      showNotification('failure', 'No se pudo enviar la solicitud de vinculación')
    } finally {
      setRequestSending(false)
    }
  }

  if (loading) return <MFSpinner />;
  if (loadError) return <p>{GET_DATA_ERROR_MESSAGE}</p>;
  const isOwner = !readOnly || form.id === session?.userId
  const breadcrumbItems = readOnly
    ? [
      { label: 'Inicio', to: '/' },
      { label: 'Usuarios', to: `/users?name=${encodeURIComponent(searchParams.get('name') || '')}` },
      { label: 'Perfil de usuario' },
    ]
    : [{ label: 'Inicio', to: '/' }, { label: 'Perfil' }];

  if (readOnly && !isOwner && form.isProfilePrivate && !canViewPrivateProfile) {
    return (
      <div className="profile">
        <div className="pageHeader">
          <MFBreadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.privateProfile}>
          {form.isTrainer && <span className={styles.trainerLabel}>Entrenador</span>}
          <img className={styles.profileImg} src={form.profileImage || defaultProfileImage} alt="Perfil" />
          <p>Esta información es privada</p>
          {notification && <MFNotification type={notification.type} message={notification.message} />}
          {viewerIsTrainer && !form.isTrainer && !requestSent && (
            <MFButton
              type="button"
              theme={ComponentTheme.profileAndHealth}
              isDisabled={requestSending}
              onClickEvent={() => void requestTrainerLink()}
            >
              {requestSending ? 'Enviando...' : 'Solicitar vinculación'}
            </MFButton>
          )}
          {viewerIsTrainer && !form.isTrainer && requestSent && <span>Solicitud enviada</span>}
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
            {isOwner && !edit && <MFButton onClickEvent={clickEdit} theme={ComponentTheme.profileAndHealth}><label>Editar</label></MFButton>}
            {readOnly && !isOwner && viewerIsTrainer && !form.isTrainer && !requestSent && (
              <MFButton
                type="button"
                theme={ComponentTheme.profileAndHealth}
                isDisabled={requestSending}
                onClickEvent={() => void requestTrainerLink()}
              >
                {requestSending ? 'Enviando...' : 'Solicitar vinculación'}
              </MFButton>
            )}
            {readOnly && !isOwner && viewerIsTrainer && !form.isTrainer && requestSent && (
              <span>Solicitud enviada</span>
            )}
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

        {relationshipError ? (
          <MFNotification
            type="failure"
            message="No se pudieron cargar las relaciones de entrenador y alumno."
          />
        ) : (
          <TrainerStudentSection
            isTrainer={!!form.isTrainer}
            isOwner={isOwner}
            edit={edit}
            users={relationships}
            selectedUserIds={selectedRelationshipIds}
            onSelectionChange={(userId, selected) => setSelectedRelationshipIds((current) =>
              selected
                ? [...current, userId]
                : current.filter((id) => id !== userId))}
          />
        )}

        {isOwner && <MFCheckbox
          theme={ComponentTheme.profileAndHealth}
          disabled={!edit}
          checked={form.isProfilePrivate}
          onChange={(event) => setForm((prev) => ({ ...prev, isProfilePrivate: event.target.checked }))}
        >
          Ocultar mi información a otros usuarios
        </MFCheckbox>}

        {
          edit && (<div className="form-buttons-container">
            <MFButton type="button" theme={ComponentTheme.generic} onClickEvent={cancelEdit}><label>Cancelar</label></MFButton>
            <MFButton type='submit' theme={ComponentTheme.profileAndHealth}><label>Guardar</label></MFButton>
          </div>)
        }
      </form>
      <MFModal
        isOpen={confirmRelationshipRemoval}
        onClose={() => setConfirmRelationshipRemoval(false)}
      >
        <h2>Confirmar eliminación</h2>
        <p>
          Vas a remover {form.isTrainer ? 'estudiantes' : 'entrenadores'}, ¿estás seguro de hacer esto?
          La acción es irreversible.
        </p>
        <div className="form-buttons-container">
          <MFButton
            type="button"
            theme={ComponentTheme.generic}
            onClickEvent={() => setConfirmRelationshipRemoval(false)}
          >
            Cancelar
          </MFButton>
          <MFButton
            type="button"
            theme={ComponentTheme.profileAndHealth}
            onClickEvent={() => void saveProfile()}
          >
            Confirmar
          </MFButton>
        </div>
      </MFModal>
    </div>)
};

export default Profile;
