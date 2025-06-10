import { genkit, z } from 'genkit'
import { startFlowServer } from '@genkit-ai/express'
import { gemini25FlashPreview0417, googleAI } from '@genkit-ai/googleai'
import { mcpClient } from 'genkitx-mcp'
import dotenv from 'dotenv'

dotenv.config()

const githubClient = mcpClient({
  name: 'github',
  serverProcess: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: process.env as Record<string, string>,
  },
})

const ai = genkit({
  plugins: [
    githubClient,
    googleAI(),
  ],
  model: gemini25FlashPreview0417,
})

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (prompt) => {
  const { text } = await ai.generate({
    // prompt example: Look up GitHub repositories related to Genkit, and summarize what you find.
    prompt,
    tools: ['github/search_repositories']
  })
  return text
})

startFlowServer({ flows: [mainFlow] })