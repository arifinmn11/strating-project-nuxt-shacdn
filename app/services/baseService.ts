import type { ApiErrorResponse, ServiceResult } from '~/types/api'

export class BaseService<TPayload, TResult> {
  constructor(private repository: any) {}

  async list(): Promise<ServiceResult<TResult[]>> {
    try {
      const data = await this.repository.list()
      return { success: true, data }
    }
    catch (err: any) {
      return this.handleError(err)
    }
  }

  async find(id: number | string): Promise<ServiceResult<TResult>> {
    try {
      const data = await this.repository.find(id)
      return { success: true, data }
    }
    catch (err: any) {
      return this.handleError(err)
    }
  }

  async create(payload: TPayload): Promise<ServiceResult<TResult>> {
    try {
      const data = await this.repository.create(payload)
      return { success: true, data }
    }
    catch (err: any) {
      return this.handleError(err)
    }
  }

  async update(id: number | string, payload: TPayload): Promise<ServiceResult<TResult>> {
    try {
      const data = await this.repository.update(id, payload)
      return { success: true, data }
    }
    catch (err: any) {
      return this.handleError(err)
    }
  }

  async delete(id: number | string): Promise<ServiceResult<void>> {
    try {
      await this.repository.delete(id)
      return { success: true }
    }
    catch (err: any) {
      return this.handleError(err)
    }
  }

  private handleError(err: any): ServiceResult<any> {
    const error: ApiErrorResponse = err?.response?._data ?? {
      code: 500,
      message: 'Unknown error',
    }

    return {
      success: false,
      error,
    }
  }
}
