import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDB } from '../config/db.js'

const TOKEN_NAME = 'token'
const JWT_SECRET = process.env.JWT_SECRET 
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax'
}

export async function register(req, res){
  try{
    const { name, email, password } = req.body
    if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const db = getDB()
    const existing = await db.collection('users').findOne({ email })
    if(existing) return res.status(409).json({ message: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const seed = Math.random().toString(36).slice(2)
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
    const doc = { name, email, password: hash, avatar, createdAt: new Date() }
    const { insertedId } = await db.collection('users').insertOne(doc)
    return res.status(201).json({ _id: insertedId, name, email, avatar, createdAt: doc.createdAt })
  }catch(err){
    return res.status(500).json({ message: 'Registration failed' })
  }
}

export async function login(req, res){
  try{
    const { email, password } = req.body
    const db = getDB()
    const user = await db.collection('users').findOne({ email })
    if(!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ _id: String(user._id), email: user.email, name: user.name, avatar: user.avatar || '' }, JWT_SECRET, { expiresIn: '7d' })
    res.cookie(TOKEN_NAME, token, COOKIE_OPTS)
    return res.json({ message: 'Logged in' })
  }catch(err){
    return res.status(500).json({ message: 'Login failed' })
  }
}

export async function logout(req, res){
  res.clearCookie(TOKEN_NAME, COOKIE_OPTS)
  return res.json({ message: 'Logged out' })
}
