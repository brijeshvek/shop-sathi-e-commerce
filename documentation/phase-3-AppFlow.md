# Application Flow Document

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 3 of 9

---

## Table of Contents

1. [Overview](#1-overview)
2. [Client Website Flows](#2-client-website-flows)
   - 2.1 [Guest User Flow](#21-guest-user-flow)
   - 2.2 [Authentication Flow](#22-authentication-flow)
   - 2.3 [Home Page Flow](#23-home-page-flow)
   - 2.4 [Product Discovery Flow](#24-product-discovery-flow)
   - 2.5 [Product Detail Flow](#25-product-detail-flow)
   - 2.6 [Cart Flow](#26-cart-flow)
   - 2.7 [Checkout Flow](#27-checkout-flow)
   - 2.8 [Order Success Flow](#28-order-success-flow)
   - 2.9 [User Profile Flow](#29-user-profile-flow)
   - 2.10 [Wishlist Flow](#210-wishlist-flow)
   - 2.11 [Order Tracking Flow](#211-order-tracking-flow)
   - 2.12 [Review Flow](#212-review-flow)
   - 2.13 [Password Reset Flow](#213-password-reset-flow)
3. [Admin Dashboard Flows](#3-admin-dashboard-flows)
   - 3.1 [Admin Login Flow](#31-admin-login-flow)
   - 3.2 [Dashboard Overview Flow](#32-dashboard-overview-flow)
   - 3.3 [Product Management Flow](#33-product-management-flow)
   - 3.4 [Order Management Flow](#34-order-management-flow)
   - 3.5 [Customer Management Flow](#35-customer-management-flow)
   - 3.6 [Category Management Flow](#36-category-management-flow)
   - 3.7 [Coupon Management Flow](#37-coupon-management-flow)
   - 3.8 [Analytics Flow](#38-analytics-flow)
4. [Backend API Flows](#4-backend-api-flows)
   - 4.1 [Request Lifecycle](#41-request-lifecycle)
   - 4.2 [JWT Auth Flow](#42-jwt-auth-flow)
   - 4.3 [Image Upload Flow](#43-image-upload-flow)
   - 4.4 [Order Processing Flow](#44-order-processing-flow)
5. [Navigation Maps](#5-navigation-maps)
   - 5.1 [Website Navigation Map](#51-website-navigation-map)
   - 5.2 [Dashboard Navigation Map](#52-dashboard-navigation-map)
6. [Page States](#6-page-states)
7. [Error States & Fallbacks](#7-error-states--fallbacks)

---

## 1. Overview

This document maps every user journey, screen transition, and data flow across the three applications. It defines how users move through the platform, what happens at each step, and how data travels between the frontend and backend.

### Applications Covered

| App | Users | Entry Point |
|-----|-------|-------------|
| Client Website (Next.js) | Customers (guest + logged in) | `website.com/` |
| Admin Dashboard (React.js) | Admin, Super Admin | `admin.website.com/login` |
| Backend API (Node.js) | Both apps via HTTP | `api.website.com/api` |

---

## 2. Client Website Flows

### 2.1 Guest User Flow

```
Visit website.com
        │
        ▼
   [Home Page]
   ┌────────────────────────────────────────┐
   │  - Hero Banner                         │
   │  - Featured Categories                 │
   │  - Featured Products                   │
   │  - Promotional Banners                 │
   └────────────────────────────────────────┘
        │
        ├──► Browse Products (no login required)
        ├──► View Product Detail (no login required)
        ├──► Search Products (no login required)
        ├──► Add to Cart (guest cart — saved in cookie/localStorage)
        │
        └──► Checkout
                │
                ▼
          [Login Required]
          Redirect to /login?redirect=/checkout
```

**Guest Cart Behavior:**
- Items stored in `localStorage` (key: `guestCart`)
- On login → guest cart merged with server cart
- Cart count shown in Navbar for both guest and logged-in users

---

### 2.2 Authentication Flow

#### Registration

```
/register
    │
    ▼
Fill Form [Name, Email, Password, Confirm Password]
    │
    ▼
Submit → POST /api/auth/register
    │
    ├── Validation Error → Show inline field errors
    │
    └── Success
            │
            ▼
        JWT cookies set (access + refresh)
            │
            ▼
        Welcome email sent
            │
            ▼
        Redirect to / (Home Page)
```

#### Login

```
/login
    │
    ▼
Fill Form [Email, Password]
    │
    ▼
Submit → POST /api/auth/login
    │
    ├── Invalid credentials → Show error toast
    ├── Account blocked → Show blocked message
    │
    └── Success
            │
            ▼
        JWT cookies set
            │
            ▼
        Guest cart merged with server cart
            │
            ▼
        Redirect to previous page OR /
```

#### Logout

```
Click "Logout" in Navbar/Profile menu
    │
    ▼
POST /api/auth/logout
    │
    ▼
JWT cookies cleared on server
    │
    ▼
Local state cleared (user, cart)
    │
    ▼
Redirect to /
```

---

### 2.3 Home Page Flow

```
[Home Page] — /
    │
    ├──► Click Category Card
    │         └──► /category/[slug]
    │
    ├──► Click Featured Product Card
    │         └──► /products/[slug]
    │
    ├──► Click "Shop Now" (Hero Banner)
    │         └──► /products
    │
    ├──► Click "Add to Wishlist" on Product Card
    │         ├── Not logged in → /login?redirect=back
    │         └── Logged in → POST /api/wishlist/add → Toast notification
    │
    ├──► Click "Add to Cart" on Product Card
    │         ├── Guest → add to localStorage cart
    │         └── Logged in → POST /api/cart/add → Cart count updated
    │
    └──► Newsletter Signup → POST /api/newsletter → Success toast
```

---

### 2.4 Product Discovery Flow

#### Product Listing

```
[Product Listing] — /products
    │
    ├── Page Load
    │       └── GET /api/products?page=1&limit=12
    │
    ├── Apply Category Filter
    │       └── GET /api/products?category=electronics
    │
    ├── Apply Price Filter
    │       └── GET /api/products?minPrice=500&maxPrice=5000
    │
    ├── Apply Sort
    │       └── GET /api/products?sort=price&order=asc
    │
    ├── Apply Rating Filter
    │       └── GET /api/products?minRating=4
    │
    ├── Pagination
    │       └── GET /api/products?page=2&limit=12
    │
    └── Click Product Card
              └──► /products/[slug]
```

#### Search Flow

```
Type in Search Bar (debounce 400ms)
    │
    ▼
GET /api/products?search=<query>&limit=5
    │
    ▼
Show Autocomplete Dropdown (max 5 results)
    │
    ├── Click Suggestion → /products/[slug]
    │
    └── Press Enter / Click "Search All"
              └──► /search?q=<query>
                        │
                        ▼
                  [Search Results Page]
                  GET /api/products?search=<query>&page=1
                        │
                        ├── Results found → Show product grid
                        └── No results → Show empty state + suggestions
```

---

### 2.5 Product Detail Flow

```
[Product Detail] — /products/[slug]
    │
    ├── Page Load (SSR)
    │       └── GET /api/products/[slug]
    │               └── GET /api/reviews/[productId]
    │
    ├── Image Gallery
    │       └── Click thumbnail → Switch main image
    │               └── Click main image → Open zoom modal
    │
    ├── Select Variant (Size/Color)
    │       └── Click option → Update selected variant state
    │
    ├── Quantity Selector
    │       └── +/- buttons → Update quantity (min:1, max:stock)
    │
    ├── Add to Cart
    │       ├── Guest → save to localStorage
    │       ├── Logged in → POST /api/cart/add
    │       └── Out of stock → Button disabled, show "Out of Stock"
    │
    ├── Add to Wishlist
    │       ├── Not logged in → redirect to /login
    │       └── Logged in → POST /api/wishlist/add → icon fills (red heart)
    │
    ├── Write Review (logged in + purchased only)
    │       └── See Review Flow (2.12)
    │
    └── Related Products Section
              └── Click → /products/[slug]
```

---

### 2.6 Cart Flow

```
[Cart Page] — /cart
    │
    ├── Page Load
    │       ├── Guest → read localStorage
    │       └── Logged in → GET /api/cart
    │
    ├── Update Quantity
    │       ├── Guest → update localStorage
    │       └── Logged in → PUT /api/cart/update
    │
    ├── Remove Item
    │       ├── Guest → remove from localStorage
    │       └── Logged in → DELETE /api/cart/remove/:productId
    │
    ├── Apply Coupon
    │       └── POST /api/coupons/validate
    │               ├── Valid → apply discount, show savings
    │               └── Invalid → show error (expired / not found / min order)
    │
    ├── Empty Cart State
    │       └── Show illustration + "Continue Shopping" button → /products
    │
    └── Click "Proceed to Checkout"
              ├── Guest → /login?redirect=/checkout
              └── Logged in → /checkout
```

---

### 2.7 Checkout Flow

```
[Checkout Page] — /checkout   (Protected Route)
    │
    ├── Page Load
    │       └── Fetch cart + user addresses
    │               └── If cart empty → redirect to /cart
    │
    ├── Step 1: Shipping Address
    │       ├── Select saved address → pre-fill form
    │       ├── Add new address → show address form
    │       └── Fill: Name, Phone, Street, City, State, Pincode
    │
    ├── Step 2: Order Review
    │       └── Show all cart items, quantities, prices
    │               └── Show subtotal, shipping, discount, total
    │
    ├── Step 3: Payment Method
    │       ├── COD (Cash on Delivery) — v1.0 default
    │       └── Online Payment — v1.1
    │
    └── Click "Place Order"
              │
              ▼
        POST /api/orders
              │
              ├── Validation error → Show error
              │
              └── Success
                      │
                      ▼
                  Cart cleared (server + local)
                      │
                      ▼
                  Order confirmation email sent
                      │
                      ▼
                  Redirect → /order-success?orderId=<id>
```

---

### 2.8 Order Success Flow

```
[Order Success Page] — /order-success
    │
    ├── Display
    │       ├── ✅ Success animation / icon
    │       ├── Order Number (e.g., ORD-20260701-4821)
    │       ├── Estimated delivery date
    │       └── Summary of items ordered
    │
    ├── CTA Buttons
    │       ├── "Track My Order" → /profile/orders/[id]
    │       └── "Continue Shopping" → /products
    │
    └── Email sent to customer with order details
```

---

### 2.9 User Profile Flow

```
[Profile] — /profile   (Protected Route)
    │
    ├── View/Edit Profile
    │       └── PUT /api/users/:id → update name, phone, avatar
    │
    ├── Change Password
    │       └── PUT /api/users/:id/password
    │               ├── Wrong current password → error
    │               └── Success → toast + logout (re-login required)
    │
    ├── Manage Addresses — /profile/addresses
    │       ├── Add Address → POST /api/users/:id/addresses
    │       ├── Edit Address → PUT /api/users/:id/addresses/:addressId
    │       ├── Delete Address → DELETE /api/users/:id/addresses/:addressId
    │       └── Set Default → PATCH /api/users/:id/addresses/:addressId/default
    │
    ├── Order History — /profile/orders
    │       └── GET /api/orders/my-orders (paginated)
    │               └── Click Order → /profile/orders/[id]
    │
    └── Wishlist — /profile/wishlist
              └── See Wishlist Flow (2.10)
```

---

### 2.10 Wishlist Flow

```
[Wishlist] — /profile/wishlist   (Protected Route)
    │
    ├── Page Load → GET /api/wishlist
    │
    ├── Empty State → Show "No items in wishlist" + Browse button
    │
    ├── Wishlist Item Actions
    │       ├── Remove from Wishlist → DELETE /api/wishlist/remove/:productId
    │       └── Move to Cart
    │               └── POST /api/cart/add
    │                       └── DELETE /api/wishlist/remove/:productId
    │
    └── Click Product → /products/[slug]
```

---

### 2.11 Order Tracking Flow

```
[Order Detail] — /profile/orders/[id]
    │
    ├── Page Load → GET /api/orders/:id
    │
    ├── Display
    │       ├── Order Number, Date, Payment Method
    │       ├── Status Timeline
    │       │       pending → processing → shipped → delivered
    │       │       (current status highlighted)
    │       ├── Estimated Delivery Date
    │       ├── Shipping Address
    │       ├── Items Ordered (name, qty, price)
    │       └── Price Breakdown (subtotal, shipping, discount, total)
    │
    └── Cancel Order Button (only if status = "pending")
              │
              ▼
        Confirm Dialog: "Are you sure you want to cancel?"
              │
              ├── No → dismiss
              └── Yes → PUT /api/orders/:id/cancel
                          └── Status updated → Toast → Page refresh
```

---

### 2.12 Review Flow

```
[Product Detail Page — Reviews Section]
    │
    ├── View Reviews
    │       └── GET /api/reviews/:productId
    │               └── Show star ratings, review text, verified badge
    │
    ├── Write Review (only if: logged in + purchased product)
    │       │
    │       ▼
    │   [Review Form]
    │   ├── Select Star Rating (1-5)
    │   ├── Write Title (optional)
    │   ├── Write Comment (required)
    │   └── Submit → POST /api/reviews/:productId
    │               ├── Already reviewed → show "Edit" instead
    │               └── Success → review appears immediately, ratings updated
    │
    ├── Edit Review
    │       └── PUT /api/reviews/:reviewId
    │
    └── Delete Review
              └── DELETE /api/reviews/:reviewId
                        └── Confirm → removed from list
```

---

### 2.13 Password Reset Flow

```
/forgot-password
    │
    ▼
Enter Email → POST /api/auth/forgot-password
    │
    ├── Email not found → generic success message (security: no reveal)
    │
    └── Email found
            │
            ▼
        Reset email sent (expires in 10 min)
            │
            ▼
        User clicks email link
            │
            ▼
        /reset-password?token=<rawToken>
            │
            ▼
        Enter New Password + Confirm Password
            │
            ▼
        POST /api/auth/reset-password
            │
            ├── Token expired → show error + resend option
            └── Success → redirect to /login + success toast
```

---

## 3. Admin Dashboard Flows

### 3.1 Admin Login Flow

```
/login   (Dashboard entry point)
    │
    ├── Already logged in? → redirect to /dashboard
    │
    ▼
Fill Form [Email, Password]
    │
    ▼
POST /api/auth/login
    │
    ├── Invalid credentials → error message
    ├── Not admin role → "Access denied" error
    │
    └── Success (role: admin or superadmin)
            │
            ▼
        JWT cookies set
            │
            ▼
        Redirect to /dashboard
```

---

### 3.2 Dashboard Overview Flow

```
[Dashboard] — /dashboard
    │
    ├── Page Load
    │       └── GET /api/analytics/dashboard
    │               Returns: revenue, orders, products, customers counts
    │
    ├── Stats Cards
    │       ├── Total Revenue (today / this week / this month toggle)
    │       ├── Total Orders (with status breakdown)
    │       ├── Total Products
    │       └── Total Customers
    │
    ├── Revenue Chart (Line Chart)
    │       └── GET /api/analytics/revenue?period=monthly
    │
    ├── Recent Orders Table (last 10)
    │       └── Click Row → /orders/[id]
    │
    ├── Top Selling Products (top 5)
    │       └── Click → /products/edit/[id]
    │
    └── Low Stock Alert
              └── Products with stock < 10 → Click → /products/edit/[id]
```

---

### 3.3 Product Management Flow

#### Product List

```
[Products] — /products
    │
    ├── Page Load → GET /api/products?page=1&limit=20 (admin view: all)
    │
    ├── Search → GET /api/products?search=<query>
    ├── Filter by Category → GET /api/products?category=<id>
    ├── Filter by Status → GET /api/products?isActive=true/false
    │
    ├── Table Actions per Row
    │       ├── Edit → /products/edit/[id]
    │       ├── Toggle Active/Inactive → PATCH /api/products/:id/status
    │       └── Delete → Confirm Dialog → DELETE /api/products/:id
    │
    ├── Bulk Actions (select multiple)
    │       ├── Bulk Delete → DELETE /api/products/bulk
    │       └── Bulk Status Change
    │
    └── "Add Product" Button → /products/add
```

#### Add/Edit Product

```
[Add Product] — /products/add
[Edit Product] — /products/edit/[id]
    │
    ├── Form Fields
    │       ├── Basic Info: Name, Slug (auto), Short Desc, Full Desc
    │       ├── Category (dropdown from GET /api/categories)
    │       ├── Brand, SKU
    │       ├── Pricing: Price, Original Price, Discount %
    │       ├── Stock Quantity
    │       ├── Tags (multi-input)
    │       ├── Variants (add variant groups with options)
    │       ├── Specifications (key-value pairs)
    │       ├── Image Upload (drag & drop, max 6)
    │       │       └── POST /api/upload/image → Cloudinary
    │       │               └── Preview shown immediately
    │       ├── Status Toggle (Active/Inactive)
    │       └── Featured Toggle
    │
    └── Submit
              ├── POST /api/products (Add)
              ├── PUT /api/products/:id (Edit)
              └── Success → redirect to /products with toast
```

---

### 3.4 Order Management Flow

#### Order List

```
[Orders] — /orders
    │
    ├── Page Load → GET /api/orders?page=1&limit=20
    │
    ├── Filters
    │       ├── By Status (pending/processing/shipped/delivered/cancelled)
    │       ├── By Date Range (date picker)
    │       └── By Customer (search by name/email)
    │
    ├── Table Columns
    │       Order# | Customer | Items | Total | Status | Date | Actions
    │
    ├── Actions per Row
    │       └── View → /orders/[id]
    │
    └── Export to CSV Button → download orders.csv
```

#### Order Detail

```
[Order Detail] — /orders/[id]
    │
    ├── Page Load → GET /api/orders/:id
    │
    ├── Display
    │       ├── Order Info (number, date, payment method, payment status)
    │       ├── Customer Info (name, email, phone) → click → /customers/[id]
    │       ├── Shipping Address
    │       ├── Items Table (product, qty, price, total)
    │       ├── Price Summary (subtotal, shipping, discount, total)
    │       └── Status History Timeline
    │
    ├── Update Order Status
    │       ├── Dropdown: pending → processing → shipped → delivered → cancelled
    │       ├── Optional Note field
    │       └── Submit → PUT /api/orders/:id/status
    │                       └── Email sent to customer on status change
    │
    └── View Invoice Button → generate/print order invoice
```

---

### 3.5 Customer Management Flow

```
[Customers] — /customers
    │
    ├── Page Load → GET /api/users?role=customer&page=1
    │
    ├── Search by name/email
    ├── Filter by status (active/blocked)
    │
    ├── Table Columns
    │       Name | Email | Phone | Orders | Joined | Status | Actions
    │
    ├── Actions per Row
    │       ├── View → /customers/[id]
    │       └── Block/Unblock → PUT /api/users/:id/block
    │
    └── Export Customers CSV

[Customer Detail] — /customers/[id]
    │
    ├── Profile Info (avatar, name, email, phone, join date)
    ├── Address List
    ├── Order History Table (GET /api/orders?user=:id)
    │       └── Click Order → /orders/[orderId]
    └── Block/Unblock Toggle
```

---

### 3.6 Category Management Flow

```
[Categories] — /categories
    │
    ├── Page Load → GET /api/categories
    │
    ├── Category Tree View (parent → children)
    │
    ├── Actions
    │       ├── Add Category → Modal Form
    │       │       ├── Name, Slug (auto), Description
    │       │       ├── Parent Category (optional dropdown)
    │       │       ├── Image Upload → Cloudinary
    │       │       └── POST /api/categories
    │       │
    │       ├── Edit Category → pre-filled Modal
    │       │       └── PUT /api/categories/:id
    │       │
    │       └── Delete Category → Confirm Dialog
    │               ├── Has products? → "Reassign products first" warning
    │               └── No products → DELETE /api/categories/:id
    │
    └── Toggle Active/Inactive → PATCH /api/categories/:id/status
```

---

### 3.7 Coupon Management Flow

```
[Coupons] — /coupons
    │
    ├── Page Load → GET /api/coupons
    │
    ├── Coupon Table Columns
    │       Code | Type | Value | Min Order | Usage | Expiry | Status | Actions
    │
    ├── Create Coupon → Modal Form
    │       ├── Code (auto-generate or manual, uppercase)
    │       ├── Discount Type: Percentage / Flat Amount
    │       ├── Discount Value
    │       ├── Minimum Order Amount
    │       ├── Max Discount Cap (for percentage type)
    │       ├── Usage Limit (total / per user)
    │       ├── Expiry Date
    │       └── POST /api/coupons
    │
    ├── Edit Coupon → pre-filled Modal → PUT /api/coupons/:id
    │
    ├── Toggle Active/Inactive → PATCH /api/coupons/:id/status
    │
    └── Delete Coupon → DELETE /api/coupons/:id
```

---

### 3.8 Analytics Flow

```
[Analytics] — /analytics
    │
    ├── Page Load → GET /api/analytics/dashboard
    │
    ├── Revenue Report
    │       ├── Period Toggle: Daily | Weekly | Monthly | Yearly
    │       └── GET /api/analytics/revenue?period=monthly&year=2026
    │               └── Line Chart (Recharts)
    │
    ├── Orders Report
    │       └── GET /api/analytics/orders?period=monthly
    │               └── Bar Chart (orders by status)
    │
    ├── Top Products
    │       └── GET /api/analytics/top-products?limit=10
    │               └── Table with product name, units sold, revenue
    │
    └── Export Report
              └── Download as CSV / PDF
```

---

## 4. Backend API Flows

### 4.1 Request Lifecycle

```
Incoming HTTP Request
        │
        ▼
[Express Middleware Stack]
    │── cors()             → check allowed origins
    │── helmet()           → set security headers
    │── express.json()     → parse JSON body
    │── cookieParser()     → parse cookies
    │── morgan()           → log request
    │── rateLimit()        → check rate limit
        │
        ▼
[Route Matching]
  e.g., POST /api/auth/login → authRouter
        │
        ▼
[Route-Level Middleware]
  e.g., authMiddleware → adminMiddleware (if protected)
        │
        ├── Auth fails → 401 Unauthorized (stop here)
        │
        ▼
[Validation Middleware]
  express-validator checks body/params/query
        │
        ├── Validation fails → 400 Bad Request with errors array
        │
        ▼
[Controller Function]
  asyncHandler wraps it → no uncaught Promise rejections
        │
        ├── Business logic error → throw new ApiError(...)
        │
        ▼
[Database Operation]
  Mongoose query (with .lean() for reads)
        │
        ▼
[Response]
  res.status(200).json(new ApiResponse(...))
        │
        ▼
[Global Error Middleware] (catches any thrown ApiError)
  res.status(err.statusCode).json({ success: false, message, errors })
```

---

### 4.2 JWT Auth Flow

```
Login Request
    │
    ▼
Validate credentials → generate tokens
    │
    ▼
Set HTTP-only Cookies:
    accessToken  (maxAge: 15 min)
    refreshToken (maxAge: 7 days)
    │
    ▼
Next Request (cookie auto-sent by browser)
    │
    ▼
authMiddleware:
    │── Read accessToken from cookie
    │── jwt.verify(token, ACCESS_SECRET)
    │
    ├── Valid → attach user to req.user → next()
    │
    └── Expired
            │
            ▼
        Read refreshToken from cookie
            │
            ▼
        jwt.verify(token, REFRESH_SECRET)
            │
            ├── Valid → generate new accessToken → set cookie → next()
            └── Invalid → 401 (force re-login)
```

---

### 4.3 Image Upload Flow

```
Admin uploads image (drag & drop in dashboard)
    │
    ▼
Multer (memoryStorage) receives file buffer
    │
    ▼
Validate: type (jpeg/png/webp) + size (< 5MB)
    │
    ├── Invalid → 400 error
    │
    ▼
Upload to Cloudinary via upload_stream
    { folder: 'ecommerce/products', transformation: [...] }
    │
    ▼
Cloudinary returns { url, public_id }
    │
    ▼
Store { url, publicId } in product.images[]
    │
    ▼
Return url to frontend → preview shown

Delete Flow:
    DELETE /api/upload/image/:publicId
        │
        ▼
    cloudinary.uploader.destroy(publicId)
        │
        ▼
    Remove from DB document
```

---

### 4.4 Order Processing Flow

```
Customer clicks "Place Order"
    │
    ▼
POST /api/orders
    │
    ▼
Validate:
    ├── Cart not empty
    ├── All items in stock
    ├── Shipping address valid
    └── Payment method valid
    │
    ├── Validation fails → 400 error
    │
    ▼
Calculate:
    subtotal = Σ (item.price × item.quantity)
    discountAmount = (coupon applied ? calculate : 0)
    taxAmount = subtotal × TAX_RATE (e.g., 18% GST)
    shippingCharge = (subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 99)
    totalAmount = subtotal - discountAmount + taxAmount + shippingCharge
    │
    ▼
Create Order document (orderNumber: ORD-YYYYMMDD-XXXX)
    │
    ▼
Update product stock (decrement each item's stock)
    │
    ▼
Update coupon usedCount + add user to usedBy[]
    │
    ▼
Clear user's cart
    │
    ▼
Send Order Confirmation Email (async, non-blocking)
    │
    ▼
Return order data to client
    │
    ▼
Client redirects to /order-success
```

---

## 5. Navigation Maps

### 5.1 Website Navigation Map

```
website.com/
├── /                          ← Home
├── /products                  ← All Products
│   └── /products/[slug]       ← Product Detail
├── /category/[slug]           ← Category Listing
├── /search?q=                 ← Search Results
├── /cart                      ← Cart
├── /checkout              🔒  ← Checkout (auth required)
├── /order-success         🔒  ← Order Success
├── /login                     ← Login
├── /register                  ← Register
├── /forgot-password           ← Forgot Password
├── /reset-password?token=     ← Reset Password
└── /profile               🔒  ← User Profile (auth required)
    ├── /profile               ← Profile Info
    ├── /profile/orders        ← Order History
    │   └── /profile/orders/[id] ← Order Detail
    ├── /profile/wishlist      ← Wishlist
    └── /profile/addresses     ← Saved Addresses
```

### 5.2 Dashboard Navigation Map

```
admin.website.com/
├── /login                     ← Admin Login
└── /dashboard             🔒  ← (all below are protected)
    ├── /dashboard             ← Overview
    ├── /products              ← Product List
    │   ├── /products/add      ← Add Product
    │   └── /products/edit/[id] ← Edit Product
    ├── /orders                ← Order List
    │   └── /orders/[id]       ← Order Detail
    ├── /customers             ← Customer List
    │   └── /customers/[id]    ← Customer Detail
    ├── /categories            ← Category Management
    ├── /coupons               ← Coupon Management
    ├── /analytics             ← Analytics & Reports
    └── /settings              ← Settings
```

---

## 6. Page States

Every page must handle these states:

### Loading State
```
- Skeleton loaders (not spinners) for content-heavy pages
- Spinner for action buttons (submit, delete)
- Disabled state for all interactive elements while loading
```

### Empty State
```
- Illustrated empty state (SVG icon + message + CTA)

Examples:
- Cart empty → "Your cart is empty" + "Browse Products" button
- No orders → "No orders yet" + "Shop Now" button
- No wishlist → "Your wishlist is empty" + "Explore Products" button
- No search results → "No results for '<query>'" + suggestions
```

### Error State
```
- API error → Error toast (top-right, auto-dismiss 4s)
- 404 Page → Custom 404 with "Go Home" button
- 500 / Network error → "Something went wrong, please try again"
- Unauthorized → redirect to login
```

### Success State
```
- Form submit → Toast notification ("Product added successfully")
- Order placed → Full Order Success page
- Profile update → Inline success message
```

---

## 7. Error States & Fallbacks

| Scenario | User Sees | Action |
|----------|-----------|--------|
| API is down | "Something went wrong. Please try again." | Retry button |
| Product out of stock (during checkout) | "Item out of stock, removed from cart" | Cart updated |
| Coupon expired | "This coupon has expired" | Coupon removed |
| Session expired | "Session expired, please login again" | Redirect to /login |
| Invalid product URL | Custom 404 page | "Go Home" button |
| Payment failure (v1.1) | "Payment failed. Try again or use COD" | Retry / change method |
| Image upload fails | "Image upload failed. Please try again." | Re-upload option |
| Network timeout | "No internet connection. Check your network." | Auto-retry on reconnect |
| Blocked account | "Your account has been suspended. Contact support." | Contact email shown |
| Admin: duplicate product SKU | "SKU already exists. Please use a unique SKU." | Highlight SKU field |

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial Application Flow Document |

---

*Previous Phase → [Phase 2: Technical Requirements Document (TRD)](./phase-2-TRD.md)*  
*Next Phase → [Phase 4: UI/UX Brief](./phase-4-UIUXBrief.md)*
