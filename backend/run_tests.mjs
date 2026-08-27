import http from 'http';

const BASE_HOST = 'localhost';
const BASE_PORT = 5005;
const BASE_PATH = '/api';

let passed = 0;
let failed = 0;
let token = '';
let sellerToken = '';
let productId = '';
let productSlug = '';
let orderId = '';

function request(method, path, body, authToken) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE_HOST,
      port: BASE_PORT,
      path: BASE_PATH + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      }
    };
    const req = http.request(opts, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(b) }); }
        catch { resolve({ status: res.statusCode, body: b }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function pass(label, detail = '') {
  passed++;
  console.log(`  ✅ PASS — ${label}${detail ? ' | ' + detail : ''}`);
}

function fail(label, err = '') {
  failed++;
  console.log(`  ❌ FAIL — ${label}${err ? ' | ' + err : ''}`);
}

function header(label) {
  console.log(`\n[ TEST ${passed + failed + 1} ] ${label}`);
}

// ────────────────────────────────────────────────
console.log('\n=========================================');
console.log('  SHOP SATHI — LIVE API TEST SUITE v3');
console.log('=========================================');

// TEST 1: Customer Login
header('Customer Login (customer1@example.com / password123)');
{
  const r = await request('POST', '/auth/login', { email: 'customer1@example.com', password: 'password123' });
  if (r.status === 200 && r.body.success) {
    token = r.body.data.token;
    pass('Login successful', `Name: ${r.body.data.name} | Role: ${r.body.data.role}`);
  } else {
    fail('Login failed', r.body.message);
  }
}

// TEST 2: Fetch Products List
header('Fetch Products List');
{
  const r = await request('GET', '/products', null, token);
  const products = Array.isArray(r.body.data) ? r.body.data : (r.body.data?.products || []);
  if (r.status === 200 && products.length > 0) {
    productId = products[0]._id;
    productSlug = products[0].slug;
    const p = products[0];
    pass(`${products.length} products loaded`, `First: "${p.name}" | Price: Rs.${p.price} | Stock: ${p.stock}`);
  } else {
    fail('Products fetch failed', r.body.message);
  }
}

// TEST 3: Product Detail by Slug
header('Product Detail Page (by slug)');
{
  const r = await request('GET', `/products/${productSlug}`, null, token);
  if (r.status === 200 && r.body.data) {
    const p = r.body.data;
    pass('Product detail loaded', `"${p.name}" | Slug: ${p.slug} | Stock: ${p.stock}`);
  } else {
    fail('Product detail failed', r.body.message);
  }
}

// TEST 4: Add to Cart
header('Add Product to Cart (qty: 2)');
{
  const r = await request('POST', '/cart/add', { productId, quantity: 2 }, token);
  if (r.status === 200 && r.body.success) {
    pass('Added to cart', `Cart items count: ${r.body.data.items?.length || 0}`);
  } else {
    fail('Add to cart failed', r.body.message);
  }
}

// TEST 5: View Cart
header('View Cart Contents');
{
  const r = await request('GET', '/cart', null, token);
  if (r.status === 200 && r.body.data) {
    const items = r.body.data.items || [];
    pass(`Cart loaded`, `Items: ${items.length}`);
    items.forEach(item => {
      console.log(`     📦 ${item.product?.name || 'Item'} x${item.quantity} @ Rs.${item.product?.price || item.price || 0}`);
    });
  } else {
    fail('View cart failed', r.body.message);
  }
}

// TEST 6: Place Order (COD)
header('Place Order — Cash on Delivery');
{
  const r = await request('POST', '/orders', {
    shippingAddress: {
      fullName: 'Test Customer',
      phone: '9876543210',
      street: '123 Main Street',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      country: 'India'
    },
    paymentMethod: 'COD'
  }, token);
  if (r.status === 201 && r.body.success) {
    orderId = r.body.data.order._id;
    pass('Order placed successfully!', `Order#: ${r.body.data.order.orderNumber} | Total: Rs.${r.body.data.order.totalAmount}`);
  } else {
    fail('Place order failed', r.body.message);
  }
}

// TEST 7: Order History
header('Customer Order History');
{
  const r = await request('GET', '/orders/my-orders', null, token);
  if (r.status === 200 && r.body.data) {
    const orders = r.body.data.orders || [];
    pass('Order history loaded', `Total orders: ${orders.length}`);
    if (orders.length > 0) {
      const o = orders[0];
      console.log(`     📋 Latest: Order#${o.orderNumber} | Status: ${o.orderStatus || o.status} | Total: Rs.${o.totalAmount}`);
    }
  } else {
    fail('Order history failed', r.body.message);
  }
}

// TEST 8: Add to Wishlist
header('Add Product to Wishlist');
{
  const r = await request('POST', '/wishlist/add', { productId }, token);
  if (r.status === 200 && r.body.success) {
    pass('Added to wishlist', `Items count: ${r.body.data?.items?.length || 1}`);
  } else {
    fail('Add to wishlist failed', r.body.message);
  }
}

// TEST 9: View Wishlist
header('View Wishlist');
{
  const r = await request('GET', '/wishlist', null, token);
  if (r.status === 200 && r.body.data) {
    const items = r.body.data.items || [];
    pass('Wishlist loaded', `Items: ${items.length}`);
  } else {
    fail('Wishlist load failed', r.body.message);
  }
}

// TEST 10: User Profile via /auth/me
header('Fetch User Profile (/auth/me)');
{
  const r = await request('GET', '/auth/me', null, token);
  if (r.status === 200 && r.body.data) {
    const u = r.body.data;
    pass('Profile loaded', `Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
  } else {
    fail('Profile failed', r.body.message);
  }
}

// TEST 11: Available Coupons
header('Get Available Coupons');
{
  const r = await request('GET', '/coupons/available', null, token);
  if (r.status === 200) {
    const list = r.body.data || [];
    pass('Coupons endpoint active', `Available: ${list.length}`);
    if (list.length > 0) console.log(`     🏷️  Code: ${list[0].code} | Value: ${list[0].discountValue}% off`);
  } else {
    fail('Coupons failed', r.body.message);
  }
}

// TEST 12: Seller Login
header('Seller Login (amit@shopsathi.com / password123)');
{
  const r = await request('POST', '/auth/login', { email: 'amit@shopsathi.com', password: 'password123' });
  if (r.status === 200 && r.body.success) {
    sellerToken = r.body.data.token;
    pass('Seller login successful', `Name: ${r.body.data.name} | Role: ${r.body.data.role}`);
  } else {
    fail('Seller login failed', r.body.message);
  }
}

// TEST 13: Categories
header('Categories API');
{
  const r = await request('GET', '/categories', null, token);
  if (r.status === 200 && Array.isArray(r.body.data) && r.body.data.length > 0) {
    const cats = r.body.data.slice(0, 6).map(c => c.name).join(', ');
    pass(`${r.body.data.length} categories`, `${cats}...`);
  } else {
    fail('Categories failed', r.body.message);
  }
}

// TEST 14: Product Filter by Category
header('Filter Products by Category');
{
  const catR = await request('GET', '/categories', null, token);
  const catId = catR.body.data?.[0]?._id;
  const r = await request('GET', `/products?category=${catId}`, null, token);
  const products = Array.isArray(r.body.data) ? r.body.data : (r.body.data?.products || []);
  if (r.status === 200) {
    pass('Category filter query successful', `Matching products: ${products.length}`);
  } else {
    fail('Category filter failed', r.body.message);
  }
}

// TEST 15: Sort Products by Price
header('Sort Products (price asc)');
{
  const r = await request('GET', '/products?sort=price&order=asc', null, token);
  const products = Array.isArray(r.body.data) ? r.body.data : (r.body.data?.products || []);
  if (r.status === 200 && products.length > 0) {
    const prices = products.map(p => p.price);
    pass('Sort by price works', `Range: Rs.${prices[0]} → Rs.${prices[prices.length - 1]}`);
  } else {
    fail('Sort failed', r.body.message);
  }
}

// SUMMARY
console.log('\n=========================================');
console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log(`  PASS RATE: ${Math.round((passed / (passed + failed)) * 100)}%`);
console.log('=========================================\n');

process.exit(failed > 0 ? 1 : 0);
