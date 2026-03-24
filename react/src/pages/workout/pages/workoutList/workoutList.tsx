import { FC, useEffect, useState } from 'react';
import styles from './workoutList.module.scss';
import { WorkoutListItem } from '../../../../models/workoutListItem';
import { workoutService } from '../../../../services/workoutService';
import MFButton from '../../../../components/mf-button/mf-button';
import MFModal from '../../../../components/mf-modal/mf-modal';
import { ComponentTheme } from '../../../../themes/enums';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import { NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom';

interface WorkoutListProps { }

const WorkoutList: FC<WorkoutListProps> = () => {

  const [searchParams, setSearchParams] = useSearchParams({ category: "all" })
  const [list, setList] = useState<WorkoutListItem[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutListItem | undefined>(undefined)
  const [categories, setCategories] = useState<WorkoutCategory[]>()
  const [category, setCategory] = useState<string>("")
  const navigate: NavigateFunction = useNavigate();
  //Probably this gonna get moved to a file
  const formattedDate = (date: String) => {
    return date.replaceAll("-", "/")
  }

  const getWorkoutList = async () => {
    //Falta ver que esto no salte dos veces
    let category = searchParams.get("category")
    setList(await workoutService.getWorkoutsListItem("0", category ? category : "all"))
  }

  const openDeletePopup = (workout: WorkoutListItem) => {
    setWorkoutSelected(workout)
    setOpen(true)
  }

  const openWorkout = (workout: WorkoutListItem) => {
    navigate("/workout/edit/" + workout.id);
  }

  const deleteWorkout = (id: string) => {
    workoutService.deleteWorkout(id).then((list: WorkoutListItem[]) => {
      setList(list)
    }).catch(() => { })
  }


  const getCategories = async () => (
    setCategories(await workoutService.getCategories())
  )

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
    let category = searchParams.get("category")
    setCategory(category ? category : "")
  }, [searchParams])

  return (<>
    <MFFormField theme={ComponentTheme.workout}>
      <label>Actividad</label>
      <select name="category" value={category} onChange={handleCategoryChange}>
        {categories && categories.map((item: WorkoutCategory) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    </MFFormField>

    <div className={styles.workoutList}>
      <table>
        <thead>
          <tr>
            <th> Nombre </th>
            <th> Categoría </th>
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
              </td>
              <td> {item.category} </td>
              <td>
                {item.estimatedTime}
              </td>
              <td>
                {formattedDate(item.lastTimeDone)}
              </td>
              <td className={styles.listActionsContainer}>
                <MFButton onClickEvent={() => openDeletePopup(item)}>Delete</MFButton>
                <MFButton onClickEvent={() => openWorkout(item)}>Editar</MFButton>
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
    </div>
  </>
  )
};

export default WorkoutList;
