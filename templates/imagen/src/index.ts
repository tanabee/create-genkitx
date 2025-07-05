import { genkit, z } from 'genkit'
import googleAI from '@genkit-ai/googleai'
import { startFlowServer } from '@genkit-ai/express'
import { logger } from 'genkit/logging'
logger.setLogLevel('debug')

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('imagen-4.0-generate-preview-06-06'),
})

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (prompt) => {
  // Prompt example: "generate an image of a banana riding bicycle"
  const { media } = await ai.generate({ prompt })
  return media
})

startFlowServer({ flows: [mainFlow] })