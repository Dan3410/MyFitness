import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Workout } from '../../../../models/workout';
import { workoutService } from '../../../../services/workoutService';

import StepEditor from '../../components/stepEditor/stepEditor';
import StepsList from '../../components/stepsList/stepsList';

interface WorkoutEditorProps { }

const WorkoutEditor: FC<WorkoutEditorProps> = () => {

  const [workout, setWorkout] = useState<Workout>()
  const id = useParams().id

  const getWorkout = async () => {
    const res = await workoutService.getWorkoutSteps(id!);
    setWorkout(res)
  }

  useEffect(() => {
    getWorkout()

  }, [])

  if(workout === undefined){
    return <div>Loading...</div>
  }else{
    return (<>
      <div>
        <div>
          <StepEditor></StepEditor>
        </div>
        <StepsList workout={workout}></StepsList>
  
      </div>
    </>
    )
  }
};

export default WorkoutEditor;
