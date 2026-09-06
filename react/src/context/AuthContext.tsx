import { createContext, useContext, useState, type ReactNode } from 'react'
import { AuthResponse } from '../models/auth'
import { authService, SESSION_STORAGE_KEY } from '../services/authService'

interface AuthContextValue {
  session: AuthResponse | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function readSession(): AuthResponse | null {
  const stored = localStorage.getItem(SESSION_STORAGE_KEY)
  return stored ? JSON.parse(stored) as AuthResponse : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(readSession)
  const saveSession = (nextSession: AuthResponse) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }
  const login = async (email: string, password: string) => saveSession(await authService.login({ email, password }))
  const register = async (email: string, password: string) => saveSession(await authService.register({ email, password }))
  const logout = () => { localStorage.removeItem(SESSION_STORAGE_KEY); setSession(null) }
  return <AuthContext.Provider value={{ session, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}