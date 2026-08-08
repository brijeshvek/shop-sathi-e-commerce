import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true)
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/'
    const conn = await mongoose.connect(mongoUri, { dbName: 'ecommerce' })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
