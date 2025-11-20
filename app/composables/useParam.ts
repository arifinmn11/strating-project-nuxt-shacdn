export const usePermission = () => {
  const authStore = useAuthStore()

  const can = (resource: string, action: string): boolean => {
    return authStore.hasPermission(resource, action)
  }

  const hasRole = (roleName: string): boolean => {
    return authStore.userRole?.name === roleName
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(authStore.userRole?.name || '')
  }

  return {
    can,
    hasRole,
    hasAnyRole,
  }
}