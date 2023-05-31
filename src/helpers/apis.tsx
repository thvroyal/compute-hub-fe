import axios, { AxiosError } from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL
axios.defaults.withCredentials = true

// enum STATUS {
//   SUCCESS = 200,
//   CREATED = 201,
//   BAD_REQUEST = 400,
//   UNAUTHORIZED = 401,
//   NOT_FOUND = 404
// }

interface RegisterData {
  name: string
  email: string
  password: string
}
export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post('/auth/register', data)
    return { data: response.data, error: null }
  } catch (error) {
    const baseError = error as AxiosError<{ message: string }>
    return {
      error: baseError.response?.data.message || baseError.message,
      data: null
    }
  }
}

interface LoginData {
  email: string
  password: string
}
export const login = async (data: LoginData) => {
  try {
    const response = await axios.post('/auth/login', data)
    return { data: response.data, error: null }
  } catch (error) {
    const baseError = error as AxiosError<{ message: string }>
    return {
      error: baseError.response?.data.message || baseError.message,
      data: null
    }
  }
}

export const logout = async () => {
  try {
    const response = await axios.get('/auth/logout')
    return { data: response.data, error: null }
  } catch (error) {
    const baseError = error as AxiosError<{ message: string }>
    return {
      error: baseError.response?.data.message || baseError.message,
      data: null
    }
  }
}

export const getMe = async () => {
  try {
    const response = await axios.get('/auth/me')
    return { data: response.data, error: null }
  } catch (error) {
    const baseError = error as AxiosError<{ message: string }>
    return {
      error: baseError.response?.data.message || baseError.message,
      data: null
    }
  }
}
