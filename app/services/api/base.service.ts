import { useTokenService } from "../storage/token.service"

export class BaseService {
  protected baseURL: string

  constructor() {
    const config = useRuntimeConfig()
    this.baseURL = config.public.apiBase
  }

  protected async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise {
    const tokenService = useTokenService()
    const token = tokenService.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Handle token refresh or logout
          await this.handleUnauthorized()
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  private async handleUnauthorized() {
    const authStore = useAuthStore()
    await authStore.logout()
    navigateTo('/login')
  }
}