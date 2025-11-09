import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

export default function EmailOTP(){
  const navigate = useNavigate()
  const { state } = useLocation()
  const [email, setEmail] = useState(state?.email || '')
  const [name] = useState(state?.name || '')
  const [password] = useState(state?.password || '')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('info') // 'success' | 'danger' | 'warning' | 'info'
  const [editingEmail, setEditingEmail] = useState(false)

  useEffect(()=>{
    if(!state?.email || !state?.name || !state?.password){
      navigate('/auth', { replace: true })
      return
    }
    // auto send OTP on mount
    ;(async()=>{
      setMsg('')
      setLoading(true)
      try{
        await api.post('/otp/send-otp', { email: state.email })
        setSent(true)
        setMsg('Code sent. Check your inbox.')
        setMsgType('info')
      }catch(e){
        setMsg(e?.response?.data?.message || 'Failed to send OTP')
        setMsgType('danger')
      }finally{
        setLoading(false)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function resend(){
    setMsg('')
    setLoading(true)
    try{
      await api.post('/otp/send-otp', { email })
      setSent(true)
      setMsg('Code resent.')
      setMsgType('info')
    }catch(e){
      setMsg(e?.response?.data?.message || 'Failed to resend OTP')
      setMsgType('danger')
    }finally{
      setLoading(false)
    }
  }

  async function applyEmailChange(){
    setMsg('')
    if(!email){ setMsg('Email is required'); return }
    setLoading(true)
    try{
      await api.post('/otp/send-otp', { email })
      setSent(true)
      setEditingEmail(false)
      setMsg('Code sent to updated email.')
      setMsgType('success')
    }catch(e){
      setMsg(e?.response?.data?.message || 'Failed to send OTP to new email')
      setMsgType('danger')
    }finally{
      setLoading(false)
    }
  }

  async function verify(){
    setMsg('')
    setLoading(true)
    try{
      await api.post('/otp/verify-otp', { email, otp })
      // On success, create the user in DB
      await api.post('/auth/register', { name, email, password })
      setMsgType('success')
      navigate('/auth', { replace: true })
    }catch(e){
      setMsg(e?.response?.data?.message || 'Failed to verify or register')
      setMsgType('danger')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 540 }}>
      <div className="card rounded-4 shadow p-4">
        <div className="fw-semibold mb-3">Verify your email</div>
        <div className="mb-2">
          <div className="form-label small">Email</div>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} disabled={!editingEmail} />
          <div className="mt-2">
            {!editingEmail ? (
              <button type="button" className="btn btn-sm btn-outline-light" onClick={()=>setEditingEmail(true)}>Change email</button>
            ) : (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-accent btn-sm" disabled={loading || !email} onClick={applyEmailChange}>Save & Send</button>
                <button type="button" className="btn btn-outline-light btn-sm" disabled={loading} onClick={()=>{ setEditingEmail(false); setMsg(''); }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
        {sent && (
          <div className="mb-2">
            <div className="form-label small">OTP</div>
            <input className="form-control" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit code" />
          </div>
        )}
        <div className="d-flex gap-2">
          {!sent ? (
            <button disabled className="btn btn-outline-light">Sending...</button>
          ) : (
            <>
              <button disabled={loading || !otp} className="btn btn-accent" onClick={verify}>Verify OTP</button>
              <button disabled={loading} className="btn btn-outline-light" onClick={resend}>Resend</button>
            </>
          )}
        </div>
        {msg && (
          <div className={`alert alert-${msgType} mt-3 mb-0 py-2 px-3`} role="alert">
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
