# Implementation Plan

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 7 of 9

---

## Table of Contents

1. [Overview](#1-overview)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Sprint Plan](#3-sprint-plan)
4. [Stage 1 — Project Setup](#4-stage-1--project-setup)
5. [Stage 2 — Backend Development](#5-stage-2--backend-development)
6. [Stage 3 — Admin Dashboard Development](#6-stage-3--admin-dashboard-development)
7. [Stage 4 — Client Website Development](#7-stage-4--client-website-development)
8. [Stage 5 — Integration & Testing](#8-stage-5--integration--testing)
9. [Task Checklist](#9-task-checklist)
10. [Coding Order (Dependencies First)](#10-coding-order-dependencies-first)
11. [Branch Strategy Per Stage](#11-branch-strategy-per-stage)
12. [Definition of Done](#12-definition-of-done)

---

## 1. Overview

### Total Estimated Timeline: 18 Weeks

| Stage | Description | Duration |
|-------|-------------|----------|
| Stage 1 | Project Setup + Tooling | Week 1 |
| Stage 2 | Backend Development | Weeks 2–5 |
| Stage 3 | Admin Dashboard | Weeks 6–8 |
| Stage 4 | Client Website | Weeks 9–12 |
| Stage 5 | Integration + Testing | Weeks 13–14 |
| Stage 6 | Deployment | Week 15 |
| Stage 7 | Buffer + Bug Fixes | Weeks 16–18 |

### Team Roles

| Role | Responsibilities |
|------|-----------------|
| **Backend Dev** | API, database, auth, email, uploads |
| **Frontend Dev (Dashboard)** | Admin React app |
| **Frontend Dev (Website)** | Customer Next.js app |
| **Full Stack** | Integration, testing, deployment |

---

## 2. Development Environment Setup

### 2.1 Prerequisites

```
Node.js     v20.x LTS       → https://nodejs.org
MongoDB     v7.x            → Local: MongoDB Community / Cloud: MongoDB Atlas
Git         Latest          → https://git-scm.com
VS Code     Latest          → https://code.visualstudio.com
Postman     Latest          → https://www.postman.com
```

### 2.2 VS Code Extensions (Required)

```
ESLint                    → dbaeumer.vscode-eslint
Prettier                  → esbenp.prettier-vscode
Tailwind CSS IntelliSense → bradlc.vscode-tailwindcss
ES7+ React Snippets       → dsznajder.es7-react-js-snippets
Thunder Client            → rangav.vscode-thunder-client
GitLens                   → eamodio.vscode-gitlens
Auto Rename Tag           → formulahendry.auto-rename-tag
Path IntelliSense         → christian-kohler.path-intellisense
MongoDB for VS Code       → mongodb.mongodb-vscode
```

### 2.3 VS Code Workspace Settings

```json
// .vscode/settings.json (in each project root)
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "tailwindCSS.includeLanguages": { "javascript": "javascript" },
  "files.associations": { "*.css": "tailwindcss" }
}
```

### 2.4 Global NPM Packages

```bash
npm install -g nodemon
npm install -g eslint
npm install -g prettier
```

---

## 3. Sprint Plan

### Sprint Overview (2-week sprints)

```
Sprint 1  (Weeks 1–2):   Project setup + Backend Auth + User module
Sprint 2  (Weeks 3–4):   Backend Products + Categories + Cart + Wishlist
Sprint 3  (Weeks 5–6):   Backend Orders + Reviews + Coupons + Analytics + Upload
Sprint 4  (Weeks 7–8):   Admin Dashboard — Auth + Layout + Product Management
Sprint 5  (Weeks 9–10):  Admin Dashboard — Orders + Customers + Categories + Coupons + Analytics
Sprint 6  (Weeks 11–12): Website — Auth + Home + Product Listing + Product Detail
Sprint 7  (Weeks 13–14): Website — Cart + Checkout + Profile + Wishlist + Order Tracking
Sprint 8  (Weeks 15–16): Integration testing + Bug fixes + Performance
Sprint 9  (Weeks 17–18): Deployment + Final QA + Go Live
```

---

## 4. Stage 1 — Project Setup

### Week 1

#### 4.1 Repository Setup

```bash
# 1. Create GitHub repository
#    Repo name: ecommerce-project
#    Visibility: Private
#    Add: .gitignore (Node), README

# 2. Clone locally
git clone https://github.com/<username>/ecommerce-project.git
cd ecommerce-project

# 3. Create main branch structure
git checkout -b develop
git push origin develop

# 4. Protect main branch in GitHub settings:
#    - Require PR before merging
#    - Require 1 approval
#    - No direct pushes
```

#### 4.2 Initialize Backend

```bash
mkdir backend && cd backend

# Init package.json
npm init -y

# Update package.json → add "type": "module" for ES Modules

# Install production dependencies
npm install express mongoose bcryptjs jsonwebtoken cookie-parser \
  cloudinary multer nodemailer express-validator helmet cors \
  morgan dotenv express-rate-limit compression slugify crypto

# Install dev dependencies
npm install -D nodemon eslint prettier eslint-config-prettier \
  eslint-plugin-node

# Create folder structure
mkdir -p src/{config,controllers,middleware,models,routes,services,utils/validators}

# Create entry point
touch server.js src/app.js src/config/db.js

# Create .env and .env.example
touch .env .env.example .gitignore .eslintrc.js .prettierrc
```

#### 4.3 Initialize Dashboard (React + Vite)

```bash
cd .. && mkdir dashboard && cd dashboard

# Create Vite + React app
npm create vite@latest . -- --template react

# Install dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios \
  react-hook-form @hookform/resolvers zod recharts \
  @tanstack/react-table react-hot-toast lucide-react date-fns

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer eslint \
  eslint-plugin-react eslint-plugin-react-hooks prettier

# Init Tailwind
npx tailwindcss init -p

# Create folder structure
mkdir -p src/{app,assets,components/{common,layout,charts},features,hooks,pages/{auth,dashboard,products,orders,customers,categories,coupons,analytics,settings},routes,services,utils}
```

#### 4.4 Initialize Website (Next.js)

```bash
cd .. && mkdir website && cd website

# Create Next.js app
npx create-next-app@latest . --typescript=false --eslint --tailwind \
  --src-dir --app --import-alias "@/*" --use-npm

# Install additional dependencies
npm install axios react-hook-form @hookform/resolvers zod \
  zustand swiper lucide-react next-seo react-hot-toast date-fns

# Install dev dependencies
npm install -D prettier eslint-config-prettier

# Create folder structure
mkdir -p src/{components/{common,layout,product,cart,checkout,home},context,hooks,lib,services,utils}
```

#### 4.5 Root README + Scripts

```bash
# Back in root
cd ..

# Create root package.json for running all apps together
touch package.json README.md
```

```json
// Root package.json
{
  "name": "ecommerce-platform",
  "version": "1.0.0",
  "scripts": {
    "dev:backend":   "cd backend && npm run dev",
    "dev:dashboard": "cd dashboard && npm run dev",
    "dev:website":   "cd website && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:dashboard\" \"npm run dev:website\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

---

## 5. Stage 2 — Backend Development

### Weeks 2–5 | Build order: bottom-up (config → models → middleware → controllers → routes)

#### 5.1 Week 2 — Foundation + Auth + Users

**Step 1: Core Setup**

```
Create: src/app.js
  - Import express, helmet, cors, morgan, cookieParser, compression
  - Mount rate limiter
  - Mount all routers
  - Mount global error handler

Create: server.js
  - Import app + connectDB
  - Call connectDB() then app.listen(PORT)

Create: src/config/db.js
  - MongoDB connection with mongoose
  - console.log on success, process.exit on failure

Create: src/config/cloudinary.js
  - Configure cloudinary with env vars

Create: src/config/email.js
  - Configure nodemailer transporter
```

**Step 2: Utilities**

```
Create: src/utils/ApiError.js        → Custom error class
Create: src/utils/ApiResponse.js     → Standard response wrapper
Create: src/utils/asyncHandler.js    → Try-catch HOF wrapper
Create: src/utils/generateToken.js   → JWT sign access + refresh tokens
```

**Step 3: User Model**

```
Create: src/models/User.model.js
  - Full schema (see Phase 5 Schema doc)
  - Pre-save: bcrypt password
  - Methods: comparePassword, getResetPasswordToken
  - Virtual: avatarUrl
```

**Step 4: Auth Middleware**

```
Create: src/middleware/auth.middleware.js
  - Verify accessToken from cookie
  - If expired → check refreshToken → issue new accessToken
  - Attach user to req.user

Create: src/middleware/admin.middleware.js
  - Check req.user.role is 'admin' or 'superadmin'
  - Throw 403 if not

Create: src/middleware/error.middleware.js
  - Global error handler
  - Handle Mongoose ValidationError, CastError, duplicate key

Create: src/middleware/validate.middleware.js
  - Run express-validator validationResult
  - Return 400 with errors array if invalid
```

**Step 5: Auth Validators**

```
Create: src/utils/validators/auth.validator.js
  - registerValidator: name, email, password, confirmPassword
  - loginValidator: email, password
  - forgotPasswordValidator: email
  - resetPasswordValidator: token, password, confirmPassword
```

**Step 6: Auth Controller + Routes**

```
Create: src/controllers/auth.controller.js
  - register()         → hash pw, create user, set cookies, send welcome email
  - login()            → verify credentials, check blocked, set cookies
  - logout()           → clear cookies
  - getMe()            → return req.user
  - forgotPassword()   → generate token, hash it, save, send email
  - resetPassword()    → find by hashed token, check expiry, update pw
  - refreshToken()     → verify refresh token, issue new access token

Create: src/routes/auth.routes.js
  - Map all auth endpoints

Create: src/services/email.service.js
  - sendWelcomeEmail(user)
  - sendPasswordResetEmail(user, resetUrl)
  - sendOrderConfirmationEmail(user, order)
  - sendOrderStatusEmail(user, order)
```

**Step 7: User Controller + Routes**

```
Create: src/controllers/user.controller.js
  - getAllUsers()    → paginated, filtered list (admin)
  - getUserById()   → single user
  - updateUser()    → update name, phone, avatar
  - changePassword()
  - blockUser()
  - addAddress()
  - updateAddress()
  - deleteAddress()
  - setDefaultAddress()

Create: src/routes/user.routes.js
  - Protected routes with authMiddleware
  - Admin routes with adminMiddleware
```

**Test:**
```
✅ POST /api/auth/register
✅ POST /api/auth/login
✅ GET  /api/auth/me
✅ POST /api/auth/logout
✅ POST /api/auth/forgot-password
✅ POST /api/auth/reset-password
✅ GET  /api/users (admin)
✅ GET  /api/users/:id
✅ PUT  /api/users/:id
```

---

#### 5.2 Week 3 — Products + Categories + Upload

**Step 1: Models**

```
Create: src/models/Category.model.js   → (see Phase 5)
Create: src/models/Product.model.js    → (see Phase 5)
  - Pre-save: auto slug, auto discount %
  - Virtual: stockStatus
  - Text index for search
```

**Step 2: Upload Middleware + Controller**

```
Create: src/middleware/upload.middleware.js
  - Multer memoryStorage config
  - File filter: jpeg/png/webp only
  - Size limit: 5MB
  - Fields: single image per request

Create: src/services/cloudinary.service.js
  - uploadImage(buffer, folder)    → stream upload to Cloudinary
  - deleteImage(publicId)          → destroy from Cloudinary

Create: src/controllers/upload.controller.js
  - uploadImage()   → multer → cloudinary → return {url, publicId}
  - uploadAvatar()  → apply face-crop transformation
  - deleteImage()   → cloudinary.destroy(publicId)

Create: src/routes/upload.routes.js
```

**Step 3: Category Controller + Routes**

```
Create: src/controllers/category.controller.js
  - getAllCategories()    → nested (parent + children), active only
  - getCategoryBySlug()
  - createCategory()     → admin
  - updateCategory()     → admin
  - deleteCategory()     → check no products assigned, admin

Create: src/routes/category.routes.js
```

**Step 4: Product Validators**

```
Create: src/utils/validators/product.validator.js
  - createProductValidator: name, price, stock, category required
  - updateProductValidator: all optional
```

**Step 5: Product Controller + Routes**

```
Create: src/controllers/product.controller.js
  - getAllProducts()     → filters: category, price, brand, rating, inStock, featured
                          sort: price, rating, newest, name
                          pagination, text search
  - getProductBySlug()  → populate category
  - getFeaturedProducts() → isActive + isFeatured, limit 8
  - createProduct()     → admin
  - updateProduct()     → admin
  - deleteProduct()     → soft delete (isActive: false)
  - toggleStatus()      → admin

Create: src/routes/product.routes.js
```

**Test:**
```
✅ GET  /api/categories
✅ POST /api/categories (admin)
✅ GET  /api/products
✅ GET  /api/products/:slug
✅ POST /api/products (admin)
✅ POST /api/upload/image (admin)
✅ Full-text search: GET /api/products?search=headphones
✅ Price filter: GET /api/products?minPrice=500&maxPrice=2000
```

---

#### 5.3 Week 4 — Cart + Wishlist + Orders

**Step 1: Cart Model + Controller**

```
Create: src/models/Cart.model.js       → (see Phase 5)

Create: src/controllers/cart.controller.js
  - getCart()      → populate items.product (check isActive + stock)
  - addToCart()    → upsert: if product exists → increment qty
                     verify stock availability
  - updateCart()   → set new quantity, validate against stock
  - removeItem()   → pull cartItem by _id
  - clearCart()    → set items: []
  - mergeGuestCart() → on login: merge localStorage cart with server cart

Create: src/routes/cart.routes.js
```

**Step 2: Wishlist Model + Controller**

```
Create: src/models/Wishlist.model.js   → (see Phase 5)

Create: src/controllers/wishlist.controller.js
  - getWishlist()    → populate products with details
  - addToWishlist()  → addToSet (no duplicates)
  - removeFromWishlist() → pull product from array

Create: src/routes/wishlist.routes.js
```

**Step 3: Order Validators**

```
Create: src/utils/validators/order.validator.js
  - placeOrderValidator: shippingAddress fields, paymentMethod
```

**Step 4: Order Controller + Routes**

```
Create: src/models/Order.model.js      → (see Phase 5)

Create: src/controllers/order.controller.js
  - placeOrder()
      → validate cart not empty
      → re-verify stock for each item (not just cart snapshot)
      → apply coupon discount (if provided)
      → calculate: subtotal, tax, shipping, total
      → create Order document
      → decrement stock for each product
      → update coupon.usedCount + usedBy[]
      → clear user cart
      → send confirmation email (async)
      → return order

  - getAllOrders()    → paginated, filters: status, date range, search (admin)
  - getMyOrders()    → customer's own orders, paginated
  - getOrderById()   → full details, customer: own only
  - updateOrderStatus() → admin: status + note, push statusHistory
                          send email notification to customer
  - cancelOrder()    → customer: only if status = 'pending'
                       set status = 'cancelled', restore stock

Create: src/routes/order.routes.js
```

**Test:**
```
✅ GET    /api/cart
✅ POST   /api/cart/add
✅ PUT    /api/cart/update
✅ DELETE /api/cart/remove/:id
✅ GET    /api/wishlist
✅ POST   /api/wishlist/add
✅ POST   /api/orders (place order)
✅ GET    /api/orders/my-orders
✅ PUT    /api/orders/:id/status (admin)
✅ PUT    /api/orders/:id/cancel
✅ Confirm stock deducted after order
✅ Confirm cart cleared after order
✅ Confirm confirmation email received
```

---

#### 5.4 Week 5 — Reviews + Coupons + Analytics

**Step 1: Review Model + Controller**

```
Create: src/models/Review.model.js     → (see Phase 5)
  - Compound unique index: {product, user}
  - Post-save: recalculate product ratings via aggregation
  - Post-delete: recalculate product ratings

Create: src/controllers/review.controller.js
  - getProductReviews()  → paginated, sort options, rating breakdown summary
  - submitReview()       → check not already reviewed
                           check isVerifiedPurchase (has delivered order)
                           save review → triggers rating recalculation
  - editReview()         → own review only
  - deleteReview()       → own review or admin

Create: src/routes/review.routes.js
```

**Step 2: Coupon Model + Controller**

```
Create: src/models/Coupon.model.js     → (see Phase 5)
  - Methods: validateForUser, calculateDiscount
  - Virtuals: isExpired, isUsageLimitReached

Create: src/controllers/coupon.controller.js
  - validateCoupon()   → check active, not expired, usage limits, min order
                         return discount amount
  - getAllCoupons()     → admin
  - createCoupon()     → admin
  - updateCoupon()     → admin
  - toggleStatus()     → admin
  - deleteCoupon()     → admin

Create: src/routes/coupon.routes.js
```

**Step 3: Analytics Controller**

```
Create: src/controllers/analytics.controller.js
  - getDashboardStats()
      → MongoDB aggregation pipelines:
        - Revenue: sum of totalAmount where status=delivered
        - Orders: count by status
        - Products: count active/inactive/outOfStock
        - Customers: count + today's new customers
        - Low stock: stock < 10
        - Recent orders: last 10

  - getRevenueChart()
      → Aggregate by period (daily/monthly/yearly)
      → Group by date label, sum revenue, count orders

  - getTopProducts()
      → Aggregate from orderItems
      → Group by product, sum quantity and revenue
      → Populate product name, image, category

  - getOrdersChart()
      → Aggregate orders by period and status

Create: src/routes/analytics.routes.js
```

**Step 4: Backend Complete — Final Checks**

```
✅ All 59 endpoints working and tested in Postman
✅ Rate limiting active (100 req/min)
✅ All protected routes require valid JWT
✅ Admin routes reject customer role
✅ All email templates working
✅ Cloudinary upload/delete working
✅ Error responses follow standard format
✅ .env.example has all required variables
✅ No secrets in codebase
✅ MongoDB indexes created
```

---

## 6. Stage 3 — Admin Dashboard Development

### Weeks 6–8

#### 6.1 Week 6 — Foundation + Auth + Layout + Products

**Step 1: Setup Foundation**

```
Configure: tailwind.config.js
  - Extend: colors (dashboard palette)
  - Extend: fontFamily (Inter)
  - Content paths

Create: src/index.css
  - Import Google Fonts (Inter)
  - Dashboard CSS variables
  - Base styles

Create: src/services/api.js
  - Axios instance: baseURL from env
  - withCredentials: true (send cookies)
  - Request interceptor: (no token needed, cookie auto-sent)
  - Response interceptor: handle 401 → redirect to login

Create: src/app/store.js  + rootReducer.js
  - Configure Redux store with RTK
  - Combine auth slice + RTK Query APIs

Create: src/utils/constants.js   → ORDER_STATUSES, ROLES, etc.
Create: src/utils/formatCurrency.js
Create: src/utils/formatDate.js
```

**Step 2: Auth Feature**

```
Create: src/features/auth/authSlice.js
  - State: { user, isLoading, isAuthenticated }
  - Actions: setCredentials, logout

Create: src/features/auth/authApi.js (RTK Query)
  - login mutation
  - logout mutation
  - getMe query

Create: src/hooks/useAuth.js
  - Return user, isAuthenticated, role from Redux

Create: src/pages/auth/LoginPage.jsx
  - Email + password form
  - Handle error toast
  - Redirect to /dashboard on success

Create: src/routes/AppRoutes.jsx
Create: src/routes/ProtectedRoute.jsx
  - Redirect to /login if not authenticated
  - Redirect to /login if not admin role
```

**Step 3: Layout Components**

```
Create: src/components/layout/DashboardLayout.jsx
  - Flex: Sidebar + main content area
  - Renders <Sidebar /> + <Header /> + <Outlet />

Create: src/components/layout/Sidebar.jsx
  - Logo + nav links (icon + label)
  - Active link highlighting
  - Collapse/expand button
  - Logout button at bottom

Create: src/components/layout/Header.jsx
  - Page title (from route)
  - Admin name + avatar
  - Dropdown: Profile / Logout
```

**Step 4: Common Components**

```
Create: src/components/common/Button.jsx
  - variants: primary, secondary, danger, ghost
  - sizes: sm, md, lg
  - loading state with spinner

Create: src/components/common/Input.jsx
  - label, error, helperText props
  - forwardRef for react-hook-form

Create: src/components/common/Badge.jsx
  - Order status badges with color mapping

Create: src/components/common/Modal.jsx
  - Portal-based, backdrop, close on Escape

Create: src/components/common/ConfirmDialog.jsx
  - Title, message, Cancel + Confirm buttons

Create: src/components/common/Spinner.jsx
Create: src/components/common/Pagination.jsx
Create: src/components/common/Table.jsx   → TanStack Table wrapper
```

**Step 5: Dashboard Overview Page**

```
Create: src/features/analytics/analyticsApi.js
  - getDashboardStats query
  - getRevenueChart query
  - getTopProducts query
  - getOrdersChart query

Create: src/pages/dashboard/DashboardPage.jsx
  - Stat cards (Revenue, Orders, Products, Customers)
  - Revenue LineChart (Recharts)
  - Orders DonutChart (Recharts)
  - Recent orders table
  - Top products list
  - Low stock alerts
```

**Step 6: Product Management**

```
Create: src/features/products/productsApi.js (RTK Query)
  - getProducts query (with filter params)
  - getProductById query
  - createProduct mutation
  - updateProduct mutation
  - deleteProduct mutation
  - toggleProductStatus mutation

Create: src/pages/products/ProductsPage.jsx
  - Table: Name, Category, Price, Stock, Status, Actions
  - Search input + category filter + status filter
  - Pagination
  - Edit / Delete / Toggle actions per row
  - "Add Product" button

Create: src/pages/products/AddProductPage.jsx
  - Multi-section form (Basic Info, Media, Pricing, Inventory, Settings)
  - Image drag & drop (up to 6)
  - Variant builder (add/remove groups and options)
  - Specification builder (key-value)
  - Tag input
  - Submit → POST /api/products

Create: src/pages/products/EditProductPage.jsx
  - Pre-filled form (load by id)
  - Submit → PUT /api/products/:id
```

---

#### 6.2 Week 7 — Orders + Customers + Categories + Coupons

**Step 1: Order Management**

```
Create: src/features/orders/ordersApi.js
  - getAllOrders query
  - getOrderById query
  - updateOrderStatus mutation

Create: src/pages/orders/OrdersPage.jsx
  - Table: Order#, Customer, Items, Total, Status, Date, Actions
  - Filters: status dropdown + date range picker
  - Search by order number or customer
  - Pagination + Export CSV button

Create: src/pages/orders/OrderDetailPage.jsx
  - Order info header (number, date, payment)
  - Customer info card (with link to customer profile)
  - Items table
  - Price breakdown
  - Status timeline (visual stepper)
  - Status update dropdown + note field + Submit
```

**Step 2: Customer Management**

```
Create: src/features/customers/customersApi.js
  - getAllCustomers query
  - getCustomerById query
  - blockCustomer mutation

Create: src/pages/customers/CustomersPage.jsx
  - Table: Avatar, Name, Email, Orders, Joined, Status, Actions
  - Search + filter by status
  - View / Block-Unblock actions

Create: src/pages/customers/CustomerDetailPage.jsx
  - Profile info
  - Address list
  - Order history table
  - Block/Unblock toggle
```

**Step 3: Category Management**

```
Create: src/features/categories/categoriesApi.js
  - getCategories, createCategory, updateCategory, deleteCategory

Create: src/pages/categories/CategoriesPage.jsx
  - Category list (tree view for parent/child)
  - Add Category modal form (name, desc, image, parent)
  - Edit Category modal (pre-filled)
  - Delete with confirm dialog (check has products)
```

**Step 4: Coupon Management**

```
Create: src/features/coupons/couponsApi.js
  - getCoupons, createCoupon, updateCoupon, toggleStatus, deleteCoupon

Create: src/pages/coupons/CouponsPage.jsx
  - Table: Code, Type, Value, Min Order, Usage, Expiry, Status, Actions
  - Create Coupon modal (all fields)
  - Edit modal
  - Toggle active / Delete
```

---

#### 6.3 Week 8 — Analytics + Settings + Polish

**Step 1: Analytics Page**

```
Create: src/pages/analytics/AnalyticsPage.jsx
  - Revenue chart (period toggle: daily/weekly/monthly/yearly)
  - Orders by status chart (bar)
  - Top products table (units sold + revenue)
  - Export to CSV button
```

**Step 2: Settings Page**

```
Create: src/pages/settings/SettingsPage.jsx
  - Admin profile tab (edit name, email, avatar, password)
  - Store settings tab (name, logo, address, contact)
```

**Step 3: Dashboard Polish**

```
✅ All pages have loading skeletons
✅ All async actions show loading spinner in button
✅ All errors show toast notification
✅ All tables have empty states with illustration
✅ Sidebar active link matches current route
✅ Sidebar collapses on small screens
✅ Breadcrumb shows on all nested pages
✅ Confirm dialog before every delete
✅ All forms have validation error messages
✅ Dashboard is fully responsive (tablet + desktop)
```

---

## 7. Stage 4 — Client Website Development

### Weeks 9–12

#### 7.1 Week 9 — Foundation + Auth + Home Page

**Step 1: Website Foundation**

```
Configure: tailwind.config.js
  - Extend colors (primary indigo palette)
  - Extend fontFamily (Plus Jakarta Sans + Inter)

Create: src/app/globals.css
  - Import Google Fonts
  - CSS variables (design tokens from Phase 4)
  - Base reset styles

Create: src/app/layout.jsx
  - Root layout: <Navbar />, <main>{children}</main>, <Footer />
  - Google Fonts <link> in <head>
  - Toast provider

Create: src/lib/axios.js
  - Axios instance with baseURL + withCredentials

Create: src/context/AuthContext.jsx
  - State: user, isLoading, isAuthenticated
  - Actions: login, logout, updateUser
  - Fetch /auth/me on mount

Create: src/context/CartContext.jsx
  - State: items, itemCount, subtotal
  - Actions: addToCart, removeFromCart, updateQuantity, clearCart
  - Guest cart from localStorage
  - On login: merge guest cart
```

**Step 2: Layout Components**

```
Create: src/components/layout/Navbar.jsx
  - Logo + Category mega-menu + Search bar + Wishlist + Cart + Account
  - Sticky on scroll (add shadow after 50px)
  - Mobile: hamburger + MobileMenu drawer
  - Cart count badge (live from CartContext)

Create: src/components/layout/MobileMenu.jsx
  - Slide-in drawer from left
  - Category links + auth links

Create: src/components/layout/Footer.jsx
  - Brand info, Quick links, Categories, Contact, Social icons
  - Newsletter inline form
  - Copyright row

Create: src/components/layout/SearchBar.jsx
  - Input with debounce (400ms)
  - Autocomplete dropdown (5 results)
  - Keyboard nav (arrow keys + Enter)
```

**Step 3: Auth Pages**

```
Create: src/services/auth.service.js
  - register(), login(), logout(), forgotPassword(), resetPassword(), getMe()

Create: src/app/(auth)/login/page.jsx
  - Email + password form
  - "Forgot password?" link
  - "Register" link
  - On success: merge cart → redirect

Create: src/app/(auth)/register/page.jsx
  - Name, email, password, confirm password
  - On success: redirect to home

Create: src/app/(auth)/forgot-password/page.jsx
  - Email form → success message

Create: src/app/(auth)/reset-password/page.jsx
  - Read token from URL params
  - New password + confirm form
```

**Step 4: Common Components**

```
Create: src/components/common/Button.jsx
Create: src/components/common/Input.jsx
Create: src/components/common/Spinner.jsx
Create: src/components/common/StarRating.jsx    → display + input modes
Create: src/components/common/Pagination.jsx
Create: src/components/common/Badge.jsx         → order status, product badges
```

**Step 5: Home Page**

```
Create: src/services/product.service.js
  - getProducts(), getProductBySlug(), getFeaturedProducts()

Create: src/components/home/HeroBanner.jsx
  - Swiper.js slider (3-5 slides, autoplay, fade)
  - Each slide: BG image + overlay + heading + CTA

Create: src/components/home/FeaturedCategories.jsx
  - Horizontal scroll on mobile, grid on desktop
  - Circular image + category name

Create: src/components/home/FeaturedProducts.jsx
  - GET /api/products/featured
  - 4-col product grid

Create: src/components/home/PromoBanner.jsx
  - Split layout with gradient bg

Create: src/app/page.jsx
  - Assemble: HeroBanner + FeaturedCategories + FeaturedProducts + PromoBanner + Newsletter
  - SSG with revalidate: 3600 (1 hour)
```

---

#### 7.2 Week 10 — Product Listing + Product Detail

**Step 1: Product Components**

```
Create: src/components/product/ProductCard.jsx
  - Image (aspect 1:1, next/image)
  - Wishlist icon (hover overlay)
  - Category label, Name (2-line clamp)
  - Star rating + count
  - Price + original price + discount badge
  - Add to Cart button
  - Hover lift animation

Create: src/components/product/ProductGrid.jsx
  - Responsive grid wrapper (2/3/4 cols)
  - Skeleton loading state (8 skeleton cards)
  - Empty state

Create: src/components/product/ProductFilters.jsx
  - Category checkboxes
  - Price range slider (min/max inputs)
  - Brand checkboxes
  - Rating filter (star buttons)
  - In Stock toggle
  - Clear All Filters
```

**Step 2: Product Listing Page**

```
Create: src/app/products/page.jsx
  - ISR: revalidate every 60 seconds
  - Layout: sidebar filters + product grid
  - Sort dropdown (price asc/desc, newest, rating)
  - Active filter chips (dismissible)
  - Pagination
  - Mobile: filter in slide-in drawer

Create: src/app/category/[slug]/page.jsx
  - Category header (name + description + image)
  - Product grid filtered by category
```

**Step 3: Product Detail Page**

```
Create: src/components/product/ProductImageGallery.jsx
  - Main image + thumbnail strip
  - Click thumbnail → swap main
  - Click main → zoom modal
  - Swiper on mobile

Create: src/components/product/ReviewCard.jsx
  - User avatar + name + date
  - Star rating
  - Review title + comment
  - "Verified Purchase" badge

Create: src/app/products/[slug]/page.jsx
  - SSR (fresh data each request)
  - Left: image gallery | Right: product info
  - Variant selector (pill buttons, selected state)
  - Quantity: +/- with stock limit
  - Add to Cart button (disabled if OOS)
  - Add to Wishlist (heart icon, toggle)
  - Delivery info row
  - Tabs: Description | Specifications | Reviews
  - Related products grid (same category, different product)
```

---

#### 7.3 Week 11 — Cart + Checkout + Search

**Step 1: Cart**

```
Create: src/components/cart/CartItem.jsx
  - Product image + name + variant + price
  - Quantity +/- controls
  - Remove button

Create: src/components/cart/CartSummary.jsx
  - Subtotal, discount, shipping, tax, total
  - Coupon input + Apply button
  - Checkout button

Create: src/app/cart/page.jsx
  - Guest: read from CartContext (localStorage)
  - Auth: GET /api/cart
  - CartItem list
  - CartSummary panel
  - Empty cart state
```

**Step 2: Checkout**

```
Create: src/components/checkout/AddressForm.jsx
  - All address fields
  - Saved addresses as selectable cards

Create: src/components/checkout/OrderSummary.jsx
  - Read-only items list + price breakdown

Create: src/app/checkout/page.jsx
  - Protected route (redirect to login if guest)
  - 3-step flow: Address → Review → Payment
  - Step indicator bar
  - "Place Order" → POST /api/orders
  - Loading state during order creation

Create: src/app/order-success/page.jsx
  - Success animation (checkmark)
  - Order number + estimated delivery
  - Items summary
  - "Track My Order" + "Continue Shopping" CTAs
```

**Step 3: Search Results**

```
Create: src/app/search/page.jsx
  - Read ?q= from URL
  - GET /api/products?search=<query>
  - Results grid with filters
  - "Showing X results for <query>"
  - No results state with suggestions
```

---

#### 7.4 Week 12 — User Profile + Wishlist + Order Tracking

**Step 1: Profile Layout**

```
Create: src/app/profile/layout.jsx
  - Protected route wrapper
  - Left sidebar nav (desktop) / tab bar (mobile)
  - Links: Profile, Orders, Wishlist, Addresses
```

**Step 2: Profile Pages**

```
Create: src/app/profile/page.jsx
  - Profile form (name, phone, avatar upload)
  - Change password section
  - PUT /api/users/:id

Create: src/app/profile/addresses/page.jsx
  - Address cards with Edit / Delete / Set Default
  - "Add New Address" form
  - POST/PUT/DELETE /api/users/:id/addresses/:addressId

Create: src/app/profile/orders/page.jsx
  - Order list table: Order#, Date, Items, Total, Status
  - Status badge (colored)
  - Pagination
  - GET /api/orders/my-orders

Create: src/app/profile/orders/[id]/page.jsx
  - Full order detail
  - Status timeline stepper
  - Cancel order button (if pending)
  - GET /api/orders/:id

Create: src/app/profile/wishlist/page.jsx
  - Product grid of wishlisted items
  - Remove from wishlist
  - Move to cart
  - GET /api/wishlist
```

**Step 3: Website Polish**

```
✅ All pages have metadata (title + description) via Next.js metadata API
✅ All pages have loading.jsx skeleton files
✅ All pages have error.jsx error boundaries
✅ Skeleton loaders for all async sections
✅ Toast notifications for all user actions
✅ Mobile navigation works perfectly
✅ All images use next/image
✅ Search autocomplete keyboard navigable
✅ Cart count updates in real time
✅ Wishlist heart toggles correctly
✅ Checkout redirects guest to login
✅ 404 page styled and helpful
✅ Footer newsletter form works
```

---

## 8. Stage 5 — Integration & Testing

### Weeks 13–14

#### 8.1 Integration Testing

```
Test Scenario 1: Full Purchase Flow
  Register → Browse Products → Filter → View Product → Add to Cart
  → Apply Coupon → Checkout → Place Order → Check Email
  → View Order in Profile → Admin: Update Status → Email received

Test Scenario 2: Guest Flow
  Visit → Browse → Add to Cart (guest) → Login → Cart Merged
  → Checkout → Order Success

Test Scenario 3: Admin Flow
  Admin Login → Add Product with Images → Publish
  → Verify on Website → Edit Product → Toggle Inactive
  → Verify hidden on Website

Test Scenario 4: Review Flow
  Login → Purchase Product → Deliver Order (admin) → Write Review
  → Verify ratings updated on product → Edit Review → Delete Review

Test Scenario 5: Coupon Flow
  Create Coupon (admin) → Apply on Cart → Verify Discount
  → Try expired coupon → Try exceeding usage limit
```

#### 8.2 Performance Checks

```
✅ Lighthouse score ≥ 90 (SEO, Performance, Accessibility, Best Practices)
✅ Product listing loads in < 2s on 4G
✅ Product detail page SSR under 500ms TTFB
✅ API responses < 200ms (measured in Postman)
✅ Images served as WebP from Cloudinary CDN
✅ No unnecessary re-renders (React DevTools profiler)
✅ Bundle size analyzed (Next.js build output)
```

#### 8.3 Security Checks

```
✅ JWT not stored in localStorage (HTTP-only cookie)
✅ Admin routes return 403 for customer role
✅ Customer cannot access other user's orders
✅ Rate limiting blocks after 100 req/min
✅ SQL injection attempt returns 400 (sanitized)
✅ XSS attempt sanitized in product description
✅ CORS blocks requests from non-whitelisted origins
✅ Sensitive fields not returned (password, resetToken)
✅ .env file not in git (check .gitignore)
```

#### 8.4 Cross-Browser + Device Testing

```
Browsers:
  ✅ Chrome (latest)
  ✅ Firefox (latest)
  ✅ Safari (latest)
  ✅ Edge (latest)

Devices:
  ✅ iPhone SE (375px)
  ✅ iPhone 14 (390px)
  ✅ Samsung Galaxy (360px)
  ✅ iPad (768px)
  ✅ iPad Pro (1024px)
  ✅ Desktop (1280px, 1440px, 1920px)
```

---

## 9. Task Checklist

### Backend

```
[ ] Project setup (package.json, folder structure, .env)
[ ] MongoDB connection
[ ] Cloudinary config
[ ] Email service (Nodemailer)
[ ] Utility classes (ApiError, ApiResponse, asyncHandler)
[ ] User model + hooks
[ ] Auth middleware (JWT verify, refresh)
[ ] Admin middleware (role check)
[ ] Error middleware (global handler)
[ ] Auth controller (register, login, logout, me, forgot, reset)
[ ] User controller (CRUD, addresses, block)
[ ] Category model + controller + routes
[ ] Product model + hooks + text index
[ ] Product controller (CRUD, filters, search)
[ ] Upload middleware (multer) + Cloudinary service
[ ] Upload controller + routes
[ ] Cart model + controller (add, update, remove, merge)
[ ] Wishlist model + controller
[ ] Order model + hooks (order number, status history)
[ ] Order controller (place, list, status update, cancel)
[ ] Review model + post-save hook (rating recalculation)
[ ] Review controller (submit, edit, delete, summary)
[ ] Coupon model + methods (validate, calculateDiscount)
[ ] Coupon controller (validate, CRUD, toggle)
[ ] Analytics controller (dashboard, revenue, top products, orders)
[ ] All routes registered in app.js
[ ] Postman collection complete + tested
[ ] Seed script (admin user, categories, products, coupons)
```

### Admin Dashboard

```
[ ] Tailwind + CSS variables setup
[ ] Axios instance (withCredentials)
[ ] Redux store + auth slice
[ ] RTK Query API files (all features)
[ ] Login page
[ ] Protected route + role check
[ ] Sidebar + Header + Layout shell
[ ] Common components (Button, Input, Badge, Modal, Dialog, Table, Pagination)
[ ] Dashboard overview page (stats, charts, recent orders, top products)
[ ] Product list page (table, search, filter)
[ ] Add product page (full form, image upload, variants)
[ ] Edit product page (pre-filled)
[ ] Order list page (table, filters, export)
[ ] Order detail page (status update, timeline)
[ ] Customer list page
[ ] Customer detail page
[ ] Category management page (modal CRUD)
[ ] Coupon management page (modal CRUD)
[ ] Analytics page (charts, export)
[ ] Settings page (profile + store)
[ ] All loading skeletons
[ ] All toast notifications
[ ] All empty states
[ ] All confirm dialogs
[ ] Responsive layout (tablet support)
```

### Client Website

```
[ ] Tailwind + CSS variables setup
[ ] Google Fonts import
[ ] Axios instance
[ ] AuthContext (user state, login, logout)
[ ] CartContext (items, add, remove, update, merge)
[ ] Navbar (desktop + mobile drawer)
[ ] Footer
[ ] Search bar with autocomplete
[ ] Login page
[ ] Register page
[ ] Forgot password page
[ ] Reset password page
[ ] Home page (Hero, Categories, Featured, Promo, Newsletter)
[ ] Product listing page (filters, sort, pagination)
[ ] Category listing page
[ ] Product detail page (gallery, variants, qty, cart, wishlist, reviews)
[ ] Search results page
[ ] Cart page (items, coupon, summary)
[ ] Checkout page (3-step flow)
[ ] Order success page
[ ] Profile layout (sidebar nav)
[ ] Profile page (edit info, change password, avatar)
[ ] Addresses page (CRUD)
[ ] Orders list page
[ ] Order detail page (timeline, cancel)
[ ] Wishlist page
[ ] All page metadata (title + description)
[ ] All loading.jsx skeletons
[ ] All error.jsx boundaries
[ ] 404 page
[ ] Lighthouse score ≥ 90
```

---

## 10. Coding Order (Dependencies First)

```
1.  Backend config + utilities         (no dependencies)
2.  User model                         (no dependencies)
3.  Auth middleware                    (depends: User model)
4.  Auth controller + routes           (depends: User model, email service)
5.  Category model + controller        (depends: auth middleware)
6.  Product model + controller         (depends: Category model)
7.  Upload service + controller        (depends: Cloudinary config)
8.  Cart model + controller            (depends: User, Product)
9.  Wishlist model + controller        (depends: User, Product)
10. Order model + controller           (depends: User, Product, Cart, Coupon)
11. Review model + controller          (depends: User, Product, Order)
12. Coupon model + controller          (depends: User)
13. Analytics controller               (depends: Order, Product, User)

14. Dashboard: Auth + Layout           (depends: backend Auth)
15. Dashboard: Products                (depends: backend Products, Categories, Upload)
16. Dashboard: Orders                  (depends: backend Orders, Users)
17. Dashboard: Customers               (depends: backend Users)
18. Dashboard: Categories              (depends: backend Categories)
19. Dashboard: Coupons                 (depends: backend Coupons)
20. Dashboard: Analytics               (depends: backend Analytics)

21. Website: Auth + Context            (depends: backend Auth)
22. Website: Home                      (depends: backend Products, Categories)
23. Website: Product Listing           (depends: backend Products, Categories)
24. Website: Product Detail            (depends: backend Products, Reviews)
25. Website: Search                    (depends: backend Products)
26. Website: Cart                      (depends: CartContext, backend Cart)
27. Website: Checkout                  (depends: backend Orders, Coupons)
28. Website: Profile + Orders          (depends: backend Users, Orders)
29. Website: Wishlist                  (depends: backend Wishlist)
```

---

## 11. Branch Strategy Per Stage

```
main
 └── develop
      ├── feature/backend-auth
      ├── feature/backend-products
      ├── feature/backend-orders
      ├── feature/backend-reviews
      ├── feature/backend-coupons
      ├── feature/backend-analytics
      ├── feature/dashboard-setup
      ├── feature/dashboard-products
      ├── feature/dashboard-orders
      ├── feature/dashboard-analytics
      ├── feature/website-setup
      ├── feature/website-home
      ├── feature/website-products
      ├── feature/website-cart-checkout
      ├── feature/website-profile
      ├── fix/<bug-description>
      └── chore/<task-description>
```

---

## 12. Definition of Done

A feature is considered **Done** when ALL of the following are true:

```
Code Quality:
  ✅ Code follows ESLint + Prettier rules (no warnings)
  ✅ No console.log statements in production code
  ✅ No hardcoded secrets or config values

Functionality:
  ✅ Feature works as per PRD acceptance criteria
  ✅ All edge cases handled (empty state, error state, loading state)
  ✅ Mobile responsive (375px → 1920px)

API (Backend):
  ✅ Endpoint tested in Postman for all scenarios
  ✅ Proper HTTP status codes returned
  ✅ Input validation working
  ✅ Auth/role protection working

UI (Frontend):
  ✅ Matches UI/UX Brief design system
  ✅ Loading skeleton shown during data fetch
  ✅ Error toast shown on API failure
  ✅ Empty state shown when no data

Version Control:
  ✅ Feature branch merged to develop via PR
  ✅ PR reviewed and approved
  ✅ No merge conflicts
  ✅ Commit messages follow convention

Documentation:
  ✅ Any new endpoint added to API docs
  ✅ .env.example updated if new env var added
```

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial Implementation Plan |

---

*Previous Phase → [Phase 6: API Documentation](./phase-6-APIDocs.md)*  
*Next Phase → [Phase 8: Deployment Guide](./phase-8-DeploymentGuide.md)*
