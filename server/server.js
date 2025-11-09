import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import techtalkRoutes from './routes/techtalkRoutes.js'
import techUpdateRoutes from './routes/techUpdateRoutes.js'
import otpRoutes from './routes/otpRoutes.js'

dotenv.config()

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req,res)=> res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/techtalk', techtalkRoutes)
app.use('/api/tech-updates', techUpdateRoutes)
app.use('/api/otp', otpRoutes)

const PORT = process.env.PORT || 5000
connectDB().then(()=>{
  app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))
}).catch(err=>{
  console.error('DB connection failed', err)
  process.exit(1)
})
