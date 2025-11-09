import { useEffect, useState } from 'react'
import api from '../api/axiosConfig.js'
import { timeAgo } from '../utils/time.js'

function Article({ a }){
  return (
    <div className="card rounded-4 shadow mb-3">
      {a.urlToImage ? <img src={a.urlToImage} className="card-img-top" alt="" /> : null}
      <div className="card-body">
        <a href={a.url} target="_blank" rel="noopener noreferrer" className="h5 d-block text-decoration-none">{a.title}</a>
        <div className="small text-muted mb-2">{a.source?.name} • {timeAgo(a.publishedAt||Date.now())}</div>
        <p className="mb-0">{a.description}</p>
      </div>
    </div>
  )
}

export default function TechUpdates(){
  const [articles,setArticles]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    let ignore=false
    async function load(){
      try{
        const { data } = await api.get('/tech-updates')
        if(!ignore){ setArticles(data||[]); setError('') }
      }catch{ if(!ignore){ setArticles([]); setError('Failed to load tech updates') } }
      finally{ if(!ignore) setLoading(false) }
    }
    load()
    return ()=>{ ignore=true }
  },[])

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-danger">{error}</div>

  return (
    <div>
      {articles.map((a,i)=> <Article key={i} a={a} />)}
      {articles.length===0 && <div className="text-muted">No articles.</div>}
    </div>
  )
}
