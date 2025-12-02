import type { Branch } from '~/types/api/v1/Branch'
import { branchService } from '~/services/api/v1/branchService'
import { toast } from 'vue-sonner'

export function useBranchForm() {
  const { $api } = useNuxtApp()
  const service = branchService($api)

  // --- FORM STATE
  const form = reactive<Partial<Branch>>({
    id: undefined,
    name: '',
    code: '',
    address: '',
    email: '',
    phone: '',
    is_active: false,
  })

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const errorRes = ref<any>(null)
  const successMessage = ref('')
  const isSuccess = ref(false)

  // --- RESET FORM
  function resetForm() {
    form.id = undefined
    form.name = ''
    form.code = ''
    errorMessage.value = ''
    successMessage.value = ''
  }

  // --- LOAD BRANCH (EDIT MODE)
  async function loadBranch(id: number) {
    resetForm()
    isLoading.value = true

    try {
      const res = await service.fetchBranchDetail(id)

      // isi form
      form.id = res.data?.id
      form.name = res.data?.name
      form.code = res.data?.code
      form.address = res.data?.address
      form.email = res.data?.email
      form.phone = res.data?.phone
      form.is_active = res.data?.is_active
    }
    catch (error: any) {
      errorMessage.value = error?.message || 'Failed to load branch data.'
    }
    finally {
      isLoading.value = false
    }
  }

  // --- CREATE
  async function createBranch(formData?: Partial<Branch>) {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      await service.storeBranch(formData)
      successMessage.value = 'Branch created successfully.'
      isSuccess.value = true
      toast.success(successMessage.value, { description: new Date().toTimeString() })
    }
    catch (error: any) {
      errorMessage.value = error?.message || 'Failed to create branch.'
      isSuccess.value = false
      errorRes.value = error
      toast.error(errorMessage.value, { description: new Date().toTimeString() })
    }
    finally {
      isSubmitting.value = false
    }
  }

  // --- UPDATE
  async function updateBranch(payload: Partial<Branch>) {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      await service.updateBranch(payload.id!, payload)
      successMessage.value = 'Branch updated successfully.'
      isSuccess.value = true
      toast.success(successMessage.value, { description: new Date().toTimeString() })
    }
    catch (error: any) {
      errorMessage.value = error?.message || 'Failed to update branch.'
      isSuccess.value = false
      toast.error(errorMessage.value, { description: new Date().toTimeString() })
      errorRes.value = error
    }
    finally {
      isSubmitting.value = false
    }
  }

  // --- SUBMIT HANDLER (opsional: wrapper)
  async function submit() {
    if (form.id) return updateBranch(form.id)
    return createBranch()
  }

  return {
    // state
    form,
    isLoading,
    isSubmitting,
    errorMessage,
    isSuccess,
    successMessage,
    errorRes,

    // fn
    resetForm,
    loadBranch,
    createBranch,
    updateBranch,
    submit,
  }
}
