export default function EventCard({ event }){
  const dateObj = event.date ? new Date(event.date) : null
  const formattedDate = dateObj ? dateObj.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }) : (event.date||'')
  const timeText = event.time || ''
  return (
    <div className="card rounded-4 shadow mb-3 p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div className="me-3">
          <div className="fw-semibold">{event.title}</div>
          <div className="d-flex flex-column gap-1 mt-1 small text-muted">
            <div className="d-flex align-items-center gap-2"><i className="bi bi-person"></i><span>{event.organizer||'—'}</span></div>
            <div className="d-flex align-items-center gap-2"><i className="bi bi-geo-alt"></i><span>{event.location||'—'}</span></div>
            <div className="d-flex align-items-center gap-2"><i className="bi bi-calendar-date"></i><span>{formattedDate}</span></div>
            {timeText ? (<div className="d-flex align-items-center gap-2"><i className="bi bi-clock"></i><span>{timeText}</span></div>) : null}
          </div>
        </div>
        <div>
          <button className="btn btn-sm btn-accent" onClick={()=>{ if(event.link){ window.open(event.link, '_blank', 'noopener'); } }}>
            Join
          </button>
        </div>
      </div>
      {event.description ? (<p className="mb-0 mt-3 small">{event.description}</p>) : null}
    </div>
  )
}
