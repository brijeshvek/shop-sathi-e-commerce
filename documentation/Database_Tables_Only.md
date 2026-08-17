# Shop Sathi E-Commerce — Database Dictionary (Tables Only)

## Collections Summary Index

| # | Collection Name | Model Name | Primary Key | Description / Purpose |
|---|-----------------|------------|-------------|-----------------------|
| 1 | `users` | `User` | `_id` (ObjectId) | Customer and admin accounts, credentials & addresses |
| 2 | `products` | `Product` | `_id` (ObjectId) | Product catalog, pricing, inventory, variants & images |
| 3 | `categories` | `Category` | `_id` (ObjectId) | Hierarchical product categories and sub-categories |
| 4 | `carts` | `Cart` | `_id` (ObjectId) | Active user shopping cart items & applied coupon |
| 5 | `wishlists` | `Wishlist` | `_id` (ObjectId) | User saved wishlist items |
| 6 | `orders` | `Order` | `_id` (ObjectId) | Placed customer orders, delivery status & financials |
| 7 | `reviews` | `Review` | `_id` (ObjectId) | Product ratings and reviews |
| 8 | `coupons` | `Coupon` | `_id` (ObjectId) | Promotional discount vouchers and usage tracking |

---

## 1. `users` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique document identifier |
| `name` | String | Yes | No | — | User full name (2–50 chars) |
| `email` | String | Yes | Unique Index | — | User email address (lowercase, unique) |
| `password` | String | Yes | No | — | Bcrypt hashed password (`select: false`) |
| `phone` | String | No | No | — | Contact mobile number |
| `avatar.url` | String | No | No | `""` | Profile image Cloudinary URL |
| `avatar.publicId` | String | No | No | `""` | Profile image asset public ID |
| `role` | String | No | Index | `'customer'` | Enum: `['customer', 'admin', 'superadmin']` |
| `addresses` | Array[Object] | No | Embedded | `[]` | Embedded address sub-documents |
| `addresses._id` | ObjectId | Yes | Sub-ID | Auto | Unique address identifier |
| `addresses.label` | String | No | No | — | Label (e.g. "Home", "Work", "Office") |
| `addresses.fullName` | String | Yes | No | — | Recipient full name |
| `addresses.phone` | String | Yes | No | — | Contact phone number |
| `addresses.street` | String | Yes | No | — | Street / Building address |
| `addresses.city` | String | Yes | No | — | City / Town |
| `addresses.state` | String | Yes | No | — | State / Province |
| `addresses.pincode` | String | Yes | No | — | Postal pincode |
| `addresses.country` | String | No | No | `'India'` | Country name |
| `addresses.isDefault` | Boolean | No | No | `false` | Default shipping address flag |
| `isBlocked` | Boolean | No | Index | `false` | Account blocked status flag |
| `resetPasswordToken` | String | No | No | — | SHA-256 password reset token |
| `resetPasswordExpire`| Date | No | No | — | Password reset token expiration date |
| `createdAt` | Date | Auto | No | Current Date | Account creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Last account modification timestamp |

---

## 2. `products` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique product identifier |
| `name` | String | Yes | Text Index | — | Product title (3–200 chars) |
| `slug` | String | Auto | Unique Index | Auto | URL slug generated from name |
| `description` | String | Yes | Text Index | — | Full detailed description |
| `shortDescription` | String | No | No | — | Short overview (Max 300 chars) |
| `price` | Number | Yes | Index | — | Current selling price (>= 0) |
| `originalPrice` | Number | No | No | — | Strike-through MRP (>= 0) |
| `discount` | Number | Auto | No | `0` | Calculated discount percentage (0–100%) |
| `category` | ObjectId | Yes | Foreign Key | — | Reference to `Category._id` |
| `brand` | String | No | Text Index | — | Brand / Manufacturer name |
| `sku` | String | No | Sparse Unique | — | Stock Keeping Unit (Uppercase) |
| `images` | Array[Object] | No | Embedded | `[]` | Array of product image objects |
| `images._id` | ObjectId | Yes | Sub-ID | Auto | Image sub-document ID |
| `images.url` | String | Yes | No | — | Cloudinary image URL |
| `images.publicId` | String | Yes | No | — | Cloudinary asset public ID |
| `images.isMain` | Boolean | No | No | `false` | Main cover image flag |
| `variants` | Array[Object] | No | Embedded | `[]` | Product variant options (Size, Color) |
| `variants.name` | String | Yes | No | — | Variant group (e.g. "Size") |
| `variants.options` | Array[String] | Yes | No | — | Option values (e.g. ["S", "M", "L"]) |
| `specifications` | Array[Object] | No | Embedded | `[]` | Key-value specifications |
| `specifications.key` | String | Yes | No | — | Spec attribute name (e.g. "Material") |
| `specifications.value`| String | Yes | No | — | Spec attribute value (e.g. "Cotton") |
| `tags` | Array[String] | No | Text Index | `[]` | Search tags |
| `stock` | Number | Yes | Index | `0` | Available stock count (>= 0) |
| `isActive` | Boolean | No | Index | `true` | Active status flag (Soft delete) |
| `isFeatured` | Boolean | No | Index | `false` | Show on homepage banner |
| `ratings.average` | Number | Auto | Index | `0` | Average star rating (0–5) |
| `ratings.count` | Number | Auto | No | `0` | Total review count |
| `createdBy` | ObjectId | No | Foreign Key | — | Reference to `User._id` (Creator) |
| `createdAt` | Date | Auto | No | Current Date | Creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Last modification timestamp |

