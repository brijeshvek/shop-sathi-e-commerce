# API Documentation

**Project:** Production-Ready E-Commerce Platform  
**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026  
**Phase:** 6 of 9

---

## Table of Contents

1. [API Overview](#1-api-overview)
2. [Authentication](#2-authentication)
3. [Auth Endpoints](#3-auth-endpoints)
4. [User Endpoints](#4-user-endpoints)
5. [Product Endpoints](#5-product-endpoints)
6. [Category Endpoints](#6-category-endpoints)
7. [Cart Endpoints](#7-cart-endpoints)
8. [Wishlist Endpoints](#8-wishlist-endpoints)
9. [Order Endpoints](#9-order-endpoints)
10. [Review Endpoints](#10-review-endpoints)
11. [Coupon Endpoints](#11-coupon-endpoints)
12. [Upload Endpoints](#12-upload-endpoints)
13. [Analytics Endpoints](#13-analytics-endpoints)
14. [Error Reference](#14-error-reference)
15. [Postman Collection](#15-postman-collection)

---

## 1. API Overview

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.shopease.com/api
```

### Request Headers
```
Content-Type:  application/json
Cookie:        accessToken=<JWT>   (auto-sent by browser)
```

### Standard Response Envelope

**Success:**
```json
{
  "success": true,
  "message": "Description of result",
  "data": { },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 98,
    "itemsPerPage": 10
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

### Access Levels

| Symbol | Meaning |
|--------|---------|
| 🌐 | Public — no auth required |
| 🔒 | Customer — must be logged in |
| 🛡️ | Admin — must have admin/superadmin role |
| 👑 | Super Admin only |

---

## 2. Authentication

All protected routes require a valid JWT `accessToken` sent as an HTTP-only cookie.

### Cookie Names
| Cookie | Expiry | Purpose |
|--------|--------|---------|
| `accessToken` | 15 minutes | API authorization |
| `refreshToken` | 7 days | Get new access token |

### Token Refresh
If an `accessToken` expires, the middleware automatically uses `refreshToken` to issue a new one. If `refreshToken` is also invalid/expired, the user must re-login.

---

## 3. Auth Endpoints

### POST `/auth/register` 🌐
Register a new customer account.

**Request Body:**
```json
{
  "name": "Brijesh Kumar",
  "email": "brijesh@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `name` | Required, 2–50 chars |
| `email` | Required, valid email format |
| `password` | Required, min 8 chars, must contain uppercase + number |
| `confirmPassword` | Must match `password` |

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Brijesh Kumar",
    "email": "brijesh@example.com",
    "role": "customer",
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```
*Sets `accessToken` + `refreshToken` HTTP-only cookies.*

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | Validation errors |
| 409 | Email already registered |

---

### POST `/auth/login` 🌐
Login with email and password.

**Request Body:**
```json
{
  "email": "brijesh@example.com",
  "password": "Password@123"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Brijesh Kumar",
    "email": "brijesh@example.com",
    "role": "customer",
    "avatar": { "url": "", "publicId": "" }
  }
}
```
*Sets `accessToken` + `refreshToken` HTTP-only cookies.*

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | Invalid credentials |
| 403 | Account is blocked |

---

### POST `/auth/logout` 🔒
Logout and clear auth cookies.

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
*Clears `accessToken` + `refreshToken` cookies.*

---

### GET `/auth/me` 🔒
Get currently logged-in user profile.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Brijesh Kumar",
    "email": "brijesh@example.com",
    "phone": "9876543210",
    "role": "customer",
    "avatar": { "url": "https://res.cloudinary.com/...", "publicId": "ecommerce/avatars/abc" },
    "addresses": [ ],
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```

---

### POST `/auth/forgot-password` 🌐
Send password reset email.

**Request Body:**
```json
{ "email": "brijesh@example.com" }
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "If this email is registered, a reset link has been sent."
}
```
*Always returns 200 (security: does not reveal if email exists).*

---

### POST `/auth/reset-password` 🌐
Reset password using token from email link.

**Request Body:**
```json
{
  "token": "a3f7b2c1d4e5...",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Password reset successful. Please login."
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | Token is invalid or has expired |
| 400 | Passwords do not match |

---

### POST `/auth/refresh-token` 🌐
Get a new access token using refresh token cookie.

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Token refreshed"
}
```
*Sets new `accessToken` cookie.*

---

## 4. User Endpoints

### GET `/users` 🛡️
Get all users (admin only). Supports pagination + filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 20) |
| `role` | String | Filter: customer / admin |
| `isBlocked` | Boolean | Filter by block status |
| `search` | String | Search by name or email |

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Brijesh Kumar",
      "email": "brijesh@example.com",
      "phone": "9876543210",
      "role": "customer",
      "isBlocked": false,
      "createdAt": "2026-07-01T04:30:00.000Z"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalItems": 98, "itemsPerPage": 20 }
}
```

---

### GET `/users/:id` 🔒
Get a single user. Customers can only get their own profile. Admins can get any.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "name": "Brijesh Kumar",
    "email": "brijesh@example.com",
    "phone": "9876543210",
    "avatar": { "url": "...", "publicId": "..." },
    "addresses": [
      {
        "_id": "65a2...",
        "label": "Home",
        "fullName": "Brijesh Kumar",
        "phone": "9876543210",
        "street": "123 Main St",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "pincode": "380001",
        "country": "India",
        "isDefault": true
      }
    ],
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```

---

### PUT `/users/:id` 🔒
Update user profile. Customers update own profile only.

**Request Body:**
```json
{
  "name": "Brijesh K.",
  "phone": "9876543210"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { "_id": "...", "name": "Brijesh K.", ... }
}
```

---

### PUT `/users/:id/password` 🔒
Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@456",
  "confirmPassword": "NewPassword@456"
}
```

**Success Response — 200:**
```json
{ "success": true, "message": "Password changed successfully" }
```

---

### PUT `/users/:id/block` 🛡️
Block or unblock a customer account.

**Request Body:**
```json
{ "isBlocked": true }
```

**Success Response — 200:**
```json
{ "success": true, "message": "User has been blocked" }
```

---

### POST `/users/:id/addresses` 🔒
Add a new address.

**Request Body:**
```json
{
  "label": "Home",
  "fullName": "Brijesh Kumar",
  "phone": "9876543210",
  "street": "123 Main Street",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "380001",
  "isDefault": true
}
```

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": { "_id": "...", "label": "Home", ... }
}
```

---

### PUT `/users/:id/addresses/:addressId` 🔒
Update an existing address.

**Request Body:** *(same as POST, all fields optional)*

**Success Response — 200:**
```json
{ "success": true, "message": "Address updated successfully" }
```

---

### DELETE `/users/:id/addresses/:addressId` 🔒
Delete an address.

**Success Response — 200:**
```json
{ "success": true, "message": "Address deleted successfully" }
```

---

### PATCH `/users/:id/addresses/:addressId/default` 🔒
Set an address as default.

**Success Response — 200:**
```json
{ "success": true, "message": "Default address updated" }
```

---

## 5. Product Endpoints

### GET `/products` 🌐
Get all active products with filters, sorting, and pagination.

**Query Parameters:**
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `page` | Number | `1` | Page number |
| `limit` | Number | `12` | Items per page |
| `search` | String | `phone` | Full-text search |
| `category` | String | `64f1...` | Category ObjectId |
| `minPrice` | Number | `500` | Minimum price |
| `maxPrice` | Number | `5000` | Maximum price |
| `brand` | String | `Samsung` | Filter by brand |
| `minRating` | Number | `4` | Minimum average rating |
| `inStock` | Boolean | `true` | Only in-stock items |
| `isFeatured` | Boolean | `true` | Only featured items |
| `sort` | String | `price` | Sort field |
| `order` | String | `asc` | `asc` or `desc` |
| `tags` | String | `wireless` | Filter by tag |

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2...",
      "name": "Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "price": 1299,
      "originalPrice": 1999,
      "discount": 35,
      "category": { "_id": "...", "name": "Electronics", "slug": "electronics" },
      "brand": "SoundMax",
      "images": [{ "url": "https://res.cloudinary.com/...", "isMain": true }],
      "stock": 50,
      "stockStatus": "in_stock",
      "ratings": { "average": 4.3, "count": 128 },
      "isFeatured": true,
      "createdAt": "2026-07-01T04:30:00.000Z"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 8, "totalItems": 96, "itemsPerPage": 12 }
}
```

---

### GET `/products/:slug` 🌐
Get a single product by slug.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2...",
    "name": "Wireless Bluetooth Headphones",
    "slug": "wireless-bluetooth-headphones",
    "description": "<p>Full product description...</p>",
    "shortDescription": "Premium sound with 30hr battery life.",
    "price": 1299,
    "originalPrice": 1999,
    "discount": 35,
    "category": { "_id": "...", "name": "Electronics", "slug": "electronics" },
    "brand": "SoundMax",
    "sku": "SMAX-BT-001",
    "images": [
      { "_id": "...", "url": "https://...", "publicId": "ecommerce/products/abc", "isMain": true },
      { "_id": "...", "url": "https://...", "publicId": "ecommerce/products/def", "isMain": false }
    ],
    "variants": [
      { "name": "Color", "options": ["Black", "White", "Navy"] }
    ],
    "specifications": [
      { "key": "Driver Size", "value": "40mm" },
      { "key": "Battery", "value": "30 hours" },
      { "key": "Connectivity", "value": "Bluetooth 5.0" }
    ],
    "tags": ["wireless", "headphones", "bluetooth"],
    "stock": 50,
    "stockStatus": "in_stock",
    "ratings": { "average": 4.3, "count": 128 },
    "isFeatured": true,
    "isActive": true,
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 404 | Product not found |

---

### POST `/products` 🛡️
Create a new product.

**Request Body:**
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "<p>Full description...</p>",
  "shortDescription": "Premium sound with 30hr battery.",
  "price": 1299,
  "originalPrice": 1999,
  "category": "64f1a2b3c4d5e6f7a8b9c0d1",
  "brand": "SoundMax",
  "sku": "SMAX-BT-001",
  "stock": 50,
  "isFeatured": true,
  "tags": ["wireless", "headphones"],
  "variants": [
    { "name": "Color", "options": ["Black", "White"] }
  ],
  "specifications": [
    { "key": "Battery", "value": "30 hours" }
  ],
  "images": [
    { "url": "https://res.cloudinary.com/...", "publicId": "ecommerce/products/abc", "isMain": true }
  ]
}
```

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "_id": "...", "name": "Wireless Bluetooth Headphones", "slug": "wireless-bluetooth-headphones", ... }
}
```

---

### PUT `/products/:id` 🛡️
Update a product. Send only fields to update.

**Request Body:** *(any product fields, all optional)*

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

---

### DELETE `/products/:id` 🛡️
Soft-delete a product (sets `isActive: false`).

**Success Response — 200:**
```json
{ "success": true, "message": "Product deleted successfully" }
```

---

### PATCH `/products/:id/status` 🛡️
Toggle product active/inactive status.

**Request Body:**
```json
{ "isActive": false }
```

**Success Response — 200:**
```json
{ "success": true, "message": "Product status updated" }
```

---

### GET `/products/featured` 🌐
Get featured products for home page (max 8).

**Success Response — 200:**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 6. Category Endpoints

### GET `/categories` 🌐
Get all active categories (with sub-categories nested).

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Electronics",
      "slug": "electronics",
      "description": "All electronic items",
      "image": { "url": "https://...", "publicId": "..." },
      "parent": null,
      "children": [
        { "_id": "65a2...", "name": "Mobiles", "slug": "mobiles", "parent": "64f1..." },
        { "_id": "65a3...", "name": "Laptops", "slug": "laptops", "parent": "64f1..." }
      ]
    }
  ]
}
```

---

### GET `/categories/:slug` 🌐
Get single category by slug.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "name": "Electronics",
    "slug": "electronics",
    "description": "...",
    "image": { "url": "...", "publicId": "..." },
    "parent": null,
    "isActive": true
  }
}
```

---

### POST `/categories` 🛡️
Create a new category.

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "All electronic gadgets",
  "image": { "url": "https://...", "publicId": "ecommerce/categories/abc" },
  "parent": null
}
```

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "_id": "...", "name": "Electronics", "slug": "electronics", ... }
}
```

---

### PUT `/categories/:id` 🛡️
Update a category.

**Success Response — 200:**
```json
{ "success": true, "message": "Category updated successfully", "data": { ... } }
```

---

### DELETE `/categories/:id` 🛡️
Delete a category (only if no products are assigned).

**Success Response — 200:**
```json
{ "success": true, "message": "Category deleted successfully" }
```

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | Cannot delete: category has products assigned |

---

## 7. Cart Endpoints

### GET `/cart` 🔒
Get the current user's cart.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "user": "64f0...",
    "items": [
      {
        "_id": "65a1...",
        "product": { "_id": "...", "name": "Headphones", "slug": "...", "stock": 50, "isActive": true },
        "name": "Wireless Bluetooth Headphones",
        "image": "https://...",
        "price": 1299,
        "quantity": 2,
        "selectedVariants": { "color": "Black" }
      }
    ],
    "coupon": null,
    "discountAmount": 0,
    "itemCount": 2,
    "subtotal": 2598
  }
}
```

---

### POST `/cart/add` 🔒
Add a product to cart (or increase quantity if already exists).

**Request Body:**
```json
{
  "productId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "quantity": 1,
  "selectedVariants": { "color": "Black" }
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { "itemCount": 3, "subtotal": 3897 }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 404 | Product not found |
| 400 | Product is out of stock |
| 400 | Requested quantity exceeds available stock |

---

### PUT `/cart/update` 🔒
Update item quantity in cart.

**Request Body:**
```json
{
  "cartItemId": "65a1...",
  "quantity": 3
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": { "itemCount": 3, "subtotal": 3897 }
}
```

---

### DELETE `/cart/remove/:cartItemId` 🔒
Remove a specific item from cart.

**Success Response — 200:**
```json
{ "success": true, "message": "Item removed from cart", "data": { "itemCount": 1, "subtotal": 1299 } }
```

---

### DELETE `/cart/clear` 🔒
Clear all items from cart.

**Success Response — 200:**
```json
{ "success": true, "message": "Cart cleared" }
```

---

### POST `/cart/merge` 🔒
Merge guest cart (localStorage) with server cart on login.

**Request Body:**
```json
{
  "guestCart": [
    { "productId": "64f1...", "quantity": 2, "selectedVariants": { "color": "Black" } }
  ]
}
```

**Success Response — 200:**
```json
{ "success": true, "message": "Cart merged successfully", "data": { "itemCount": 3, "subtotal": 3897 } }
```

---

## 8. Wishlist Endpoints

### GET `/wishlist` 🔒
Get the current user's wishlist with product details.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "user": "64f0...",
    "products": [
      {
        "_id": "65a1...",
        "name": "Wireless Headphones",
        "slug": "wireless-headphones",
        "price": 1299,
        "originalPrice": 1999,
        "discount": 35,
        "images": [{ "url": "https://...", "isMain": true }],
        "ratings": { "average": 4.3, "count": 128 },
        "stock": 50,
        "stockStatus": "in_stock"
      }
    ],
    "count": 1
  }
}
```

---

### POST `/wishlist/add` 🔒
Add a product to wishlist.

**Request Body:**
```json
{ "productId": "64f1a2b3c4d5e6f7a8b9c0d1" }
```

**Success Response — 200:**
```json
{ "success": true, "message": "Added to wishlist", "data": { "count": 3 } }
```

---

### DELETE `/wishlist/remove/:productId` 🔒
Remove a product from wishlist.

**Success Response — 200:**
```json
{ "success": true, "message": "Removed from wishlist", "data": { "count": 2 } }
```

---

## 9. Order Endpoints

### POST `/orders` 🔒
Place a new order.

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "Brijesh Kumar",
    "phone": "9876543210",
    "street": "123 Main Street",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "couponCode": "SAVE10"
}
```
*(Items are taken from user's server cart)*

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "64f1...",
    "orderNumber": "ORD-20260701-0001",
    "orderStatus": "pending",
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "items": [ ... ],
    "shippingAddress": { ... },
    "subtotal": 2598,
    "shippingCharge": 0,
    "taxAmount": 467.64,
    "discountAmount": 259.8,
    "totalAmount": 2805.84,
    "estimatedDelivery": "2026-07-08T00:00:00.000Z",
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```

---

### GET `/orders` 🛡️
Get all orders (admin). Supports filters and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | Number | Page number |
| `limit` | Number | Items per page (default: 20) |
| `status` | String | Filter by orderStatus |
| `paymentStatus` | String | Filter by paymentStatus |
| `startDate` | Date | From date |
| `endDate` | Date | To date |
| `search` | String | Search by orderNumber or customer name |

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "orderNumber": "ORD-20260701-0001",
      "user": { "_id": "...", "name": "Brijesh Kumar", "email": "brijesh@example.com" },
      "itemCount": 2,
      "totalAmount": 2805.84,
      "orderStatus": "pending",
      "paymentMethod": "COD",
      "createdAt": "2026-07-01T04:30:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET `/orders/my-orders` 🔒
Get logged-in customer's own orders.

**Query Parameters:** `page`, `limit`, `status`

**Success Response — 200:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### GET `/orders/:id` 🔒
Get full order details. Customers can only view own orders.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "orderNumber": "ORD-20260701-0001",
    "user": { "_id": "...", "name": "Brijesh Kumar", "email": "...", "phone": "..." },
    "items": [
      {
        "_id": "...",
        "product": "65a1...",
        "name": "Wireless Bluetooth Headphones",
        "image": "https://...",
        "price": 1299,
        "quantity": 2,
        "selectedVariants": { "color": "Black" }
      }
    ],
    "shippingAddress": { ... },
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "statusHistory": [
      { "status": "pending", "note": "", "updatedAt": "2026-07-01T04:30:00.000Z" }
    ],
    "subtotal": 2598,
    "shippingCharge": 0,
    "taxAmount": 467.64,
    "discountAmount": 259.8,
    "totalAmount": 2805.84,
    "estimatedDelivery": "2026-07-08T00:00:00.000Z",
    "createdAt": "2026-07-01T04:30:00.000Z"
  }
}
```

---

### PUT `/orders/:id/status` 🛡️
Update order status (admin only).

**Request Body:**
```json
{
  "orderStatus": "shipped",
  "note": "Dispatched via BlueDart, tracking: BD123456"
}
```

**Success Response — 200:**
```json
{ "success": true, "message": "Order status updated to shipped" }
```
*Sends status update email to customer.*

---

### PUT `/orders/:id/cancel` 🔒
Customer cancels their own order (only if status is `pending`).

**Request Body:**
```json
{ "cancelReason": "Changed my mind" }
```

**Success Response — 200:**
```json
{ "success": true, "message": "Order cancelled successfully" }
```

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | Order cannot be cancelled after processing has begun |
| 403 | Not authorized to cancel this order |

---

## 10. Review Endpoints

### GET `/reviews/:productId` 🌐
Get all reviews for a product.

**Query Parameters:** `page`, `limit`, `sort` (newest / highest / lowest)

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64f1...",
        "user": { "_id": "...", "name": "Brijesh Kumar", "avatarUrl": "https://..." },
        "rating": 5,
        "title": "Excellent sound quality!",
        "comment": "Best headphones I have ever used. The bass is incredible.",
        "isVerifiedPurchase": true,
        "createdAt": "2026-07-01T04:30:00.000Z"
      }
    ],
    "summary": {
      "average": 4.3,
      "count": 128,
      "breakdown": { "5": 72, "4": 32, "3": 14, "2": 6, "1": 4 }
    }
  },
  "pagination": { ... }
}
```

---

### POST `/reviews/:productId` 🔒
Submit a review for a product.

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent sound quality!",
  "comment": "Best headphones I have ever used. The bass is incredible."
}
```

**Success Response — 201:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": { "_id": "...", "rating": 5, "isVerifiedPurchase": true, ... }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 409 | You have already reviewed this product |
| 400 | Only customers who purchased the product can review |

---

### PUT `/reviews/:reviewId` 🔒
Edit own review.

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated: Still great!",
  "comment": "Updated my review after 3 months of use..."
}
```

**Success Response — 200:**
```json
{ "success": true, "message": "Review updated successfully", "data": { ... } }
```

---

### DELETE `/reviews/:reviewId` 🔒
Delete own review. Admins can delete any review.

**Success Response — 200:**
```json
{ "success": true, "message": "Review deleted successfully" }
```

---

## 11. Coupon Endpoints

### POST `/coupons/validate` 🔒
Validate a coupon code for the current user and cart total.

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderAmount": 2598
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 259.8,
    "maxDiscount": 500,
    "finalAmount": 2338.2
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 404 | Coupon not found |
| 400 | This coupon has expired |
| 400 | Minimum order amount of ₹500 required |
| 400 | You have already used this coupon |
| 400 | Coupon usage limit reached |

---

### GET `/coupons` 🛡️
Get all coupons (admin only).

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "code": "SAVE10",
      "discountType": "percentage",
      "discountValue": 10,
      "minOrderAmount": 500,
      "maxDiscount": 200,
      "usageLimit": 100,
      "usedCount": 45,
      "perUserLimit": 1,
      "isActive": true,
      "expiresAt": "2027-01-01T00:00:00.000Z",
      "isExpired": false,
      "isUsageLimitReached": false
    }
  ]
}
```

---

### POST `/coupons` 🛡️
Create a new coupon.

**Request Body:**
```json
{
  "code": "MONSOON30",
  "discountType": "percentage",
  "discountValue": 30,
  "minOrderAmount": 1000,
  "maxDiscount": 500,
  "usageLimit": 200,
  "perUserLimit": 1,
  "expiresAt": "2026-09-30T23:59:59.000Z"
}
```

**Success Response — 201:**
```json
{ "success": true, "message": "Coupon created successfully", "data": { ... } }
```

---

### PUT `/coupons/:id` 🛡️
Update an existing coupon.

**Success Response — 200:**
```json
{ "success": true, "message": "Coupon updated successfully", "data": { ... } }
```

---

### PATCH `/coupons/:id/status` 🛡️
Toggle coupon active/inactive.

**Request Body:**
```json
{ "isActive": false }
```

**Success Response — 200:**
```json
{ "success": true, "message": "Coupon deactivated" }
```

---

### DELETE `/coupons/:id` 🛡️
Delete a coupon.

**Success Response — 200:**
```json
{ "success": true, "message": "Coupon deleted successfully" }
```

---

## 12. Upload Endpoints

### POST `/upload/image` 🛡️
Upload an image to Cloudinary.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `image` | File | Image file (jpeg/png/webp, max 5MB) |
| `folder` | String | `products` / `categories` / `avatars` |

**Success Response — 200:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/shopease/image/upload/v1234567890/ecommerce/products/abc123.webp",
    "publicId": "ecommerce/products/abc123"
  }
}
```

**Error Responses:**
| Code | Message |
|------|---------|
| 400 | No image file provided |
| 400 | File type not allowed. Use jpeg, png, or webp |
| 400 | File size exceeds 5MB limit |

---

### POST `/upload/avatar` 🔒
Upload user avatar (customers can upload own).

**Request:** `multipart/form-data`

| Field | Type |
|-------|------|
| `image` | File |

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../avatars/user123.webp",
    "publicId": "ecommerce/avatars/user123"
  }
}
```

