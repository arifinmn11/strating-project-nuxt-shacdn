export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    credentials: 'include',
    headers : {
      'Accept': 'application/json',
      'Authorization': `Bearer ${config.public.apiToken || ''}`,
    },
  })

  return {
    provide: {
      api,
    },
  }
})