---

## 3. `categories` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique category identifier |
| `name` | String | Yes | Unique Index | — | Category title (2–50 chars) |
| `slug` | String | Auto | Unique Index | Auto | URL slug generated from name |
| `description` | String | No | No | — | Category description |
| `image.url` | String | No | No | `""` | Banner image URL |
| `image.publicId` | String | No | No | `""` | Cloudinary asset ID |
| `parent` | ObjectId | No | Foreign Key | `null` | Reference to parent `Category._id` (null = main) |
| `isActive` | Boolean | No | Index | `true` | Active status flag |
| `createdAt` | Date | Auto | No | Current Date | Creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Modification timestamp |

---

## 4. `carts` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique cart identifier |
| `user` | ObjectId | Yes | Unique FK | — | Reference to `User._id` (One cart per user) |
| `items` | Array[Object] | No | Embedded | `[]` | Cart line items |
| `items._id` | ObjectId | Yes | Sub-ID | Auto | Cart item ID |
| `items.product` | ObjectId | Yes | Foreign Key | — | Reference to `Product._id` |
| `items.name` | String | Yes | No | — | Product name snapshot |
| `items.image` | String | No | No | `""` | Image URL snapshot |
| `items.price` | Number | Yes | No | — | Unit price snapshot |
| `items.quantity` | Number | Yes | No | `1` | Quantity (>= 1) |
| `items.selectedVariants` | Map[String] | No | No | — | Selected variant key-values |
| `coupon` | ObjectId | No | Foreign Key | `null` | Reference to applied `Coupon._id` |
| `discountAmount` | Number | No | No | `0` | Applied discount amount |
| `createdAt` | Date | Auto | No | Current Date | Cart creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Last item change timestamp |

---

## 5. `wishlists` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique wishlist identifier |
| `user` | ObjectId | Yes | Unique FK | — | Reference to `User._id` (One wishlist per user) |
| `products` | Array[ObjectId]| No | Array FK | `[]` | Array of `Product._id` references |
| `createdAt` | Date | Auto | No | Current Date | Creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Last change timestamp |

---

## 6. `orders` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique order ID |
| `orderNumber` | String | Auto | Unique Index | Auto | Format: `ORD-YYYYMMDD-XXXX` |
| `user` | ObjectId | Yes | Foreign Key | — | Reference to `User._id` |
| `items` | Array[Object] | Yes | Embedded | — | Order line items snapshot |
| `items.product` | ObjectId | Yes | Foreign Key | — | Reference to `Product._id` |
| `items.name` | String | Yes | No | — | Product title snapshot |
| `items.image` | String | No | No | `""` | Thumbnail snapshot |
| `items.price` | Number | Yes | No | — | Unit price snapshot |
| `items.quantity` | Number | Yes | No | — | Ordered quantity (>= 1) |
| `items.selectedVariants` | Map[String] | No | No | — | Variant options snapshot |
| `shippingAddress.fullName` | String | Yes | No | — | Recipient full name |
| `shippingAddress.phone` | String | Yes | No | — | Recipient phone number |
| `shippingAddress.street` | String | Yes | No | — | Street address |
| `shippingAddress.city` | String | Yes | No | — | City |
| `shippingAddress.state` | String | Yes | No | — | State |
| `shippingAddress.pincode` | String | Yes | No | — | Postal pincode |
| `shippingAddress.country` | String | No | No | `'India'` | Country |
| `paymentMethod` | String | Yes | No | — | Enum: `['COD', 'ONLINE']` |
| `paymentStatus` | String | No | Index | `'pending'` | Enum: `['pending', 'paid', 'failed', 'refunded']` |
| `orderStatus` | String | No | Index | `'pending'` | Enum: `['pending', 'processing', 'shipped', 'delivered', 'cancelled']` |
| `statusHistory` | Array[Object] | No | Embedded | `[]` | Audit trail of status updates |
| `coupon` | ObjectId | No | Foreign Key | `null` | Reference to `Coupon._id` |
| `subtotal` | Number | Yes | No | — | Items price subtotal |
| `shippingCharge` | Number | No | No | `0` | Shipping charge (Free above ₹499) |
| `taxAmount` | Number | No | No | `0` | GST tax (18%) |
| `discountAmount` | Number | No | No | `0` | Discount deduction |
| `totalAmount` | Number | Yes | No | — | Final payable total |
| `estimatedDelivery` | Date | No | No | — | Expected delivery date |
| `deliveredAt` | Date | No | No | — | Delivery completion date |
| `cancelledAt` | Date | No | No | — | Order cancellation date |
| `cancelReason` | String | No | No | — | Reason for cancellation |
| `createdAt` | Date | Auto | Index | Current Date | Order date |
| `updatedAt` | Date | Auto | No | Current Date | Last status change date |

