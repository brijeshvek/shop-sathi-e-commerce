import Ticket from '../models/Ticket.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/tickets
export const getAllTickets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, priority, search } = req.query
  const filter = {}

  if (status) filter.status = status
  if (priority) filter.priority = priority
  if (search) {
    filter.$or = [
      { ticketId: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Ticket.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, tickets, 'Tickets fetched successfully', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit)
  }))
})

// POST /api/tickets
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, message, priority, category } = req.body
  const ticket = await Ticket.create({
    user: req.user._id,
    subject,
    message,
    priority,
    category
  })
  res.status(201).json(new ApiResponse(201, ticket, 'Ticket created successfully'))
})

// PUT /api/tickets/:id (Update Status)
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status, priority } = req.body
  const updateData = {}
  if (status) updateData.status = status
  if (priority) updateData.priority = priority

  const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .populate('user', 'name email phone')

  if (!ticket) throw new ApiError(404, 'Ticket not found')
  res.status(200).json(new ApiResponse(200, ticket, 'Ticket updated successfully'))
})

// POST /api/tickets/:id/reply
export const addTicketReply = asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message) throw new ApiError(400, 'Reply message is required')

  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) throw new ApiError(404, 'Ticket not found')

  const senderRole = req.user.role === 'admin' || req.user.role === 'seller' ? 'Support Agent' : 'User'
  
  ticket.replies.push({
    sender: senderRole,
    message,
    createdAt: new Date()
  })

  // If agent replies, auto-mark ticket as In Progress
  if (senderRole === 'Support Agent' && ticket.status === 'Open') {
    ticket.status = 'In Progress'
  }

  await ticket.save()
  
  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('user', 'name email phone')
    .lean()

  res.status(200).json(new ApiResponse(200, populatedTicket, 'Reply added successfully'))
})
