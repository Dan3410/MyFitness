import React, { FC } from 'react';
import styles from './workoutList.module.scss';

interface WorkoutListProps { }

const WorkoutList: FC<WorkoutListProps> = () => {
  // Could be a list of categories first then it shows all workout of that category.
  // Something like blocks
  const CATEGORIES = [
    { label: "Natación", value: 'swim' },
    { label: "Fuerza", value: "gym" },
    { label: "Correr", value: "run" }
  ]

  return (
    <div className={styles.workoutList}>
      <h2>
        Workouts
      </h2>
      <div className={styles.categoriesContainer}>
        {CATEGORIES.map((category: {label: string, value: string}) => (
          <button className={styles.category}>
            <label>{category.label}</label>
          </button>
        ))}

      </div>
    </div>
  )
};

export default WorkoutList;
