export class BaseRepository<TPayload, TResult> {
  constructor(private baseUrl: string) {}

  list(): Promise<TResult[]> {
    return $fetch(this.baseUrl)
  }

  find(id: number | string): Promise<TResult> {
    return $fetch(`${this.baseUrl}/${id}`)
  }

  create(payload: TPayload): Promise<TResult> {
    return $fetch(this.baseUrl, {
      method: 'POST',
      body: payload,
    })
  }

  update(id: number | string, payload: TPayload): Promise<TResult> {
    return $fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  delete(id: number | string): Promise<void> {
    return $fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
  }
}
