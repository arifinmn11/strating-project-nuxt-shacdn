export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}