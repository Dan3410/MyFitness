import { FC, useEffect, useState } from 'react';
import styles from './workoutCategories.module.scss';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { workoutCategory } from '../../../../models/workoutCategories';
import { workoutService } from '../../../../services/workoutService';

interface WorkoutCategoriesProps { }

const WorkoutCategories: FC<WorkoutCategoriesProps> = () => {

  const [categories, setCategories] = useState<workoutCategory[]>()

  const navigate: NavigateFunction = useNavigate();

  const redirectTo = (string: string) => {
    navigate(string)
  }

  const getCategories = async () => (
    setCategories(await workoutService.getCategories())
  )
  useEffect(() => {
    getCategories()
  }, [])


  return (
    <div className={styles.workoutCategories}>
      <div className={styles.categoriesContainer}>
        {categories?.map((category: { label: string, value: string }) => (
          <button className={styles.category} onClick={() => redirectTo(category.value)}>
            <label>{category.label}</label>
          </button>
        ))}
      </div>
    </div>
  )
};

export default WorkoutCategories;
