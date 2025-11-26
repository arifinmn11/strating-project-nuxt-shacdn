export interface Branch {
  id: number
  name: string
  code: string
}

export interface BranchFilter {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  name?: string
  phone?: string
  email?: string
  address?: string
  is_active?: string
}
