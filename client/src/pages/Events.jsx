import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig.js'
import { setEvents } from '../redux/eventsSlice.js'
import EventCard from '../components/EventCard.jsx'
import Modal from '../components/Modal.jsx'

export default function Events(){
  const dispatch = useDispatch()
  const events = useSelector(s=>s.events.list)
  const user = useSelector(s=>s.auth.user)
  const navigate = useNavigate()
  const [open,setOpen]=useState(false)
  const [form,setForm]=useState({ title:'', organizer:'', date:'', time:'', location:'', description:'', link:'' })
  const [tab,setTab]=useState('upcoming') // 'upcoming' | 'previous'

  useEffect(()=>{
    let ignore=false
    async function load(){
      try{
        const { data } = await api.get('/events')
        if(!ignore) dispatch(setEvents(data||[]))
      }catch{ if(!ignore) dispatch(setEvents([])) }
    }
    load()
    return ()=>{ ignore=true }
  },[dispatch])

  const now = new Date()
  const upcoming = [...events]
    .filter(e=> new Date(e.date) >= now)
    .sort((a,b)=> new Date(a.date)-new Date(b.date))
  const previous = [...events]
    .filter(e=> new Date(e.date) < now)
    .sort((a,b)=> new Date(b.date)-new Date(a.date))

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-grow-1">
          <div className="center-tabs d-flex justify-content-around align-items-center mb-0 position-relative" style={{maxWidth:420, margin:'0 auto'}}>
            {['upcoming','previous'].map(k=> (
              <button
                key={k}
                onClick={()=>setTab(k)}
                className={`tab-item btn btn-link text-decoration-none ${tab===k?'active':''}`}
              >{k==='upcoming'?'Upcoming Events':'Previous Events'}</button>
            ))}
            <div className="tab-underline" style={{left: tab==='upcoming'? '18%': '68%'}} />
          </div>
        </div>
        <div>
          <button className="btn btn-accent" onClick={()=>{ user ? setOpen(true) : navigate('/auth') }}>+ Add Event</button>
        </div>
      </div>
      {(tab==='upcoming' ? upcoming : previous).length===0 ? (
        <div className="text-muted">No events.</div>
      ) : (
        (tab==='upcoming' ? upcoming : previous).map(e=> (<EventCard key={e._id} event={e} />))
      )}

      <Modal
        open={open}
        title="Add Tech Event"
        onClose={()=>{ setOpen(false); setForm({ title:'', organizer:'', date:'', location:'', description:'' }) }}
        onSubmit={async()=>{
          if(!form.title.trim() || !form.date.trim()) return
          try{
            await api.post('/events', {
              title: form.title.trim(),
              organizer: form.organizer.trim(),
              date: form.date.trim(),
              time: form.time.trim(),
              location: form.location.trim(),
              description: form.description.trim(),
              link: form.link.trim()
            })
            const { data } = await api.get('/events')
            dispatch(setEvents(data||[]))
          }catch{}
          setOpen(false)
          setForm({ title:'', organizer:'', date:'', time:'', location:'', description:'', link:'' })
        }}
        submitLabel="Create"
      >
        <div className="mb-2">
          <label className="form-label small">Title</label>
          <input className="form-control" value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))} />
        </div>
        <div className="mb-2">
          <label className="form-label small">Organizer</label>
          <input className="form-control" value={form.organizer} onChange={e=>setForm(s=>({...s,organizer:e.target.value}))} />
        </div>
        <div className="row g-2 mb-2">
          <div className="col">
            <label className="form-label small">Date</label>
            <input type="date" className="form-control" value={form.date} onChange={e=>setForm(s=>({...s,date:e.target.value}))} />
          </div>
          <div className="col">
            <label className="form-label small">Time</label>
            <input type="time" className="form-control" value={form.time} onChange={e=>setForm(s=>({...s,time:e.target.value}))} />
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label small">Location</label>
          <input className="form-control" value={form.location} onChange={e=>setForm(s=>({...s,location:e.target.value}))} />
        </div>
        <div className="mb-2">
          <label className="form-label small">Description</label>
          <textarea rows="3" className="form-control" value={form.description} onChange={e=>setForm(s=>({...s,description:e.target.value}))} />
        </div>
        <div className="mb-2">
          <label className="form-label small">Join Link</label>
          <input className="form-control" placeholder="https://..." value={form.link} onChange={e=>setForm(s=>({...s,link:e.target.value}))} />
        </div>
      </Modal>
    </div>
  )
}
