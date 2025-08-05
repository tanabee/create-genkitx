import { genkit, z } from 'genkit'
import { googleAI, gemini25FlashLite } from '@genkit-ai/googleai'
import { enableFirebaseTelemetry } from '@genkit-ai/firebase'

enableFirebaseTelemetry()

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: gemini25FlashLite,
})

export const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (input) => {
  const { text } = await ai.generate(input)
  return text
})