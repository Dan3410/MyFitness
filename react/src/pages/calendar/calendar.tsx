import { FC, useEffect, useMemo, useState } from 'react';
import styles from './calendar.module.scss';
import { useAuth } from '../../context/AuthContext';
import MFCalendar from '../../components/mf-calendar/mf-calendar';
import { WorkoutCategory } from '../../models/workoutCategories';
import type { WorkoutListItem } from '../../models/workoutListItem';
import { workoutService } from '../../services/workoutService';
import { calendarService, type CalendarEvent, type PlannedWorkouts } from '../../services/calendarService';
import MFSelector from '../../components/mf-selector/mf-selector';
import { ComponentTheme } from '../../models/componentTheme';
import { profileService } from '../../services/profileService';
import { trainerStudentService } from '../../services/trainerStudentService';
import type { UserSearchResult } from '../../models/user';
import type { Option } from '../../models/option';
import MFModal from '../../components/mf-modal/mf-modal';
import MFButton from '../../components/mf-button/mf-button';


interface CalendarProps { }

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const calendarModes: Option[] = [
  { label: 'Rutinas', value: 'workouts' },
  { label: 'Alumnos', value: 'students' },
];

const Calendar: FC<CalendarProps> = () => {
  const { session } = useAuth();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkouts>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [students, setStudents] = useState<UserSearchResult[]>([]);
  const [isTrainer, setIsTrainer] = useState(false);
  const [calendarMode, setCalendarMode] = useState('workouts');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [workoutTime, setWorkoutTime] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventWorkoutId, setEventWorkoutId] = useState('');
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventToCancel, setEventToCancel] = useState<CalendarEvent | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState(false);
  const [studentLoadError, setStudentLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const [workoutList, calendarData, eventList, profile] = await Promise.all([
          workoutService.getWorkoutsListItem(session?.userId || '', WorkoutCategory.ALL),
          calendarService.getCalendar(monthKey(currentMonth)),
          calendarService.getEvents(monthKey(currentMonth)),
          profileService.getUserData(),
        ])
        setWorkouts(workoutList)
        setPlannedWorkouts(calendarData)
        setEvents(eventList)
        setIsTrainer(Boolean(profile.isTrainer))
      } catch {
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }

    if (session?.userId) void loadCalendar()
  }, [session?.userId, currentMonth]);

  useEffect(() => {
    if (!isTrainer || calendarMode !== 'students') return
    let cancelled = false
    setStudentLoadError(false)
    trainerStudentService.getStudents().then((studentList) => {
      if (!cancelled) setStudents(studentList)
    }).catch(() => {
      if (!cancelled) setStudentLoadError(true)
    })
    return () => { cancelled = true }
  }, [isTrainer, calendarMode])

  const changeMonth = (month: Date) => {
    setCurrentMonth(month)
    setSelectedDate(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`)
  }

  const addWorkout = async () => {
    if (!selectedWorkoutId) return
    try {
      await calendarService.addPlannedWorkout(selectedDate, selectedWorkoutId, workoutTime || undefined)
      setPlannedWorkouts(await calendarService.getCalendar(monthKey(currentMonth)))
      setSelectedWorkoutId('')
      setWorkoutTime('')
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

  const createEvent = async () => {
    if (!selectedStudentId) return
    try {
      setSavingEvent(true)
      await calendarService.createEvent(
        selectedDate,
        selectedStudentId,
        eventTime || undefined,
        eventWorkoutId || undefined,
      )
      setEvents(await calendarService.getEvents(monthKey(currentMonth)))
      setSelectedStudentId('')
      setEventTime('')
      setEventWorkoutId('')
    } catch {
      setLoadError(true)
    } finally {
      setSavingEvent(false)
    }
  }

  const requestEventCancellation = (eventId: string) => {
    const event = events.find((item) => item.id === eventId)
    if (event) setEventToCancel(event)
  }

  const cancelEvent = async () => {
    if (!eventToCancel) return
    try {
      setCancellingEvent(true)
      await calendarService.cancelEvent(eventToCancel.id)
      setEvents(await calendarService.getEvents(monthKey(currentMonth)))
      setEventToCancel(null)
    } catch {
      setLoadError(true)
    } finally {
      setCancellingEvent(false)
    }
  }

  const eventsByDate = useMemo(
    () => events.reduce<Record<string, CalendarEvent[]>>((grouped, event) => {
      grouped[event.date] = [...(grouped[event.date] || []), event]
      return grouped
    }, {}),
    [events],
  )

  return (<>
    <div className={styles.workoutList}>
      {loading ? <p>Cargando calendario...</p> : loadError ? <p>No se pudo cargar el calendario.</p> : <>
        <MFCalendar
          plannedWorkouts={plannedWorkouts}
          events={eventsByDate}
          isTrainer={isTrainer}
          currentUserId={session?.userId || ''}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onMonthChange={changeMonth}
          onDateSelect={setSelectedDate}
          onRemoveWorkout={removeWorkout}
          onCancelEvent={requestEventCancellation}
        />
        {isTrainer && (
          <MFSelector
            label="Calendario"
            theme={ComponentTheme.workout}
            options={calendarModes}
            value={calendarMode}
            onChange={(value) => setCalendarMode(String(value))}
          />
        )}
        {isTrainer && calendarMode === 'students' ? (
          <div className={styles.addWorkout}>
            {studentLoadError && <p>No se pudieron cargar los alumnos.</p>}
            <label htmlFor="calendar-student">Seleccionar alumno para el {selectedDate}</label>
            <select
              id="calendar-student"
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
            >
              <option value="">Seleccionar alumno</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
            </select>
            <label htmlFor="calendar-event-time">Hora*</label>
            <input
              id="calendar-event-time"
              type="time"
              value={eventTime}
              onChange={(event) => setEventTime(event.target.value)}
            />
            <label htmlFor="calendar-event-workout">Rutina*</label>
            <select
              id="calendar-event-workout"
              value={eventWorkoutId}
              onChange={(event) => setEventWorkoutId(event.target.value)}
            >
              <option value="">Sin rutina</option>
              {workouts.filter((workout) => !workout.sourceTrainerName).map((workout) => (
                <option key={workout.id} value={workout.id}>{workout.name}</option>
              ))}
            </select>
            <button type="button" onClick={createEvent} disabled={!selectedStudentId || savingEvent}>
              Crear evento
            </button>
          </div>
        ) : (
          <div className={styles.addWorkout}>
            <label htmlFor="calendar-workout">Agregar rutina al {selectedDate}*</label>
            <select id="calendar-workout" value={selectedWorkoutId} onChange={(event) => setSelectedWorkoutId(event.target.value)}>
              <option value="">Seleccionar rutina</option>
              {workouts.map((workout) => <option key={workout.id} value={workout.id}>{workout.name}</option>)}
            </select>
            <label htmlFor="calendar-workout-time">Hora</label>
            <input
              id="calendar-workout-time"
              type="time"
              value={workoutTime}
              onChange={(event) => setWorkoutTime(event.target.value)}
            />
            <button type="button" onClick={addWorkout} disabled={!selectedWorkoutId}>Agregar</button>
          </div>
        )}
      </>}
    </div>
    <MFModal isOpen={eventToCancel !== null} onClose={() => setEventToCancel(null)}>
      <h2>Cancelar evento</h2>
      <p>
        ¿Estas seguro que queres cancelar el evento con {eventToCancel
          ? (isTrainer ? eventToCancel.studentName : eventToCancel.trainerName)
          : ''}?
        <br />
        Esta acción no se puede deshacer
      </p>
      <div className={styles.confirmationButtons}>
        <MFButton
          type="button"
          onClickEvent={() => setEventToCancel(null)}
          isDisabled={cancellingEvent}
        >
          Volver
        </MFButton>
        <MFButton
          type="button"
          theme={ComponentTheme.workout}
          onClickEvent={() => void cancelEvent()}
          isDisabled={cancellingEvent}
        >
          {cancellingEvent ? 'Cancelando...' : 'Cancelar evento'}
        </MFButton>
      </div>
    </MFModal>
  </>
  )
};

export default Calendar;
