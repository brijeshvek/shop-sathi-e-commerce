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

// Invoice HTML generation for email attachments
const generateInvoiceHtml = (order, user) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.orderNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; line-height: 1.5; }
    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 14px; background: #fff; border-radius: 8px; }
    .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
    .invoice-box table td { padding: 8px 4px; vertical-align: top; }
    .invoice-box table tr.top table td { padding-bottom: 20px; }
    .invoice-box table tr.top table td.title { font-size: 32px; font-weight: bold; color: #6366f1; }
    .invoice-box table tr.information table td { padding-bottom: 30px; }
    .invoice-box table tr.heading td { background: #f3f4f6; border-bottom: 1px solid #ddd; font-weight: bold; padding: 10px 8px; }
    .invoice-box table tr.item td { border-bottom: 1px solid #eee; padding: 10px 8px; }
    .invoice-box table tr.item.last td { border-bottom: none; }
    .invoice-box table tr.total td { font-weight: bold; border-top: 2px solid #eee; padding: 12px 8px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .badge { padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge-paid { background: #dcfce7; color: #15803d; }
    .badge-pending { background: #fef9c3; color: #a16207; }
  </style>
</head>
<body>
  <div class="invoice-box">
    <table>
      <tr class="top">
        <td colspan="4">
          <table>
            <tr>
              <td class="title">Shop Sathi</td>
              <td class="text-right">
                <strong>Invoice #:</strong> ${order.orderNumber}<br>
                <strong>Created:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                <strong>Status:</strong> <span class="badge ${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}">${order.paymentStatus}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr class="information">
        <td colspan="4">
          <table>
            <tr>
              <td>
                <strong>Billed To:</strong><br>
                ${order.shippingAddress?.fullName || user.name}<br>
                ${order.shippingAddress?.street || ''}<br>
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.pincode || ''}<br>
                ${order.shippingAddress?.country || ''}<br>
                Phone: ${order.shippingAddress?.phone || ''}
              </td>
              <td class="text-right">
                <strong>Payment Info:</strong><br>
                Method: ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}<br>
                ${order.paymentDetails?.razorpayPaymentId ? `Transaction ID: ${order.paymentDetails.razorpayPaymentId}<br>` : ''}
                ${order.paymentDetails?.paidAt ? `Paid At: ${new Date(order.paymentDetails.paidAt).toLocaleString()}` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr class="heading">
        <td>Item Description</td>
        <td class="text-center">Price</td>
        <td class="text-center">Qty</td>
        <td class="text-right">Total</td>
      </tr>
      ${order.items.map(item => `
        <tr class="item">
          <td>
            <strong>${item.name}</strong>
            ${item.selectedVariants && Object.keys(item.selectedVariants).length > 0 ? `<br><small style="color: #666">${Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}</small>` : ''}
          </td>
          <td class="text-center">₹${item.price.toFixed(2)}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr class="total">
        <td colspan="2"></td>
        <td class="text-center">Subtotal:</td>
        <td class="text-right">₹${(order.subtotal || order.totalAmount).toFixed(2)}</td>
      </tr>
      <tr class="total">
        <td colspan="2"></td>
        <td class="text-center">Shipping:</td>
        <td class="text-right">${order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge?.toFixed(2)}`}</td>
      </tr>
      <tr class="total">
        <td colspan="2"></td>
        <td class="text-center">Tax:</td>
        <td class="text-right">₹${(order.taxAmount || 0).toFixed(2)}</td>
      </tr>
      ${order.discountAmount > 0 ? `
      <tr class="total" style="color: #15803d">
        <td colspan="2"></td>
        <td class="text-center">Discount:</td>
        <td class="text-right">-₹${order.discountAmount.toFixed(2)}</td>
      </tr>
      ` : ''}
      <tr class="total" style="font-size: 16px; color: #6366f1;">
        <td colspan="2"></td>
        <td class="text-center">Grand Total:</td>
        <td class="text-right">₹${order.totalAmount.toFixed(2)}</td>
      </tr>
    </table>
    <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
      Thank you for shopping with Shop Sathi!
    </div>
  </div>
</body>
</html>
`

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
      <p><strong>Payment Status:</strong> <span style="text-transform:capitalize;font-weight:bold;color:${order.paymentStatus === 'paid' ? '#16a34a' : '#d97706'}">${order.paymentStatus}</span></p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment'}</p>
      <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toDateString() : '5–7 business days'}</p>
      <p>Please find attached your official invoice copy for this order.</p>
      <table>
        <tr><th>Product</th><th>Qty</th><th>Total</th></tr>
        ${itemsHtml}
        <tr><td colspan="2"><strong>Total Amount</strong></td><td style="text-align:right"><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></td></tr>
      </table>
      <a href="${process.env.CLIENT_URL}/profile/orders/${order._id}" class="btn">Track Order</a>
    `),
    attachments: [
      {
        filename: `invoice_${order.orderNumber}.html`,
        content: generateInvoiceHtml(order, user)
      }
    ]
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

// Login OTP Email
export const sendLoginOtpEmail = async (user, otp) => {
  await transporter.sendMail({
    from:    FROM,
    to:      user.email,
    subject: `🔐 Your Login OTP — ${otp}`,
    html:    baseTemplate(`
      <h2>Security Verification Code 🔐</h2>
      <p>Hi ${user.name}, use the verification code below to complete your login request.</p>
      <div style="background:#f3f4f6; border-radius:8px; padding:16px; text-align:center; font-size:32px; font-weight:bold; letter-spacing:6px; color:#4f46e5; margin:24px 0;">
        ${otp}
      </div>
      <p>This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
      <hr class="divider">
      <p style="color:#6b7280;font-size:13px">If you didn't attempt to log in, you can safely ignore this email.</p>
    `),
  })
}
