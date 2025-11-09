export function timeAgo(date){
  const d = new Date(date)
  const s = Math.floor((Date.now()-d.getTime())/1000)
  const m = Math.floor(s/60); if(m<1) return `${s}s ago`
  const h = Math.floor(m/60); if(h<1) return `${m}m ago`
  const d2 = Math.floor(h/24); if(d2<1) return `${h}h ago`
  const w = Math.floor(d2/7); if(w<1) return `${d2}d ago`
  const mo = Math.floor(d2/30); if(mo<1) return `${w}w ago`
  const y = Math.floor(d2/365); if(y<1) return `${mo}mo ago`
  return `${y}y ago`
}
