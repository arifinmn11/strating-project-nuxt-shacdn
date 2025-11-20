import { useTokenService } from "~/services/storage/token.service"
import type { LoginCredentials } from "~/types/auth.types"

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    await authStore.login(credentials)
    router.push('/dashboard')
  }

  const logout = async () => {
    await authStore.logout()
  }

  const checkAuth = async () => {
    const tokenService = useTokenService()
    const token = tokenService.getToken()

    if (token && !authStore.isAuthenticated) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        await logout()
      }
    }
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    login,
    logout,
    checkAuth,
  }
}