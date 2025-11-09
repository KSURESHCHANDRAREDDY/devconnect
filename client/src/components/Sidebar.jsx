import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/axiosConfig.js'
import { clearUser } from '../redux/authSlice.js'

export default function Sidebar({ user }){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const icon = {
    home: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    news: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h12a2 2 0 0 1 2 2v10a3 3 0 0 0 3 3H6a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9h8M8 13h8" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    calendar: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    chat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    user: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    lock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8.5h.01M11 11h2v5h-2z" stroke="currentColor" strokeWidth="1.5"/></svg>
    )
  }

  const nav = user ? [
    { to: '/', label: 'Home', icon: icon.home },
    { to: '/tech-updates', label: 'Tech Updates', icon: icon.news },
    { to: '/events', label: 'Events', icon: icon.calendar },
    { to: '/techtalk', label: 'TechTalk Posts', icon: icon.chat },
    { to: '/about', label: 'About', icon: icon.info },
    { to: '/profile', label: 'Profile', icon: icon.user }
  ] : [
    { to: '/', label: 'Home', icon: icon.home },
    { to: '/tech-updates', label: 'Tech Updates', icon: icon.news },
    { to: '/events', label: 'Events', icon: icon.calendar },
    { to: '/techtalk', label: 'TechTalk Posts', icon: icon.chat },
    { to: '/about', label: 'About', icon: icon.info },
    { to: '/auth', label: 'Login / Register', icon: icon.lock }
  ]

  return (
    <aside className="card sidebar-card rounded-4 shadow p-3 d-flex flex-column">
      <div className="fw-semibold mb-3"><i className="bi bi-link-45deg me-2" style={{ color: '#a855f7' }}></i>DevConnect</div>
      <ul className="list-unstyled sidebar-nav flex-grow-1">
        {nav.map(item=> (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to==='/'}
              className={({isActive})=> `d-flex align-items-center gap-2 px-3 py-3 rounded-3 text-decoration-none ${isActive?'sidebar-active':'text-white-50'}`}
            >
              <span className="opacity-75">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div>
        <div className="d-flex flex-column gap-2">
          <div className="text-white-50 small px-1 mt-2">Share a quick update</div>
          <button className="btn btn-accent w-100 rounded-3" onClick={()=>{
            if(!user){ navigate('/auth'); return }
            navigate('/techtalk')
          }}>+ Post</button>
          {user && (
            <button className="btn btn-outline-light w-100 rounded-3" onClick={async()=>{
              try{ await api.post('/auth/logout') }catch{}
              dispatch(clearUser())
              navigate('/auth')
            }}>Logout</button>
          )}
        </div>
      </div>
    </aside>
  )
}
