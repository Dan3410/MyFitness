import { useState, type FC } from 'react'
import styles from './mf-calendar.module.scss'
import type { WorkoutListItem } from '../../models/workoutListItem'
import type { PlannedWorkouts } from '../../services/workoutService'

interface MFCalendarProps {
  workouts: WorkoutListItem[]
  plannedWorkouts: PlannedWorkouts
  selectedDate: string
  onDateSelect: (date: string) => void
  onRemoveWorkout: (date: string, workoutId: string) => void
}

const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MFCalendar: FC<MFCalendarProps> = ({ workouts, plannedWorkouts, selectedDate, onDateSelect, onRemoveWorkout }) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const changeMonth = (offset: number) => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    setCurrentMonth(nextMonth)
    onDateSelect(dateKey(nextMonth))
  }

  const getWorkoutById = (workoutId: string) =>
    workouts.find((workout) => String(workout.id) === String(workoutId))

  const firstDayOffset = (currentMonth.getDay() + 6) % 7
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const days = Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstDayOffset + 1
    return day > 0 && day <= daysInMonth
      ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      : null
  })

  const selectedWorkoutNames = (plannedWorkouts[selectedDate] || [])
    .map(getWorkoutById)
    .filter((workout): workout is WorkoutListItem => Boolean(workout))

  return (
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
                {planned.slice(0, 2).map((workoutId) => (
                  <span key={workoutId}>{getWorkoutById(workoutId)?.name || 'Workout'}</span>
                ))}
                {planned.length > 2 && <small>+{planned.length - 2} más</small>}
              </span>
            </div>
          )
        })}
      </div>

      <div className={styles.dayDetails}>
        <h3>Rutinas del {selectedDate}</h3>
        {selectedWorkoutNames.length === 0 ? <p>No hay rutinas planificadas.</p> : (
          <ul>
            {selectedWorkoutNames.map((workout) => (
              <li key={workout.id}>
                <span>{workout.name}</span>
                <button type="button" onClick={() => onRemoveWorkout(selectedDate, String(workout.id))} aria-label={`Quitar ${workout.name}`}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default MFCalendar
