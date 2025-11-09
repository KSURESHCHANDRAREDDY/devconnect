import { createSlice } from '@reduxjs/toolkit'

const initialState = { threads: [], status: 'idle', error: null }

const techtalkSlice = createSlice({
  name: 'techtalk',
  initialState,
  reducers: {
    setThreads(state, action){ state.threads = action.payload || [] }
  }
})

export const { setThreads } = techtalkSlice.actions
export default techtalkSlice.reducer
