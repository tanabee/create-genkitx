#!/usr/bin/env node
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'glob'

/**
 * Function to update the version property in package.json
 * @param {string} filePath - Path to the package.json file
 * @param {string} newVersion - New version to set
 */
const updatePackageVersion = async (filePath, newVersion) => {
  try {
    const packageJsonData = await readFile(filePath, 'utf8')
    const packageJson = JSON.parse(packageJsonData)
    const oldVersion = packageJson.version
    packageJson.version = newVersion
    await writeFile(
      filePath,
      JSON.stringify(packageJson, null, 2),
      'utf8'
    )
    console.log(`✅ Updated ${filePath}: ${oldVersion} -> ${newVersion}`)
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message)
  }
}

/**
 * Function to update version in all package.json files
 * @param {string} newVersion - New version to set
 */
const updateAllPackageVersions = async (newVersion) => {
  // Update root package.json
  const rootPackagePath = path.resolve(process.cwd(), 'package.json')
  await updatePackageVersion(rootPackagePath, newVersion)

  // Find and update package.json files in templates directory
  // Using glob with ignore option to exclude node_modules
  const templatesPattern = 'templates/**/package.json'
  const templatePackageFiles = await glob(templatesPattern, {
    ignore: ['**/node_modules/**'],
    cwd: process.cwd(),
    absolute: true
  })
  
  for (const filePath of templatePackageFiles) {
    await updatePackageVersion(filePath, newVersion)
  }
}

// Get new version from command line arguments
const newVersion = process.argv[2]

if (!newVersion) {
  console.error('Error: Please specify a version')
  console.log('Usage: npm run update-version <newVersion>')
  process.exit(1)
}

updateAllPackageVersions(newVersion)
  .then(() => console.log('✅ Successfully updated version in all package.json files'))
  .catch(error => console.error('Error:', error.message))
