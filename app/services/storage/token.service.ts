export class TokenService {
  private TOKEN_KEY = 'auth_token'
  private REFRESH_TOKEN_KEY = 'refresh_token'

  setToken(token: string): void {
    if (process.client) {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  getToken(): string | null {
    if (process.client) {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  setRefreshToken(token: string): void {
    if (process.client) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
    }
  }

  getRefreshToken(): string | null {
    if (process.client) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  clearTokens(): void {
    if (process.client) {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    }
  }
}

export const useTokenService = () => new TokenService()