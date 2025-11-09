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
  if(!user || !pass) throw new Error('GMAIL_USER or GMAIL_PASS not configured')
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass }
  })
}

export async function sendOtp(req, res){
  try{
    const { email } = req.body
    if(!email) return res.status(400).json({ message: 'Email is required' })

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

// For testing/demo purposes only
export function __getOtpStore(){ return otpStore }
