import 'dotenv/config'
import { sendPasswordResetEmail } from './src/services/email.service.js'

const testResetEmail = async () => {
  const dummyUser = {
    name: 'Brijesh Vekariya',
    email: 'brjshvkr@gmail.com'
  }
  const dummyResetUrl = 'http://localhost:3000/reset-password?token=mocktoken123456'

  console.log('Sending test password reset email to:', dummyUser.email)
  try {
    await sendPasswordResetEmail(dummyUser, dummyResetUrl)
    console.log('✅ Password reset email sent successfully!')
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
  }
}

testResetEmail()
