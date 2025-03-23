import { genkit } from 'genkit'
import { googleAI, gemini20Flash } from '@genkit-ai/googleai'
import { logger } from 'genkit/logging'
logger.setLogLevel('debug')

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
})

async function main() {
  const { text } = await ai.generate('What is Firebase Genkit?')
  console.log(text)
}

main()