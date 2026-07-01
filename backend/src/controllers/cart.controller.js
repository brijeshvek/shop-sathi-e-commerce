import Cart from '../models/Cart.model.js'
import Product from '../models/Product.model.js'
import Coupon from '../models/Coupon.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price stock isActive images slug')
    .populate('coupon', 'code discountType discountValue')
    .lean()

  if (!cart) cart = { items: [], coupon: null, discountAmount: 0, itemCount: 0, subtotal: 0 }

  // Calculate totals
  const subtotal    = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0
  const itemCount   = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  res.status(200).json(new ApiResponse(200, { ...cart, subtotal, itemCount }, 'Cart fetched'))
})

// POST /api/cart/add
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedVariants } = req.body
  const product = await Product.findById(productId)
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found.')
  if (product.stock < quantity) throw new ApiError(400, `Only ${product.stock} items in stock.`)

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })

  const existingItem = cart.items.find(i => i.product.toString() === productId)
  if (existingItem) {
    const newQty = existingItem.quantity + quantity
    if (newQty > product.stock) throw new ApiError(400, `Only ${product.stock} items available.`)
    existingItem.quantity = newQty
  } else {
    const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url || ''
    cart.items.push({
      product: product._id, name: product.name,
      image: mainImage, price: product.price, quantity, selectedVariants,
    })
  }

  await cart.save()
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  res.status(200).json(new ApiResponse(200, { itemCount, subtotal }, 'Item added to cart'))
})

// PUT /api/cart/update
export const updateCart = asyncHandler(async (req, res) => {
  const { cartItemId, quantity } = req.body
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) throw new ApiError(404, 'Cart not found.')

  const item = cart.items.id(cartItemId)
  if (!item) throw new ApiError(404, 'Cart item not found.')

  const product = await Product.findById(item.product)
  if (product && quantity > product.stock) {
    throw new ApiError(400, `Only ${product.stock} items available.`)
  }

  item.quantity = quantity
  await cart.save()

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  res.status(200).json(new ApiResponse(200, { itemCount, subtotal }, 'Cart updated'))
})

// DELETE /api/cart/remove/:cartItemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) throw new ApiError(404, 'Cart not found.')
  cart.items = cart.items.filter(i => i._id.toString() !== req.params.cartItemId)
  await cart.save()

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  res.status(200).json(new ApiResponse(200, { itemCount, subtotal }, 'Item removed'))
})

// DELETE /api/cart/clear
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null, discountAmount: 0 })
  res.status(200).json(new ApiResponse(200, null, 'Cart cleared'))
})

// POST /api/cart/merge
export const mergeGuestCart = asyncHandler(async (req, res) => {
  const { guestCart = [] } = req.body
  if (!guestCart.length) return res.status(200).json(new ApiResponse(200, null, 'Nothing to merge'))

  let cart = await Cart.findOne({ user: req.user._id }) || await Cart.create({ user: req.user._id, items: [] })

  for (const guestItem of guestCart) {
    const product = await Product.findById(guestItem.productId)
    if (!product || !product.isActive || product.stock < 1) continue

    const exists = cart.items.find(i => i.product.toString() === guestItem.productId)
    if (exists) {
      exists.quantity = Math.min(exists.quantity + guestItem.quantity, product.stock)
    } else {
      const img = product.images.find(i => i.isMain)?.url || product.images[0]?.url || ''
      cart.items.push({
        product: product._id, name: product.name,
        image: img, price: product.price,
        quantity: Math.min(guestItem.quantity, product.stock),
        selectedVariants: guestItem.selectedVariants,
      })
    }
  }

  await cart.save()
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  res.status(200).json(new ApiResponse(200, { itemCount, subtotal }, 'Cart merged successfully'))
})
