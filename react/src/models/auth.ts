export interface AuthResponse {
  token: string
  userId: string
  email: string
  name: string
  lastName: string
}

export interface AuthRequest {
  email: string
  password: string
}