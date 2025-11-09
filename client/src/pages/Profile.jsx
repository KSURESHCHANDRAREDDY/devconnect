import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig.js'
import { clearUser } from '../redux/authSlice.js'

export default function Profile(){
  const user = useSelector(s=>s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <div className="card rounded-4 shadow p-3">
      <div className="d-flex align-items-center mb-3">
        <img src={user?.avatar||'https://avatars.githubusercontent.com/u/1?v=4'} width="64" height="64" className="rounded-circle me-3" />
        <div>
          <div className="h5 m-0">{user?.name||'Guest'}</div>
          <div className="small text-muted">{user?.email||'Not logged in'}</div>
        </div>
      </div>
      <div className="small text-muted">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
      {user && (
        <div className="mt-3">
          <button className="btn btn-outline-light" onClick={async()=>{
            try{ await api.post('/auth/logout') }catch{}
            dispatch(clearUser())
            navigate('/auth')
          }}>Logout</button>
        </div>
      )}
    </div>
  )
}
