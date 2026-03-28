import axios from 'axios'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
  })

  // REQUEST
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // RESPONSE (401)
  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigateTo('/login')
      }
      return Promise.reject(err)
    }
  )

  return {
    provide: {
      api,
    },
  }
})
