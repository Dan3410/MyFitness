import { useState, type FC } from 'react'
import styles from './mf-calendar.module.scss'
import type { CalendarEvent, PlannedWorkouts } from '../../services/calendarService'
import MFButton from '../mf-button/mf-button'
import { ComponentTheme } from '../../models/componentTheme'
import { useNavigate } from 'react-router-dom'
import MFModal from '../mf-modal/mf-modal'

interface MFCalendarProps {
  plannedWorkouts: PlannedWorkouts
  currentMonth: Date
  selectedDate: string
  onMonthChange: (month: Date) => void
  onDateSelect: (date: string) => void
  onRemoveWorkout: (date: string, workoutId: string) => void
  events?: Record<string, CalendarEvent[]>
  isTrainer?: boolean
  onCancelEvent?: (eventId: string) => void
}

const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MFCalendar: FC<MFCalendarProps> = ({
  plannedWorkouts,
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  onRemoveWorkout,
  events = {},
  isTrainer = false,
  onCancelEvent,
}) => {
  const navigate = useNavigate()
  const [workoutToRemove, setWorkoutToRemove] = useState<{ id: string; title: string } | null>(null)
  const [removingWorkout, setRemovingWorkout] = useState(false)
  const today = new Date()
  const changeMonth = (offset: number) => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    onMonthChange(nextMonth)
    onDateSelect(dateKey(nextMonth))
  }

  const firstDayOffset = (currentMonth.getDay() + 6) % 7
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const days = Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstDayOffset + 1
    return day > 0 && day <= daysInMonth
      ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      : null
  })

  const selectedWorkouts = plannedWorkouts[selectedDate] || []
  const selectedEvents = events[selectedDate] || []

  const confirmWorkoutRemoval = async () => {
    if (!workoutToRemove) return
    setRemovingWorkout(true)
    try {
      await onRemoveWorkout(selectedDate, workoutToRemove.id)
      setWorkoutToRemove(null)
    } finally {
      setRemovingWorkout(false)
    }
  }

  return (
    <>
    <section className={styles.calendar} aria-label="Calendario de workouts">
      <div className={styles.calendarHeader}>
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior"><label>&#8249;</label></button>
        <h2>{monthFormatter.format(currentMonth)}</h2>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente"><label>&#8250;</label></button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className={styles.daysGrid}>
        {days.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className={styles.emptyDay} />
          const key = dateKey(date)
          const planned = plannedWorkouts[key] || []
          return (
            <div
              key={key}
              className={`${styles.day} ${key === selectedDate ? styles.selectedDay : ''} ${key === dateKey(today) ? styles.today : ''}`}
              onClick={() => onDateSelect(key)}
            >
              <strong>{date.getDate()}</strong>
              <span className={styles.dayWorkouts}>
                {planned.slice(0, 2).map((workout) => (
                  <span key={workout.id}>{workout.title}</span>
                ))}
                {planned.length > 2 && <small>+{planned.length - 2} más</small>}
              </span>
              <span className={styles.dayEvents}>
                {(events[key] || []).slice(0, 2).map((event) => (
                  <span key={event.id}>{isTrainer ? event.studentName : event.trainerName}</span>
                ))}
                {(events[key] || []).length > 2 && <small>+{(events[key] || []).length - 2} más</small>}
              </span>
            </div>
          )
        })}
      </div>

      <div className={styles.dayDetails}>
        <h3>Eventos ({selectedDate})</h3>
        <h4>Rutinas</h4>
        {selectedWorkouts.length === 0 ? <p>No hay rutinas planificadas.</p> : (
          <ul>
            {selectedWorkouts.map((workout) => (
              <li key={workout.id}>
                <span>{workout.title}</span>
                <div className={styles.workoutActions}>
                  <MFButton
                    theme={ComponentTheme.workout}
                    onClickEvent={() => navigate(`/workout/view/${workout.id}`)}
                  >
                    Ver
                  </MFButton>
                  <MFButton
                    theme={ComponentTheme.workout}
                    onClickEvent={() => setWorkoutToRemove(workout)}
                  >
                    Quitar
                  </MFButton>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h4>Eventos con estudiantes</h4>
        {selectedEvents.length === 0 ? <p>No hay eventos planificados.</p> : (
          <ul>
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <span>{isTrainer ? event.studentName : event.trainerName}</span>
                <MFButton
                  theme={ComponentTheme.workout}
                  onClickEvent={() => onCancelEvent?.(event.id)}
                >
                  Cancelar evento
                </MFButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
    <MFModal isOpen={workoutToRemove !== null} onClose={() => setWorkoutToRemove(null)}>
      <h2>Quitar rutina</h2>
      <p>
        ¿Estas seguro que queres quitar la rutina {workoutToRemove?.title}?
        <br />
        Esta acción no se puede deshacer
      </p>
      <div className={styles.workoutConfirmationButtons}>
        <MFButton
          onClickEvent={() => setWorkoutToRemove(null)}
          isDisabled={removingWorkout}
        >
          Volver
        </MFButton>
        <MFButton
          theme={ComponentTheme.workout}
          onClickEvent={() => void confirmWorkoutRemoval()}
          isDisabled={removingWorkout}
        >
          {removingWorkout ? 'Quitando...' : 'Quitar rutina'}
        </MFButton>
      </div>
    </MFModal>
    </>
  )
}

export default MFCalendar
