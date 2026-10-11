import { FC, useEffect, useState } from 'react';
import styles from './calendar.module.scss';
import { useAuth } from '../../context/AuthContext';
import MFCalendar from '../../components/mf-calendar/mf-calendar';
import { WorkoutCategory } from '../../models/workoutCategories';
import type { WorkoutListItem } from '../../models/workoutListItem';
import { workoutService } from '../../services/workoutService';
import { calendarService, type PlannedWorkouts } from '../../services/calendarService';


interface CalendarProps { }

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const Calendar: FC<CalendarProps> = () => {
  const { session } = useAuth();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkouts>({});
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const [workoutList, calendarData] = await Promise.all([
          workoutService.getWorkoutsListItem(session?.userId || '', WorkoutCategory.ALL),
          calendarService.getCalendar(monthKey(currentMonth)),
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
  }, [session?.userId, currentMonth]);

  const changeMonth = (month: Date) => {
    setCurrentMonth(month)
    setSelectedDate(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`)
  }

  const addWorkout = async () => {
    if (!selectedWorkoutId) return
    try {
      await calendarService.addPlannedWorkout(selectedDate, selectedWorkoutId)
      setPlannedWorkouts(await calendarService.getCalendar(monthKey(currentMonth)))
      setSelectedWorkoutId('')
    } catch {
      setLoadError(true)
    }
  }

  const removeWorkout = async (date: string, workoutId: string) => {
    try {
      await calendarService.removePlannedWorkout(date, workoutId)
      setPlannedWorkouts(await calendarService.getCalendar(monthKey(currentMonth)))
    } catch {
      setLoadError(true)
    }
  }

  return (<>
    <div className={styles.workoutList}>
      {loading ? <p>Cargando calendario...</p> : loadError ? <p>No se pudo cargar el calendario.</p> : <>
        <MFCalendar
          plannedWorkouts={plannedWorkouts}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onMonthChange={changeMonth}
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
