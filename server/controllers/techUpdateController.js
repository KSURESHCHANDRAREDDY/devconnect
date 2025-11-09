import axios from 'axios'

export async function getTechUpdates(req, res){
  try{
    const apiKey = process.env.NEWS_API_KEY
    if(!apiKey) return res.status(500).json({ message: 'NEWS_API_KEY not configured' })
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`
    const { data } = await axios.get(url)
    const articles = (data?.articles||[]).map(a=>({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      source: a.source,
      publishedAt: a.publishedAt
    }))
    res.json(articles)
  }catch(err){
    res.status(500).json({ message: 'Failed to fetch tech updates' })
  }
}
