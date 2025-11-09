import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig.js'
import { setThreads } from '../redux/techtalkSlice.js'
import Modal from '../components/Modal.jsx'
import { timeAgo } from '../utils/time.js'

function ThreadCard({ t, onLike, onDislike, onReply, onDelete, canDelete }){
  const [anim, setAnim] = useState({ like:false, dislike:false, comment:false })
  const likeCount = (t.likes||[]).length
  const dislikeCount = (t.dislikes||[]).length
  const replyCount = (t.replies||[]).length
  const btnStyle = (active)=>({ transition:'transform 120ms ease, color 200ms ease', transform: active? 'scale(1.15)':'scale(1)', color: active? '#16a34a':undefined })
  const btnStyleDis = (active)=>({ transition:'transform 120ms ease, color 200ms ease', transform: active? 'scale(1.15)':'scale(1)', color: active? '#dc2626':undefined })
  const btnStyleCom = (active)=>({ transition:'transform 120ms ease, color 200ms ease', transform: active? 'scale(1.12)':'scale(1)', color: active? '#2563eb':undefined })
  const [showReplies,setShowReplies]=useState(false)
  return (
    <div className="card rounded-4 shadow mb-3 p-3">
      <div className="d-flex align-items-start">
        <img src={t.authorPic||'https://avatars.githubusercontent.com/u/1?v=4'} alt="" width="36" height="36" className="rounded-circle me-2" />
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div className="fw-semibold">{t.author||'User'}</div>
            {canDelete && (
              <button className="btn btn-sm btn-outline-light" title="Delete" onClick={onDelete}>
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
          <div className="small text-muted">{timeAgo(t.createdAt||Date.now())}</div>
          <div className="fw-semibold mt-1">{t.title}</div>
          <p className="mb-0 mt-1 small">{t.body}</p>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2" style={btnStyle(anim.like)} onClick={async()=>{ setAnim(s=>({...s,like:true})); setTimeout(()=>setAnim(s=>({...s,like:false})),140); await onLike?.() }}>
          <i className="bi bi-hand-thumbs-up"></i>
          <span className="ms-1">{likeCount}</span>
        </button>
        <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2" style={btnStyleDis(anim.dislike)} onClick={async()=>{ setAnim(s=>({...s,dislike:true})); setTimeout(()=>setAnim(s=>({...s,dislike:false})),140); await onDislike?.() }}>
          <i className="bi bi-hand-thumbs-down"></i>
          <span className="ms-1">{dislikeCount}</span>
        </button>
        <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2" style={btnStyleCom(anim.comment)} onClick={()=>{ setAnim(s=>({...s,comment:true})); setTimeout(()=>setAnim(s=>({...s,comment:false})),140); setShowReplies(v=>!v) }}>
          <i className="bi bi-chat"></i>
          <span className="ms-1">{replyCount}</span>
        </button>
      </div>
      {showReplies && (
        <div className="mt-3">
          {(t.replies||[]).length===0 ? (
            <div className="text-muted small">No comments yet.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {(t.replies||[]).map((r,idx)=> (
                <div key={idx} className="d-flex">
                  <img src={r.userPic||'https://avatars.githubusercontent.com/u/1?v=4'} alt="" width="28" height="28" className="rounded-circle me-2 mt-1" />
                  <div className="flex-grow-1">
                    <div className="small"><span className="fw-semibold">{r.userName||'User'}</span> <span className="text-muted">• {timeAgo(r.createdAt||Date.now())}</span></div>
                    <div className="small">{r.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-sm btn-accent" onClick={onReply}>Reply</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TechTalk(){
  const dispatch = useDispatch()
  const threads = useSelector(s=>s.techtalk.threads)
  const user = useSelector(s=>s.auth.user)
  const navigate = useNavigate()
  const [replyOpen,setReplyOpen]=useState(false)
  const [activeId,setActiveId]=useState(null)
  const [replyText,setReplyText]=useState('')
  const [createOpen,setCreateOpen]=useState(false)
  const [form,setForm]=useState({ title:'', body:'' })
  const [view,setView]=useState('latest') // 'latest' | 'mine'
  const [deleteOpen,setDeleteOpen]=useState(false)
  const [deleteId,setDeleteId]=useState(null)

  useEffect(()=>{
    let ignore=false
    async function load(){
      try{
        const { data } = await api.get('/techtalk')
        if(!ignore) dispatch(setThreads(data||[]))
      }catch{ if(!ignore) dispatch(setThreads([])) }
    }
    load()
    return ()=>{ ignore=true }
  },[dispatch])

  const source = view==='mine' && user? threads.filter(t=> String(t.authorId)===String(user._id)) : threads
  const sorted = [...source].sort((a,b)=> new Date(b.createdAt||0)-new Date(a.createdAt||0))

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-grow-1">
          <div className="center-tabs d-flex justify-content-around align-items-center mb-0 position-relative" style={{maxWidth:420, margin:'0 auto'}}>
            {['latest','mine'].map(k=> (
              <button
                key={k}
                onClick={()=>setView(k)}
                className={`tab-item btn btn-link text-decoration-none ${view===k?'active':''}`}
              >{k==='latest'?'Latest':'My Posts'}</button>
            ))}
            <div className="tab-underline" style={{left: view==='latest'? '18%': '68%'}} />
          </div>
        </div>
        <div>
          <button className="btn btn-accent" onClick={()=>{ user ? setCreateOpen(true) : navigate('/auth') }}>+ Add Post</button>
        </div>
      </div>
      {sorted.length===0 ? (
        <div className="text-muted">No discussions yet.</div>
      ) : sorted.map(t=> (
        <ThreadCard
          key={t._id}
          t={t}
          onLike={async()=>{ if(!user){ navigate('/auth'); return } try{ const { data } = await api.patch(`/techtalk/${t._id}/like`); dispatch(setThreads(threads.map(x=>x._id===data._id?data:x))) }catch{} }}
          onDislike={async()=>{ if(!user){ navigate('/auth'); return } try{ const { data } = await api.patch(`/techtalk/${t._id}/dislike`); dispatch(setThreads(threads.map(x=>x._id===data._id?data:x))) }catch{} }}
          onReply={()=>{ if(!user){ navigate('/auth'); return } setActiveId(t._id); setReplyOpen(true) }}
          canDelete={String(user?._id)===String(t.authorId)}
          onDelete={()=>{ setDeleteId(t._id); setDeleteOpen(true) }}
        />
      ))}

      <Modal
        open={replyOpen}
        title="Reply"
        onClose={()=>{ setReplyOpen(false); setReplyText('') }}
        onSubmit={async()=>{
          if(!replyText.trim()) return
          if(!user){ navigate('/auth'); return }
          try{ const { data } = await api.post(`/techtalk/${activeId}/reply`, { text: replyText.trim() }); dispatch(setThreads(threads.map(x=>x._id===data._id?data:x))) }catch{}
          setReplyOpen(false); setReplyText('')
        }}
        submitLabel="Reply"
      >
        <textarea className="form-control" rows="4" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Write your reply..." />
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete Post?"
        onClose={()=>{ setDeleteOpen(false); setDeleteId(null) }}
        onSubmit={async()=>{
          if(!deleteId) return
          try{
            await api.delete(`/techtalk/${deleteId}`)
            dispatch(setThreads(threads.filter(x=>x._id!==deleteId)))
          }catch{}
          setDeleteOpen(false); setDeleteId(null)
        }}
        submitLabel="Delete"
        submitVariant="danger"
      >
        <div className="small">Are you sure you want to delete this post? This action cannot be undone.</div>
      </Modal>

      <Modal
        open={createOpen}
        title="Start Discussion"
        onClose={()=>{ setCreateOpen(false); setForm({ title:'', body:'' }) }}
        onSubmit={async()=>{
          if(!form.title.trim() || !form.body.trim()) return
          try{
            if(!user){ navigate('/auth'); return }
            await api.post('/techtalk', { title: form.title.trim(), body: form.body.trim() })
            const { data } = await api.get('/techtalk')
            dispatch(setThreads(data||[]))
          }catch{}
          setCreateOpen(false); setForm({ title:'', body:'' })
        }}
        submitLabel="Post"
      >
        <div className="mb-2">
          <label className="form-label small">Title</label>
          <input className="form-control" value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))} />
        </div>
        <div className="mb-2">
          <label className="form-label small">Description</label>
          <textarea className="form-control" rows="4" value={form.body} onChange={e=>setForm(s=>({...s,body:e.target.value}))} />
        </div>
      </Modal>
    </div>
  )
}
