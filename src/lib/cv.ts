import cv from '@cv'

export type Project = Omit<(typeof cv.projects)[number], 'architecture' | 'media' | 'url' | 'urlLabel' | 'thumb' | 'highlights' | 'shortName' | 'uxDetails'> & {
  endDate?: string
  /** Name for tight spots (browser bar of the demo, command palette). */
  shortName?: string
  summary?: string
  /** Key points shown on the featured card (titles) and the case page (full text). */
  highlights?: { title: string; text: string }[]
  /** User-experience decisions shown on the case page ("Detalles de experiencia"). */
  uxDetails?: { title: string; text: string }[]
  url?: string
  urlLabel?: string
  /** Card capture: a fixed `src` (+ optional hover `video`), or a demo clip `base` with -claro/-oscuro versions. */
  thumb?: { src?: string; base?: string; frame: 'phone' | 'browser'; alt: string; domain?: string; video?: string; wide?: boolean }
  media?: { src: string; caption: string; title?: string; device?: 'phone' | 'tablet' }[]
  problem?: string
  context?: string[]
  decisions?: { title: string; text: string }[]
  results?: string[]
  architecture?: {
    clients: Node[]
    services: Node[]
    data: Node[]
  }
}
type Node = { name: string; detail: string; primary?: boolean }

export const { basics, work, education, skills, languages, licenses } = cv
export const projects = cv.projects as Project[]

const MONTHS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.']

/** "2017-06" → "jun. 2017"; "2012" → "2012"; undefined → "actualidad" */
export function formatDate(date?: string) {
  if (!date) return 'actualidad'
  const [year, month] = date.split('-')
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year
}

export function formatRange(start: string, end?: string) {
  return `${formatDate(start)} – ${formatDate(end)}`
}

export function yearOf(date?: string) {
  return date ? date.slice(0, 4) : 'hoy'
}

export const profile = (network: string) => basics.profiles.find((p) => p.network === network)

/** Projects with more to show than their card (write-up, demo clips or a known role) get a /casos page. */
export const hasDetailPage = (p: Project) => Boolean(p.problem || p.media || p.entity === 'Workmate')

export const PDF_PATH = '/cv-alejandro-tamayo.pdf'
export const PDF_ATS_PATH = '/cv-alejandro-tamayo-ats.pdf'
