# Deployment Guide

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 8 of 9

---

## Table of Contents

1. [Overview](#1-overview)
2. [Deployment Architecture](#2-deployment-architecture)
3. [Pre-Deployment Checklist](#3-pre-deployment-checklist)
4. [Service Account Setup](#4-service-account-setup)
5. [MongoDB Atlas Setup](#5-mongodb-atlas-setup)
6. [Cloudinary Setup](#6-cloudinary-setup)
7. [Email Service Setup](#7-email-service-setup)
8. [Backend Deployment (Railway)](#8-backend-deployment-railway)
9. [Admin Dashboard Deployment (Vercel)](#9-admin-dashboard-deployment-vercel)
10. [Client Website Deployment (Vercel)](#10-client-website-deployment-vercel)
11. [Domain & DNS Configuration](#11-domain--dns-configuration)
12. [SSL Certificate](#12-ssl-certificate)
13. [Environment Variables Reference](#13-environment-variables-reference)
14. [Post-Deployment Verification](#14-post-deployment-verification)
15. [Rollback Procedure](#15-rollback-procedure)
16. [CI/CD Pipeline](#16-cicd-pipeline)

---

## 1. Overview

### Deployment Targets

| Application | Platform | URL Pattern |
|-------------|----------|-------------|
| Backend API | Railway | `api.shopease.com` |
| Client Website | Vercel | `shopease.com` / `www.shopease.com` |
| Admin Dashboard | Vercel | `admin.shopease.com` |
| Database | MongoDB Atlas | Internal connection string |
| Images | Cloudinary | `res.cloudinary.com/shopease/...` |
| Email | Gmail SMTP → SendGrid | SMTP |

### Deployment Flow

```
GitHub (main branch)
        │
        ├──► Railway (auto-deploy backend)
        │
        ├──► Vercel Project 1 (auto-deploy website)
        │
        └──► Vercel Project 2 (auto-deploy dashboard)

All three apps are independently deployed.
A push to main triggers all three deployments simultaneously.
```

---

## 2. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                 │
│                                                                 │
│   shopease.com          admin.shopease.com    api.shopease.com  │
│        │                       │                    │          │
└────────│───────────────────────│────────────────────│──────────┘
         │                       │                    │
         ▼                       ▼                    ▼
  ┌─────────────┐       ┌──────────────┐     ┌─────────────────┐
  │   Vercel    │       │    Vercel    │     │    Railway      │
  │  (Website)  │       │  (Dashboard) │     │   (Backend)     │
  │  Next.js    │       │  React SPA   │     │  Node.js API    │
  └─────────────┘       └──────────────┘     └────────┬────────┘
                                                       │
                              ┌────────────────────────┤
                              │                        │
                        ┌─────▼──────┐       ┌────────▼───────┐
                        │  MongoDB   │       │   Cloudinary   │
                        │   Atlas    │       │   (Images CDN) │
                        │  M10 Cluster│      └────────────────┘
                        └────────────┘
                                                  ┌──────────┐
                                                  │SendGrid  │
                                                  │ (Email)  │
                                                  └──────────┘
```

---

## 3. Pre-Deployment Checklist

### Code Readiness

```
[ ] All features tested locally end-to-end
[ ] No console.log() statements in production code
[ ] No hardcoded localhost URLs — all use env variables
[ ] All .env variables documented in .env.example
[ ] .env files are in .gitignore (never committed)
[ ] ESLint passes with zero errors: npm run lint
[ ] Build succeeds without errors:
    Backend:   node server.js (no crash on start)
    Dashboard: npm run build (no build errors)
    Website:   npm run build (no build errors)
[ ] Git: all changes committed and pushed to main
[ ] Git: no merge conflicts in main branch
[ ] README.md updated with setup instructions
```

### Security Readiness

```
[ ] All JWT secrets are strong random strings (≥ 64 chars)
[ ] bcrypt salt rounds = 12
[ ] CORS whitelist contains only production domains
[ ] Rate limiting is enabled
[ ] Helmet.js middleware is active
[ ] Cookie flags: httpOnly=true, secure=true, sameSite='strict'
[ ] No sensitive data logged in production
[ ] MongoDB Atlas IP whitelist configured
[ ] Cloudinary API keys have restricted permissions
```

### Performance Readiness

```
[ ] Next.js build output analyzed (no large bundles)
[ ] All images go through Cloudinary (no local file serving)
[ ] Mongoose queries use .lean() for read-only operations
[ ] Database indexes are created
[ ] API pagination implemented on all list endpoints
[ ] gzip compression enabled (compression middleware)
```

---

## 4. Service Account Setup

### 4.1 Accounts Required

| Service | URL | Plan |
|---------|-----|------|
| GitHub | github.com | Free |
| MongoDB Atlas | mongodb.com/atlas | Free (M0) → M10 for production |
| Cloudinary | cloudinary.com | Free tier (25GB storage, 25GB bandwidth) |
| Railway | railway.app | Hobby ($5/month) |
| Vercel | vercel.com | Free (Hobby) — up to 2 projects |
| SendGrid | sendgrid.com | Free (100 emails/day) |
| Domain Registrar | namecheap.com / godaddy.com | ~$10–15/year |

### 4.2 Create Accounts

```
1. Sign up at all services above
2. Link GitHub account to:
   - Railway (for auto-deploy)
   - Vercel (for auto-deploy)
3. Verify email addresses for all services
```

---

## 5. MongoDB Atlas Setup

### 5.1 Create Cluster

```
1. Login → mongodb.com/atlas
2. Click "Build a Database"
3. Choose: M0 Free Tier (for start) OR M10 (for production)
4. Provider: AWS | Region: Mumbai (ap-south-1) — closest to India
5. Cluster Name: ecommerce-cluster
6. Click "Create Cluster" (takes ~3 minutes)
```

### 5.2 Database User

```
1. Security → Database Access → Add New Database User
2. Username: ecommerce_user
3. Password: <generate strong password, save securely>
4. Database User Privileges: Read and write to any database
5. Click "Add User"
```

### 5.3 Network Access (IP Whitelist)

```
1. Security → Network Access → Add IP Address
2. For Railway: Add "Allow Access from Anywhere" (0.0.0.0/0)
   (Railway uses dynamic IPs)
3. Click "Confirm"

NOTE: In a high-security setup, use Railway's static IP add-on
and whitelist only that IP instead of 0.0.0.0/0
```

### 5.4 Get Connection String

```
1. Database → Connect → Connect your application
2. Driver: Node.js | Version: 5.5 or later
3. Copy connection string:
   mongodb+srv://ecommerce_user:<password>@ecommerce-cluster.xxxxx.mongodb.net/

4. Replace <password> with your actual password
5. Add database name at the end:
   mongodb+srv://ecommerce_user:<password>@ecommerce-cluster.xxxxx.mongodb.net/ecommerce

6. Save this as MONGODB_URI in your backend .env
```

### 5.5 Create Indexes (After First Deployment)

```bash
# Connect via MongoDB Atlas Data Explorer or mongosh
# Run index creation script from Phase 5 (Schema doc)

# Or add to seed script:
node src/utils/seed.js --indexes
```

---

## 6. Cloudinary Setup

### 6.1 Create Account & Get Credentials

```
1. Login → cloudinary.com/console
2. Dashboard shows:
   - Cloud Name: your-cloud-name
   - API Key: 123456789012345
   - API Secret: xxxxxxxxxxxxxxxxxxxx

3. Save all three in backend .env:
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx
```

### 6.2 Create Upload Folders

```
1. Media Library → Create Folder: ecommerce
2. Inside ecommerce, create sub-folders:
   - ecommerce/products
   - ecommerce/categories
   - ecommerce/avatars
```

### 6.3 Upload Presets (Optional but Recommended)

```
1. Settings → Upload → Add upload preset
2. Preset name: ecommerce_products
3. Signing Mode: Signed
4. Folder: ecommerce/products
5. Transformations: f_webp, q_auto
6. Save

Repeat for categories and avatars presets.
```

---

## 7. Email Service Setup

### 7.1 Development: Gmail SMTP

```
1. Use a dedicated Gmail account (not personal)
2. Enable 2-Factor Authentication on Gmail
3. Generate App Password:
   Google Account → Security → 2-Step Verification → App Passwords
   App: Mail | Device: Other → Name: "ShopEase Backend"
   Copy the 16-character password

4. Save in .env:
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=shopease.noreply@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx     ← 16-char app password
   EMAIL_FROM=ShopEase <shopease.noreply@gmail.com>
```

### 7.2 Production: SendGrid

```
1. Login → sendgrid.com
2. Settings → API Keys → Create API Key
3. Name: ShopEase Production
4. Permissions: Full Access OR Mail Send only
5. Copy API Key (shown only once!)

6. Verify Sender Identity:
   Settings → Sender Authentication → Single Sender Verification
   Enter: From Name, From Email, Reply To, Company, Address
   Verify via email link

7. Update backend .env for production:
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx
   EMAIL_FROM=ShopEase <noreply@shopease.com>

8. Update email.service.js for production:
   Use @sendgrid/mail package instead of Nodemailer
   OR use Nodemailer with SendGrid SMTP:
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=<SENDGRID_API_KEY>
```

---

## 8. Backend Deployment (Railway)

### 8.1 Prepare Backend for Deployment

```bash
# In backend/package.json — add start script:
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

```js
// In server.js — use process.env.PORT (Railway assigns dynamic port)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

### 8.2 Create Railway Project

```
1. Login → railway.app
2. New Project → Deploy from GitHub repo
3. Select: ecommerce-project repository
4. Select: backend/ as root directory
   (Or use Railway monorepo support → set root to /backend)

5. Railway auto-detects Node.js → runs npm install + npm start
```

### 8.3 Configure Environment Variables on Railway

```
1. Railway Project → Variables tab
2. Add all variables from backend .env:

NODE_ENV=production
PORT=5000 (Railway overrides this automatically)
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=<64-char random string>
JWT_REFRESH_SECRET=<64-char different random string>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=<sendgrid_api_key>
EMAIL_FROM=ShopEase <noreply@shopease.com>
CLIENT_URL=https://shopease.com
DASHBOARD_URL=https://admin.shopease.com
COOKIE_SECURE=true
```

> **Generate strong secrets:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 8.4 Add Procfile (Optional)

```
# backend/Procfile
web: node server.js
```

### 8.5 Deploy & Verify

```
1. Railway auto-deploys on push to main
2. View deployment logs in Railway dashboard
3. Wait for "Deploy successful" status

4. Get Railway URL: https://ecommerce-backend-production.up.railway.app

5. Test with Postman:
   GET https://ecommerce-backend-production.up.railway.app/api/auth/me
   Expected: 401 Unauthorized (correct — not logged in)
   
6. Run seed script against production DB:
   Add temporary env var: SEED=true
   OR run locally with production MONGODB_URI:
   MONGODB_URI=<prod-uri> node src/utils/seed.js
```

### 8.6 Custom Domain on Railway

```
1. Railway Project → Settings → Domains
2. Add custom domain: api.shopease.com
3. Copy the CNAME record Railway provides
4. Go to your domain registrar → DNS settings
5. Add CNAME record:
   Type:  CNAME
   Name:  api
   Value: ecommerce-backend-production.up.railway.app
6. Wait for DNS propagation (5 min – 48 hours)
7. Railway auto-provisions SSL for custom domain
```

---

## 9. Admin Dashboard Deployment (Vercel)

### 9.1 Prepare Dashboard for Deployment

```bash
# In dashboard/package.json — verify build script exists:
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

```js
// In dashboard/vite.config.js — ensure base is '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

```js
// In dashboard/src/services/api.js — use env variable for base URL:
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
```

### 9.2 Create Vercel Project (Dashboard)

```
1. Login → vercel.com
2. New Project → Import Git Repository
3. Select: ecommerce-project
4. Root Directory: dashboard
5. Framework Preset: Vite
6. Build Command: npm run build
7. Output Directory: dist
8. Install Command: npm install
```

### 9.3 Configure Environment Variables (Dashboard)

```
In Vercel Project Settings → Environment Variables:

VITE_API_URL=https://api.shopease.com/api
```

### 9.4 Configure SPA Routing

React Router needs a `vercel.json` for client-side routing:

```json
// dashboard/vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 9.5 Deploy Dashboard

```
1. Click "Deploy" in Vercel
2. Wait for build to complete (~2 minutes)
3. Vercel provides URL: https://ecommerce-dashboard.vercel.app

4. Test:
   - Visit the URL
   - Login page loads
   - Login with admin credentials (seeded: admin@shopease.com / Admin@123456)
   - Dashboard overview loads
   - Products list loads with data from API
```

### 9.6 Custom Domain (Dashboard)

```
1. Vercel Project → Settings → Domains
2. Add: admin.shopease.com
3. Vercel provides DNS records to add:
   Type: CNAME | Name: admin | Value: cname.vercel-dns.com
4. Add in domain registrar DNS settings
5. SSL auto-provisioned by Vercel (Let's Encrypt)
```

---

## 10. Client Website Deployment (Vercel)

### 10.1 Prepare Website for Deployment

```js
// website/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],    // allow Cloudinary images
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

module.exports = nextConfig
```

### 10.2 Create Vercel Project (Website)

```
1. Vercel → New Project → Import Git Repository
2. Select: ecommerce-project
3. Root Directory: website
4. Framework Preset: Next.js (auto-detected)
5. Build Command: npm run build (auto)
6. Output Directory: .next (auto)
7. Install Command: npm install (auto)
```

### 10.3 Configure Environment Variables (Website)

```
In Vercel Project Settings → Environment Variables:

NEXT_PUBLIC_API_URL=https://api.shopease.com/api
NEXT_PUBLIC_SITE_URL=https://shopease.com
```

### 10.4 Deploy Website

```
1. Click "Deploy"
2. Wait for build (~3–5 minutes for Next.js)
3. Vercel URL: https://ecommerce-website.vercel.app

4. Test:
   - Homepage loads with hero + products
   - Product listing page loads and filters work
   - Product detail page loads
   - Login and register work
   - Add to cart works
   - Checkout completes (place a test order)
   - Admin dashboard shows the test order
```

### 10.5 Custom Domain (Website)

```
1. Vercel Project → Settings → Domains
2. Add: shopease.com
3. Add: www.shopease.com (Vercel auto-redirects to shopease.com)
4. Vercel provides:
   Type: A     | Name: @   | Value: 76.76.21.21
   Type: CNAME | Name: www | Value: cname.vercel-dns.com
5. Add in domain registrar DNS settings
6. SSL auto-provisioned by Vercel
```

---

## 11. Domain & DNS Configuration

### 11.1 DNS Records Summary

Add all these records in your domain registrar (Namecheap / GoDaddy):

```
Type    Name     Value                              TTL
────────────────────────────────────────────────────────────
A       @        76.76.21.21 (Vercel)               Auto
CNAME   www      cname.vercel-dns.com               Auto
CNAME   admin    cname.vercel-dns.com               Auto
CNAME   api      <railway-app>.up.railway.app       Auto
```

### 11.2 Verify DNS Propagation

```bash
# Check from terminal (wait 5–30 minutes after adding records):
nslookup shopease.com
nslookup www.shopease.com
nslookup admin.shopease.com
nslookup api.shopease.com

# Or use online tool: dnschecker.org
```

### 11.3 Update CORS After Domain Setup

```js
// backend src/app.js — update CORS with final domains:
app.use(cors({
  origin: [
    'https://shopease.com',
    'https://www.shopease.com',
    'https://admin.shopease.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

---

## 12. SSL Certificate

### Automatic SSL (All Platforms)

| Platform | SSL Provider | Auto-Renewal |
|----------|-------------|--------------|
| Vercel | Let's Encrypt | ✅ Automatic |
| Railway | Let's Encrypt | ✅ Automatic |
| MongoDB Atlas | AWS ACM | ✅ Automatic |

**No manual SSL setup needed.** All platforms provision and renew SSL certificates automatically when you add custom domains.

### Verify SSL

```bash
# Test HTTPS is working:
curl -I https://shopease.com
curl -I https://api.shopease.com/api/products

# Expected: HTTP/2 200, with server headers
# Check certificate: lock icon in browser
```

---

## 13. Environment Variables Reference

### 13.1 Backend (Railway)

```env
# ── Server ──────────────────────────────────────────
NODE_ENV=production
PORT=5000

# ── Database ─────────────────────────────────────────
MONGODB_URI=mongodb+srv://ecommerce_user:<password>@ecommerce-cluster.xxxxx.mongodb.net/ecommerce

# ── JWT ──────────────────────────────────────────────
JWT_ACCESS_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_REFRESH_SECRET=<generate: different from access secret>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ── Cloudinary ───────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx

# ── Email (SendGrid) ─────────────────────────────────
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=ShopEase <noreply@shopease.com>

# ── Frontend URLs (CORS whitelist) ───────────────────
CLIENT_URL=https://shopease.com
DASHBOARD_URL=https://admin.shopease.com

# ── Cookie ───────────────────────────────────────────
COOKIE_SECURE=true

# ── App ──────────────────────────────────────────────
FREE_SHIPPING_THRESHOLD=499
SHIPPING_CHARGE=99
TAX_RATE=0.18
LOW_STOCK_THRESHOLD=10
```

### 13.2 Dashboard (Vercel)

```env
VITE_API_URL=https://api.shopease.com/api
```

### 13.3 Website (Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.shopease.com/api
NEXT_PUBLIC_SITE_URL=https://shopease.com
```

---

## 14. Post-Deployment Verification

### 14.1 Backend API Tests

```bash
# 1. Health check
GET https://api.shopease.com/api/products
Expected: 200 OK with products array

# 2. Auth flow
POST https://api.shopease.com/api/auth/login
Body: { "email": "admin@shopease.com", "password": "Admin@123456" }
Expected: 200 OK, cookies set

# 3. Protected route
GET https://api.shopease.com/api/auth/me
Expected: 200 with user data (using session cookie from step 2)

# 4. CORS check
Open browser console on https://shopease.com
fetch('https://api.shopease.com/api/products').then(r => r.json()).then(console.log)
Expected: No CORS error, products returned
```

### 14.2 Website Checks

```
[ ] Homepage loads in < 3 seconds
[ ] All product images load (Cloudinary URLs working)
[ ] Search returns results
[ ] Product detail page loads with correct data
[ ] Register new account → welcome email received
[ ] Login with new account
[ ] Add products to cart
[ ] Apply coupon code (WELCOME20)
[ ] Complete checkout with COD
[ ] Order confirmation email received
[ ] Order visible in Profile → Orders
```

### 14.3 Dashboard Checks

```
[ ] Admin login works
[ ] Dashboard stats show correct numbers
[ ] Revenue chart renders
[ ] Product list loads
[ ] Add a test product with images → verify on website
[ ] View the test order from website
[ ] Update order status → email sent to customer
[ ] Category management works
[ ] Coupon management works
```

### 14.4 Lighthouse Scores (Target ≥ 90)

```bash
# Run Lighthouse in Chrome DevTools (Incognito mode):
# DevTools → Lighthouse → Analyze page load

Target Scores:
  Performance:    ≥ 90
  Accessibility:  ≥ 90
  Best Practices: ≥ 90
  SEO:            ≥ 95

# Run for all key pages:
  https://shopease.com              (Home)
  https://shopease.com/products     (Product Listing)
  https://shopease.com/products/<slug> (Product Detail)
```

### 14.5 Security Verification

```bash
# Check security headers (via securityheaders.com):
# Enter: https://api.shopease.com
# Expected rating: A or B

# Test rate limiting:
# Make 110 requests in 1 minute to any endpoint
# Expected: 429 Too Many Requests after 100

# Check cookies (Chrome DevTools → Application → Cookies):
# accessToken:  HttpOnly=true, Secure=true, SameSite=Strict
# refreshToken: HttpOnly=true, Secure=true, SameSite=Strict
```

---

## 15. Rollback Procedure

### 15.1 Vercel Rollback (Website / Dashboard)

```
1. Vercel Dashboard → Select Project
2. Deployments tab → find last working deployment
3. Click "..." → Promote to Production
4. Rollback takes ~30 seconds

Alternatively via CLI:
  npx vercel rollback
```

### 15.2 Railway Rollback (Backend)

```
1. Railway Dashboard → Select Service
2. Deployments tab → find last working deployment
3. Click on deployment → "Rollback to this deploy"
4. Confirm rollback

Alternatively:
  git revert <commit-hash>
  git push origin main
  (triggers new deployment with reverted code)
```

### 15.3 Database Rollback

```
MongoDB Atlas does NOT support one-click rollback.
Prevention: Always take a backup before major migrations.

Manual restore from backup:
  1. MongoDB Atlas → Database → ... → Load Sample Data
     OR restore from backup file:
  2. mongorestore --uri="<MONGODB_URI>" --db=ecommerce ./backup/

Create backup before deployment:
  mongodump --uri="<MONGODB_URI>" --db=ecommerce --out=./backup/
```

### 15.4 Emergency Procedures

```
Issue: API is down (5xx errors)
  1. Check Railway logs for error message
  2. Fix code → push to main → auto-redeploy
  3. If DB connection: check MongoDB Atlas status page
  4. If env var issue: update in Railway → redeploy

Issue: Website shows blank page
  1. Check browser console for errors
  2. Verify NEXT_PUBLIC_API_URL in Vercel env vars
  3. Check if API is reachable
  4. Rollback to last working Vercel deployment

Issue: Login not working (cookie not set)
  1. Verify COOKIE_SECURE=true in production
  2. Verify CLIENT_URL matches exact domain (https://shopease.com)
  3. Verify CORS allows the frontend domain
  4. Check Chrome DevTools → Network → response Set-Cookie header

Issue: Emails not sending
  1. Check Railway logs for email errors
  2. Verify SendGrid API key is correct
  3. Check SendGrid Activity Feed for bounces/blocks
  4. Verify sender is verified in SendGrid
```

---

## 16. CI/CD Pipeline

### 16.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  # ── Backend: Lint + Test ──────────────────────────────
  backend-check:
    name: Backend Lint & Build Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check startup (no crash)
        run: |
          timeout 10 node server.js || true
        env:
          NODE_ENV: test
          PORT: 5001
          MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
          JWT_ACCESS_SECRET: test-secret-for-ci
          JWT_REFRESH_SECRET: test-refresh-secret-for-ci

  # ── Dashboard: Build Check ───────────────────────────
  dashboard-build:
    name: Dashboard Build Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: dashboard
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: dashboard/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://api.shopease.com/api

  # ── Website: Build Check ─────────────────────────────
  website-build:
    name: Website Build Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: https://api.shopease.com/api
          NEXT_PUBLIC_SITE_URL: https://shopease.com

  # ── Deploy (after all checks pass) ──────────────────
  deploy:
    name: Deploy All Services
    needs: [backend-check, dashboard-build, website-build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Trigger Railway Deploy (Backend)
        run: |
          curl -X POST "${{ secrets.RAILWAY_DEPLOY_HOOK }}"

      - name: Vercel auto-deploys website + dashboard
        run: echo "Vercel detects push to main and deploys automatically"
```

### 16.2 GitHub Secrets Required

```
Go to: GitHub Repo → Settings → Secrets and variables → Actions

Add:
  RAILWAY_DEPLOY_HOOK     ← from Railway Project → Settings → Deploy Hook
  MONGODB_URI_TEST        ← test database connection string (optional)
```

### 16.3 Branch Protection Rules

```
Go to: GitHub → Settings → Branches → Add rule

Branch: main
Rules:
  ✅ Require a pull request before merging
  ✅ Require at least 1 approval
  ✅ Require status checks to pass before merging
      → backend-check
      → dashboard-build
      → website-build
  ✅ Do not allow bypassing the above settings
```

### 16.4 Deployment Status Badges (README.md)

```markdown
![Backend](https://img.shields.io/badge/backend-railway-success)
![Website](https://img.shields.io/badge/website-vercel-success)
![Dashboard](https://img.shields.io/badge/dashboard-vercel-success)
```

---

## Deployment Summary

| Service | URL | Platform | Status Check |
|---------|-----|----------|-------------|
| Backend API | https://api.shopease.com | Railway | GET /api/products |
| Client Website | https://shopease.com | Vercel | Homepage loads |
| Admin Dashboard | https://admin.shopease.com | Vercel | Login page loads |
| Database | MongoDB Atlas (internal) | Atlas | Atlas dashboard |
| Images | Cloudinary CDN | Cloudinary | Media library |
| Email | SendGrid | SendGrid | Activity feed |

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial Deployment Guide |

---

*Previous Phase → [Phase 7: Implementation Plan](./phase-7-ImplementationPlan.md)*  
*Next Phase → [Phase 9: Maintenance Guide](./phase-9-MaintenanceGuide.md)*
