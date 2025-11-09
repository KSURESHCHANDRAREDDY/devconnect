import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axiosConfig.js'
import { setPosts } from '../redux/postsSlice.js'
import PostCard from '../components/PostCard'

export default function Home(){
  const dispatch = useDispatch()
  const posts = useSelector(s=>s.posts.list)
  const [tab,setTab]=useState('trending')
  const [threads,setThreads]=useState([])

  useEffect(()=>{
    let ignore=false
    async function load(){
      try{
        const [pRes, tRes] = await Promise.all([
          api.get('/posts'),
          api.get('/techtalk')
        ])
        if(!ignore){
          dispatch(setPosts(pRes.data||[]))
          setThreads(tRes.data||[])
        }
      }catch{ if(!ignore) dispatch(setPosts([])) }
    }
    load()
    return ()=>{ ignore=true }
  },[dispatch])

  const merged = useMemo(()=>{
    const mapThread = t => ({
      _id: `tt-${t._id}`,
      title: t.title,
      description: t.body,
      image: t.image,
      author: t.author,
      authorPic: t.authorPic,
      createdAt: t.createdAt,
      likes: t.likes,
      dislikes: t.dislikes,
      comments: t.replies
    })
    const mappedThreads = threads.map(mapThread)
    // Keep original posts as-is; prefix id to avoid key collision handling below
    const mappedPosts = posts.map(p=> ({ ...p, _id: `po-${p._id}` }))
    return [...mappedPosts, ...mappedThreads]
  },[posts, threads])

  const trending = useMemo(()=>
    [...merged].sort((a,b)=>{
      const la=(a.likes?.length||0), lb=(b.likes?.length||0)
      if(lb!==la) return lb-la
      return new Date(b.createdAt||0)-new Date(a.createdAt||0)
    })
  ,[merged])

  const latest = useMemo(()=>
    [...merged].sort((a,b)=> new Date(b.createdAt||0)-new Date(a.createdAt||0))
  ,[merged])

  return (
    <div>
      <div className="center-tabs d-flex justify-content-around align-items-center mb-3 position-relative">
        {['trending','latest'].map(k=> (
          <button
            key={k}
            onClick={()=>setTab(k)}
            className={`tab-item btn btn-link text-decoration-none ${tab===k?'active':''}`}
          >{k.charAt(0).toUpperCase()+k.slice(1)}</button>
        ))}
        <div className="tab-underline" style={{left: tab==='trending'? '18%': '68%'}} />
      </div>

      {merged.length===0 ? (
        <div className="text-muted">No posts yet.</div>
      ) : (
        (tab==='trending'
          ? trending.map(p=> (<PostCard key={`tr-${p._id}`} post={p} />))
          : latest.map(p=> (<PostCard key={`lt-${p._id}`} post={p} />))
        )
      )}
    </div>
  )
}
