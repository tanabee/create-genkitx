import { initializeApp } from 'firebase-admin/app'
import type { Request, Response, NextFunction } from 'express'
import { onRequest } from 'firebase-functions/https'
import express from 'express'
import { mainFlow } from './genkit'

initializeApp()

const app = express()
app.use(express.json())
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== `Bearer ${process.env.SERVICE_API_KEY}`) {
    res.status(403).json({ message: 'Forbidden' })
  }
  next()
})

app.post('/api/messages', async (req: Request, res: Response) => {
  const response = await mainFlow(req.body.message)
  res.json({ message: response })
})

export const api = onRequest(
  { secrets: ['SERVICE_API_KEY', 'GEMINI_API_KEY'] },
  app
)