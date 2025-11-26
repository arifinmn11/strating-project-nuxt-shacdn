import type { PaginatedResponse } from '~/types/Base'

export function baseRepository(api: any) {
  return {
    getPaginated<T>(
      url: string,
      params: Record<string, any> = {},
    ): Promise<PaginatedResponse<T>> {
      return api(url, {
        method: 'GET',
        query: params,
      })
    },
  }
}
