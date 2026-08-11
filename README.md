# 🛍️ Shop Sathi - Production-Ready E-Commerce Platform

Welcome to **Shop Sathi**, an end-to-end, production-grade E-Commerce platform engineered for high performance, security, and scalability. This repository is structured as a monorepo containing the **Customer Storefront**, **Admin Dashboard**, **Backend REST API**, and exhaustive **Technical Documentation**.

---

## 📐 Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Customer Storefront    │
                          │   (Next.js 16 + React 19)│
                          └────────────┬─────────────┘
                                       │ HTTP / REST
                                       ▼
┌──────────────────────┐  HTTP / REST ┌──────────────────────────┐
│   Admin Dashboard    ├─────────────►│       Backend API        │
│   (Vite + React 19)  │              │  (Node.js + Express.js)  │
└──────────────────────┘              └────────────┬─────────────┘
                                                   │ Mongoose ORM
                                                   ▼
                                      ┌──────────────────────────┐
                                      │     MongoDB Database     │
                                      └──────────────────────────┘
```

---

## 🛠️ Tech Stack & Technologies

### 1. 🛒 Storefront (`/website`)
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + PostCSS
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Internationalization**: i18next + React i18next
- **Icons & UI**: Lucide React, Swiper, React Hot Toast
- **Deployment Target**: Netlify

### 2. 📊 Admin Dashboard (`/dashboard`)
- **Build Tool & Framework**: Vite 8 + React 19
- **Routing**: React Router DOM v7
- **State Management**: Redux Toolkit + React-Redux
- **Styling**: Tailwind CSS v4 + PostCSS
- **Data Visualization**: Recharts
- **Data Tables**: TanStack Table v8
- **Form Validation**: React Hook Form + Zod
- **Deployment Target**: Netlify

### 3. ⚙️ Backend API (`/backend`)
- **Runtime & Framework**: Node.js (>=20.0.0) + Express.js v4
- **Database & ORM**: MongoDB + Mongoose v8
- **Authentication**: JWT (JSON Web Tokens) + Cookie Parser + Bcrypt.js
- **Payment Gateway Integration**: Razorpay SDK
- **Communication Services**: Nodemailer (Email) + Twilio (SMS/OTP)
- **File Uploads**: Multer
- **Security & Optimization**: Helmet, CORS, Express Rate Limit, Compression, Morgan Logging

---

## 📁 Repository Structure

```
shop-sathi-e-commerce/
├── 📄 README.md                    # Main Project Documentation
├── 📁 backend/                     # Express & Node.js REST API
│   ├── 📁 scripts/                 # Utility & bulk image update scripts
│   ├── 📁 src/                     # Controllers, Models, Routes, Middlewares, Services
│   ├── 📄 server.js                # Server entry point
│   ├── 📄 seed.js                  # Database seed script
│   └── 📄 package.json             # Backend dependencies & npm scripts
├── 📁 dashboard/                   # Admin Dashboard Application (Vite + React)
│   ├── 📁 public/                  # Public assets
│   ├── 📁 src/                     # Admin pages, components, redux slices, routes
│   ├── 📄 vite.config.js           # Vite configuration
│   └── 📄 package.json             # Dashboard dependencies & npm scripts
├── 📁 website/                     # Storefront Application (Next.js 16)
│   ├── 📁 public/                  # Static assets & images
│   ├── 📁 src/                     # Next.js pages, components, stores, hooks
│   ├── 📄 next.config.mjs          # Next.js configuration
│   └── 📄 package.json             # Storefront dependencies & npm scripts
└── 📁 documentation/               # Complete Project Specification Guides
    ├── 📄 phase-1-PRD.md           # Product Requirements Document
    ├── 📄 phase-2-TRD.md           # Technical Requirements Document
    ├── 📄 phase-3-AppFlow.md       # User Flow & Navigation Specs
    ├── 📄 phase-4-UIUXBrief.md     # Design System & UI/UX Guidelines
    ├── 📄 phase-5-Schema.md        # Database Schema Specifications
    ├── 📄 phase-6-APIDocs.md       # Complete API Endpoint Documentation
    ├── 📄 phase-7-ImplementationPlan.md # Step-by-Step Build Roadmap
    ├── 📄 phase-8-DeploymentGuide.md    # Production Deployment Guide
    ├── 📄 phase-9-MaintenanceGuide.md   # Maintenance & Operations
    └── 📄 prodecats-categories.md  # Product Catalog Specifications
