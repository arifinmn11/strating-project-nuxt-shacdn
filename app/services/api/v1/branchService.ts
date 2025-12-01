import type { Branch } from '~/types/api/v1/Branch'
import type { PaginatedResponse } from '~/types/Base'
import { branchRepository } from '~/repositories/v1/branchRepository'

export function branchService(api: any) {
  const repo = branchRepository(api)

  const fetchBranches = async (): Promise<Branch[]> => {
    return await repo.getBranchs()
  }

  const fetchBranchDetail = async (id: number): Promise<Branch> => {
    return await repo.getBranchById(id)
  }

  const storeBranch = async (payload: Partial<Branch>): Promise<Branch> => {
    return await repo.createBranch(payload)
  }

  const fetchPaginatedBranches = async (params: Record<string, any> = {}): Promise<PaginatedResponse<Branch>> => {
    return await repo.getPaginatedBranchs(params)
  }

  const updateBranch = async (id: number, payload: Partial<Branch>): Promise<Branch> => {
    return await repo.updateBranch(id, payload)
  }

  return {
    fetchBranches,
    fetchBranchDetail,
    storeBranch,
    fetchPaginatedBranches,
    updateBranch,
  }
}
