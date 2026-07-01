# UI/UX Brief

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 4 of 9

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity](#2-brand-identity)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout Grid](#5-spacing--layout-grid)
6. [Iconography](#6-iconography)
7. [Component Library](#7-component-library)
8. [Client Website — Page-by-Page UI Brief](#8-client-website--page-by-page-ui-brief)
9. [Admin Dashboard — Page-by-Page UI Brief](#9-admin-dashboard--page-by-page-ui-brief)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Animation & Micro-interactions](#11-animation--micro-interactions)
12. [Accessibility Guidelines](#12-accessibility-guidelines)
13. [Image & Media Guidelines](#13-image--media-guidelines)
14. [Design Tokens (CSS Variables)](#14-design-tokens-css-variables)

---

## 1. Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Clean & Modern** | Ample whitespace, clear hierarchy, no clutter |
| **Mobile First** | Design starts at 375px, scales up |
| **Speed Feels Fast** | Skeleton loaders, instant feedback, optimistic UI |
| **Trust & Safety** | Clear CTAs, secure badge indicators, transparent pricing |
| **Accessible** | WCAG 2.1 AA compliant — usable by everyone |

### Design Mood

- **Website:** Bright, fresh, inviting — makes users want to shop
- **Dashboard:** Professional, data-dense, calm — helps admins focus

---

## 2. Brand Identity

### Brand Name
> **ShopEase** *(placeholder — replace with actual brand name)*

### Brand Voice
- Friendly but professional
- Clear and direct (no jargon)
- Helpful and reassuring during purchase flow

### Logo Usage
```
Primary Logo:    [Icon] + "ShopEase" wordmark  — for Navbar, emails
Icon Only:       Favicon, mobile app icon
Wordmark Only:   Footer, loading screen
```

### Brand Tagline
> *"Everything you need, delivered."*

---

## 3. Color System

### 3.1 Website — Primary Palette

```css
/* Primary — Indigo Blue */
--color-primary-50:  #eef2ff;
--color-primary-100: #e0e7ff;
--color-primary-200: #c7d2fe;
--color-primary-300: #a5b4fc;
--color-primary-400: #818cf8;
--color-primary-500: #6366f1;   /* Main brand color */
--color-primary-600: #4f46e5;   /* Hover state */
--color-primary-700: #4338ca;   /* Active/pressed */
--color-primary-800: #3730a3;
--color-primary-900: #312e81;

/* Accent — Amber (Sale badges, highlights) */
--color-accent-400: #fbbf24;
--color-accent-500: #f59e0b;
--color-accent-600: #d97706;

/* Success — Green */
--color-success-100: #dcfce7;
--color-success-500: #22c55e;
--color-success-700: #15803d;

/* Error — Red */
--color-error-100: #fee2e2;
--color-error-500: #ef4444;
--color-error-700: #b91c1c;

/* Warning — Orange */
--color-warning-100: #ffedd5;
--color-warning-500: #f97316;

/* Neutral — Gray scale */
--color-gray-50:  #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;

/* Base */
--color-white: #ffffff;
--color-black: #000000;
--color-background: #f9fafb;  /* Page background */
--color-surface: #ffffff;      /* Cards, modals */
```

### 3.2 Dashboard — Dark Professional Palette

```css
/* Dashboard background — Deep Dark Blue */
--dash-bg:         #0f172a;   /* Main background */
--dash-surface:    #1e293b;   /* Cards, sidebar */
--dash-surface-2:  #334155;   /* Hover, elevated cards */
--dash-border:     #475569;   /* Borders, dividers */

/* Dashboard Primary — Blue */
--dash-primary:    #3b82f6;   /* Main action color */
--dash-primary-h:  #2563eb;   /* Hover */

/* Dashboard text */
--dash-text:       #f1f5f9;   /* Primary text */
--dash-text-muted: #94a3b8;   /* Secondary text */
--dash-text-dim:   #64748b;   /* Disabled, placeholder */

/* Status Colors */
--dash-success:    #10b981;
--dash-warning:    #f59e0b;
--dash-error:      #ef4444;
--dash-info:       #06b6d4;
```

### 3.3 Semantic Color Usage

| Use Case | Token |
|----------|-------|
| Primary CTA buttons | `--color-primary-500` |
| Hover on CTA | `--color-primary-600` |
| Destructive actions | `--color-error-500` |
| Success toasts/badges | `--color-success-500` |
| Sale / discount badge | `--color-accent-500` |
| Star ratings | `#facc15` (yellow-400) |
| "In Stock" label | `--color-success-500` |
| "Out of Stock" label | `--color-error-500` |
| "Low Stock" label | `--color-warning-500` |
| Order: Pending | `--color-warning-500` |
| Order: Processing | `--color-primary-500` |
| Order: Shipped | `--color-info` |
| Order: Delivered | `--color-success-500` |
| Order: Cancelled | `--color-error-500` |

---

## 4. Typography

### 4.1 Font Families

```css
/* Heading Font */
--font-heading: 'Plus Jakarta Sans', sans-serif;

/* Body Font */
--font-body: 'Inter', sans-serif;

/* Monospace (for codes, SKUs, order numbers) */
--font-mono: 'JetBrains Mono', monospace;
```

> Import from Google Fonts: `Plus Jakarta Sans` (600, 700, 800) + `Inter` (400, 500, 600)

### 4.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 12px | 400 | 1.4 | Labels, captions |
| `--text-sm` | 14px | 400 | 1.5 | Body small, helpers |
| `--text-base` | 16px | 400 | 1.6 | Body text |
| `--text-lg` | 18px | 500 | 1.5 | Subheadings |
| `--text-xl` | 20px | 600 | 1.4 | Section titles |
| `--text-2xl` | 24px | 700 | 1.3 | Page headings |
| `--text-3xl` | 30px | 700 | 1.2 | Hero subheadings |
| `--text-4xl` | 36px | 800 | 1.1 | Hero headings |
| `--text-5xl` | 48px | 800 | 1.0 | Large hero (desktop) |

### 4.3 Typography Rules

- **Headings:** Plus Jakarta Sans, Bold/ExtraBold
- **Body:** Inter, Regular/Medium
- **Prices:** Inter, Bold, slightly larger than surrounding text
- **Discounts:** Strikethrough + red color for original price
- **Order numbers:** JetBrains Mono for readability

---

## 5. Spacing & Layout Grid

### 5.1 Spacing Scale (4px base)

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### 5.2 Website Layout Grid

```
Desktop (≥1280px):   12-column grid, max-width: 1280px, gap: 24px
Laptop (≥1024px):    12-column grid, max-width: 1024px, gap: 20px
Tablet (≥768px):     8-column grid, gap: 16px
Mobile (<768px):     4-column grid, gap: 12px
```

### 5.3 Container

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;       /* desktop */
  /* padding: 0 16px; */ /* mobile */
}
```

### 5.4 Dashboard Layout

```
Sidebar:      240px fixed width (collapsible to 64px)
Main Content: flex-1, padding: 24px
Header:       64px height, full width minus sidebar
```

---

## 6. Iconography

### Icon Library: Lucide React

- **Style:** Outline (default), Filled for active states
- **Sizes:** 16px (inline), 20px (buttons), 24px (standalone), 32px (feature icons)
- **Color:** Inherits from parent or uses semantic color tokens

### Common Icon Mappings

| Action / Concept | Lucide Icon |
|-----------------|-------------|
| Cart | `ShoppingCart` |
| Wishlist (empty) | `Heart` |
| Wishlist (filled) | `HeartFill` |
| Search | `Search` |
| User / Profile | `User` |
| Menu (mobile) | `Menu` |
| Close | `X` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Add | `Plus` |
| Settings | `Settings` |
| Orders | `Package` |
| Dashboard | `LayoutDashboard` |
| Analytics | `BarChart2` |
| Customers | `Users` |
| Categories | `Grid3x3` |
| Coupons | `Tag` |
| Upload | `Upload` |
| Download | `Download` |
| Eye (view) | `Eye` |
| Star (rating) | `Star` |
| Truck (shipping) | `Truck` |
| Check | `CheckCircle2` |
| Alert | `AlertCircle` |
| Info | `Info` |
| Arrow back | `ArrowLeft` |
| Chevron | `ChevronRight` |
| Filter | `SlidersHorizontal` |
| Sort | `ArrowUpDown` |

---

## 7. Component Library

### 7.1 Buttons

```
Variants:
  Primary   — filled indigo, white text
  Secondary — white bg, indigo border + text
  Danger    — filled red
  Ghost     — transparent bg, text only
  Link      — underline style

Sizes:
  sm  — h-8,  px-3, text-sm
  md  — h-10, px-4, text-base  (default)
  lg  — h-12, px-6, text-lg

States:
  Default | Hover (darker shade) | Active (pressed)
  Loading (spinner inside, disabled) | Disabled (opacity-50)

Rules:
  - Always have min-width to prevent layout shift on loading state
  - Icon buttons: square, same height variants
  - Full-width on mobile checkout forms
```

### 7.2 Input Fields

```
Structure:
  Label (above)
  Input field
  Helper text OR Error message (below)

Variants:
  Default — gray border
  Focus   — indigo border + ring
  Error   — red border + red helper text
  Disabled — gray bg, not-allowed cursor

Types handled:
  text | email | password | number | search | textarea | select
```

### 7.3 Cards

```
Product Card (Website):
  ┌────────────────────┐
  │  [Product Image]   │  → aspect-ratio: 1/1, object-cover
  │  [Wishlist icon]   │  → top-right overlay on hover
  ├────────────────────┤
  │  Category (small)  │
  │  Product Name      │  → 2-line clamp
  │  ★★★★☆ (4.2) 128  │
  │  ₹1,299  ₹1,999   │  → price + strikethrough original
  │  [Add to Cart btn] │
  └────────────────────┘

  Hover effect: card lifts (translateY -4px + shadow deepens)

Dashboard Stat Card:
  ┌─────────────────────────┐
  │  Icon (colored bg)      │
  │  Label                  │
  │  Value (large bold)     │
  │  ↑ 12% vs last month    │  → trend indicator
  └─────────────────────────┘
```

### 7.4 Badges & Tags

```
Order Status Badges:
  Pending     — amber bg, amber text
  Processing  — blue bg, blue text
  Shipped     — cyan bg, cyan text
  Delivered   — green bg, green text
  Cancelled   — red bg, red text

Product Badges:
  NEW         — indigo bg
  SALE        — red bg (e.g., "-30%")
  OUT OF STOCK — gray bg
  FEATURED    — gold border

All badges: rounded-full, px-2, py-0.5, text-xs, font-semibold
```

### 7.5 Modals & Dialogs

```
Backdrop: black/50 overlay, blurred
Modal Panel: white, rounded-xl, shadow-2xl
  Max-width: 480px (sm), 640px (md), 768px (lg)
  Animation: scale 0.95 → 1 + fade in (150ms ease-out)
  
Confirm Dialog: smaller variant (max-w-sm)
  Title | Description | Cancel + Confirm buttons
```

### 7.6 Toast Notifications

```
Position: top-right (desktop), top-center (mobile)
Auto-dismiss: 4 seconds
Types: success (green) | error (red) | warning (amber) | info (blue)
Animation: slide-in from right + fade out

Structure:
  [Icon] [Message]   [X close]
```

### 7.7 Tables (Dashboard)

```
Header:   gray-50 bg, uppercase, text-xs, letter-spacing
Rows:     white bg, hover: gray-50
Borders:  bottom border only (gray-200)
Actions:  icon buttons on each row (edit, delete, view)

Mobile:   horizontal scroll on small screens
Sorting:  clickable column headers with sort icon
Pagination: bottom of table, "Previous | 1 2 3 | Next"
```

### 7.8 Skeleton Loaders

```
Product Card Skeleton:
  - Gray animated pulse box (image area)
  - 3 gray lines (name + price + button)

Table Skeleton:
  - Header row normal
  - 5 rows of gray animated lines

Dashboard Card Skeleton:
  - Gray box (icon area)
  - Two gray lines (label + value)

Animation: CSS keyframe pulse (opacity 0.5 → 1 → 0.5, 1.5s infinite)
```

### 7.9 Pagination

```
Style: numbered buttons
  ← Prev  |  1  2  [3]  4  5  ...  12  |  Next →

Active page: filled indigo button
Hover: light indigo bg
Disabled: gray, not-allowed cursor
```

### 7.10 Star Rating Component

```
Display mode: 5 stars, partial fill supported (e.g., 4.3 stars)
Input mode: clickable stars (hover highlights up to cursor)
Color: #facc15 (yellow-400) filled, gray-300 empty
Sizes: sm (12px) | md (16px) | lg (20px)
```

---

## 8. Client Website — Page-by-Page UI Brief

### 8.1 Navbar

```
Desktop Layout:
┌──────────────────────────────────────────────────────────┐
│  [Logo]   [Categories ▾]  [Search Bar ──────]  [♡] [🛒 3] [Account ▾]│
└──────────────────────────────────────────────────────────┘

Mobile Layout (< 768px):
┌────────────────────────────────┐
│  [≡]  [Logo]   [🔍] [🛒 3]    │
└────────────────────────────────┘
[Mobile Drawer slides in from left]

Sticky on scroll, adds drop shadow after 50px scroll.
Category dropdown: mega-menu with category grid + featured image.
Cart icon shows badge count (red pill).
Account menu: Login / Register (guest) or Profile / Orders / Logout (user).
```

### 8.2 Home Page

```
Section 1 — Hero Banner
  Full-width slider (Swiper.js), 3–5 slides
  Each slide: background image + overlay + heading + subtext + CTA button
  Autoplay: 4s, fade transition

Section 2 — Category Showcase
  Horizontal scrollable cards on mobile
  Grid 6 cols on desktop
  Each card: circular image + category name below

Section 3 — Featured Products
  Heading: "Featured Products"
  Grid: 4 cols (desktop), 2 cols (mobile)
  Product Cards (see 7.3)
  "View All" button → /products

Section 4 — Promotional Banner
  Full-width split layout: left (text + CTA), right (product image)
  Eye-catching background gradient

Section 5 — Newsletter
  Full-width section, indigo gradient bg
  Email input + Subscribe button (inline)
  "Join 10,000+ happy customers" social proof
```

### 8.3 Product Listing Page

```
Layout:
┌──────────┬───────────────────────────────────────┐
│ FILTERS  │ [Sort ▾]  Showing 48 of 200 products  │
│ (240px)  │                                        │
│ Category │  ┌──┐ ┌──┐ ┌──┐ ┌──┐                 │
│ Price    │  │  │ │  │ │  │ │  │  Product Grid     │
│ Brand    │  └──┘ └──┘ └──┘ └──┘                 │
│ Rating   │                                        │
│ Stock    │           Pagination                   │
└──────────┴───────────────────────────────────────┘

Mobile: Filters behind slide-in drawer (filter icon top-right)
Active filters shown as dismissible chips below search bar
Grid: 4 cols desktop → 3 cols laptop → 2 cols tablet → 2 cols mobile
```

### 8.4 Product Detail Page

```
Layout (Desktop):
┌─────────────────┬──────────────────────────────┐
│  Image Gallery  │  Product Name                │
│                 │  Brand | Category            │
│  [Main Image]   │  ★★★★☆ 4.2 (128 reviews)    │
│                 │  ₹1,299  ~~₹1,999~~  35% OFF │
│  [thumbnails]   │  ─────────────────────────── │
│                 │  Variants (Size/Color pills)  │
└─────────────────│  Quantity: [−] 1 [+]          │
                  │  [Add to Cart]  [♡ Wishlist]  │
                  │  ─────────────────────────────│
                  │  ✓ Free delivery over ₹499    │
                  │  ✓ 7-day easy returns         │
                  └──────────────────────────────┘

Below fold:
  Tabs: Description | Specifications | Reviews (128)
  Related Products grid
```

### 8.5 Cart Page

```
Layout (Desktop):
┌────────────────────────────────┬──────────────┐
│  Cart Items (left, 65%)        │  Order       │
│  ┌────────────────────────────┐│  Summary     │
│  │[img] Name       Qty  Price ││  (right,35%) │
│  │      Variant    [-][1][+]  ││              │
│  │      [Remove]    ₹1,299   ││  Subtotal    │
│  └────────────────────────────┘│  Discount    │
│  [Apply Coupon code ──] [Apply]│  Shipping    │
│                                │  ──────────  │
│                                │  Total       │
│                                │  [Checkout]  │
└────────────────────────────────┴──────────────┘

Mobile: stacked layout (summary at bottom)
```

### 8.6 Checkout Page

```
Multi-step layout (3 steps):

Step indicator:  [1 Address] ──── [2 Review] ──── [3 Payment]

Step 1 - Shipping Address:
  Saved addresses as selectable cards
  "Add New Address" expandable form
  [Continue →]

Step 2 - Order Review:
  Items list (read-only)
  Price breakdown
  [← Back]  [Continue →]

Step 3 - Payment:
  Method: ◉ Cash on Delivery   ○ Online (coming soon)
  Terms checkbox
  [← Back]  [Place Order] ← large indigo button
```

### 8.7 Profile Pages

```
Sidebar navigation (desktop), tabs (mobile):
  ├── My Profile (avatar + edit form)
  ├── My Orders (table with status badges)
  ├── Wishlist (product grid)
  └── My Addresses (address cards with edit/delete/default)
```

---

## 9. Admin Dashboard — Page-by-Page UI Brief

### 9.1 Dashboard Layout Shell

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: [≡ collapse] [ShopEase Admin] ......[👤 Admin ▾]│
├────────┬─────────────────────────────────────────────────┤
│        │                                                 │
│ SIDE   │           MAIN CONTENT AREA                    │
│ BAR    │                                                 │
│ 240px  │  Breadcrumb: Dashboard > Products > Add         │
│        │  ─────────────────────────────────────────────  │
│ [icon] Dashboard                                        │
│ [icon] Products                                         │
│ [icon] Orders                                           │
│ [icon] Customers                                        │
│ [icon] Categories                                       │
│ [icon] Coupons                                          │
│ [icon] Analytics                                        │
│ [icon] Settings                                         │
│        │                                                 │
└────────┴─────────────────────────────────────────────────┘

Sidebar: dark (--dash-surface), collapses to icon-only mode
Active item: indigo left border + indigo tinted bg
Header: slightly lighter dark bg, has notification bell
```

### 9.2 Dashboard Overview Page

```
Row 1 — Stat Cards (4 cols):
  [Total Revenue]  [Total Orders]  [Total Products]  [Total Customers]
  Each: icon (colored circle) + value + trend arrow

Row 2 — Charts (2 cols):
  Left (70%):  Revenue Line Chart (12 months)
  Right (30%): Orders by Status Donut Chart

Row 3 — Tables (2 cols):
  Left (60%):  Recent Orders table (last 10)
  Right (40%): Top Products list (top 5 with mini bar)

Row 4 — Alerts:
  Low Stock Products list (stock < 10)
```

### 9.3 Add/Edit Product Page

```
Two-column form layout:

Left Column (65%) — Main Info:
  Product Name *
  Slug (auto-generated, editable)
  Short Description
  Full Description (rich text)
  Category * (dropdown)
  Brand, SKU
  Tags (multi-tag input)
  Specifications (dynamic key-value rows)

Right Column (35%) — Media & Settings:
  Image Upload Box (drag & drop, 6 max)
    → shows preview grid after upload
  Price *
  Original Price
  Discount % (auto-calculated)
  Stock *
  Variants (add variant group: e.g., Size → S,M,L,XL)
  Toggle: Active / Inactive
  Toggle: Featured

Bottom: [Cancel]  [Save Draft]  [Publish Product]
```

---

## 10. Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
xs:   < 480px    (small phones)
sm:   ≥ 640px    (large phones)
md:   ≥ 768px    (tablets)
lg:   ≥ 1024px   (laptops)
xl:   ≥ 1280px   (desktops)
2xl:  ≥ 1536px   (large screens)
```

### Responsive Behavior

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Product grid | 2 cols | 3 cols | 4 cols |
| Navbar | hamburger | hamburger | full |
| Cart layout | stacked | stacked | 2-col |
| Checkout steps | vertical | vertical | horizontal |
| Dashboard sidebar | hidden (drawer) | icon-only | full |
| Dashboard stat cards | 2×2 grid | 2×2 grid | 1×4 row |
| Filters (website) | drawer | sidebar | sidebar |

---

## 11. Animation & Micro-interactions

### Principles
- Duration: 150ms (instant feedback) to 300ms (transitions)
- Easing: `ease-out` for appearing, `ease-in` for disappearing
- Never animate layout-affecting properties (width, height) — use transform/opacity only

### Animation Catalog

| Element | Animation |
|---------|-----------|
| Page transition | fade-in (opacity 0→1, 200ms) |
| Product card hover | translateY(-4px) + shadow, 200ms ease-out |
| Button hover | background darken + scale(1.02), 150ms |
| Button click | scale(0.97), 100ms |
| Modal open | scale(0.95→1) + opacity(0→1), 150ms ease-out |
| Modal close | opacity(1→0), 100ms ease-in |
| Toast appear | translateX(100%→0) + opacity, 300ms ease-out |
| Toast dismiss | opacity(1→0) + translateY(-8px), 200ms |
| Dropdown open | translateY(-8px→0) + opacity, 150ms |
| Skeleton loader | pulse keyframe (opacity 0.5↔1, 1.5s infinite) |
| Sidebar collapse | width 240px→64px, 250ms ease-in-out |
| Cart badge update | scale(1→1.3→1) bounce, 300ms |
| Star rating hover | fill color sweeps left→right |
| Wishlist toggle | heart scale(1→1.4→1) + color change |
| Image gallery switch | fade cross-dissolve, 200ms |
| Checkout step change | slide left/right, 250ms ease-out |
| Success checkmark | draw SVG stroke animation, 400ms |

### CSS Keyframes

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

@keyframes bounceScale {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.35); }
  100% { transform: scale(1); }
}
```

---

## 12. Accessibility Guidelines

### WCAG 2.1 AA Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Focus visible | Custom focus ring: 2px indigo outline, 2px offset |
| Keyboard nav | All interactive elements reachable via Tab key |
| Screen reader | `aria-label` on icon buttons, `alt` on images |
| Form errors | `aria-describedby` linking input to error message |
| Loading states | `aria-busy="true"` + `aria-label="Loading..."` |
| Modals | Focus trap inside modal, `role="dialog"`, `aria-modal` |
| Skip links | "Skip to main content" at top of page |

### Interactive Element Rules

```
Buttons:      min 44×44px touch target
Links:        descriptive text (no "click here")
Images:       alt="" for decorative, meaningful alt for content images
Videos:       captions (future)
Forms:        every input has associated <label>
```

---

## 13. Image & Media Guidelines

### Product Images

| Usage | Dimensions | Format | Max Size |
|-------|-----------|--------|----------|
| Product thumbnail | 400×400px | WebP | 80KB |
| Product detail | 800×800px | WebP | 200KB |
| Cart / order item | 80×80px | WebP | 20KB |
| Hero banner | 1440×560px | WebP | 300KB |
| Category card | 600×400px | WebP | 150KB |
| User avatar | 150×150px | WebP | 30KB |

### Image Rules
- All product images: **square aspect ratio (1:1)**
- Always include `alt` text with product name
- Use `next/image` for automatic optimization in website
- Cloudinary transformations handle format conversion

### Placeholder Images
- While loading: gray skeleton (no broken image icon)
- If image fails: product icon on gray background
- Default avatar: initials on colored circle (e.g., "BK" on indigo)

---

## 14. Design Tokens (CSS Variables)

```css
/* === WEBSITE tokens (globals.css) === */

:root {
  /* Colors */
  --color-primary:      #6366f1;
  --color-primary-dark: #4f46e5;
  --color-accent:       #f59e0b;
  --color-success:      #22c55e;
  --color-error:        #ef4444;
  --color-warning:      #f97316;
  --color-bg:           #f9fafb;
  --color-surface:      #ffffff;
  --color-border:       #e5e7eb;
  --color-text:         #111827;
  --color-text-muted:   #6b7280;

  /* Typography */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;
  --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.10);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.10);
  --shadow-card: 0 2px 8px rgba(99,102,241,0.08);

  /* Transitions */
  --transition-fast:   all 150ms ease-out;
  --transition-base:   all 200ms ease-out;
  --transition-slow:   all 300ms ease-out;

  /* Z-index scale */
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-modal:     300;
  --z-toast:     400;
  --z-tooltip:   500;
}

/* === DASHBOARD tokens === */
.dashboard {
  --dash-bg:           #0f172a;
  --dash-surface:      #1e293b;
  --dash-surface-2:    #334155;
  --dash-border:       #475569;
  --dash-primary:      #3b82f6;
  --dash-text:         #f1f5f9;
  --dash-text-muted:   #94a3b8;
}
```

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial UI/UX Brief created |

---

*Previous Phase → [Phase 3: Application Flow](./phase-3-AppFlow.md)*  
*Next Phase → [Phase 5: Backend Schema](./phase-5-Schema.md)*
