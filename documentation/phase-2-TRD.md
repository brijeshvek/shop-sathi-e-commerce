# Technical Requirements Document (TRD)

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 2 of 9

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack — Detailed](#2-technology-stack--detailed)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Database Design](#4-database-design)
5. [API Design Standards](#5-api-design-standards)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [File Upload Strategy](#7-file-upload-strategy)
8. [Email Service](#8-email-service)
9. [Error Handling Standards](#9-error-handling-standards)
10. [Environment Configuration](#10-environment-configuration)
11. [Security Requirements](#11-security-requirements)
12. [Performance Requirements](#12-performance-requirements)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Version Control Strategy](#14-version-control-strategy)
15. [Coding Standards](#15-coding-standards)

---

## 1. System Architecture

### 1.1 Architecture Overview

The platform follows a **three-tier, decoupled architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│   ┌──────────────────┐        ┌──────────────────────┐     │
│   │  Client Website  │        │   Admin Dashboard    │     │
│   │    (Next.js)     │        │     (React.js)       │     │
│   │   Port: 3000     │        │     Port: 3001        │     │
│   └────────┬─────────┘        └──────────┬───────────┘     │
└────────────│──────────────────────────────│─────────────────┘
             │  HTTP/HTTPS REST API Calls   │
             ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                          │
│                                                             │
│           ┌──────────────────────────────┐                 │
│           │       Backend API            │                 │
│           │   (Node.js + Express.js)     │                 │
│           │        Port: 5000            │                 │
│           └───────────────┬──────────────┘                 │
└───────────────────────────│─────────────────────────────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
┌─────────────────┐ ┌──────────────┐ ┌───────────────┐
│    MongoDB      │ │  Cloudinary  │ │  Nodemailer   │
│   (Database)    │ │  (Images)    │ │   (Email)     │
└─────────────────┘ └──────────────┘ └───────────────┘
```

### 1.2 Communication Pattern

| From | To | Protocol | Format |
|------|----|----------|--------|
| Client Website | Backend API | HTTPS | JSON |
| Admin Dashboard | Backend API | HTTPS | JSON |
| Backend API | MongoDB | MongoDB Driver | BSON |
| Backend API | Cloudinary | HTTPS SDK | Multipart/JSON |
| Backend API | Email Service | SMTP | MIME |

### 1.3 Architecture Principles

- **Separation of Concerns** — Frontend and Backend are fully independent
- **Stateless API** — No server-side session; JWT-based auth
- **Single Responsibility** — Each module handles one domain
- **DRY (Don't Repeat Yourself)** — Shared utilities and middleware
- **RESTful Design** — Standard HTTP verbs and status codes

---

## 2. Technology Stack — Detailed

### 2.1 Client Website (Next.js)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with SSR/SSG/ISR |
| React | 18.x | UI component library |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Zustand | 4.x | Lightweight global state management |
| Axios | 1.x | HTTP client for API calls |
| React Hook Form | 7.x | Form handling and validation |
| Zod | 3.x | Schema validation |
| next-seo | 6.x | SEO meta tags management |
| Swiper.js | 11.x | Product image slider |
| Lucide React | latest | Icon library |

### 2.2 Admin Dashboard (React.js)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library |
| React Router DOM | 6.x | Client-side routing |
| Redux Toolkit | 2.x | Global state (auth, data) |
| RTK Query | 2.x | Data fetching & caching |
| Tailwind CSS | 3.x | Styling |
| React Hook Form | 7.x | Form management |
| Recharts | 2.x | Analytics charts |
| React Table (TanStack) | 8.x | Data tables |
| Lucide React | latest | Icons |
| React Hot Toast | 2.x | Notifications |
| date-fns | 3.x | Date formatting |

### 2.3 Backend API (Node.js)

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 7.x | NoSQL database |
| Mongoose | 8.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication tokens |
| bcryptjs | 2.x | Password hashing |
| Cloudinary SDK | 2.x | Image upload & management |
| Nodemailer | 6.x | Email sending |
| Multer | 1.x | File upload middleware |
| Express Validator | 7.x | Input validation |
| Helmet | 7.x | HTTP security headers |
| CORS | 2.x | Cross-origin policy |
| Morgan | 1.x | HTTP request logging |
| dotenv | 16.x | Environment variables |
| express-rate-limit | 7.x | Rate limiting |
| cookie-parser | 1.x | Cookie parsing |
| compression | 1.x | Response compression |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control |
| VS Code | IDE |
| Postman | API testing |
| ESLint | Code linting |
| Prettier | Code formatting |
| Nodemon | Auto-restart dev server |
| concurrently | Run multiple scripts |

---

## 3. Project Folder Structure

### 3.1 Root Structure

```
ecommerce-project/
├── backend/                  # Node.js API
├── dashboard/                # React.js Admin
├── website/                  # Next.js Client
├── documentation/            # All phase docs
│   ├── phase-1-PRD.md
│   ├── phase-2-TRD.md
│   ├── phase-3-AppFlow.md
│   ├── phase-4-UIUXBrief.md
│   ├── phase-5-Schema.md
│   ├── phase-6-APIDocs.md
│   ├── phase-7-ImplementationPlan.md
│   ├── phase-8-DeploymentGuide.md
│   └── phase-9-MaintenanceGuide.md
├── shared/                   # Shared assets/types
│   └── assets/
└── README.md
```

### 3.2 Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary config
│   │   └── email.js            # Nodemailer config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── coupon.controller.js
│   │   ├── upload.controller.js
│   │   └── analytics.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verify
│   │   ├── admin.middleware.js  # Role check
│   │   ├── error.middleware.js  # Global error handler
│   │   ├── validate.middleware.js
│   │   └── upload.middleware.js # Multer config
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Category.model.js
│   │   ├── Cart.model.js
│   │   ├── Wishlist.model.js
│   │   ├── Order.model.js
│   │   ├── Review.model.js
│   │   └── Coupon.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── order.routes.js
│   │   ├── review.routes.js
│   │   ├── coupon.routes.js
│   │   ├── upload.routes.js
│   │   └── analytics.routes.js
│   ├── services/
│   │   ├── email.service.js    # Email templates & sending
│   │   └── cloudinary.service.js
│   ├── utils/
│   │   ├── ApiError.js         # Custom error class
│   │   ├── ApiResponse.js      # Standard response wrapper
│   │   ├── asyncHandler.js     # Try-catch wrapper
│   │   ├── generateToken.js    # JWT generation
│   │   └── validators/
│   │       ├── auth.validator.js
│   │       ├── product.validator.js
│   │       └── order.validator.js
│   └── app.js                  # Express app setup
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── package.json
└── server.js                   # Entry point
```

### 3.3 Dashboard Structure (React.js)

```
dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── store.js            # Redux store
│   │   └── rootReducer.js
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── Pagination.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   └── charts/
│   │       ├── RevenueChart.jsx
│   │       └── OrderChart.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   └── authApi.js
│   │   ├── products/
│   │   │   ├── productsSlice.js
│   │   │   └── productsApi.js
│   │   ├── orders/
│   │   │   ├── ordersSlice.js
│   │   │   └── ordersApi.js
│   │   ├── customers/
│   │   │   └── customersApi.js
│   │   ├── categories/
│   │   │   └── categoriesApi.js
│   │   ├── coupons/
│   │   │   └── couponsApi.js
│   │   └── analytics/
│   │       └── analyticsApi.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   ├── products/
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── AddProductPage.jsx
│   │   │   └── EditProductPage.jsx
│   │   ├── orders/
│   │   │   ├── OrdersPage.jsx
│   │   │   └── OrderDetailPage.jsx
│   │   ├── customers/
│   │   │   ├── CustomersPage.jsx
│   │   │   └── CustomerDetailPage.jsx
│   │   ├── categories/
│   │   │   └── CategoriesPage.jsx
│   │   ├── coupons/
│   │   │   └── CouponsPage.jsx
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.jsx
│   │   └── settings/
│   │       └── SettingsPage.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   └── api.js              # Axios instance
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── constants.js
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### 3.4 Website Structure (Next.js)

```
website/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout
│   │   ├── page.jsx            # Home page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── register/
│   │   │   │   └── page.jsx
│   │   │   └── forgot-password/
│   │   │       └── page.jsx
│   │   ├── products/
│   │   │   ├── page.jsx        # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.jsx    # Product detail
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.jsx
│   │   ├── search/
│   │   │   └── page.jsx
│   │   ├── cart/
│   │   │   └── page.jsx
│   │   ├── checkout/
│   │   │   └── page.jsx
│   │   ├── profile/
│   │   │   ├── page.jsx
│   │   │   ├── orders/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.jsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.jsx
│   │   │   └── addresses/
│   │   │       └── page.jsx
│   │   └── order-success/
│   │       └── page.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── Pagination.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   └── ReviewCard.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── checkout/
│   │   │   ├── AddressForm.jsx
│   │   │   └── OrderSummary.jsx
│   │   └── home/
│   │       ├── HeroBanner.jsx
│   │       ├── FeaturedCategories.jsx
│   │       └── FeaturedProducts.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useWishlist.js
│   │   └── useDebounce.js
│   ├── lib/
│   │   └── axios.js            # Axios instance
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   └── review.service.js
│   └── utils/
│       ├── formatCurrency.js
│       ├── formatDate.js
│       └── constants.js
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 4. Database Design

### 4.1 Collections Overview

| Collection | Description |
|------------|-------------|
| `users` | Customer and admin accounts |
| `products` | Product catalog |
| `categories` | Product categories |
| `carts` | Shopping carts (per user) |
| `wishlists` | Wishlists (per user) |
| `orders` | Placed orders |
| `reviews` | Product reviews |
| `coupons` | Discount coupons |

### 4.2 User Schema

```js
{
  _id: ObjectId,
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, select: false),
  phone: String,
  avatar: {
    url: String,
    publicId: String
  },
  role: String (enum: ['customer', 'admin', 'superadmin'], default: 'customer'),
  addresses: [
    {
      _id: ObjectId,
      label: String,           // "Home", "Work"
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String (default: 'India'),
      isDefault: Boolean
    }
  ],
  isBlocked: Boolean (default: false),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Product Schema

```js
{
  _id: ObjectId,
  name: String (required, trim),
  slug: String (unique, auto-generated),
  description: String (required),
  shortDescription: String,
  price: Number (required, min: 0),
  originalPrice: Number,
  discount: Number (0-100),           // percentage
  category: ObjectId (ref: 'Category', required),
  brand: String,
  images: [
    {
      url: String,
      publicId: String,
      isMain: Boolean
    }
  ],
  variants: [
    {
      name: String,                    // "Size", "Color"
      options: [String]               // ["S","M","L"] or ["Red","Blue"]
    }
  ],
  stock: Number (required, min: 0),
  sku: String (unique),
  tags: [String],
  specifications: [
    {
      key: String,
      value: String
    }
  ],
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  ratings: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 Category Schema

```js
{
  _id: ObjectId,
  name: String (required, trim, unique),
  slug: String (unique),
  description: String,
  image: {
    url: String,
    publicId: String
  },
  parent: ObjectId (ref: 'Category', nullable),   // for sub-categories
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 Cart Schema

```js
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, unique),
  items: [
    {
      product: ObjectId (ref: 'Product'),
      name: String,
      image: String,
      price: Number,
      quantity: Number (min: 1),
      selectedVariants: Object  // { size: "M", color: "Red" }
    }
  ],
  coupon: ObjectId (ref: 'Coupon', nullable),
  discountAmount: Number (default: 0),
  updatedAt: Date
}
```

### 4.6 Wishlist Schema

```js
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, unique),
  products: [ObjectId (ref: 'Product')],
  updatedAt: Date
}
```

### 4.7 Order Schema

```js
{
  _id: ObjectId,
  orderNumber: String (unique, auto-generated),  // ORD-20260701-XXXX
  user: ObjectId (ref: 'User', required),
  items: [
    {
      product: ObjectId (ref: 'Product'),
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      selectedVariants: Object
    }
  ],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  paymentMethod: String (enum: ['COD', 'ONLINE']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
  orderStatus: String (
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  ),
  statusHistory: [
    {
      status: String,
      updatedAt: Date,
      note: String
    }
  ],
  subtotal: Number,
  shippingCharge: Number (default: 0),
  taxAmount: Number,
  discountAmount: Number (default: 0),
  totalAmount: Number,
  coupon: ObjectId (ref: 'Coupon', nullable),
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.8 Review Schema

```js
{
  _id: ObjectId,
  product: ObjectId (ref: 'Product', required),
  user: ObjectId (ref: 'User', required),
  rating: Number (required, min: 1, max: 5),
  title: String,
  comment: String (required),
  isVerifiedPurchase: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
// Compound unique index: { product: 1, user: 1 }
```

### 4.9 Coupon Schema

```js
{
  _id: ObjectId,
  code: String (required, unique, uppercase),
  discountType: String (enum: ['percentage', 'flat']),
  discountValue: Number (required),
  minOrderAmount: Number (default: 0),
  maxDiscount: Number,           // cap for percentage coupons
  usageLimit: Number,            // total times can be used
  usedCount: Number (default: 0),
  perUserLimit: Number (default: 1),
  usedBy: [ObjectId (ref: 'User')],
  isActive: Boolean (default: true),
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.10 Database Indexes

```js
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Products
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ isActive: 1, isFeatured: 1 })
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' })  // full-text search

// Orders
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ user: 1, createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })

// Reviews
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true })
db.reviews.createIndex({ product: 1 })

// Coupons
db.coupons.createIndex({ code: 1 }, { unique: true })
```

---

## 5. API Design Standards

### 5.1 Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.yourdomain.com/api
```

### 5.2 HTTP Methods

| Method | Usage |
|--------|-------|
| GET | Retrieve data |
| POST | Create resource |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Delete resource |

### 5.3 Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": { ... },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Product not found",
  "errors": []
}
```

### 5.4 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | OK — GET, PUT success |
| 201 | Created — POST success |
| 204 | No Content — DELETE success |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — not logged in |
| 403 | Forbidden — not enough permissions |
| 404 | Not Found — resource doesn't exist |
| 409 | Conflict — duplicate (email, slug) |
| 422 | Unprocessable Entity — invalid data |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |

### 5.5 Pagination Query Params

```
GET /api/products?page=1&limit=12&sort=price&order=asc&category=electronics&minPrice=500&maxPrice=5000&search=phone
```

---

## 6. Authentication & Authorization

### 6.1 Strategy: JWT with HTTP-only Cookies

```
Login Flow:
1. User sends email + password
2. Server validates credentials
3. Server generates Access Token (15 min) + Refresh Token (7 days)
4. Tokens sent via HTTP-only, Secure, SameSite=Strict cookies
5. Client makes requests — cookie sent automatically
6. Server verifies token on each protected request
7. If Access Token expires → use Refresh Token to get new one
```

### 6.2 Token Configuration

| Token | Expiry | Cookie Flag |
|-------|--------|-------------|
| Access Token | 15 minutes | HTTP-only, Secure, SameSite=Strict |
| Refresh Token | 7 days | HTTP-only, Secure, SameSite=Strict |

### 6.3 Role-Based Access Control (RBAC)

| Role | Access |
|------|--------|
| `customer` | Own profile, cart, wishlist, orders, reviews |
| `admin` | All customer access + product/order/customer management |
| `superadmin` | All admin access + user management, settings |

### 6.4 Middleware Chain

```
Request → authMiddleware (verify JWT) → adminMiddleware (check role) → Controller
```

### 6.5 Password Reset Flow

```
1. User submits email → POST /api/auth/forgot-password
2. Server generates crypto random token (32 bytes)
3. Token hashed and stored in DB with 10-min expiry
4. Reset link emailed: https://website.com/reset-password?token=<rawToken>
5. User submits new password → POST /api/auth/reset-password
6. Server finds user by hashed token, checks expiry
7. Password updated, token cleared
```

---

## 7. File Upload Strategy

### 7.1 Cloudinary Configuration

```
Storage:  Cloudinary CDN
SDK:      cloudinary v2 (Node.js)
Process:  Multer (memoryStorage) → Cloudinary upload_stream
```

### 7.2 Upload Folders

| Content | Cloudinary Folder |
|---------|------------------|
| Product Images | `ecommerce/products` |
| Category Images | `ecommerce/categories` |
| User Avatars | `ecommerce/avatars` |

### 7.3 Image Transformations

- **Product thumbnails:** `w_400,h_400,c_fill,f_webp,q_auto`
- **Product full:** `w_800,h_800,c_fit,f_webp,q_auto`
- **Category:** `w_600,h_400,c_fill,f_webp,q_auto`
- **Avatar:** `w_150,h_150,c_fill,g_face,r_max,f_webp`

### 7.4 Upload Limits

| Setting | Value |
|---------|-------|
| Max file size | 5 MB |
| Allowed types | image/jpeg, image/png, image/webp |
| Max images per product | 6 |

---

## 8. Email Service

### 8.1 Provider

- **Service:** Gmail SMTP (dev) / SendGrid (production)
- **Library:** Nodemailer

### 8.2 Email Templates

| Template | Trigger |
|----------|---------|
| Welcome Email | New user registration |
| Order Confirmation | Order placed |
| Order Status Update | Status changed by admin |
| Password Reset | Forgot password request |
| Order Cancellation | Order cancelled |

### 8.3 Email Template Structure

```
HTML template with:
- Company logo & branding
- Clear heading
- Main content (order details, link, etc.)
- Call-to-action button
- Footer with contact info
```

---

## 9. Error Handling Standards

### 9.1 Custom ApiError Class

```js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.success = false
    this.errors = errors
  }
}
```

### 9.2 asyncHandler Wrapper

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
```

