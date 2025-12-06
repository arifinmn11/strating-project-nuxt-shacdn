import type { Branch, BranchPayload } from '~/types/api/v1/Branch'
import { BaseRepository } from '~/repositories/baseRepo'

export const branchRepository = new BaseRepository<BranchPayload, Branch>(
  '/api/v1/branches',
)
