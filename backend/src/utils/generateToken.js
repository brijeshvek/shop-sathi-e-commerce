import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET || 'your_super_strong_access_secret_min_64_chars', {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  })

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'your_super_strong_refresh_secret_min_64_chars', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  })

export const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure:   true,
    sameSite: 'none',
  }
  res.cookie('accessToken',  accessToken,  { ...cookieOptions, maxAge: 15 * 60 * 1000 })
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

export const clearCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure:   true,
    sameSite: 'none',
  }
  res.clearCookie('accessToken', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)
}
