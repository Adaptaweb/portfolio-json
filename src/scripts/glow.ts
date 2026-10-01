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

// Touch screens: simulate the hover while scrolling. The card crossing the middle of the viewport
// gets .scroll-lit (and a scrollfocus/scrollblur event, used by the project cards to play their
// demo), and a virtual pointer travels diagonally across it as it moves through the middle.
if (matchMedia('(hover: none)').matches) {
  let lit = new Set<HTMLElement>()
  let pending = false

  function sweep() {
    pending = false
    const mid = innerHeight / 2
    const next = new Set<HTMLElement>()
    for (const el of document.querySelectorAll<HTMLElement>('.glow-card')) {
      const r = el.getBoundingClientRect()
      if (r.height === 0 || r.top > mid || r.bottom < mid) continue
      const progress = (mid - r.top) / r.height
      el.style.setProperty('--x', `${r.width * (0.15 + 0.7 * progress)}px`)
      el.style.setProperty('--y', `${r.height * progress}px`)
      next.add(el)
    }
    for (const el of lit) if (!next.has(el)) (el.classList.remove('scroll-lit'), el.dispatchEvent(new Event('scrollblur')))
    for (const el of next) if (!lit.has(el)) (el.classList.add('scroll-lit'), el.dispatchEvent(new Event('scrollfocus')))
    lit = next
  }

  const request = () => {
    if (!pending) {
      pending = true
      requestAnimationFrame(sweep)
    }
  }
  addEventListener('scroll', request, { passive: true })
  addEventListener('resize', request, { passive: true })
  request()
}
