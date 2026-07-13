import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Order Issue', 'Payment Problem', 'Technical Bug', 'General Inquiry'],
    default: 'General Inquiry'
  },
  replies: [
    {
      sender: {
        type: String, // 'User' or 'Support Agent'
        required: true
      },
      message: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true })

// Auto-generate ticket ID
ticketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments()
    this.ticketId = `TKT-${1000 + count + 1}`
  }
  next()
})

const Ticket = mongoose.model('Ticket', ticketSchema)
export default Ticket
