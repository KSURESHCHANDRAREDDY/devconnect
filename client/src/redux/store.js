import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import postsReducer from './postsSlice.js'
import eventsReducer from './eventsSlice.js'
import techtalkReducer from './techtalkSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    events: eventsReducer,
    techtalk: techtalkReducer
  }
})

export default store
