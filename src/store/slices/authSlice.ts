import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { RootState } from 'store/store'

type User = {
  role?: string
  name: string
  email: string
  id: string
}
interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth
      }
    }
  }
})

export const { setCurrentUser } = authSlice.actions
export const selectCurrentUser = (state: RootState) => state.auth.user
export const authReducer = authSlice.reducer