---

### DELETE `/upload/image/:publicId` 🛡️
Delete an image from Cloudinary.

**Note:** `publicId` must be URL-encoded (replace `/` with `%2F`)

**Success Response — 200:**
```json
{ "success": true, "message": "Image deleted successfully" }
```

---

## 13. Analytics Endpoints

### GET `/analytics/dashboard` 🛡️
Get dashboard summary stats.

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "today": 12450,
      "thisWeek": 84320,
      "thisMonth": 342100,
      "trend": "+12.5%"
    },
    "orders": {
      "total": 1284,
      "pending": 43,
      "processing": 28,
      "shipped": 67,
      "delivered": 1102,
      "cancelled": 44,
      "trend": "+8.2%"
    },
    "products": {
      "total": 156,
      "active": 148,
      "outOfStock": 8
    },
    "customers": {
      "total": 892,
      "newToday": 12,
      "trend": "+5.1%"
    },
    "lowStockProducts": [
      { "_id": "...", "name": "USB-C Cable", "stock": 3 },
      { "_id": "...", "name": "Phone Stand", "stock": 7 }
    ],
    "recentOrders": [ ... ]
  }
}
```

---

### GET `/analytics/revenue` 🛡️
Get revenue data for charting.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `period` | String | `daily` / `weekly` / `monthly` / `yearly` |
| `year` | Number | Year (default: current year) |
| `month` | Number | Month 1–12 (for daily period) |

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    { "label": "Jan", "revenue": 284500, "orders": 312 },
    { "label": "Feb", "revenue": 312400, "orders": 341 },
    { "label": "Mar", "revenue": 298700, "orders": 328 },
    { "label": "Apr", "revenue": 342100, "orders": 378 }
  ]
}
```

