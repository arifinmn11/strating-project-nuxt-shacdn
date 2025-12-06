import type { Branch, BranchPayload } from '~/types/api/v1/Branch'
import { branchRepository } from '~/repositories/v1/branchRepo'
import { BaseService } from '~/services/baseService'

export const branchService = new BaseService<BranchPayload, Branch>(
  branchRepository,
)
