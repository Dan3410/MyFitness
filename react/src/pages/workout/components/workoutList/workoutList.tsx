import { FC, useEffect, useState } from 'react';
import styles from './workoutList.module.scss';
import { WorkoutListItem } from '../../../../models/workoutListItem';
import { workoutService } from '../../../../services/workoutService';
import MFButton from '../../../../components/mf-button/mf-button';
import MFModal from '../../../../components/mf-modal/mf-modal';
import { ComponentTheme } from '../../../../themes/enums';

interface WorkoutListProps { }

const WorkoutList: FC<WorkoutListProps> = () => {

  const [list, setList] = useState<WorkoutListItem[]>([])

  //Probably this gonna get moved to a file
  const formattedDate = (date: String) => {
    return date.replaceAll("-","/")
  }

  const getWorkoutList = async () => (
    setList(await workoutService.getWorkoutsListItem("0", "all"))
  )

  const [open, setOpen] = useState<boolean>(false)
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutListItem | undefined>(undefined)

  const openDeletePopup = (workout: WorkoutListItem) => {
    setWorkoutSelected(workout)
    setOpen(true)
  }
  
  const deleteWorkout = (id: string) => {
    console.log(id)
    workoutService.deleteWorkout(id).then((list: WorkoutListItem[]) => {
      console.log(list)
      setList(list)
    }).catch(() => {})
  }

  useEffect(() => {
    getWorkoutList()
  }, [])

  return (
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
              <td>
                <MFButton onClickEvent={() => openDeletePopup(item)}>Delete</MFButton>
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
          <MFButton onClickEvent={() => workoutSelected && deleteWorkout(workoutSelected?.id) } theme={ComponentTheme.workout}>Eliminar</MFButton>
        </div>
      </MFModal>
    </div>
  )
};

export default WorkoutList;