---

### GET `/analytics/top-products` 🛡️
Get top-selling products.

**Query Parameters:** `limit` (default: 10), `period` (last 30 / 90 / 365 days)

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Wireless Bluetooth Headphones",
      "image": "https://...",
      "unitsSold": 284,
      "revenue": 368916,
      "category": "Electronics"
    }
  ]
}
```

---

### GET `/analytics/orders` 🛡️
Get order analytics by period.

**Query Parameters:** `period`, `year`, `month`

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    { "label": "Jan", "total": 312, "delivered": 280, "cancelled": 18, "pending": 14 }
  ]
}
```

---

## 14. Error Reference

### HTTP Status Codes

| Code | When Used |
|------|-----------|
| `200` | Successful GET, PUT, PATCH, DELETE |
| `201` | Successful POST (resource created) |
| `400` | Bad request — validation failed, business rule violation |
| `401` | Unauthorized — no valid token / token expired |
| `403` | Forbidden — valid token but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict — duplicate email, duplicate review, etc. |
| `429` | Too many requests — rate limit exceeded |
| `500` | Internal server error |

### Common Error Messages

| Error | Status | Message |
|-------|--------|---------|
| Not logged in | 401 | `Authentication required. Please login.` |
| Token expired | 401 | `Your session has expired. Please login again.` |
| Not admin | 403 | `Access denied. Admin privileges required.` |
| Own data only | 403 | `You are not authorized to access this resource.` |
| Not found | 404 | `[Resource] not found.` |
| Duplicate email | 409 | `An account with this email already exists.` |
| Duplicate review | 409 | `You have already reviewed this product.` |
| Rate limit | 429 | `Too many requests. Please try again after 1 minute.` |

