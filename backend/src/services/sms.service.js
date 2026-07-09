import twilio from 'twilio'

export const sendLoginOtpSms = async (user, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !twilioPhone) {
    console.log(`\n⚠️ [WARNING] Twilio SMS is not configured. Skipping SMS to ${user.phone}.\n`)
    return
  }

  try {
    const client = twilio(accountSid, authToken)
    
    // Twilio requires E.164 formatting (e.g. +919876543210 for India)
    // For this example, we assume the user.phone includes the country code.
    // If not, it should be formatted before passing it to Twilio, or handled here.
    let formattedPhone = user.phone
    if (!formattedPhone.startsWith('+')) {
      // Defaulting to India country code if no '+' is present, adjust as needed.
      formattedPhone = `+91${formattedPhone}`
    }

    const message = await client.messages.create({
      body: `Your Shop Shathi verification code is: ${otp}. It will expire in 5 minutes.`,
      from: twilioPhone,
      to: formattedPhone
    })

    console.log(`\n✅ SMS sent successfully to ${formattedPhone}. SID: ${message.sid}\n`)
    return message
  } catch (error) {
    console.error(`\n❌ Failed to send SMS to ${user.phone}:`, error.message, '\n')
    throw error
  }
}
