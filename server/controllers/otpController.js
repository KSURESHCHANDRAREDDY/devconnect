import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// In-memory OTP store: email -> { otp, expiresAt }
const otpStore = new Map()

function generateOTP(){
  return Math.floor(100000 + Math.random()*900000).toString()
}

function createTransport(){
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_PASS
  const host = process.env.GMAIL_HOST || 'smtp.gmail.com'
  const port = Number(process.env.GMAIL_PORT || 465)
  const secure = port === 465
  if(!user || !pass) throw new Error('GMAIL_USER or GMAIL_PASS not configured')
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}

export function verifyMailTransport(){
  try{
    const transporter = createTransport()
    transporter.verify()
      .then(()=> console.log('SMTP: connection OK'))
      .catch(err=> console.error('SMTP verify failed:', err && err.message ? err.message : err))
  }catch(err){
    console.error('SMTP config invalid:', err && err.message ? err.message : err)
  }
}

export async function sendOtp(req, res){
  try{
    const { email } = req.body
    if(!email) return res.status(400).json({ message: 'Email is required' })

    const existing = otpStore.get(email)
    if (existing && Date.now() < existing.expiresAt) {
      return res.json({ message: 'OTP already sent' })
    }

    const otp = generateOTP()
    const expiresAt = Date.now() + 5*60*1000 // 5 minutes
    otpStore.set(email, { otp, expiresAt })

    const transporter = createTransport()
    await transporter.sendMail({
      from: `DevConnect OTP <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your DevConnect OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px">
        <p>Your OTP is:</p>
        <div style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</div>
        <p>This code expires in 5 minutes.</p>
      </div>`
    })

    return res.json({ message: 'OTP sent' })
  }catch(err){
    return res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export async function verifyOtp(req, res){
  try{
    const { email, otp } = req.body
    if(!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' })
    const entry = otpStore.get(email)
    if(!entry) return res.status(400).json({ message: 'No OTP requested for this email' })
    if(Date.now() > entry.expiresAt){
      otpStore.delete(email)
      return res.status(400).json({ message: 'OTP expired' })
    }
    if(entry.otp !== String(otp)){
      return res.status(400).json({ message: 'Invalid OTP' })
    }
    otpStore.delete(email)
    return res.json({ message: 'OTP verified' })
  }catch(err){
    return res.status(500).json({ message: 'Failed to verify OTP' })
  }
}
