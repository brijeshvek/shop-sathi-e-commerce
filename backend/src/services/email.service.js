import transporter from '../config/email.js'

const FROM = process.env.EMAIL_FROM || 'ShopEase <noreply@shopease.com>'

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .header  { background: #6366f1; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .body    { padding: 32px; color: #374151; line-height: 1.6; }
    .body h2 { color: #111827; margin-top: 0; }
    .btn     { display: inline-block; background: #6366f1; color: #fff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer  { background: #f3f4f6; padding: 20px 32px; text-align: center; color: #9ca3af; font-size: 13px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    table    { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td, th   { padding: 10px 12px; border: 1px solid #e5e7eb; text-align: left; font-size: 14px; }
    th       { background: #f9fafb; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>🛍️ ShopEase</h1></div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} ShopEase. All rights reserved.</div>
  </div>
</body>
</html>`

// Welcome Email
export const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    from:    FROM,
    to:      user.email,
    subject: '🎉 Welcome to ShopEase!',
    html:    baseTemplate(`
      <h2>Welcome, ${user.name}! 👋</h2>
      <p>We're excited to have you on board. Start exploring thousands of products at the best prices.</p>
      <a href="${process.env.CLIENT_URL}" class="btn">Start Shopping</a>
      <hr class="divider">
      <p style="color:#6b7280;font-size:13px">If you didn't create this account, please ignore this email.</p>
    `),
  })
}

// Password Reset Email
export const sendPasswordResetEmail = async (user, resetUrl) => {
  await transporter.sendMail({
    from:    FROM,
    to:      user.email,
    subject: '🔑 Reset Your Password',
    html:    baseTemplate(`
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name}, we received a request to reset your password.</p>
      <p>Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
      <hr class="divider">
      <p style="color:#6b7280;font-size:13px">If you didn't request this, please ignore this email. Your password won't change.</p>
    `),
  })
}

// Order Confirmation Email
export const sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('')

  await transporter.sendMail({
    from:    FROM,
    to:      user.email,
    subject: `✅ Order Confirmed — ${order.orderNumber}`,
    html:    baseTemplate(`
      <h2>Order Confirmed! 🎉</h2>
      <p>Hi ${user.name}, your order has been placed successfully.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toDateString() : '5–7 business days'}</p>
      <table>
        <tr><th>Product</th><th>Qty</th><th>Total</th></tr>
        ${itemsHtml}
        <tr><td colspan="2"><strong>Total Amount</strong></td><td style="text-align:right"><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></td></tr>
      </table>
      <a href="${process.env.CLIENT_URL}/profile/orders/${order._id}" class="btn">Track Order</a>
    `),
  })
}

// Order Status Update Email
export const sendOrderStatusEmail = async (user, order) => {
  const statusMessages = {
    processing: 'Your order is being processed. 📦',
    shipped:    'Great news! Your order has been shipped. 🚚',
    delivered:  'Your order has been delivered. Enjoy! 🎉',
    cancelled:  'Your order has been cancelled.',
  }

  await transporter.sendMail({
    from:    FROM,
    to:      user.email,
    subject: `📦 Order Update — ${order.orderNumber}`,
    html:    baseTemplate(`
      <h2>Order Status Updated</h2>
      <p>Hi ${user.name}, ${statusMessages[order.orderStatus] || 'Your order status has been updated.'}</p>
      <p><strong>Order:</strong> ${order.orderNumber}</p>
      <p><strong>New Status:</strong> <span style="color:#6366f1;font-weight:600;text-transform:capitalize">${order.orderStatus}</span></p>
      <a href="${process.env.CLIENT_URL}/profile/orders/${order._id}" class="btn">View Order</a>
    `),
  })
}
