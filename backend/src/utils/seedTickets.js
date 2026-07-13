import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Ticket from '../models/Ticket.model.js'
import User from '../models/User.model.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

const seedTickets = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop-sathi-e-commerce'
    console.log(`Connecting to database at ${mongoUri}...`)
    await mongoose.connect(mongoUri)
    console.log('Connected!')

    // Find any user in the DB
    const anyUser = await User.findOne({})
    if (!anyUser) {
      console.log('No user found in database to link tickets to. Please register a user first.')
      process.exit(1)
    }

    console.log(`Found User: ${anyUser.name} (${anyUser._id}). Seeding tickets...`)

    await Ticket.deleteMany({})

    const dummyTickets = [
      {
        ticketId: "TKT-1001",
        user: anyUser._id,
        subject: "Payment debited but order status says Pending",
        message: "I tried paying for my last order using Google Pay. The money was cut from my account, but my order status still shows Pending Payment. Please check.",
        category: "Payment Problem",
        priority: "High",
        status: "Open",
        replies: []
      },
      {
        ticketId: "TKT-1002",
        user: anyUser._id,
        subject: "Need to change my shipping address",
        message: "Hi, I just placed an order (order ID ending in 4A5F) but realized I typed the wrong house number. Can you update it to flat 404, Block C, Royal Residency?",
        category: "Order Issue",
        priority: "Medium",
        status: "In Progress",
        replies: [
          {
            sender: "Support Agent",
            message: "Hello! We can certainly help you change the address if the order hasn't shipped yet. Could you confirm the full correct pincode?",
            createdAt: new Date(Date.now() - 3600000)
          }
        ]
      },
      {
        ticketId: "TKT-1003",
        user: anyUser._id,
        subject: "Received wrong item in my package",
        message: "I ordered a blue running t-shirt, but instead received a black polo shirt in size M. Please assist with returning and exchanging this.",
        category: "Order Issue",
        priority: "High",
        status: "Open",
        replies: []
      },
      {
        ticketId: "TKT-1004",
        user: anyUser._id,
        subject: "How do I request a refund?",
        message: "I canceled my order before it was shipped. How long does it take for the refund amount to reflect in my bank account?",
        category: "General Inquiry",
        priority: "Low",
        status: "Resolved",
        replies: [
          {
            sender: "Support Agent",
            message: "Hi there! Since the cancellation was successful, refunds are processed instantly and usually reflect in your bank account within 3 to 5 business days.",
            createdAt: new Date(Date.now() - 7200000)
          },
          {
            sender: "User",
            message: "Thank you for the quick response! I will wait for a few days.",
            createdAt: new Date(Date.now() - 3600000)
          }
        ]
      }
    ]

    await Ticket.create(dummyTickets)
    console.log('Seeded tickets successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed tickets:', error)
    process.exit(1)
  }
}

seedTickets()
