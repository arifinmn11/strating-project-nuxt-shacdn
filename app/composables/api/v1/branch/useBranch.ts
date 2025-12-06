import type { Branch } from '~/types/api/v1/Branch'
import { ref } from 'vue'
import { branchService } from '~/services/api/v1/branchServ'

export function useBranch() {
  const items = ref<Branch[]>([])
  const loading = ref(false)

  async function refresh() {
    loading.value = true
    const result = await branchService.list()
    loading.value = false

    if (result.success)
      items.value = result.data!
  }

  return { items, loading, refresh }
}
