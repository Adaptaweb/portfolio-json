// Light/dark demo clips, as in the Control de Acceso y Casino presentation.
// Every clip exists twice: `${base}-claro.mp4` and `${base}-oscuro.mp4` (plus a `.webp` poster each).
// Only the clips change theme; the page around them stays dark.

export type Mode = 'auto' | 'claro' | 'oscuro'
export type Phase = 'claro' | 'oscuro'

export const clipUrl = (base: string, phase: Phase, ext: 'mp4' | 'webp' = 'mp4') => `${base}-${phase}.${ext}`

/** Theme currently shown by the Showcase that contains `el` (light when there is none). */
export const phaseOf = (el: Element): Phase =>
  (el.closest<HTMLElement>('[data-demo-mode]')?.dataset.phase as Phase | undefined) ?? 'claro'

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** Point a video at another clip/phase without the sweep (used when changing clips). */
export function loadClip(video: HTMLVideoElement, base: string, phase: Phase) {
  video.dataset.base = base
  video.dataset.phase = phase
  video.poster = clipUrl(base, phase, 'webp')
  video.src = clipUrl(base, phase)
}

/**
 * Freeze the frame a video is showing on a canvas laid exactly over it, so the next clip or theme can
 * load underneath and the canvas is then animated away. Returns null when there is nothing to freeze.
 */
function freezeFrame(video: HTMLVideoElement): HTMLCanvasElement | null {
  const frame = video.parentElement
  frame?.querySelectorAll('canvas.theme-cover').forEach((c) => c.remove())
  if (!frame || video.readyState < 2 || !video.videoWidth || reducedMotion()) return null
  const cover = document.createElement('canvas')
  cover.className = 'theme-cover'
  cover.width = video.videoWidth
  cover.height = video.videoHeight
  try {
    cover.getContext('2d')!.drawImage(video, 0, 0, cover.width, cover.height)
  } catch {
    return null
  }
  const r = video.getBoundingClientRect()
  const f = frame.getBoundingClientRect()
  Object.assign(cover.style, {
    position: 'absolute',
    zIndex: '2',
    pointerEvents: 'none',
    objectFit: 'cover',
    objectPosition: getComputedStyle(video).objectPosition,
    left: `${r.left - f.left}px`,
    top: `${r.top - f.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    borderRadius: getComputedStyle(video).borderRadius,
  })
  frame.append(cover)
  return cover
}

/** Animate a frozen frame away and make sure it never stays behind (animations stall in hidden tabs). */
function dismiss(cover: HTMLCanvasElement, keyframes: Keyframe[], duration: number) {
  cover.animate(keyframes, { duration, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }).onfinish = () =>
    cover.remove()
  setTimeout(() => cover.remove(), duration + 450)
}

/** Move to another clip (next in a sequence or a tab click) with a crossfade from the current frame. */
export function changeClip(video: HTMLVideoElement, base: string, phase: Phase) {
  const cover = freezeFrame(video)
  loadClip(video, base, phase)
  if (cover) {
    video.addEventListener('loadeddata', () => dismiss(cover, [{ opacity: 1 }, { opacity: 0 }], 600), { once: true })
    // If the clip is paused before it loads (pointer left the card), don't leave the frozen frame on top.
    setTimeout(() => cover.remove(), 2500)
  }
  video.play().catch(() => {})
}

/**
 * Swap a playing clip to the other theme: the current frame is frozen on a canvas above the video
 * and, once the new version paints, the canvas is wiped away with a circular sweep.
 */
export function switchPhase(video: HTMLVideoElement, phase: Phase) {
  const base = video.dataset.base
  if (!base || video.dataset.phase === phase) return
  const time = video.currentTime
  const resume = !video.paused
  const cover = freezeFrame(video)

  loadClip(video, base, phase)
  if (!resume && !cover) return

  video.addEventListener(
    'loadeddata',
    () => {
      try {
        video.currentTime = Math.min(time, (video.duration || time) - 0.1)
      } catch {}
      if (cover) {
        const origin = phase === 'oscuro' ? '100% 0%' : '0% 100%'
        dismiss(cover, [{ clipPath: `circle(150% at ${origin})` }, { clipPath: `circle(0% at ${origin})` }], 750)
      }
    },
    { once: true },
  )
  // With preload="none" nothing is fetched until play() or an explicit load, so trigger one.
  if (resume) video.play().catch(() => {})
  else {
    video.preload = 'auto'
    video.load()
  }
}
