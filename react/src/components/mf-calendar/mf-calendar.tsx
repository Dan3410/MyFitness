import type { FC } from 'react'
import styles from './mf-calendar.module.scss'
import type { PlannedWorkouts } from '../../services/calendarService'

interface MFCalendarProps {
  plannedWorkouts: PlannedWorkouts
  currentMonth: Date
  selectedDate: string
  onMonthChange: (month: Date) => void
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

const MFCalendar: FC<MFCalendarProps> = ({ plannedWorkouts, currentMonth, selectedDate, onMonthChange, onDateSelect, onRemoveWorkout }) => {
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
                {planned.slice(0, 2).map((workout) => (
                  <span key={workout.id}>{workout.title}</span>
                ))}
                {planned.length > 2 && <small>+{planned.length - 2} más</small>}
              </span>
            </div>
          )
        })}
      </div>

      <div className={styles.dayDetails}>
        <h3>Rutinas del {selectedDate}</h3>
        {selectedWorkouts.length === 0 ? <p>No hay rutinas planificadas.</p> : (
          <ul>
            {selectedWorkouts.map((workout) => (
              <li key={workout.id}>
                <span>{workout.title}</span>
                <button type="button" onClick={() => onRemoveWorkout(selectedDate, workout.id)} aria-label={`Quitar ${workout.title}`}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default MFCalendar
