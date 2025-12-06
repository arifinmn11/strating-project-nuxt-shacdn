import type { Branch, BranchFilter, BranchPayload } from '~/types/api/v1/Branch'
import type { PaginatedResponse } from '~/types/Base'
import { baseRepository } from '../baseRepository'

const BASE_URI = '/api/v1/branch'

export function branchRepository(api: any) {
  const baseRepo = baseRepository(api)

  const getBranchs = (): Promise<Branch[]> => {
    return api(BASE_URI)
  }

  const getBranchById = (id: number): Promise<Branch> => {
    return api(`${BASE_URI}/${id}`)
  }

  const updateBranch = (id: number, payload: BranchPayload): Promise<Branch> => {
    return api(`${BASE_URI}/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  const createBranch = (payload: BranchPayload): Promise<Branch> => {
    return api(`${BASE_URI}`, {
      method: 'POST',
      body: payload,
    })
  }

  const getPaginatedBranchs = (
    params: BranchFilter,
  ): Promise<PaginatedResponse<Branch>> => {
    return baseRepo.getPaginated<Branch>(BASE_URI, params)
  }

  return {
    getBranchs,
    getBranchById,
    updateBranch,
    createBranch,
    getPaginatedBranchs,
  }
}