---

## 15. Postman Collection

### Environment Variables

```json
{
  "baseUrl": "http://localhost:5000/api",
  "productId": "",
  "orderId": "",
  "categoryId": "",
  "couponId": "",
  "reviewId": ""
}
```

### Collection Structure

```
📁 ShopEase API
├── 📁 Auth
│   ├── Register
│   ├── Login
│   ├── Get Me
│   ├── Logout
│   ├── Forgot Password
│   └── Reset Password
├── 📁 Users
│   ├── Get All Users (Admin)
│   ├── Get User by ID
│   ├── Update Profile
│   ├── Change Password
│   ├── Block User (Admin)
│   ├── Add Address
│   ├── Update Address
│   ├── Delete Address
│   └── Set Default Address
├── 📁 Products
│   ├── Get All Products
│   ├── Get Product by Slug
│   ├── Get Featured Products
│   ├── Create Product (Admin)
│   ├── Update Product (Admin)
│   ├── Delete Product (Admin)
│   └── Toggle Status (Admin)
├── 📁 Categories
│   ├── Get All Categories
│   ├── Get Category by Slug
│   ├── Create Category (Admin)
│   ├── Update Category (Admin)
│   └── Delete Category (Admin)
├── 📁 Cart
│   ├── Get Cart
│   ├── Add to Cart
│   ├── Update Cart Item
│   ├── Remove Cart Item
│   ├── Clear Cart
│   └── Merge Guest Cart
├── 📁 Wishlist
│   ├── Get Wishlist
│   ├── Add to Wishlist
│   └── Remove from Wishlist
├── 📁 Orders
│   ├── Place Order
│   ├── Get All Orders (Admin)
│   ├── Get My Orders
│   ├── Get Order by ID
│   ├── Update Order Status (Admin)
│   └── Cancel Order
├── 📁 Reviews
│   ├── Get Product Reviews
│   ├── Submit Review
│   ├── Edit Review
│   └── Delete Review
├── 📁 Coupons
│   ├── Validate Coupon
│   ├── Get All Coupons (Admin)
│   ├── Create Coupon (Admin)
│   ├── Update Coupon (Admin)
│   ├── Toggle Status (Admin)
│   └── Delete Coupon (Admin)
├── 📁 Upload
│   ├── Upload Product Image
│   ├── Upload Avatar
│   └── Delete Image
└── 📁 Analytics (Admin)
    ├── Dashboard Stats
    ├── Revenue Chart
    ├── Top Products
    └── Orders Chart
```

### Total Endpoints: **54**

| Module | Count |
|--------|-------|
| Auth | 6 |
| Users | 9 |
| Products | 7 |
| Categories | 5 |
| Cart | 6 |
| Wishlist | 3 |
| Orders | 6 |
| Reviews | 4 |
| Coupons | 6 |
| Upload | 3 |
| Analytics | 4 |
| **Total** | **59** |

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | July 2026 | Team | Initial API Documentation |

---

*Previous Phase → [Phase 5: Backend Schema](./phase-5-Schema.md)*  
*Next Phase → [Phase 7: Implementation Plan](./phase-7-ImplementationPlan.md)*
