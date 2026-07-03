import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

// Routes
import healthRouter    from './routes/health.routes.js'
import authRouter      from './routes/auth.routes.js'
import userRouter      from './routes/user.routes.js'
import productRouter   from './routes/product.routes.js'
import categoryRouter  from './routes/category.routes.js'
import cartRouter      from './routes/cart.routes.js'
import wishlistRouter  from './routes/wishlist.routes.js'
import orderRouter     from './routes/order.routes.js'
import reviewRouter    from './routes/review.routes.js'
import couponRouter    from './routes/coupon.routes.js'
import uploadRouter    from './routes/upload.routes.js'
import analyticsRouter from './routes/analytics.routes.js'
import sellerRouter    from './routes/seller.routes.js'
import roleRouter      from './routes/role.routes.js'

// Error middleware
import { errorHandler, notFound } from './middleware/error.middleware.js'

const app = express()

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet())

app.use(cors({
  origin: [
    process.env.CLIENT_URL    || 'http://localhost:3000',
    process.env.DASHBOARD_URL || 'http://localhost:3001',
    'http://localhost:3002',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again after 1 minute.' },
})
app.use('/api', limiter)

// ── Parsing ───────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(compression())

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api',          healthRouter)
app.use('/api/auth',     authRouter)
app.use('/api/users',    userRouter)
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/cart',     cartRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/orders',   orderRouter)
app.use('/api/reviews',  reviewRouter)
app.use('/api/coupons',  couponRouter)
app.use('/api/upload',   uploadRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/seller',   sellerRouter)
app.use('/api/roles',    roleRouter)

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
