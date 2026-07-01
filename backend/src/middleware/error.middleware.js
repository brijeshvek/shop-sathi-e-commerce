import ApiError from '../utils/ApiError.js'

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'
  let errors     = err.errors     || []

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message    = `Invalid ${err.path}: ${err.value}`
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400
    message    = 'Validation failed'
    errors     = Object.values(err.errors).map(e => ({
      field:   e.path,
      message: e.message,
    }))
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token.' }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired.' }

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err)
  }

  res.status(statusCode).json({ success: false, message, errors })
}
