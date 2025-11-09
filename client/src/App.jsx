import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from './api/axiosConfig.js'
import { setUser, clearUser } from './redux/authSlice.js'
import Sidebar from './components/Sidebar'
import TrendingTopics from './components/TrendingTopics'
import SuggestedEvents from './components/SuggestedEvents'
import HowItWorks from './components/HowItWorks'
import Home from './pages/Home'
import TechUpdates from './pages/TechUpdates'
import Events from './pages/Events'
import TechTalk from './pages/TechTalk'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import EmailOTP from './pages/EmailOTP'
import About from './pages/About'

function Layout({ children }) {
  const location = useLocation()
  const user = useSelector(s=>s.auth.user)
  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="sidebar">
            <Sidebar user={user} />
          </div>
        </div>
        <div className="col-lg-6">
          {location.pathname !== '/' && location.pathname !== '/techtalk' && location.pathname !== '/events' && location.pathname !== '/tech-updates' && location.pathname !== '/profile' && location.pathname !== '/about' && (
            <div className="feed-tabs d-flex gap-3 mb-3 small">
              <NavLink to="/tech-updates" className={({isActive})=>`text-decoration-none ${isActive?'fw-semibold text-white':'text-muted'}`}>News</NavLink>
              <NavLink to="/events" className={({isActive})=>`text-decoration-none ${isActive?'fw-semibold text-white':'text-muted'}`}>Events</NavLink>
              <NavLink to="/techtalk" className={({isActive})=>`text-decoration-none ${isActive?'fw-semibold text-white':'text-muted'}`}>TechTalk</NavLink>
            </div>
          )}
          {children}
        </div>
        <div className="col-lg-3">
          <div className="right-panel d-flex flex-column gap-3">
            <TrendingTopics />
            <SuggestedEvents />
            <HowItWorks />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const dispatch = useDispatch()
  const user = useSelector(s=>s.auth.user)
  useEffect(()=>{
    let ignore=false
    ;(async()=>{
      try{
        const { data } = await api.get('/users/me')
        if(!ignore) dispatch(setUser(data))
      }catch{
        if(!ignore) dispatch(clearUser())
      }
    })()
    return ()=>{ ignore=true }
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Layout><Home/></Layout>} />
      <Route path="/tech-updates" element={<Layout><TechUpdates/></Layout>} />
      <Route path="/events" element={<Layout><Events/></Layout>} />
      <Route path="/techtalk" element={<Layout><TechTalk/></Layout>} />
      <Route path="/about" element={<Layout><About/></Layout>} />
      <Route path="/profile" element={user? <Layout><Profile/></Layout> : <Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth/>} />
      <Route path="/verify-email" element={<EmailOTP/>} />
    </Routes>
  )
}
