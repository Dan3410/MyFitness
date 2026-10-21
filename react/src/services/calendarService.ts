import { GET_DATA_ERROR_MESSAGE, SAVE_WORKOUT_ERROR_MESSAGE } from '../const/errorMessages'
import { SESSION_STORAGE_KEY } from './authService'

export interface PlannedWorkout {
  id: string
  title: string
  category: string
}

export interface CalendarEvent {
  id: string
  trainerId: string
  trainerName: string
  studentId: string
  studentName: string
  date: string
}

export type PlannedWorkouts = Record<string, PlannedWorkout[]>

const API_URL = 'http://localhost:3000/workout/calendar'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`,
})

class CalendarService {
  async getCalendar(month?: string): Promise<PlannedWorkouts> {
    const monthQuery = month ? `?month=${encodeURIComponent(month)}` : ''
    const response = await fetch(`${API_URL}${monthQuery}`, { headers: authHeaders() })
    if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
    return response.json()
  }

  async addPlannedWorkout(date: string, workoutId: string): Promise<PlannedWorkouts> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ date, workoutId }),
    })
    if (!response.ok) throw new Error(SAVE_WORKOUT_ERROR_MESSAGE)
    return response.json()
  }

  async removePlannedWorkout(date: string, workoutId: string): Promise<PlannedWorkouts> {
    const response = await fetch(`${API_URL}/${date}/${workoutId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error(SAVE_WORKOUT_ERROR_MESSAGE)
    return response.json()
  }

  async getEvents(month?: string): Promise<CalendarEvent[]> {
    const monthQuery = month ? `?month=${encodeURIComponent(month)}` : ''
    const response = await fetch(`${API_URL}/events${monthQuery}`, { headers: authHeaders() })
    if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
    return response.json()
  }

  async createEvent(date: string, studentId: string): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ date, studentId }),
    })
    if (!response.ok) throw new Error(await response.text() || SAVE_WORKOUT_ERROR_MESSAGE)
    return response.json()
  }

  async cancelEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error(await response.text() || SAVE_WORKOUT_ERROR_MESSAGE)
  }
}

export const calendarService = new CalendarService()
