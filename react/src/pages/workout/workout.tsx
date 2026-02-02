import React, { FC } from 'react';
import styles from './workout.module.scss';
import { Outlet } from 'react-router-dom';


interface WorkoutProps { }

const Workout: FC<WorkoutProps> = () => {

  return (<>
    <div className={styles.workoutList}>
      <h2>
        Workouts
      </h2>
      <Outlet></Outlet>
    </div>
  </>
  )
};

export default Workout;
