export interface Branch {
  id: number | null
  name: string
  code: string
  address: string
  email: string
  phone: string
  is_active: boolean
}

export interface BranchFilter {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  name?: string
  address?: string
  is_active?: string
}
