// Generates the downloadable CV PDFs and the Open Graph image from the built site.
// Usage: npm run assets  (builds, serves dist/ with `astro preview`, prints with headless Chrome/Edge)
import { spawn, execSync, execFileSync } from 'node:child_process'
import { existsSync, copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const PORT = 4329
const BASE = `http://localhost:${PORT}`

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const browser = BROWSERS.find((p) => existsSync(p))
if (!browser) {
  console.error('No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta del navegador.')
  process.exit(1)
}

execSync('npx astro build', { stdio: 'inherit' })

const server = spawn(`npx astro preview --port ${PORT}`, { stdio: 'ignore', shell: true })

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${BASE}/cv`)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('astro preview no respondió a tiempo')
}

const profile = join(tmpdir(), `cv-assets-${Date.now()}`)
const headless = (args) =>
  execFileSync(browser, ['--headless=new', '--disable-gpu', `--user-data-dir=${profile}`, '--hide-scrollbars', ...args], {
    stdio: 'ignore',
  })

const outputs = [
  { file: 'cv-alejandro-tamayo.pdf', url: `${BASE}/cv`, pdf: true },
  { file: 'cv-alejandro-tamayo-ats.pdf', url: `${BASE}/cv?ats=1`, pdf: true },
  { file: 'og.png', url: `${BASE}/og`, pdf: false },
]

try {
  await waitForServer()
  mkdirSync('dist', { recursive: true })
  for (const { file, url, pdf } of outputs) {
    const target = resolve('public', file)
    headless(
      pdf
        ? ['--no-pdf-header-footer', '--virtual-time-budget=4000', `--print-to-pdf=${target}`, url]
        : ['--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${target}`, url],
    )
    copyFileSync(target, join('dist', file))
    console.log(`✓ ${target}`)
  }
} finally {
  // shell: true wraps preview in a shell; kill the whole tree so the port is released
  if (process.platform === 'win32') execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' })
  else server.kill()
  rmSync(profile, { recursive: true, force: true })
}
