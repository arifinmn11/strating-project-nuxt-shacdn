export interface ApiErrorField {
  field: string
  message: string
}

export interface ApiErrorResponse {
  code: number
  message: string
  errors?: ApiErrorField[]
}

export interface ServiceResult<T> {
  success: boolean
  data?: T
  error?: ApiErrorResponse
}
