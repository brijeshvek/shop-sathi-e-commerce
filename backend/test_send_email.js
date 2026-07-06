import 'dotenv/config'
import transporter from './src/config/email.js'

const FROM = process.env.EMAIL_FROM || 'ShopEase <noreply@shopease.com>'
const TO = 'brjshvkr@gmail.com'

const testMail = async () => {
  console.log('Sending test email using credentials from .env...')
  console.log('EMAIL_USER:', process.env.EMAIL_USER)
  console.log('EMAIL_FROM:', FROM)
  console.log('Sending to:', TO)

  try {
    const info = await transporter.sendMail({
      from: FROM,
      to: TO,
      subject: '🔐 Test OTP & Invoice Attachment',
      html: `
        <h2>Verification & Order Confirmation Test Email 🚀</h2>
        <p>Hi Brijesh, this is a test email sent from your e-commerce application backend.</p>
        <p><strong>Test OTP:</strong> 123456</p>
        <p>Please check the attachment for a sample of your HTML invoice file.</p>
      `,
      attachments: [
        {
          filename: 'invoice_ORD-TEST-123.html',
          content: `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Invoice ORD-TEST-123</title>
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1 style="color: #6366f1;">Shop Sathi Invoice</h1>
              <p>Thank you for your order!</p>
              <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
                <tr style="background-color: #f3f4f6;">
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <td>Sample Premium Product</td>
                  <td>1</td>
                  <td>₹499.00</td>
                </tr>
                <tr>
                  <td colspan="2"><strong>Grand Total</strong></td>
                  <td><strong>₹499.00</strong></td>
                </tr>
              </table>
            </body>
            </html>
          `
        }
      ]
    })
    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
  }
}

testMail()
