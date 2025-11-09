import { NavLink } from 'react-router-dom'

export default function SuggestedEvents(){
  const items=[
    {title:'Meetup: React NYC', date:'Tomorrow'},
    {title:'Conference: RustConf', date:'Nov 3'},
    {title:'Workshop: Prompt Eng', date:'Nov 12'}
  ]
  return (
    <div className="card rounded-4 shadow p-3">
      <h2 className="h6 mb-3">Suggested Events</h2>
      {items.map((e,i)=> (
        <div key={i} className="d-flex justify-content-between align-items-center small mb-2">
          <span>{e.title}</span>
          <span className="text-muted">{e.date}</span>
        </div>
      ))}
      <NavLink to="/events" className="btn btn-accent w-100 mt-2">Explore All</NavLink>
    </div>
  )
}
