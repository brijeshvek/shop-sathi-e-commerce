import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const addressSchema = new mongoose.Schema({
  label:     { type: String, trim: true },
  fullName:  { type: String, required: true, trim: true },
  phone:     { type: String, required: true },
  street:    { type: String, required: true, trim: true },
  city:      { type: String, required: true, trim: true },
  state:     { type: String, required: true, trim: true },
  pincode:   { type: String, required: true },
  country:   { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
}, { _id: true })

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
    trim: true, minLength: 2, maxLength: 50,
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String, required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    unique: true,
    sparse: true,
    trim: true 
  },
  avatar: {
    url:      { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin', 'superadmin'],
    default: 'customer',
  },
  sellerInfo: {
    storeName:   { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    isApproved:  { type: Boolean, default: true },
  },
  addresses: [addressSchema],
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken:  { type: String, select: false },
  resetPasswordExpire: { type: Date,   select: false },
  loginOtp:            { type: String, select: false },
  loginOtpExpire:      { type: Date,   select: false },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Generate reset token
userSchema.methods.getResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken  = crypto.createHash('sha256').update(rawToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return rawToken
}

// Avatar fallback virtual
userSchema.virtual('avatarUrl').get(function () {
  return this.avatar?.url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name)}`
})

const User = mongoose.model('User', userSchema)
export default User
