#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "fs"
import { writeFile, readFile } from "fs/promises"
import prompts from "prompts"

const templates = [
  {
    value: "minimal",
    title: "Minimal",
    description: "This is a Minimal template",
    installationCommands: [
      'export GEMINI_API_KEY=<your-api-key>',
      'npm start'
    ],
  },
  {
    value: "vertexai",
    title: "VertexAI",
    description: "This is a VertexAI template",
    installationCommands: [
      'echo "GCLOUD_PROJECT=<your-gcloud-project>" > .env',
      'echo "GCLOUD_LOCATION=<your-gcloud-location>" >> .env',
      'gcloud auth application-default login',
      'npm start',
      'Check the docs if you run into any problems:',
      'https://genkit.dev/docs/plugins/vertex-ai',
    ],
  },
  {
    value: "mcp",
    title: "MCP",
    description: "This is a MCP template",
    installationCommands: [
      'echo "GEMINI_API_KEY=<your-api-key>" > .env',
      'echo "GITHUB_PERSONAL_ACCESS_TOKEN=<your-github-personal-access-token>" >> .env',
      'npm start'
    ],
  },
  {
    value: "firebase",
    title: "Firebase",
    description: "This is a Firebase template",
    installationCommands: []
  }
]

const renamePackageJsonName = async (targetDir, projectName) => {
  const packageJsonPath = path.join(targetDir, "package.json")
  const packageJsonData = await readFile(packageJsonPath, "utf8")
  const packageJson = JSON.parse(packageJsonData)
  packageJson.name = projectName
  await writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf8"
  )
}

(async () => {
  try {
    const response = await prompts([
      {
        type: "select",
        name: "template",
        message: "Select template",
        choices: templates,
      },
      {
        type: "text",
        name: "projectName",
        message: "Enter your project name",
        format: (val) => val.trim(),
      },
    ])
    const { projectName, template } = response

    const targetDir = path.join(process.cwd(), projectName)
    const sourceDir = path.resolve(fileURLToPath(import.meta.url), `../../templates/${template}`)

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
      fs.cpSync(sourceDir, targetDir, { recursive: true })
      await renamePackageJsonName(targetDir, projectName)
      execSync('npm install', { cwd: projectName, stdio: 'inherit' })
      
      console.log(`✅ Project "${projectName}" has been successfully generated\n`)
      if (templates.find(t => t.value === template).installationCommands.length > 0) {
        console.log('You can start your project with the following commands:')
        console.log(`cd ${projectName}`)
        for (const command of templates.find(t => t.value === template).installationCommands) {
          console.log(command)
        }
      } else {
        console.log(`cd ${projectName}`)
        console.log('See README.md for setup instructions.')
      }
      console.log('Enjoy building with Genkit! 👍\n')
    } else {
      throw new Error("Target directory already exists!\nPlease choose another name or delete the existing directory.")
    }
  }
  catch(err){
    console.log(err.message)
  }
})()