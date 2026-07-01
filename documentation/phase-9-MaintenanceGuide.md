# Maintenance Guide

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 9 of 9 — FINAL

---

## Table of Contents

1. [Overview](#1-overview)
2. [Monitoring Setup](#2-monitoring-setup)
3. [Log Management](#3-log-management)
4. [Database Maintenance](#4-database-maintenance)
5. [Backup Strategy](#5-backup-strategy)
6. [Security Maintenance](#6-security-maintenance)
7. [Performance Monitoring](#7-performance-monitoring)
8. [Dependency Management](#8-dependency-management)
9. [Bug Reporting & Tracking](#9-bug-reporting--tracking)
10. [Hotfix Procedure](#10-hotfix-procedure)
11. [Feature Release Process](#11-feature-release-process)
12. [Routine Maintenance Schedule](#12-routine-maintenance-schedule)
13. [Scaling Guide](#13-scaling-guide)
14. [Incident Response](#14-incident-response)
15. [Future Enhancements Roadmap](#15-future-enhancements-roadmap)

---

## 1. Overview

This guide covers all ongoing maintenance tasks required to keep the ShopEase e-commerce platform running securely, performantly, and reliably after initial deployment.

### Maintenance Principles

| Principle | Description |
|-----------|-------------|
| **Proactive** | Monitor before problems occur, not after |
| **Automated** | Automate repetitive tasks (backups, alerts) |
| **Documented** | Log every change, incident, and resolution |
| **Minimal Downtime** | Use zero-downtime deployment strategies |
| **Security First** | Patch vulnerabilities within 24–48 hours |

### Maintenance Ownership

| Area | Owner | Frequency |
|------|-------|-----------|
| Bug fixes | Backend / Frontend Dev | As needed |
| Security patches | Full Stack / DevOps | Within 48 hours |
| Dependency updates | Backend Dev | Monthly |
| DB backups | Automated | Daily |
| Performance review | Full Stack | Weekly |
| Feature releases | Full team | Bi-weekly sprint |
| Cost review | Product Manager | Monthly |

---

## 2. Monitoring Setup

### 2.1 Uptime Monitoring — UptimeRobot (Free)

```
Setup:
  1. Create account → uptimerobot.com
  2. Add Monitor → HTTP(s)
  3. Add the following monitors:

  Monitor 1: API Health
    URL:      https://api.shopease.com/api/products
    Interval: Every 5 minutes
    Alert:    Email + SMS on downtime

  Monitor 2: Website
    URL:      https://shopease.com
    Interval: Every 5 minutes
    Alert:    Email on downtime

  Monitor 3: Admin Dashboard
    URL:      https://admin.shopease.com
    Interval: Every 5 minutes
    Alert:    Email on downtime

4. Create a public status page:
   status.shopease.com
   (Shows uptime history to customers if site is down)
```

### 2.2 Error Tracking — Sentry (Free Tier)

```
Setup:
  1. Create account → sentry.io
  2. Create Project: Node.js (Backend)
  3. Create Project: Next.js (Website)
  4. Create Project: React (Dashboard)

Backend Integration:
  npm install @sentry/node

  // In server.js — before all routes:
  import * as Sentry from '@sentry/node'
  Sentry.init({
    dsn: process.env.SENTRY_DSN_BACKEND,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,  // 10% of requests
  })

  // In error middleware — report to Sentry:
  Sentry.captureException(err)

Website Integration:
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs

Dashboard Integration:
  npm install @sentry/react
  Sentry.init({ dsn: process.env.VITE_SENTRY_DSN })

Benefits:
  - Real-time error alerts (email/Slack)
  - Full stack traces
  - Error frequency tracking
  - User context on errors
```

### 2.3 Analytics — Vercel Analytics (Built-in)

```
Enable in Vercel Dashboard:
  1. Website Project → Analytics tab → Enable

Tracks:
  - Page views
  - Core Web Vitals (LCP, FID, CLS)
  - Top pages
  - Geographic distribution
  - Device breakdown

Cost: Free for Hobby plan
```

### 2.4 Railway Metrics (Built-in)

```
Railway Dashboard → Service → Metrics tab

Tracks:
  - CPU usage
  - Memory usage
  - Network I/O
  - Request volume

Set alerts:
  Railway → Service → Settings → Notifications
  Alert on: Deployment success/failure, crash restart
```

### 2.5 Add Health Check Endpoint

```js
// backend/src/routes/health.routes.js
import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
  })
})

export default router

// Mount in app.js:
import healthRouter from './routes/health.routes.js'
app.use('/api', healthRouter)
```

---

## 3. Log Management

### 3.1 Logging Levels

```js
// Use Morgan for HTTP request logs
// Use console levels for app logs:

console.error()  // Critical errors (always log)
console.warn()   // Warnings (potential issues)
console.info()   // Important events (order placed, user registered)
console.log()    // Debug (development only, remove in production)
```

### 3.2 What to Log

```js
// ✅ LOG these events:
- Server startup + port
- DB connection success / failure
- Failed login attempts (email, IP, timestamp)
- Order placed (orderId, userId, amount)
- Order status changed
- Admin actions (product created/deleted, user blocked)
- File upload success / failure
- Password reset requested
- Unhandled exceptions (via Sentry)

// ❌ NEVER LOG:
- Passwords (even hashed)
- JWT tokens
- Credit card numbers
- Full request bodies with sensitive fields
```

### 3.3 Viewing Logs in Production

```bash
# Railway logs:
railway logs                          # last 100 lines
railway logs --tail                   # live streaming
railway logs --filter "ERROR"         # filter by keyword

# Vercel Function logs (for API routes):
vercel logs https://shopease.com      # recent function logs

# MongoDB Atlas logs:
Atlas Dashboard → Database → Monitoring → Real Time
```

### 3.4 Log Retention

| Platform | Retention | How to extend |
|----------|-----------|---------------|
| Railway | 7 days | Export to external service |
| Vercel | 1 hour | Export to Datadog / LogDNA |
| Sentry | 30 days (free) | Upgrade plan |

---

## 4. Database Maintenance

### 4.1 Regular Checks

```bash
# Connect to MongoDB Atlas:
# Atlas → Database → Browse Collections

# Check collection sizes weekly:
db.orders.countDocuments()
db.products.countDocuments()
db.users.countDocuments()
db.reviews.countDocuments()

# Check slow queries (Atlas → Monitoring → Query Profiler):
# Enable: Atlas → Performance Advisor → Enable Profiler
# Look for queries > 100ms and add indexes
```

### 4.2 Index Maintenance

```js
// Check existing indexes monthly:
db.products.getIndexes()
db.orders.getIndexes()

// Remove unused indexes (Atlas Performance Advisor flags these):
db.collectionName.dropIndex('index_name')

// Rebuild indexes if fragmented (do during low-traffic hours):
db.products.reIndex()
```

### 4.3 Data Cleanup Tasks

```js
// Run monthly via a script or MongoDB Atlas Scheduled Trigger:

// 1. Remove expired coupons (older than 6 months)
await Coupon.deleteMany({
  expiresAt: { $lt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
  isActive: false,
})

// 2. Clear abandoned carts (untouched for 30 days)
await Cart.deleteMany({
  items: { $ne: [] },
  updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
})

// 3. Clear expired password reset tokens
await User.updateMany(
  { resetPasswordExpire: { $lt: new Date() } },
  { $unset: { resetPasswordToken: '', resetPasswordExpire: '' } }
)

// 4. Archive old delivered/cancelled orders (> 1 year)
// Move to an 'archived_orders' collection
```

### 4.4 MongoDB Atlas Performance Advisor

```
Atlas Dashboard → Database → Performance Advisor

Reviews:
  - Slow query suggestions
  - Missing index recommendations
  - Unused index warnings

Action: Review weekly, implement recommendations in next sprint.
```

---

## 5. Backup Strategy

### 5.1 MongoDB Atlas Automatic Backups

```
Atlas Free (M0):     No automatic backups — manual only
Atlas M10+:          Continuous backup (point-in-time restore)

Recommendation: Upgrade to M10 for production ($57/month)
  - Continuous backup (restore to any point in last 24 hours)
  - Snapshots retained for 7 days (daily), 4 weeks (weekly)

Enable:
  Atlas → Backup → Enable Backup for Cluster
```

### 5.2 Manual Backup Script

```bash
#!/bin/bash
# backup.sh — run via cron or GitHub Actions

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$DATE"
MONGODB_URI="mongodb+srv://..."

echo "Starting backup: $DATE"

# Create backup
mongodump \
  --uri="$MONGODB_URI" \
  --db=ecommerce \
  --out="$BACKUP_DIR" \
  --gzip

# Upload to cloud storage (e.g., AWS S3 or Cloudinary)
# aws s3 cp "$BACKUP_DIR" s3://shopease-backups/$DATE --recursive

echo "Backup complete: $BACKUP_DIR"

# Cleanup backups older than 30 days
find ./backups -type d -mtime +30 -exec rm -rf {} +
```

### 5.3 Automated Backup via GitHub Actions

```yaml
# .github/workflows/backup.yml
name: Daily Database Backup

on:
  schedule:
    - cron: '0 1 * * *'    # Every day at 1:00 AM UTC (6:30 AM IST)

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install mongodump
        run: |
          wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
          echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
          sudo apt-get update && sudo apt-get install -y mongodb-database-tools

      - name: Run backup
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
        run: bash scripts/backup.sh

      - name: Upload backup artifact
        uses: actions/upload-artifact@v4
        with:
          name: db-backup-${{ github.run_id }}
          path: ./backups/
          retention-days: 30
```

### 5.4 Backup Retention Policy

| Backup Type | Retention | Storage |
|-------------|-----------|---------|
| Daily automated | 30 days | GitHub Artifacts |
| Pre-deployment | 90 days | GitHub Artifacts |
| Monthly | 12 months | External cloud storage |

---

## 6. Security Maintenance

### 6.1 Vulnerability Scanning

```bash
# Run weekly in each app directory:
cd backend   && npm audit
cd dashboard && npm audit
cd website   && npm audit

# Auto-fix low/moderate vulnerabilities:
npm audit fix

# Check what will be changed before fixing:
npm audit fix --dry-run

# For breaking-change fixes (review carefully):
npm audit fix --force
```

### 6.2 Dependency Security Policy

```
CRITICAL vulnerability:  Patch within 24 hours
HIGH vulnerability:       Patch within 48 hours
MODERATE vulnerability:   Patch within 1 week
LOW vulnerability:        Patch in next monthly update
```

### 6.3 GitHub Dependabot (Automated)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /backend
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 10
    labels: [dependencies, backend]

  - package-ecosystem: npm
    directory: /dashboard
    schedule:
      interval: weekly
      day: monday
    labels: [dependencies, dashboard]

  - package-ecosystem: npm
    directory: /website
    schedule:
      interval: weekly
      day: monday
    labels: [dependencies, website]

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
    labels: [dependencies, ci]
```

### 6.4 JWT Secret Rotation

```bash
# Rotate JWT secrets every 90 days:

# Step 1: Generate new secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Step 2: Update in Railway environment variables
# Railway → Project → Variables → update JWT_ACCESS_SECRET + JWT_REFRESH_SECRET

# Step 3: Redeploy (Railway auto-redeploys on env var change)

# Note: All current user sessions will be invalidated.
# Users will need to log in again — this is expected and secure.
# Schedule during low-traffic hours (e.g., 3 AM IST).
```

### 6.5 Security Audit Checklist (Monthly)

```
[ ] npm audit — zero critical/high vulnerabilities
[ ] Check Sentry for new error patterns (possible attacks)
[ ] Review Railway logs for suspicious activity (many 401s, unusual IPs)
[ ] Check MongoDB Atlas access logs (Atlas → Security → Access History)
[ ] Verify CORS still only allows whitelisted origins
[ ] Verify rate limiting is working (test with curl)
[ ] Review admin accounts — remove inactive ones
[ ] Check Cloudinary — no unauthorized uploads
[ ] Verify SSL certificates are valid (check expiry in browser)
[ ] Review SendGrid — no spike in bounces (possible list compromise)
```

---

## 7. Performance Monitoring

### 7.1 Core Web Vitals Tracking

```
Run monthly via Google PageSpeed Insights:
  https://pagespeed.web.dev/

Target URLs:
  https://shopease.com
  https://shopease.com/products
  https://shopease.com/products/<best-selling-slug>

Target Scores:
  LCP (Largest Contentful Paint): < 2.5s  ✅
  FID (First Input Delay):        < 100ms ✅
  CLS (Cumulative Layout Shift):  < 0.1   ✅
  TTFB (Time to First Byte):      < 600ms ✅

Document scores in a spreadsheet monthly.
If any score drops below target → investigate immediately.
```

### 7.2 API Response Time Monitoring

```bash
# Test key API endpoints monthly:
# Using curl with timing:

curl -o /dev/null -s -w "%{time_total}s\n" \
  https://api.shopease.com/api/products

curl -o /dev/null -s -w "%{time_total}s\n" \
  "https://api.shopease.com/api/products?search=headphones&category=electronics"

# Targets:
# GET /products (no filters):  < 150ms
# GET /products (with filters): < 250ms
# POST /orders:                 < 500ms
# GET /analytics/dashboard:     < 800ms
```

### 7.3 MongoDB Query Performance

```js
// Enable slow query logging (> 100ms) in MongoDB Atlas:
// Atlas → Database → Monitoring → Real Time Performance Panel

// Check for slow queries monthly:
// Atlas → Performance Advisor → Slow Queries

// Common fixes:
// - Missing index → add index
// - N+1 query → use populate or aggregation
// - Large result set → add pagination or lean()
// - Unoptimized aggregation → add $match early in pipeline
```

### 7.4 Bundle Size Monitoring

```bash
# Check website bundle size after each major release:
cd website
npm run build

# Review .next/analyze output
# Install bundle analyzer:
npm install --save-dev @next/bundle-analyzer

# In next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)

# Run analysis:
ANALYZE=true npm run build

# Dashboard bundle:
cd dashboard
npm run build
# Check dist/ folder sizes — total JS should be < 500KB gzipped
```

---

## 8. Dependency Management

### 8.1 Monthly Update Routine

```bash
# Step 1: Check outdated packages
cd backend   && npm outdated
cd dashboard && npm outdated
cd website   && npm outdated

# Step 2: Update minor + patch versions (safe)
npm update

# Step 3: Review major version updates manually
# Use npm-check-updates for major bumps:
npx ncu -u --target minor     # minor updates only
npx ncu -u                    # all updates (review changelog first!)

# Step 4: Test after updates
npm run lint
npm run build (dashboard + website)
node server.js (backend — verify no crash)

# Step 5: Run integration tests

# Step 6: Commit and push if all tests pass
git add package.json package-lock.json
git commit -m "chore(deps): update dependencies - $(date +%Y-%m)"
git push origin develop
```

### 8.2 Node.js Version Updates

```
Node.js LTS release schedule:
  - New LTS: October each year
  - Active support: 18 months
  - Maintenance: 12 months

Action:
  - Update to new LTS within 1 month of release
  - Update in Railway: Settings → Environment → NODE_VERSION=22
  - Update in package.json engines field
  - Test locally before deploying
```

### 8.3 Breaking Changes Protocol

```
Before updating a major version:
  1. Read the package CHANGELOG / migration guide
  2. Check GitHub issues for reported breaking changes
  3. Test in a feature branch first
  4. Deploy to staging (if available) and test
  5. Only merge to main after full verification
  6. Document the update in the changelog
```

---

## 9. Bug Reporting & Tracking

### 9.1 Bug Report Template

```markdown
## Bug Report

**Title:** [Short description of the bug]

**Severity:** Critical / High / Medium / Low

**Environment:** Production / Staging / Local

**Steps to Reproduce:**
1. Go to ...
2. Click on ...
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots / Logs:**
[Attach screenshot or paste error from Sentry/Railway logs]

**Browser / Device:**
Chrome 125 / iPhone 14 / Windows 11

**Reported By:** [Name]
**Date:** [Date]
```

### 9.2 Severity Levels

| Severity | Description | Response Time | Examples |
|----------|-------------|---------------|---------|
| **Critical** | System down or data loss | < 2 hours | API down, checkout broken, login broken |
| **High** | Major feature broken | < 24 hours | Orders not sending email, images not loading |
| **Medium** | Minor feature broken | < 72 hours | Filter not working, pagination off |
| **Low** | Cosmetic / minor UX | Next sprint | Alignment issue, typo |

### 9.3 GitHub Issues Workflow

```
Labels to create in GitHub:
  🔴 critical     — fix immediately
  🟠 high         — fix this week
  🟡 medium       — fix this sprint
  🟢 low          — backlog
  🐛 bug          — confirmed bug
  ✨ enhancement  — new feature request
  📚 docs         — documentation update
  🔒 security     — security vulnerability

Workflow:
  Bug reported → Create GitHub Issue → Label → Assign → Fix branch
  → PR → Review → Merge to develop → Deploy to staging → Verify
  → Merge to main → Deploy → Close issue
```

---

## 10. Hotfix Procedure

For **Critical** bugs that need immediate fix in production:

```bash
# Step 1: Create hotfix branch from main (NOT develop)
git checkout main
git pull origin main
git checkout -b hotfix/checkout-payment-crash

# Step 2: Fix the bug
# Make minimal changes — ONLY what is needed to fix the bug

# Step 3: Test the fix locally
npm run dev  # verify fix works
npm run lint # verify no lint errors

# Step 4: Commit with clear message
git add .
git commit -m "fix(checkout): resolve payment calculation crash on zero-stock item"

# Step 5: Push and create PR to main
git push origin hotfix/checkout-payment-crash
# Create PR → merge to main (emergency — 1 approval needed)

# Step 6: After merge → auto-deployed to production

# Step 7: Verify fix in production (test the exact scenario that was broken)

# Step 8: Merge hotfix back to develop (so develop is not behind)
git checkout develop
git merge hotfix/checkout-payment-crash
git push origin develop

# Step 9: Delete hotfix branch
git branch -d hotfix/checkout-payment-crash
git push origin --delete hotfix/checkout-payment-crash

# Step 10: Document the incident (see Incident Response section)
```

---

## 11. Feature Release Process

### 11.1 Release Cycle

```
Every 2 weeks (end of sprint):
  1. All sprint features merged to develop
  2. QA testing on develop branch
  3. Create release branch: release/v1.1.0
  4. Final testing + bug fixes on release branch
  5. Merge release → main (triggers production deploy)
  6. Merge release → develop (keep in sync)
  7. Tag the release: git tag v1.1.0
  8. Write release notes in GitHub Releases
```

### 11.2 Semantic Versioning

```
Format: MAJOR.MINOR.PATCH
  MAJOR: Breaking changes (v2.0.0 — new architecture)
  MINOR: New features, backward compatible (v1.1.0 — wishlist added)
  PATCH: Bug fixes (v1.0.1 — cart calculation fix)

Examples:
  v1.0.0  — Initial production launch
  v1.0.1  — Hotfix: checkout email not sending
  v1.1.0  — Feature: online payment gateway
  v1.2.0  — Feature: product reviews + ratings
  v2.0.0  — Major: multi-vendor marketplace
```

### 11.3 Release Notes Template

```markdown
## ShopEase v1.1.0 — Release Notes

**Release Date:** August 2026
**Type:** Minor Release

### ✨ New Features
- Online payment via Razorpay
- Product variant stock tracking
- Admin: bulk product status update

### 🐛 Bug Fixes
- Fixed cart total calculation with percentage coupon
- Fixed mobile menu not closing after navigation
- Fixed product slug collision on rename

### ⚡ Performance
- Improved product listing API response by 40% (added compound index)
- Reduced dashboard bundle size by 22% (code splitting)

### 🔒 Security
- Updated bcryptjs to v3.0 (security patch)
- Added additional rate limiting on auth endpoints

### 📚 Documentation
- Updated API docs for new payment endpoints
- Added Razorpay integration guide
```

---

## 12. Routine Maintenance Schedule

### Daily (Automated)

```
✅ UptimeRobot checks API + Website + Dashboard every 5 min
✅ Database backup runs at 1:00 AM UTC
✅ Sentry monitors for new errors
✅ Railway monitors CPU and memory
```

### Weekly (Manual — Every Monday)

```
[ ] Review UptimeRobot report (check uptime %)
[ ] Review Sentry — any new errors this week?
[ ] Review Railway logs — any warnings?
[ ] Check API response times (key endpoints)
[ ] Review Core Web Vitals in Vercel Analytics
[ ] Check MongoDB Atlas Performance Advisor
[ ] Check low stock alerts in dashboard
[ ] Review any new GitHub issues / bug reports
[ ] Review Dependabot PRs (merge safe updates)
[ ] Check email delivery rate in SendGrid
```

### Monthly (First Monday of month)

```
[ ] Run npm audit in all 3 apps — fix vulnerabilities
[ ] Review and update dependencies (minor/patch)
[ ] Run Lighthouse scores on all key pages
[ ] Review MongoDB Atlas storage usage
[ ] Review Cloudinary storage + bandwidth usage
[ ] Review Railway CPU/memory — scale if needed
[ ] Review error budget (uptime SLA)
[ ] Rotate JWT secrets (every 90 days)
[ ] Review admin user accounts — remove inactive
[ ] Review coupon list — deactivate expired ones
[ ] Test password reset flow end-to-end
[ ] Test order flow end-to-end (place test order)
[ ] Check SSL certificate expiry dates
[ ] Review SendGrid bounce/spam rates
[ ] Document any incidents from the past month
[ ] Update CHANGELOG.md with all changes
[ ] Cost review: Railway + Vercel + Atlas + Cloudinary bills
```

### Quarterly

```
[ ] Full security audit (see Section 6.5)
[ ] Major dependency updates (review changelogs)
[ ] Node.js version upgrade (if new LTS released)
[ ] Review and update documentation
[ ] Performance baseline review + optimization sprint
[ ] Database index analysis and optimization
[ ] Review and archive old orders (> 1 year)
[ ] Review feature roadmap and prioritize next quarter
[ ] Team retrospective and process improvements
```

---

## 13. Scaling Guide

### 13.1 When to Scale

| Metric | Threshold | Action |
|--------|-----------|--------|
| Railway CPU | > 80% consistently | Upgrade Railway plan |
| Railway Memory | > 80% consistently | Upgrade Railway plan |
| API response time | > 500ms average | Optimize queries or scale |
| MongoDB storage | > 80% of tier | Upgrade Atlas tier |
| Cloudinary bandwidth | > 80% of quota | Upgrade Cloudinary plan |
| Concurrent users | > 500 simultaneous | Add Redis caching |

### 13.2 Vertical Scaling (Railway)

```
Railway → Service → Settings → Resources
  Increase: CPU (0.5 → 1 → 2 vCPU)
  Increase: Memory (512MB → 1GB → 2GB)

Cost impact:
  $5/month   → 0.5 vCPU, 512MB RAM
  $10/month  → 1 vCPU, 1GB RAM
  $20/month  → 2 vCPU, 2GB RAM
```

### 13.3 Horizontal Scaling (Future)

```
When vertical scaling is not enough:
  1. Add Redis for session caching + rate limiting store
  2. Add Redis for API response caching (product lists)
  3. Use Railway's horizontal scaling (multiple instances)
  4. Add a load balancer (Railway handles this automatically)
  5. Use MongoDB Atlas M30+ with sharding for very large datasets
```

### 13.4 Redis Caching (Future Implementation)

```js
// Cache frequently-accessed, rarely-changing data:
// - Product listing (cache 60 seconds)
// - Category list (cache 5 minutes)
// - Featured products (cache 5 minutes)
// - Dashboard stats (cache 5 minutes)

// Implementation:
npm install ioredis

// Cache middleware pattern:
const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`
  const cached = await redis.get(key)
  if (cached) return res.json(JSON.parse(cached))
  res.sendResponse = res.json.bind(res)
  res.json = (data) => {
    redis.setex(key, duration, JSON.stringify(data))
    res.sendResponse(data)
  }
  next()
}

// Usage:
router.get('/products', cacheMiddleware(60), getProducts)
router.get('/categories', cacheMiddleware(300), getCategories)
```

### 13.5 MongoDB Atlas Upgrade Path

```
M0  (Free):    512MB storage, shared cluster — Development only
M2  ($9/mo):   2GB storage, shared — Early production
M5  ($25/mo):  5GB storage, shared — Small production
M10 ($57/mo):  10GB storage, dedicated — Production recommended
M20 ($140/mo): 20GB storage, dedicated — Growing business
M30 ($230/mo): 40GB storage, dedicated + auto-scaling
```

---

## 14. Incident Response

### 14.1 Incident Severity Levels

| Level | Impact | Response | Examples |
|-------|--------|----------|---------|
| P0 — Critical | Full outage | Immediate (< 30 min) | API down, DB unreachable |
| P1 — High | Core feature broken | < 2 hours | Checkout broken, login broken |
| P2 — Medium | Non-core broken | < 24 hours | Email not sending, search broken |
| P3 — Low | Minor issue | Next sprint | UI bug, slow page |

### 14.2 Incident Response Steps

```
DETECT:
  [ ] Alert received (UptimeRobot / Sentry / User report)
  [ ] Verify the issue (reproduce manually)
  [ ] Determine severity level

COMMUNICATE:
  [ ] Notify team via WhatsApp/Slack group
  [ ] Update public status page (status.shopease.com)
  [ ] If P0/P1: Post status: "We are aware of the issue and working on a fix"

INVESTIGATE:
  [ ] Check Railway logs (most common source of truth)
  [ ] Check Sentry for error details and stack trace
  [ ] Check MongoDB Atlas status page (mongodbstatus.com)
  [ ] Check Cloudinary status (status.cloudinary.com)
  [ ] Identify root cause

RESOLVE:
  [ ] Apply fix (hotfix procedure if code change needed)
  [ ] Verify fix in production
  [ ] Monitor for 30 minutes after fix

COMMUNICATE (POST-FIX):
  [ ] Update status page: "Issue resolved"
  [ ] Notify affected users (if significant)
  [ ] Post-mortem within 24 hours (for P0/P1)

DOCUMENT:
  [ ] Write incident report (template below)
  [ ] Add to incident log
  [ ] Update runbook with new learnings
```

### 14.3 Incident Report Template

```markdown
## Incident Report — [Date]

**Incident ID:** INC-2026-001
**Severity:** P1 — High
**Status:** Resolved

### Timeline
| Time (IST) | Event |
|------------|-------|
| 14:32 | UptimeRobot alert — API returning 500 errors |
| 14:35 | Team notified via WhatsApp |
| 14:38 | Status page updated: "Investigating issue" |
| 14:45 | Root cause identified: MongoDB connection pool exhausted |
| 15:00 | Fix deployed: increased connection pool size |
| 15:05 | API returning 200 — issue resolved |
| 15:35 | 30-minute monitoring period complete |
| 15:36 | Status page updated: "Resolved" |

### Root Cause
A traffic spike caused MongoDB connection pool (default 100) to be
exhausted. All new requests were queued and timing out after 30 seconds,
returning 500 errors.

### Impact
- Duration: 33 minutes
- Affected: All API endpoints
- Users impacted: ~45 customers attempted checkout during outage

### Resolution
Updated MongoDB connection string:
  maxPoolSize: 100 → 200
  socketTimeoutMS: 30000 → 45000

### Prevention
- Add MongoDB connection pool monitoring alert
- Implement connection pool metrics in health endpoint
- Consider Redis caching to reduce DB load during spikes

### Action Items
[ ] Add connection pool alert in Railway (threshold: > 80% pool usage)
[ ] Add /api/health to include DB connection pool stats
[ ] Schedule Redis caching implementation for v1.1
```

---

## 15. Future Enhancements Roadmap

### v1.1 — Payment & Variants (2 months after launch)

```
[ ] Online payment integration (Razorpay)
    - Payment gateway setup
    - Webhook for payment success/failure
    - Payment status update flow
    - Refund handling

[ ] Product variant stock tracking
    - Stock per variant (not just total)
    - Low stock alert per variant

[ ] Admin: Export to CSV
    - Export orders list
    - Export customers list

[ ] Admin: Invoice PDF
    - Generate PDF invoice for each order
    - Email invoice on order delivery
```

### v1.2 — Reviews & Search (3 months after launch)

```
[ ] Advanced search
    - Elasticsearch or MongoDB Atlas Search
    - Fuzzy matching, typo tolerance
    - Relevance scoring

[ ] Review images
    - Customers can upload photos with reviews

[ ] Review helpfulness voting
    - "Was this helpful?" up/down vote

[ ] Admin: Review moderation
    - Approve / reject reviews before publishing
```

### v1.3 — Marketing (4 months after launch)

```
[ ] Email marketing
    - Abandoned cart reminder email (after 2 hours)
    - Back in stock notification
    - Price drop alert for wishlisted products
    - Weekly newsletter with featured products

[ ] Promotional banners management
    - Admin can create/edit/schedule banners
    - Homepage banners from dashboard

[ ] Flash sale support
    - Time-limited price discount on products
    - Sale countdown timer on product card
```

### v2.0 — Platform Expansion (6+ months)

```
[ ] Multi-vendor marketplace
    - Seller registration and approval
    - Seller dashboard (mini admin)
    - Commission management
    - Seller payouts

[ ] Mobile apps
    - React Native customer app (iOS + Android)
    - Push notifications for orders

[ ] AI features
    - Product recommendations (collaborative filtering)
    - Smart search suggestions
    - Auto-tagging for products

[ ] Loyalty program
    - Points earned on purchases
    - Redeem points for discounts
    - Tier system (Silver/Gold/Platinum)

[ ] Multi-language support
    - English + Hindi + Gujarati
    - i18n with next-intl

[ ] Multi-currency support
    - INR (default), USD, AED
    - Real-time exchange rates
```

---

## Maintenance Contacts

| Role | Responsibility | Contact |
|------|---------------|---------|
| Backend Lead | API, DB, infrastructure issues | backend@shopease.com |
| Frontend Lead | Website, Dashboard issues | frontend@shopease.com |
| DevOps | Deployment, CI/CD, scaling | devops@shopease.com |
| Product Manager | Feature prioritization, roadmap | pm@shopease.com |

### External Support Contacts

| Service | Support URL | Priority Support |
|---------|-------------|-----------------|
| Railway | railway.app/help | Discord community |
| Vercel | vercel.com/support | Support ticket |
| MongoDB Atlas | mongodb.com/support | Atlas dashboard |
| Cloudinary | cloudinary.com/support | Support ticket |
| SendGrid | sendgrid.com/support | Support ticket |
| Sentry | sentry.io/support | In-app support |

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial Maintenance Guide — Final Phase |

---

*Previous Phase → [Phase 8: Deployment Guide](./phase-8-DeploymentGuide.md)*

---

## 🎉 Documentation Complete

All 9 phases of documentation have been completed:

| # | Document | File |
|---|----------|------|
| 1 | Product Requirements Document | phase-1-PRD.md |
| 2 | Technical Requirements Document | phase-2-TRD.md |
| 3 | Application Flow | phase-3-AppFlow.md |
| 4 | UI/UX Brief | phase-4-UIUXBrief.md |
| 5 | Backend Schema | phase-5-Schema.md |
| 6 | API Documentation | phase-6-APIDocs.md |
| 7 | Implementation Plan | phase-7-ImplementationPlan.md |
| 8 | Deployment Guide | phase-8-DeploymentGuide.md |
| 9 | Maintenance Guide | phase-9-MaintenanceGuide.md |

**Next Step → Begin Stage 1: Project Setup (Phase 7 — Implementation Plan)**
