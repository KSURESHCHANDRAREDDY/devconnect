import { createSlice } from '@reduxjs/toolkit'

const initialState = { list: [], joined: [], status: 'idle', error: null }

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action){ state.list = action.payload || [] },
    setJoined(state, action){ state.joined = action.payload || [] }
  }
})

export const { setEvents, setJoined } = eventsSlice.actions
export default eventsSlice.reducer
