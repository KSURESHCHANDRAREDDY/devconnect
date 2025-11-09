import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/axiosConfig.js'
import { setUser } from '../redux/authSlice.js'

export default function Auth(){
  const [tab,setTab]=useState('login')
  const [form,setForm]=useState({ name:'', email:'', password:'', confirm:'' })
  const [error,setError]=useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = e=> setForm(s=>({...s,[e.target.name]:e.target.value}))

  async function submitLogin(e){
    e.preventDefault()
    setError('')
    try{
      await api.post('/auth/login', { email: form.email, password: form.password })
      const { data } = await api.get('/users/me')
      dispatch(setUser(data))
      window.location.href='/'
    }catch{ setError('Login failed') }
  }

  async function submitRegister(e){
    e.preventDefault()
    setError('')
    if(form.password!==form.confirm){ setError('Passwords do not match'); return }
    navigate('/verify-email', { state: { name: form.name, email: form.email, password: form.password } })
  }

  return (
    <div className="container py-5" style={{maxWidth:540}}>
      <div className="card rounded-4 shadow p-4">
        <div className="d-flex gap-3 mb-3">
          <button className={`btn btn-sm ${tab==='login'?'btn-accent':'btn-outline-light'}`} onClick={()=>setTab('login')}>Login</button>
          <button className={`btn btn-sm ${tab==='register'?'btn-accent':'btn-outline-light'}`} onClick={()=>setTab('register')}>Register</button>
        </div>

        {tab==='login' ? (
          <form onSubmit={submitLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required />
            </div>
            {error && <div className="text-danger small mb-2">{error}</div>}
            <button className="btn btn-accent w-100" type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={submitRegister}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input name="name" className="form-control" value={form.name} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input name="confirm" type="password" className="form-control" value={form.confirm} onChange={onChange} required />
            </div>
            {error && <div className="text-danger small mb-2">{error}</div>}
            <button className="btn btn-accent w-100" type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
  )
}
