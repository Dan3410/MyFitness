import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent, PlannedWorkouts } from '../../services/calendarService'
import MFCalendar from './mf-calendar'

const selectedDate = '2025-01-15'
const currentMonth = new Date(2025, 0, 1)

const renderCalendar = ({
  plannedWorkouts = {},
  events = {},
  isTrainer = false,
  currentUserId = 'user-1',
  onMonthChange = vi.fn(),
  onDateSelect = vi.fn(),
  onRemoveWorkout = vi.fn().mockResolvedValue(undefined),
  onCancelEvent = vi.fn(),
  eventActions,
}: {
  plannedWorkouts?: PlannedWorkouts
  events?: Record<string, CalendarEvent[]>
  isTrainer?: boolean
  currentUserId?: string
  onMonthChange?: (month: Date) => void
  onDateSelect?: (date: string) => void
  onRemoveWorkout?: (date: string, workoutId: string) => Promise<void>
  onCancelEvent?: (eventId: string) => void
  eventActions?: ReactNode
} = {}) => render(
  <MemoryRouter>
    <MFCalendar
      plannedWorkouts={plannedWorkouts}
      currentMonth={currentMonth}
      selectedDate={selectedDate}
      onMonthChange={onMonthChange}
      onDateSelect={onDateSelect}
      onRemoveWorkout={onRemoveWorkout}
      events={events}
      isTrainer={isTrainer}
      currentUserId={currentUserId}
      onCancelEvent={onCancelEvent}
      eventActions={eventActions}
    />
  </MemoryRouter>,
)

describe('MFCalendar', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.append(modalRoot)
  })

  afterEach(() => {
    cleanup()
    document.getElementById('modal-root')?.remove()
  })

  it('renders the month grid and selected-date details', () => {
    renderCalendar()

    expect(screen.getByRole('region', { name: 'Calendario de workouts' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'enero de 2025' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: `Eventos (${selectedDate})` })).toBeTruthy()
    expect(screen.getByText('No hay rutinas planificadas.')).toBeTruthy()
    expect(screen.getByText('No hay eventos planificados.')).toBeTruthy()
    expect(screen.getByText('Lun')).toBeTruthy()
    expect(screen.getByText('Dom')).toBeTruthy()
  })

  it('renders calendar actions below all event sections', () => {
    renderCalendar({
      isTrainer: true,
      events: {
        [selectedDate]: [{
          id: 'student-event',
          trainerId: 'user-1',
          trainerName: 'Entrenador actual',
          studentId: 'student-1',
          studentName: 'Estudiante asignado',
          date: selectedDate,
        }],
      },
      eventActions: <div data-testid="event-actions">Selector y formulario</div>,
    })

    const trainerEventsHeading = screen.getByRole('heading', { name: 'Eventos con entrenadores' })
    const eventActions = screen.getByTestId('event-actions')
    expect(trainerEventsHeading.compareDocumentPosition(eventActions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('changes month and selects its first day when navigating', () => {
    const onMonthChange = vi.fn()
    const onDateSelect = vi.fn()
    renderCalendar({ onMonthChange, onDateSelect })

    fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }))

    expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 1, 1))
    expect(onDateSelect).toHaveBeenCalledWith('2025-02-01')
  })

  it('selects a clicked day and displays planned workouts', () => {
    const onDateSelect = vi.fn()
    renderCalendar({
      onDateSelect,
      plannedWorkouts: {
        [selectedDate]: [
          { id: 'workout-1', title: 'Fuerza', category: 'gym', time: '09:30' },
        ],
      },
    })

    fireEvent.click(screen.getByText('16', { selector: 'strong' }))

    expect(onDateSelect).toHaveBeenCalledWith('2025-01-16')
    expect(screen.getByText('1 rutina')).toBeTruthy()
    expect(screen.getByText('09:30 -')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Fuerza' }).getAttribute('href'))
      .toBe('/workout/view/workout-1')
  })

  it('confirms removing a planned workout before calling the removal handler', async () => {
    const onRemoveWorkout = vi.fn().mockResolvedValue(undefined)
    renderCalendar({
      plannedWorkouts: {
        [selectedDate]: [{ id: 'workout-1', title: 'Fuerza', category: 'gym' }],
      },
      onRemoveWorkout,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(onRemoveWorkout).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Quitar rutina' }))

    await waitFor(() => {
      expect(onRemoveWorkout).toHaveBeenCalledWith(selectedDate, 'workout-1')
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('shows events for the current user and supports cancelling them', () => {
    const onCancelEvent = vi.fn()
    const event: CalendarEvent = {
      id: 'event-1',
      trainerId: 'trainer-1',
      trainerName: 'Entrenadora',
      studentId: 'user-1',
      studentName: 'Estudiante',
      date: selectedDate,
      time: '10:00',
      workoutTitle: 'Rutina compartida',
    }
    renderCalendar({
      events: { [selectedDate]: [event] },
      onCancelEvent,
    })

    expect(screen.getByText('10:00 - Entrenadora')).toBeTruthy()
    expect(screen.getByText('Rutina: Rutina compartida')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar evento' }))

    expect(onCancelEvent).toHaveBeenCalledWith('event-1')
  })

  it('separates trainer events with students and trainers', () => {
    const studentEvent: CalendarEvent = {
      id: 'student-event',
      trainerId: 'user-1',
      trainerName: 'Entrenador actual',
      studentId: 'student-1',
      studentName: 'Estudiante asignado',
      date: selectedDate,
    }
    const trainerEvent: CalendarEvent = {
      id: 'trainer-event',
      trainerId: 'trainer-2',
      trainerName: 'Otro entrenador',
      studentId: 'user-1',
      studentName: 'Entrenador actual',
      date: selectedDate,
    }
    renderCalendar({
      isTrainer: true,
      events: { [selectedDate]: [studentEvent, trainerEvent] },
    })

    expect(screen.getByRole('heading', { name: 'Eventos con estudiantes' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Eventos con entrenadores' })).toBeTruthy()
    expect(screen.getByText('Estudiante asignado')).toBeTruthy()
    expect(screen.getByText('Otro entrenador')).toBeTruthy()
  })
})
