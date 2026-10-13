import type { UserSearchResult } from '../models/user'
import { SESSION_STORAGE_KEY } from './authService'

const API_URL = 'http://localhost:3000/trainer/students'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`,
})

class TrainerStudentService {
  async getStudents(): Promise<UserSearchResult[]> {
    const response = await fetch(API_URL, { headers: authHeaders() })
    if (!response.ok) throw new Error('No se pudieron cargar los alumnos')
    return response.json()
  }

  async getTrainers(): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_URL}/trainers`, { headers: authHeaders() })
    if (!response.ok) throw new Error('No se pudieron cargar los entrenadores')
    return response.json()
  }

  async getRelationshipsForProfile(userId: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_URL}/profile/${encodeURIComponent(userId)}`, { headers: authHeaders() })
    if (!response.ok) throw new Error('No se pudieron cargar las relaciones del usuario')
    return response.json()
  }

  async unlinkStudent(studentId: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error('No se pudo remover al alumno')
    return response.json()
  }

  async unlinkTrainer(trainerId: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_URL}/trainers/${encodeURIComponent(trainerId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error('No se pudo remover al entrenador')
    return response.json()
  }
}

export const trainerStudentService = new TrainerStudentService()
