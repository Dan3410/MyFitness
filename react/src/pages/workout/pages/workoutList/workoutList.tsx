import { FC, useEffect, useRef, useState } from 'react';
import styles from './workoutList.module.scss';
import { WorkoutListItem } from '../../../../models/workoutListItem';
import { workoutService } from '../../../../services/workoutService';
import MFButton from '../../../../components/mf-button/mf-button';
import MFModal from '../../../../components/mf-modal/mf-modal';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import { ComponentTheme } from '../../../../models/componentTheme';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { WorkoutCategory, WorkoutCategoryOption } from '../../../../models/workoutCategories';
import { NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom';
import { GET_DATA_ERROR_MESSAGE } from '../../../../const/errorMessages';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
import MFCheckbox from '../../../../components/mf-checkbox/mf-checkbox';
import MFNotification from '../../../../components/mf-notification/mf-notification';
import { useAuth } from '../../../../context/AuthContext';
import { profileService } from '../../../../services/profileService';
import { trainerStudentService } from '../../../../services/trainerStudentService';
import type { UserSearchResult } from '../../../../models/user';

interface WorkoutListProps { }

const WorkoutList: FC<WorkoutListProps> = () => {

  const [searchParams, setSearchParams] = useSearchParams({ category: "all" })
  const [list, setList] = useState<WorkoutListItem[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutListItem | undefined>(undefined)
  const [categories, setCategories] = useState<WorkoutCategoryOption[]>()
  const [category, setCategory] = useState<string>("")
  const [loadError, setLoadError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [students, setStudents] = useState<UserSearchResult[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [isTrainer, setIsTrainer] = useState(false)
  const [trainerDataError, setTrainerDataError] = useState(false)
  const [shareWorkout, setShareWorkout] = useState<WorkoutListItem | null>(null)
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState(false)
  const [shareSuccess, setShareSuccess] = useState('')
  const shareNotificationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate: NavigateFunction = useNavigate();
  const { session } = useAuth()

  useEffect(() => () => {
    if (shareNotificationTimeout.current) clearTimeout(shareNotificationTimeout.current)
  }, [])

  const startShareNotificationTimeout = () => {
    if (shareNotificationTimeout.current) clearTimeout(shareNotificationTimeout.current)
    shareNotificationTimeout.current = setTimeout(() => {
      setShareError(false)
      setShareSuccess('')
      shareNotificationTimeout.current = null
    }, 5000)
  }

  //Probably this gonna get moved to a file
  const formattedDate = (date: string) => {
    return date.replaceAll("-", "/")
  }

  const getWorkoutList = async () => {
    //Falta ver que esto no salte dos veces
    const selectedCategory = searchParams.get("category")
    try {
      setLoadError(false)
      setList(await workoutService.getWorkoutsListItem("0", selectedCategory as WorkoutCategory || WorkoutCategory.ALL))
    } catch {
      setList([])
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  const openDeletePopup = (workout: WorkoutListItem) => {
    setWorkoutSelected(workout)
    setOpen(true)
  }

  const openWorkout = (workout: WorkoutListItem) => {
    navigate("/workout/edit/" + workout.id);
  }

  const createWorkout = () => {
    navigate('/workout/categories');
  }

  const deleteWorkout = (id: string) => {
    workoutService.deleteWorkout(id).then((list: WorkoutListItem[]) => {
      setList(list)
    }).catch(() => { })
  }


  const getCategories = async () => {
    try {
      setCategories(await workoutService.getCategories())
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", event.target.value);
    setSearchParams(newParams);
    setCategory(event.target.value)
    getWorkoutList()
  }

  useEffect(() => {
    getWorkoutList()
    getCategories()
    const category = searchParams.get("category")
    setCategory(category ? category : "")
  }, [searchParams])

  useEffect(() => {
    let active = true
    const loadTrainerData = async () => {
      setLoadingStudents(true)
      setTrainerDataError(false)
      setIsTrainer(false)
      setStudents([])
      try {
        const user = await profileService.getUserData()
        if (!active) return
        setIsTrainer(user.isTrainer)
        if (user.isTrainer) {
          const linkedStudents = await trainerStudentService.getStudents()
          if (active) setStudents(linkedStudents)
        }
      } catch {
        if (active) setTrainerDataError(true)
      } finally {
        if (active) setLoadingStudents(false)
      }
    }
    void loadTrainerData()
    return () => { active = false }
  }, [session?.userId])

  const openShareModal = async (workout: WorkoutListItem) => {
    setShareWorkout(workout)
    setSelectedStudentIds([])
    setShareError(false)
    setLoadingStudents(true)
    setTrainerDataError(false)
    try {
      const [linkedStudents, sharedStudentIds] = await Promise.all([
        trainerStudentService.getStudents(),
        workoutService.getSharedStudentIds(workout.id),
      ])
      setStudents(linkedStudents)
      setSelectedStudentIds(sharedStudentIds)
    } catch {
      setStudents([])
      setTrainerDataError(true)
    } finally {
      setLoadingStudents(false)
    }
  }

  const shareSelectedWorkout = async () => {
    if (!shareWorkout) return
    if (shareNotificationTimeout.current) clearTimeout(shareNotificationTimeout.current)
    setSharing(true)
    setShareError(false)
    setShareSuccess('')
    try {
      const sharedWith = await workoutService.shareWorkout(shareWorkout.id, selectedStudentIds)
      setShareSuccess(sharedWith.length === 0
        ? 'Se quitó la rutina de todos los alumnos.'
        : `Rutina compartida con ${sharedWith.length} alumno${sharedWith.length === 1 ? '' : 's'}.`)
      startShareNotificationTimeout()
      setShareWorkout(null)
    } catch {
      setShareError(true)
      startShareNotificationTimeout()
    } finally {
      setSharing(false)
    }
  }

  return (<>
  <div className="pageHeader">
    <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Workouts' }]} />
    <div className="pageTitleBar">
      <h2>
        Rutinas de ejercicio
      </h2>
      <MFButton theme={ComponentTheme.workout} type="button" onClickEvent={createWorkout}>Crear rutina</MFButton>
    </div>
  </div>
  {trainerDataError || shareError || shareSuccess ? <div className={styles.workoutListNotifications}>
    {trainerDataError && <MFNotification type="warning" message="No se pudieron cargar los datos del entrenador y sus alumnos." />}
    {shareSuccess && <MFNotification type="success" message={shareSuccess} />}
    {shareError && <MFNotification type="failure" message="No se pudo compartir la rutina." />}
  </div> : null}
    <MFFormField theme={ComponentTheme.workout}>
      <label>Actividad</label>
      <select name="category" value={category} onChange={handleCategoryChange}>
        {categories && categories?.length > 0 && categories.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    </MFFormField>

    {loading || loadingCategories ? <MFSpinner theme={ComponentTheme.workout} /> : loadError ? <p>{GET_DATA_ERROR_MESSAGE}</p> : <div className={styles.workoutList}>
      <table cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th> Nombre </th>
            <th> Categoria </th>
            <th> Duración estimada </th>
            <th> Última vez realizada </th>
            <th> Acciones </th>
          </tr>
        </thead>
        <tbody>
          {list && list.map((item: WorkoutListItem) => (
            <tr key={item.id}>
              <td>
                {item.name}
                {item.sourceTrainerName && <small className={styles.trainerAttribution}>De {item.sourceTrainerName}</small>}
              </td>
              <td> {item.category} </td>
              <td>
                {item.estimatedTime} minutos
              </td>
              <td>
                {formattedDate(item.lastTimeDone)}
              </td>
              <td className={styles.listActionsContainer}>
                {item.sourceTrainerName ? (
                  <MFButton theme={ComponentTheme.workout} onClickEvent={() => navigate(`/workout/view/${item.id}`)}>Ver</MFButton>
                ) : (
                  <>
                    <MFButton onClickEvent={() => openDeletePopup(item)}>Eliminar</MFButton>
                    <MFButton theme={ComponentTheme.workout} onClickEvent={() => openWorkout(item)}>Editar</MFButton>
                    {isTrainer && <MFButton onClickEvent={() => void openShareModal(item)}>Compartir</MFButton>}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MFModal isOpen={open} onClose={() => setOpen(false)}>
        <h2>Borrar rutina</h2>
        <p>¿Estas seguro de borrar la rutina {workoutSelected?.name}? Esta acción se no se puede deshacer.</p>
        <div className={styles.modalButtonContainer}>
          <MFButton onClickEvent={() => setOpen(false)}>Cancelar</MFButton>
          <MFButton onClickEvent={() => workoutSelected && deleteWorkout(workoutSelected?.id)} theme={ComponentTheme.workout}>Eliminar</MFButton>
        </div>
      </MFModal>
      <MFModal isOpen={shareWorkout !== null} onClose={() => setShareWorkout(null)}>
        <h2>Compartir rutina</h2>
        <p>Selecciona los alumnos que recibirán “{shareWorkout?.name}”.</p>
        {sharing ? (
          <MFSpinner theme={ComponentTheme.workout} label="Compartiendo rutina" />
        ) : (
          <>
            {loadingStudents ? <p>Cargando alumnos...</p> : students.length === 0 ? <p>No tienes alumnos vinculados.</p> : (
              <div className={styles.studentSelection}>
                {students.map((student) => (
                  <MFCheckbox
                    key={student.id}
                    theme={ComponentTheme.workout}
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={(event) => setSelectedStudentIds((current) => event.target.checked
                      ? [...current, student.id]
                      : current.filter((id) => id !== student.id))}
                  >
                    {student.name}
                  </MFCheckbox>
                ))}
              </div>
            )}
            {shareError && <p role="alert">No se pudo compartir la rutina.</p>}
            <div className={styles.modalButtonContainer}>
              <MFButton onClickEvent={() => setShareWorkout(null)}>Cancelar</MFButton>
              <MFButton
                theme={ComponentTheme.workout}
                isDisabled={loadingStudents}
                onClickEvent={() => void shareSelectedWorkout()}
              >
                Compartir
              </MFButton>
            </div>
          </>
        )}
      </MFModal>
    </div>}
  </>
  )
};

export default WorkoutList;
