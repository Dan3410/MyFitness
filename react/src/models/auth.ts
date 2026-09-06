export interface AuthResponse {
  token: string
  userId: string
  email: string
}

export interface AuthRequest {
  email: string
  password: string
}