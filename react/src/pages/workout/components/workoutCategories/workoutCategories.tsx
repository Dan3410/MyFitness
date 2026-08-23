import { FC, useEffect, useState } from 'react';
import styles from './workoutCategories.module.scss';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { WorkoutCategory, WorkoutCategoryOption } from '../../../../models/workoutCategories';
import { workoutService } from '../../../../services/workoutService';

interface WorkoutCategoriesProps { }

const categoryIcons: Record<WorkoutCategory, string> = {
  [WorkoutCategory.SWIM]: '🏊‍♂️',
  [WorkoutCategory.GYM]: '🏋️‍♂️',
  [WorkoutCategory.RUN]: '🏃‍♂️',
  [WorkoutCategory.ALL]: '🏋️‍♂️'
};

const WorkoutCategories: FC<WorkoutCategoriesProps> = () => {

  const [categories, setCategories] = useState<WorkoutCategoryOption[]>()

  const navigate: NavigateFunction = useNavigate();

  const redirectTo = (categoryValue: WorkoutCategory) => {
    navigate(`/workout/edit/new?category=${categoryValue}`);
  }

  const getCategories = async () => {
    const allCategories = await workoutService.getCategories();
    setCategories(allCategories.filter((category: WorkoutCategoryOption) => category.value !== WorkoutCategory.ALL));
  }

  useEffect(() => {
    void getCategories();
  }, [])

  return (
    <div className={styles.workoutCategories}>
      <div className={styles.header}>
        <h2>Elige el tipo de entrenamiento</h2>
      </div>
      <div className={styles.categoriesContainer}>
        {categories?.map((category) => (
          <button key={category.value} type="button" className={styles.category} onClick={() => redirectTo(category.value)}>
            <span className={styles.icon} aria-hidden="true">{categoryIcons[category.value] ?? '🏋️‍♂️'}</span>
            <span className={styles.label}>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
};

export default WorkoutCategories;
