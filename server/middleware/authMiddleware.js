import jwt from 'jsonwebtoken'

export function authRequired(req, res, next){
  const token = req.cookies?.token
  if(!token) return res.status(401).json({ message: 'Unauthorized' })
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = payload
    next()
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' })
  }
}
