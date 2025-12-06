import { branchService } from '~/services/api/v1/branchService'
import { useDebounceFn } from '@vueuse/core'

export function useBranch() {
  const { $api } = useNuxtApp()
  const service = branchService($api)

  // Ambil query dari URL
  const query = useUrlSearchParams()

  // --- STATE (sinkron otomatis dengan URL) ---
  const page = ref(Number(query.page ?? 1))
  const limit = ref(Number(query.limit ?? 10))
  const search = ref(query.search ?? '')
  const sort_by = ref(query.sort_by ?? 'id|asc')
  const debouncedSearch = ref(search.value)

  const filters = reactive({
    name: query.name ?? '',
    email: query.email ?? '',
    phone: query.phone ?? '',
    address: query.address ?? '',
    is_active: query.is_active ?? '',
  })

  // --- UPDATE URL setiap state berubah ---
  watch(
    [page, limit, sort_by, filters, debouncedSearch],
    () => {
      query.page = page.value
      query.limit = limit.value
      query.search = debouncedSearch.value || undefined
      query.sort_by = sort_by.value

      Object.entries(filters).forEach(([key, val]) => {
        query[key] = val || undefined
      })
    },
    { deep: true },
  )

  // Debounce the search input so API isn't called on every keystroke
  const applySearchDebounce = useDebounceFn((val: unknown) => {
    const sval = Array.isArray(val) ? val.join(' ') : String(val ?? '')
    debouncedSearch.value = sval
    page.value = 1 // reset page when search changes
  }, 300)

  watch(search, (val) => {
    applySearchDebounce(val)
  })

  // --- FETCH DATA ---
  const { data, pending, error, refresh } = useAsyncData(
    () => JSON.stringify([
      'branches',
      page.value,
      limit.value,
      debouncedSearch.value,
      sort_by.value,
      { ...filters },
    ]),
    () =>
      service.fetchPaginatedBranches({
        page: page.value,
        limit: limit.value,
        search: debouncedSearch.value,
        sort_by: sort_by.value,
        ...filters,
      }),
    {
      watch: [page, limit, debouncedSearch, sort_by, filters],
    },
  )

  // --- OUTPUT COMPUTED ---
  const branches = computed(() => (data as any)?.value?.data?.data ?? [])
  const pagination = computed(() => (data as any)?.value?.data?.pagination ?? {})

  // --- PAGINATION ACTION ---
  const next = () => {
    if (pagination.value.current_page < pagination.value.last_page) {
      page.value++
    }
  }

  const prev = () => {
    if (page.value > 1) {
      page.value--
    }
  }

  // --- CRUD / Other actions ---
  const getBranchDetail = (id: number) =>
    useAsyncData(`branch-${id}`, () => service.fetchBranchDetail(id))

  const createBranch = (payload: any) =>
    useAsyncData('create-branch', () => service.storeBranch(payload), {
      immediate: false,
    })

  return {
    // state
    page,
    limit,
    search,
    sort_by,
    filters,
    debouncedSearch,

    // data
    branches,
    pagination,
    pending,
    error,

    // actions
    applySearchDebounce,
    refresh,
    next,
    prev,
    getBranchDetail,
    createBranch,
  }
}