### 9.3 Global Error Middleware

```js
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || []
  })
})
```

---

## 10. Environment Configuration

### 10.1 Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

# JWT
JWT_ACCESS_SECRET=<strong_random_secret>
JWT_REFRESH_SECRET=<strong_random_secret>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Frontend URLs (CORS)
CLIENT_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001

# Cookie
COOKIE_SECURE=false    # true in production
```

### 10.2 Website (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 10.3 Dashboard (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 11. Security Requirements

| Security Measure | Implementation |
|-----------------|----------------|
| Password Hashing | bcrypt, saltRounds = 12 |
| Token Storage | HTTP-only cookies (no localStorage) |
| Rate Limiting | 100 req/min per IP (express-rate-limit) |
| CORS | Whitelist only CLIENT_URL and DASHBOARD_URL |
| HTTP Headers | Helmet.js (XSS, HSTS, CSP, etc.) |
| Input Sanitization | express-validator on all inputs |
| NoSQL Injection | Mongoose sanitize query ($where blocked) |
| File Upload Safety | Type + size validation before Cloudinary |
| Sensitive Fields | `password` field: `select: false` in schema |
| Admin Routes | Double middleware: authMiddleware + adminMiddleware |
| Error Messages | Never expose stack traces in production |

---

## 12. Performance Requirements

### 12.1 Backend

| Optimization | Method |
|--------------|--------|
| Response compression | compression middleware (gzip) |
| Database queries | Mongoose `.lean()` for read-only queries |
| Pagination | All list endpoints paginated |
| Image CDN | Cloudinary serves images (global CDN) |
| Indexes | Compound indexes on frequently queried fields |

### 12.2 Next.js Website

| Optimization | Method |
|--------------|--------|
| SSG for static pages | Home, category pages pre-rendered |
| SSR for dynamic pages | Product detail with fresh data |
| ISR | Product listing (revalidate: 60 seconds) |
| Image Optimization | next/image (auto WebP, lazy load, responsive) |
| Code Splitting | Automatic per-route by Next.js |
| Font Optimization | next/font (Google Fonts, no FOUT) |

### 12.3 React Dashboard

| Optimization | Method |
|--------------|--------|
| RTK Query caching | Auto cache + invalidation |
| Table virtualization | TanStack Table (virtual rows for large lists) |
| Lazy loading routes | React.lazy + Suspense |
| Memoization | React.memo for heavy components |

---

## 13. Deployment Architecture

### 13.1 Target Platforms

| Service | Platform |
|---------|----------|
| Backend API | Railway / Render |
| Client Website | Vercel |
| Admin Dashboard | Vercel / Netlify |
| Database | MongoDB Atlas (M0 free → M10 production) |
| Images | Cloudinary (free tier → paid) |
| Email | Gmail SMTP → SendGrid (production) |

### 13.2 Environment Tiers

| Tier | Purpose |
|------|---------|
| Development | Local machines, `localhost` |
| Staging | Pre-production testing |
| Production | Live, public-facing |

---

## 14. Version Control Strategy

### 14.1 Branching Model

```
main          ← production-ready code only
  └── develop ← integration branch
        ├── feature/product-listing
        ├── feature/checkout-flow
        ├── fix/cart-calculation-bug
        └── chore/update-dependencies