---

## 7. `reviews` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique review ID |
| `product` | ObjectId | Yes | Compound Unique | — | Reference to `Product._id` |
| `user` | ObjectId | Yes | Compound Unique | — | Reference to `User._id` |
| `rating` | Number | Yes | No | — | Star rating score (1 to 5) |
| `title` | String | No | No | — | Review title (Max 100 chars) |
| `comment` | String | Yes | No | — | Review text (10–1000 chars) |
| `isVerifiedPurchase` | Boolean | No | No | `false` | True if verified purchase |
| `createdAt` | Date | Auto | Index | Current Date | Review submission date |
| `updatedAt` | Date | Auto | No | Current Date | Last edit date |

---

## 8. `coupons` Collection Schema

| Field Name | Data Type | Required | Key / Index | Default Value | Description / Constraints |
|------------|-----------|----------|-------------|---------------|---------------------------|
| `_id` | ObjectId | Auto | Primary Key | Auto | Unique coupon ID |
| `code` | String | Yes | Unique Index | — | Coupon code (3–20 chars, uppercase) |
| `discountType` | String | Yes | No | — | Enum: `['percentage', 'flat']` |
| `discountValue` | Number | Yes | No | — | Percentage % or flat amount ₹ |
| `minOrderAmount` | Number | No | No | `0` | Minimum order subtotal required |
| `maxDiscount` | Number | No | No | `null` | Max discount cap for percentage |
| `usageLimit` | Number | No | No | `null` | Total max redemptions (null = unlimited) |
| `usedCount` | Number | No | No | `0` | Current total redemptions |
| `perUserLimit` | Number | No | No | `1` | Max redemptions per user |
| `usedBy` | Array[ObjectId]| No | Foreign Keys | `[]` | Array of `User._id` references |
| `isActive` | Boolean | No | Index | `true` | Active status flag |
| `expiresAt` | Date | Yes | Index | — | Expiration timestamp |
| `createdAt` | Date | Auto | No | Current Date | Creation timestamp |
| `updatedAt` | Date | Auto | No | Current Date | Modification timestamp |

---

## Database Indexes Reference Table

| Collection | Index Fields | Index Type | Unique | Purpose |
|------------|--------------|------------|--------|---------|
| `users` | `{ email: 1 }` | B-Tree | Yes | Fast unique user login lookup |
| `users` | `{ role: 1 }` | B-Tree | No | Role based user filtering |
| `users` | `{ isBlocked: 1 }` | B-Tree | No | Account status filter |
| `products` | `{ slug: 1 }` | B-Tree | Yes | Fast product detail URL lookup |
| `products` | `{ category: 1 }` | B-Tree | No | Category product listing filter |
| `products` | `{ isActive: 1, isFeatured: 1 }` | Compound | No | Homepage featured products query |
| `products` | `{ isActive: 1, price: 1 }` | Compound | No | Price sorting and filtering |
| `products` | `{ 'ratings.average': -1 }` | B-Tree | No | Top rated products sorting |
| `products` | `{ name: 'text', description: 'text', tags: 'text', brand: 'text' }` | Text | No | Full-text search search bar |
| `categories` | `{ slug: 1 }` | B-Tree | Yes | Category page URL lookup |
| `categories` | `{ parent: 1 }` | B-Tree | No | Sub-category hierarchy queries |
| `orders` | `{ orderNumber: 1 }` | B-Tree | Yes | Order tracking code lookup |
| `orders` | `{ user: 1, createdAt: -1 }` | Compound | No | Customer order history listing |
| `orders` | `{ orderStatus: 1 }` | B-Tree | No | Admin order fulfillment filter |
| `reviews` | `{ product: 1, user: 1 }` | Compound | Yes | Prevent duplicate user reviews per product |
| `reviews` | `{ product: 1, createdAt: -1 }` | Compound | No | Product review list pagination |
| `coupons` | `{ code: 1 }` | B-Tree | Yes | Fast coupon code validation |
| `coupons` | `{ isActive: 1, expiresAt: 1 }` | Compound | No | Active coupon validity queries |
| `carts` | `{ user: 1 }` | B-Tree | Yes | Single cart per user enforcement |
| `wishlists` | `{ user: 1 }` | B-Tree | Yes | Single wishlist per user enforcement |
