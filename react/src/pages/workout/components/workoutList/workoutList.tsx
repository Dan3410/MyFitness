import { FC, useEffect, useState } from 'react';
import styles from './workoutList.module.scss';
import { WorkoutListItem } from '../../../../models/workoutListItem';
import { workoutService } from '../../../../services/workoutService';
import MFButton from '../../../../components/mf-button/mf-button';

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

  const deleteWorkout = (id: string) => (
    workoutService.deleteWorkout(id).then((list: WorkoutListItem[]) => {
      console.log(list)
      setList(list)
    }).catch(() => {})
  )

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
                <MFButton onClickEvent={() => deleteWorkout(item.id)}>Delete</MFButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default WorkoutList;
