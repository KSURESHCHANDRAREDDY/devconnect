export default function Modal({ open, title, children, onClose, onSubmit, submitLabel='Save', submitVariant='accent' }){
  if(!open) return null
  return (
    <div className="modal-backdrop" style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:1050}} onClick={onClose}>
      <div className="card rounded-4 shadow" style={{maxWidth:560,margin:'10vh auto',padding:'1rem',background:'#151518'}} onClick={e=>e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="fw-semibold">{title}</div>
          <button className="btn btn-sm btn-outline-light" onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
        {onSubmit && (
          <div className="mt-3 d-flex justify-content-end gap-2">
            <button className={`btn ${submitVariant==='danger'?'btn-danger':'btn-accent'}`} onClick={onSubmit}>{submitLabel}</button>
          </div>
        )}
      </div>
    </div>
  )
}
