import { FC, useEffect, useState } from 'react';
import styles from './workoutCategories.module.scss';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import { workoutService } from '../../../../services/workoutService';
import { Option } from '../../../../models/option';

interface WorkoutCategoriesProps { }

const categoryIcons: Record<string, string> = {
  swim: '🏊‍♂️',
  gym: '🏋️‍♂️',
  run: '🏃‍♂️'
};

const WorkoutCategories: FC<WorkoutCategoriesProps> = () => {

  const [categories, setCategories] = useState<WorkoutCategory[]>()

  const navigate: NavigateFunction = useNavigate();

  const redirectTo = (categoryValue: string) => {
    navigate(`/workout/edit/new?category=${categoryValue}`);
  }

  const getCategories = async () => {
    const allCategories = await workoutService.getCategories();
    setCategories(allCategories.filter((category: WorkoutCategory) => category.value !== 'all'));
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
        {categories?.map((category: Option) => (
          <button key={category.value} type="button" className={styles.category} onClick={() => redirectTo(category.value as string)}>
            <span className={styles.icon} aria-hidden="true">{categoryIcons[category.value as string] ?? '🏋️‍♂️'}</span>
            <span className={styles.label}>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
};

export default WorkoutCategories;
