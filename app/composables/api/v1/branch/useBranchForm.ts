import type { ApiErrorResponse } from '~/types/api'
import type { BranchPayload } from '~/types/api/v1/Branch'
import { ref } from 'vue'
import { branchService } from '~/services/api/v1/branchServ'

export function useBranchForm() {
  const isSubmitting = ref(false)
  const serverErrors = ref<ApiErrorResponse | null>(null)

  async function submit(payload: BranchPayload) {
    isSubmitting.value = true
    serverErrors.value = null

    const result = await branchService.create(payload)
    isSubmitting.value = false

    if (!result.success)
      serverErrors.value = result.error ?? null

    return result
  }

  return { isSubmitting, serverErrors, submit }
}
