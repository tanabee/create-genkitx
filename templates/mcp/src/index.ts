import { genkit, z } from 'genkit'
import { startFlowServer } from '@genkit-ai/express'
import { googleAI } from '@genkit-ai/googleai'
import { createMcpClient } from '@genkit-ai/mcp'
import dotenv from 'dotenv'

dotenv.config()

const githubClient = createMcpClient({
  name: 'github',
  rawToolResponses: true,
  mcpServer: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: process.env as Record<string, string>,
  },
})

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.8,
  }),
})

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (prompt) => {
  await githubClient.ready()
  const allTools = await githubClient.getActiveTools(ai)

  const enabledTools = [
    'github-mcp-server/search_repositories',
    'github-mcp-server/search_pull_requests',
    'github-mcp-server/search_issues',
    'github-mcp-server/search_code',
    'github-mcp-server/list_pull_requests',
    'github-mcp-server/list_issues',
    'github-mcp-server/list_commits',
  ]
  const tools = allTools.filter(t => enabledTools.includes(t.__action.name))

  const { text } = await ai.generate({
    // prompt example:
    // From the latest 100 commits, explain what was updated in the following repository: https://github.com/firebase/genkit
    prompt,
    tools,
  })

  return text
})

startFlowServer({ flows: [mainFlow] })