import { defineStore } from 'pinia'
import { useAuthService } from '~/services/api/auth.service'
import { useTokenService } from '~/services/storage/token.service'
import type { User, LoginCredentials } from '~/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    userRole: (state) => state.user?.role,
    userPermissions: (state) => state.user?.permissions || [],
    hasPermission: (state) => {
      return (resource: string, action: string) => {
        return state.user?.permissions.some(
          (p) => p.resource === resource && p.action === action
        ) || false
      }
    },
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      try {
        const authService = useAuthService()
        const tokenService = useTokenService()
        
        const response = await authService.login(credentials)
        
        this.user = response.user
        this.isAuthenticated = true
        
        tokenService.setToken(response.token)
        tokenService.setRefreshToken(response.refreshToken)
        
        return response
      } catch (error) {
        this.isAuthenticated = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const authService = useAuthService()
        await authService.logout()
      } finally {
        const tokenService = useTokenService()
        tokenService.clearTokens()
        this.user = null
        this.isAuthenticated = false
        navigateTo('/login')
      }
    },

    async fetchUser() {
      try {
        const authService = useAuthService()
        this.user = await authService.getProfile()
        this.isAuthenticated = true
      } catch (error) {
        this.isAuthenticated = false
        throw error
      }
    },
  },
})