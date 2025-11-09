export default function TrendingTopics(){
  const topics=['#AI','#React','#Cloud','#DevOps','#Security']
  return (
    <div className="card rounded-4 shadow p-3">
      <h2 className="h6 mb-3">Trending Topics</h2>
      <div className="d-flex flex-wrap gap-2">
        {topics.map(t=> <span key={t} className="badge text-bg-dark border">{t}</span>)}
      </div>
    </div>
  )
}
