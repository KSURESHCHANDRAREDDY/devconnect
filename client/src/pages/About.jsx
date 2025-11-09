import React from 'react'

export default function About(){
  return (
    <div className="card rounded-4 shadow p-4">
      <h2 className="mb-2">About DevConnect</h2>
      <p className="text-muted">DevConnect is a community platform for developers to discover tech updates, share ideas, and organize events. We focus on a clean, fast, and collaborative experience.</p>

      <h5 className="mt-4">Our Mission</h5>
      <p className="mb-3">Empower developers to learn, connect, and grow by providing a simple space to follow news, discuss topics, and participate in events.</p>

      <div className="border rounded-4 p-3 mb-4">
        <h6 className="mb-3">What we use</h6>
        <div className="d-flex flex-wrap gap-2">
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-file-code" style={{ color: '#61DAFB' }}></i>React</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-layers" style={{ color: '#764ABC' }}></i>Redux Toolkit</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-lightning-charge" style={{ color: '#646CFF' }}></i>Vite</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-bootstrap" style={{ color: '#7952B3' }}></i>Bootstrap</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-cpu" style={{ color: '#3C873A' }}></i>Node.js</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-box" style={{ color: '#6c757d' }}></i>Express</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-database" style={{ color: '#47A248' }}></i>MongoDB</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-shield-lock" style={{ color: '#FF6A00' }}></i>JWT</span>
          <span className="badge bg-secondary d-inline-flex align-items-center gap-1"><i className="bi bi-envelope" style={{ color: '#0d6efd' }}></i>Nodemailer</span>
        </div>
        <div className="mt-3 small">
          <div className="mb-1">Key Features</div>
          <ul className="mb-0 small text-white-50">
            <li><i className="bi bi-check-circle text-success me-1"></i>Email OTP-based signup</li>
            <li><i className="bi bi-check-circle text-success me-1"></i>JWT auth with httpOnly cookies</li>
            <li><i className="bi bi-check-circle text-success me-1"></i>State management with Redux Toolkit</li>
            <li><i className="bi bi-check-circle text-success me-1"></i>Post tech updates, discuss topics, and explore events</li>
            <li><i className="bi bi-check-circle text-success me-1"></i>Responsive UI with Bootstrap</li>
          </ul>
        </div>
      </div>

      <div className="border rounded-4 p-3">
        <h6 className="mb-2">About the Developer</h6>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="fw-semibold">Built by K Suresh Chandra Reddy</div>
          <div className="d-inline-flex align-items-center small text-white-50">
            <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: 8 }}></i>
            Open to work
          </div>
        </div>
        <p className="small text-white-50 mb-2">Developer focused on building clean, responsive, and secure web applications.</p>
        <div className="d-flex gap-3 small">
          <a className="text-decoration-none" href="#" onClick={e=>e.preventDefault()}><i className="bi bi-github me-1"></i>GitHub</a>
          <a className="text-decoration-none" href="#" onClick={e=>e.preventDefault()}><i className="bi bi-link-45deg me-1"></i>Website</a>
        </div>
      </div>
    </div>
  )
}
