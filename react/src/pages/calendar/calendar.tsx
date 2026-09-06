import { FC, useEffect, useState } from 'react';
import styles from './calendar.module.scss';
import { useAuth } from '../../context/AuthContext';
import MFCalendar from '../../components/mf-calendar/mf-calendar';
import { WorkoutCategory } from '../../models/workoutCategories';
import type { WorkoutListItem } from '../../models/workoutListItem';
import { workoutService } from '../../services/workoutService';
import { calendarService, type PlannedWorkouts } from '../../services/calendarService';


interface CalendarProps { }

const Calendar: FC<CalendarProps> = () => {
  const { session } = useAuth();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkouts>({});
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoadError(false)
        const [workoutList, calendarData] = await Promise.all([
          workoutService.getWorkoutsListItem(session?.userId || '', WorkoutCategory.ALL),
          calendarService.getCalendar(),
        ])
        setWorkouts(workoutList)
        setPlannedWorkouts(calendarData)
      } catch {
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }

    if (session?.userId) void loadCalendar()
  }, [session?.userId]);

  const addWorkout = async () => {
    if (!selectedWorkoutId) return
    try {
      setPlannedWorkouts(await calendarService.addPlannedWorkout(selectedDate, selectedWorkoutId))
      setSelectedWorkoutId('')
    } catch {
      setLoadError(true)
    }
  }

  const removeWorkout = async (date: string, workoutId: string) => {
    try {
      setPlannedWorkouts(await calendarService.removePlannedWorkout(date, workoutId))
    } catch {
      setLoadError(true)
    }
  }

  return (<>
    <div className={styles.workoutList}>
      {loading ? <p>Cargando calendario...</p> : loadError ? <p>No se pudo cargar el calendario.</p> : <>
        <MFCalendar
          workouts={workouts}
          plannedWorkouts={plannedWorkouts}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onRemoveWorkout={removeWorkout}
        />
        <div className={styles.addWorkout}>
          <label htmlFor="calendar-workout">Agregar rutina al {selectedDate}</label>
          <select id="calendar-workout" value={selectedWorkoutId} onChange={(event) => setSelectedWorkoutId(event.target.value)}>
            <option value="">Seleccionar rutina</option>
            {workouts.map((workout) => <option key={workout.id} value={workout.id}>{workout.name}</option>)}
          </select>
          <button type="button" onClick={addWorkout} disabled={!selectedWorkoutId}>Agregar</button>
        </div>
      </>}
    </div>
  </>
  )
};

export default Calendar;
