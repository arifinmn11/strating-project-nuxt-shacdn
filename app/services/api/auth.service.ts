import type { LoginCredentials, AuthResponse, User } from '~/types/auth.types'
import { BaseService } from './base.service'

export class AuthService extends BaseService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async getProfile(): Promise<User> {
    return this.request('/auth/profile')
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }
}

export const useAuthService = () => new AuthService()