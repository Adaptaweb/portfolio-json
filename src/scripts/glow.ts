// Pointer glow for `.glow`, `.btn` and `.glow-card` elements (styles in global.css), as brilloPuntero.ts in the
// Control de Acceso y Casino platform: one listener for the page, writing --x/--y (pointer position
// relative to each element) at most once per frame, also while the pointer only gets close.
const SELECTOR = '.glow, .btn, .glow-card'

let x = -9999
let y = -9999
let queued = false

function paint() {
  queued = false
  for (const el of document.querySelectorAll<HTMLElement>(SELECTOR)) {
    const r = el.getBoundingClientRect()
    // Skip what is far off screen: nothing there can glow.
    if (r.bottom < -200 || r.top > innerHeight + 200) continue
    el.style.setProperty('--x', `${x - r.left}px`)
    el.style.setProperty('--y', `${y - r.top}px`)
  }
}

function schedule() {
  if (!queued) {
    queued = true
    requestAnimationFrame(paint)
  }
}

document.addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse') return
    x = e.clientX
    y = e.clientY
    schedule()
  },
  { passive: true },
)
// Scrolling moves elements under a still pointer.
document.addEventListener('scroll', schedule, { passive: true, capture: true })
