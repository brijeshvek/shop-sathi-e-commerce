import express from 'express'
import {
  getAllTickets, createTicket, updateTicketStatus, addTicketReply
} from '../controllers/ticket.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.route('/')
  .get(getAllTickets)
  .post(createTicket)

router.route('/:id')
  .put(updateTicketStatus)

router.route('/:id/reply')
  .post(addTicketReply)

export default router
