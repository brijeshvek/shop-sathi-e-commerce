import nodemailer from 'nodemailer'

const config = {
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Prevents certificate verification failures
  },
}

// Gmail specific optimizations
if (process.env.EMAIL_HOST === 'smtp.gmail.com' || process.env.EMAIL_USER?.endsWith('@gmail.com')) {
  delete config.host
  delete config.port
  config.service = 'gmail'
}

const transporter = nodemailer.createTransport(config)

export default transporter

