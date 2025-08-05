import { genkit, z } from 'genkit'
import { vertexAI, gemini25FlashLite } from '@genkit-ai/vertexai'
import { startFlowServer } from '@genkit-ai/express'
import { logger } from 'genkit/logging'
import dotenv from 'dotenv'

dotenv.config()

logger.setLogLevel('debug')

const ai = genkit({
  plugins: [vertexAI({
    projectId: process.env.GCLOUD_PROJECT!,
    location: process.env.GCLOUD_LOCATION!,
  })],
  model: gemini25FlashLite,
})

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (input) => {
  const { text } = await ai.generate(input)
  return text
})

startFlowServer({ flows: [mainFlow] })