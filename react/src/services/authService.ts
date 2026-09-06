import { AuthRequest, AuthResponse } from '../models/auth'

const API_URL = 'http://localhost:3000/auth'
export const SESSION_STORAGE_KEY = 'myfitness_session'

class AuthService {
  async login(credentials: AuthRequest): Promise<AuthResponse> { return this.request('/login', credentials) }
  async register(credentials: AuthRequest): Promise<AuthResponse> { return this.request('/register', credentials) }

  private async request(path: string, credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(API_URL + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials)
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      const message = typeof body?.message === 'string' ? body.message : 'No se pudo completar la operación'
      throw new Error(message)
    }
    return response.json()
  }
}

export const authService = new AuthService()