```

---

## ✨ Key Features

### 🛍️ Customer Storefront (`/website`)
- **Product Catalog & Discovery**: Category hierarchy, dynamic search, multi-faceted filtering, sorting, and pagination.
- **Product Details**: Variant selections (size, color), image galleries, customer reviews, rating breakdowns, and stock availability.
- **Shopping Cart & Checkout**: Interactive cart drawer, persistent session cart, discount code application, and Razorpay payment processing.
- **User Accounts**: Authentication, order history tracking, saved addresses, wishlist management, and profile settings.
- **Multilingual & Responsive**: Multi-language translation support (i18n) and 100% responsive design across all viewports.

### 📊 Admin Dashboard (`/dashboard`)
- **Analytics Overview**: Real-time sales metrics, revenue analytics, top-selling product charts, and recent order feeds.
- **Product Management**: Full CRUD operations for products, categories, dynamic inventory tracking, and variant handling.
- **Order Fulfillment**: Order processing workflow (Pending → Processing → Shipped → Delivered → Cancelled), invoice generation, and status updates.
- **Customer Management**: User account listing, order history, activity logs, and account status management.

### ⚙️ Backend API (`/backend`)
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Admin, Manager, and Customer roles.
- **Secure Authentication**: HTTP-only cookie JWT delivery, refresh tokens, and password hashing with bcrypt.
- **Payment Processing**: Verification signatures for Razorpay webhooks and payment flow integration.
- **Automated Communication**: Transactional emails (order confirmation, password reset) via Nodemailer & OTP validation via Twilio.
- **Production Hardened**: Rate limiting protection, security headers via Helmet, payload compression, and centralized error handling.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your environment:
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **MongoDB**: Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI

---

### 1. ⚙️ Setup & Start Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables (copy example file)
cp .env.example .env

# Seed initial database data (categories, products, admin account)
npm run seed

# Start development server
npm run dev
```

The backend server runs at **`http://localhost:5000`** by default.

---

### 2. 🛍️ Setup & Start Storefront Website

```bash
# Navigate to the website directory
cd website

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The customer storefront runs at **`http://localhost:3000`** by default.

---

### 3. 📊 Setup & Start Admin Dashboard

```bash
# Navigate to the dashboard directory
cd dashboard

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The admin dashboard runs at **`http://localhost:5173`** by default.

---

## 📜 Database Seeding & Utility Scripts

The backend includes pre-configured utility scripts for populating seed data and updating product catalogs:

| Command | Description |
| :--- | :--- |
| `npm run seed` | Seeds default admin user, initial product categories, and sample products. |
| `npm run update-images` | Updates product image URLs across all existing products in MongoDB. |
| `npm run bulk-update-images` | Executes bulk update for product media assets. |
| `npm run update-pet-supplies` | Updates pet supplies category catalog. |
| `npm run update-mobile-accessories` | Updates mobile accessories category catalog. |
| `npm run update-toys-games` | Updates toys and games category catalog. |

---

## 📚 Complete Documentation Index

For detailed specifications and architectural deep dives, check out the documentation files in the [`documentation/`](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation) folder:

- 📄 [Phase 1: Product Requirements Document (PRD)](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-1-PRD.md)
- 📄 [Phase 2: Technical Requirements Document (TRD)](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-2-TRD.md)
- 📄 [Phase 3: App Flow & Navigation Specs](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-3-AppFlow.md)
- 📄 [Phase 4: UI/UX Brief & Design System](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-4-UIUXBrief.md)
- 📄 [Phase 5: Database Schema Specifications](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-5-Schema.md)
- 📄 [Phase 6: Complete API Documentation](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-6-APIDocs.md)
- 📄 [Phase 7: Step-by-Step Implementation Roadmap](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-7-ImplementationPlan.md)
- 📄 [Phase 8: Production Deployment Guide](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-8-DeploymentGuide.md)
- 📄 [Phase 9: Maintenance & Security Operations](file:///c:/Users/Brijesh/OneDrive/Desktop/ATS-system/ATS-system/ATS-system/ATS-system/shop-sathi-e-commerce/documentation/phase-9-MaintenanceGuide.md)

---

## 🤝 Contributing & License

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Developed with ❤️ for **Shop Sathi E-Commerce Platform**.
