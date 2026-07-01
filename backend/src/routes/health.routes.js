import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState
  res.status(200).json({
    success: true, status: 'ok',
    environment: process.env.NODE_ENV,
    uptime: Math.floor(process.uptime()) + 's',
    database: dbState === 1 ? 'connected' : 'disconnected',
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
    timestamp: new Date().toISOString(),
  })
})

export default router
