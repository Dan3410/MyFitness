import { GET_DATA_ERROR_MESSAGE, SAVE_WORKOUT_ERROR_MESSAGE } from '../const/errorMessages'
import { SESSION_STORAGE_KEY } from './authService'

export type PlannedWorkouts = Record<string, string[]>

const API_URL = 'http://localhost:3000/workout/calendar'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`,
})

class CalendarService {
  async getCalendar(): Promise<PlannedWorkouts> {
    const response = await fetch(API_URL, { headers: authHeaders() })
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
}

export const calendarService = new CalendarService()