```

### 14.2 Commit Message Convention

```
<type>(<scope>): <short description>

Types: feat | fix | docs | style | refactor | test | chore

Examples:
feat(auth): add JWT refresh token logic
fix(cart): resolve quantity calculation error
docs(readme): update setup instructions
```

### 14.3 PR Rules

- Every feature must go through a Pull Request
- At least 1 review before merging to `develop`
- `main` branch is protected — no direct pushes
- Squash commits before merging

---

## 15. Coding Standards

### 15.1 General

- **Language:** JavaScript (ES2022+)
- **Module system:** ES Modules (`import/export`) everywhere
- **Async:** `async/await` — no callbacks or `.then()` chains
- **Naming:** camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants

### 15.2 Backend

```js
// ✅ Good
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query
  const products = await Product.find({ isActive: true })
    .lean()
    .limit(limit)
    .skip((page - 1) * limit)
  res.status(200).json(new ApiResponse(200, products, 'Products fetched'))
})

// ❌ Bad
app.get('/products', async (req, res) => {
  try {
    const p = await Product.find()
    res.json(p)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})
```

### 15.3 React / Next.js

```jsx
// ✅ Good — functional component, named export
export const ProductCard = ({ product }) => {
  const { name, price, images } = product
  return (
    <div className="product-card">
      <img src={images[0]?.url} alt={name} />
      <h3>{name}</h3>
      <p>₹{price.toLocaleString()}</p>
    </div>
  )
}

// ❌ Bad — default export, unclear naming
export default function Card(props) { ... }
```

### 15.4 ESLint + Prettier Config

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial TRD created |

---

*Previous Phase → [Phase 1: Product Requirements Document (PRD)](./phase-1-PRD.md)*  
*Next Phase → [Phase 3: Application Flow](./phase-3-AppFlow.md)*
