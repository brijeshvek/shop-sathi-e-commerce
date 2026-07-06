import 'dotenv/config'
import axios from 'axios'

const testResendOtp = async () => {
  console.log('Testing /api/auth/resend-otp...')
  try {
    const res = await axios.post('http://localhost:5005/api/auth/resend-otp', {
      email: 'brjshvkr@gmail.com'
    })
    console.log('✅ Resend OTP success response:', res.data)
  } catch (error) {
    console.error('❌ Resend OTP failed:', error.response?.data || error.message)
  }
}

testResendOtp()
