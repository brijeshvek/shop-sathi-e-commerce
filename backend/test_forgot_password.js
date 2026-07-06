import 'dotenv/config'
import axios from 'axios'

const testForgotPassword = async () => {
  console.log('Testing /api/auth/forgot-password...')
  try {
    const res = await axios.post('http://localhost:5005/api/auth/forgot-password', {
      email: 'brjshvkr@gmail.com'
    })
    console.log('✅ Forgot password success response:', res.data)
  } catch (error) {
    console.error('❌ Forgot password failed:', error.response?.data || error.message)
  }
}

testForgotPassword()
