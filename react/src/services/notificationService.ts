import type { TrainerRequestNotification } from '../models/notification'
import { SESSION_STORAGE_KEY } from './authService'

const API_URL = 'http://localhost:3000/notifications'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`,
})

class NotificationService {
  async getNotifications(): Promise<TrainerRequestNotification[]> {
    const response = await fetch(API_URL, { headers: authHeaders() })
    if (!response.ok) throw new Error('No se pudieron cargar las notificaciones')
    return response.json()
  }

  async sendTrainerRequest(recipientId: string): Promise<TrainerRequestNotification> {
    const response = await fetch(`${API_URL}/trainer-request/${encodeURIComponent(recipientId)}`, {
      method: 'POST',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error('No se pudo enviar la solicitud')
    return response.json()
  }

  async respondToTrainerRequest(notificationId: string, decision: 'accept' | 'decline'): Promise<TrainerRequestNotification> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(notificationId)}/${decision}`, {
      method: 'PATCH',
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error('No se pudo responder la solicitud')
    return response.json()
  }
}

export const notificationService = new NotificationService()