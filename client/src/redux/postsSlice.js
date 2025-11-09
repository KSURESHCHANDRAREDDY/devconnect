import { createSlice } from '@reduxjs/toolkit'

const initialState = { list: [], status: 'idle', error: null }

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action){ state.list = action.payload || [] },
    likePost(state, action){
      const p = state.list.find(x=>x._id===action.payload)
      if(p){ p.likes = [...(p.likes||[]), 'me'] }
    },
    dislikePost(state, action){
      const p = state.list.find(x=>x._id===action.payload)
      if(p){ p.dislikes = [...(p.dislikes||[]), 'me'] }
    }
  }
})

export const { setPosts, likePost, dislikePost } = postsSlice.actions
export default postsSlice.reducer
