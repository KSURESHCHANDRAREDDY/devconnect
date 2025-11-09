import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axiosConfig.js'
import { setPosts } from '../redux/postsSlice.js'
import { timeAgo } from '../utils/time.js'

export default function PostCard({ post }){
  const tags = Array.isArray(post.tags)?post.tags:[]
  const likeCount = (post.likes||[]).length
  const dislikeCount = (post.dislikes||[]).length
  const commentCount = (post.comments||post.replies||[]).length
  const [showComments,setShowComments]=useState(false)
  const [commentText,setCommentText]=useState('')
  const dispatch = useDispatch()
  const posts = useSelector(s=>s.posts.list)
  return (
    <div className="card rounded-4 shadow mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start mb-2">
          <img src={post.authorPic||'https://avatars.githubusercontent.com/u/1?v=4'} alt="" width="32" height="32" className="rounded-circle me-2" />
          <div className="d-flex flex-column flex-grow-1">
            <div className="fw-semibold">{post.author||'Anonymous'}</div>
            <div className="small text-muted">{timeAgo(post.createdAt||Date.now())}</div>
            <h5 className="card-title mb-1 mt-1">{post.title}</h5>
            {post.image ? <img src={post.image} className="rounded-3 mb-2 mt-1" alt="" style={{maxWidth:'100%'}} /> : null}
            <p className="card-text">{post.description}</p>
          </div>
        </div>
        {tags.length>0 && (
          <div className="d-flex flex-wrap gap-2 mb-2">
            {tags.map((t,i)=> <span key={i} className="badge text-bg-dark border">#{t}</span>)}
          </div>
        )}
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2">
            <i className="bi bi-hand-thumbs-up"></i>
            <span className="ms-1">{likeCount}</span>
          </button>
          <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2">
            <i className="bi bi-hand-thumbs-down"></i>
            <span className="ms-1">{dislikeCount}</span>
          </button>
          <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2" onClick={()=>setShowComments(v=>!v)}>
            <i className="bi bi-chat"></i>
            <span className="ms-1">{commentCount}</span>
          </button>
        </div>
        {showComments && (
          <div className="mt-3">
            {(post.comments||[]).length===0 ? (
              <div className="text-muted small">No comments yet.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {(post.comments||[]).map((c,idx)=> (
                  <div key={idx} className="d-flex">
                    <img src={c.userPic||'https://avatars.githubusercontent.com/u/1?v=4'} alt="" width="28" height="28" className="rounded-circle me-2 mt-1" />
                    <div className="flex-grow-1">
                      <div className="small"><span className="fw-semibold">{c.userName||'User'}</span> <span className="text-muted">• {timeAgo(c.createdAt||Date.now())}</span></div>
                      <div className="small">{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="d-flex align-items-start gap-2 mt-3">
              <img src={post.myPic||'https://avatars.githubusercontent.com/u/1?v=4'} alt="" width="28" height="28" className="rounded-circle mt-1" />
              <div className="flex-grow-1">
                <textarea rows="2" className="form-control" placeholder="Add a comment..." value={commentText} onChange={e=>setCommentText(e.target.value)}></textarea>
                <div className="d-flex justify-content-end mt-2">
                  <button className="btn btn-sm btn-accent" onClick={async()=>{
                    const text = commentText.trim()
                    if(!text) return
                    try{
                      const { data } = await api.post(`/posts/${post._id}/comment`, { text })
                      dispatch(setPosts(posts.map(p=> p._id===data._id ? data : p)))
                    }catch{}
                    setCommentText('')
                  }}>Comment</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
