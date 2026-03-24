import { FC, useEffect, useState } from 'react';
import styles from './workoutEditor.module.scss';
import { useParams, useSearchParams } from 'react-router-dom';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {

  const [searchParams, setSearchParams] = useSearchParams({ category: "all" })
  const id = useParams().id

  useEffect(() => {
    console.log(id)
    
    //Meanwhile, a loading screen
    }, [])

  return (<>
  </>
  )
};

export default WorkoutEditor;
