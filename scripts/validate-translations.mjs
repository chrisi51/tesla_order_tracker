/**
 * Validates that all translation files have the same keys as en.json.
 * Usage: node scripts/validate-translations.mjs
 */

import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'

const messagesDir = join(import.meta.dirname, '..', 'messages')
const referenceFile = 'en.json'

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

const referenceJson = JSON.parse(readFileSync(join(messagesDir, referenceFile), 'utf-8'))
const referenceKeys = new Set(flattenKeys(referenceJson))

const files = readdirSync(messagesDir).filter(f => f.endsWith('.json') && f !== referenceFile)
let hasErrors = false

for (const file of files.sort()) {
  const locale = basename(file, '.json')
  const json = JSON.parse(readFileSync(join(messagesDir, file), 'utf-8'))
  const keys = new Set(flattenKeys(json))

  const missing = [...referenceKeys].filter(k => !keys.has(k))
  const extra = [...keys].filter(k => !referenceKeys.has(k))

  if (missing.length === 0 && extra.length === 0) {
    console.log(`✓ ${locale} — ${keys.size} keys OK`)
  } else {
    hasErrors = true
    console.log(`✗ ${locale}:`)
    if (missing.length > 0) {
      console.log(`  Missing (${missing.length}): ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ` ... +${missing.length - 10} more` : ''}`)
    }
    if (extra.length > 0) {
      console.log(`  Extra (${extra.length}): ${extra.slice(0, 10).join(', ')}${extra.length > 10 ? ` ... +${extra.length - 10} more` : ''}`)
    }
  }
}

console.log(`\nChecked ${files.length} files against ${referenceFile} (${referenceKeys.size} keys)`)
process.exit(hasErrors ? 1 : 0)
