// Editor engine: structured JSON document + pure canvas renderer (used for preview AND export).
export const FONTS = ['Space Grotesk', 'Inter', 'IBM Plex Mono']
export const uid = () => Math.random().toString(36).slice(2, 9)

const measureCtx = document.createElement('canvas').getContext('2d')
const fontOf = (e) => `${e.weight || 700} ${e.size}px "${e.font}", sans-serif`

export function wrap(e) {
  measureCtx.font = fontOf(e)
  return String(e.text).split('\n').flatMap((para) => {
    const out = []; let line = ''
    for (const word of para.split(' ')) {
      const t = line ? `${line} ${word}` : word
      if (line && measureCtx.measureText(t).width > e.w) { out.push(line); line = word } else line = t
    }
    return [...out, line]
  })
}
export const lineH = (e) => e.size * 1.15
// Axis-aligned bounds — text height derives from wrapped lines.
export const bounds = (e) => (e.type === 'text' ? { ...e, h: wrap(e).length * lineH(e) } : e)

export function draw(ctx, doc, imgs, { transparent = false, selected = null } = {}) {
  const { w, h } = doc
  ctx.clearRect(0, 0, w, h)
  if (!transparent) { ctx.fillStyle = doc.bg; ctx.fillRect(0, 0, w, h) }
  for (const e of doc.els) {
    if (e.hidden) continue
    ctx.save(); ctx.globalAlpha = e.opacity ?? 1
    if (e.glow) { ctx.shadowColor = e.glowColor || e.fill; ctx.shadowBlur = e.glow }
    ctx.fillStyle = e.fill
    if (e.type === 'rect') {
      if (e.radius) { ctx.beginPath(); ctx.roundRect(e.x, e.y, e.w, e.h, e.radius); ctx.fill() } else ctx.fillRect(e.x, e.y, e.w, e.h)
    } else if (e.type === 'ellipse') {
      ctx.beginPath(); ctx.ellipse(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill()
    } else if (e.type === 'slash') { // parallelogram accent
      const k = e.w * 0.35; ctx.beginPath(); ctx.moveTo(e.x + k, e.y); ctx.lineTo(e.x + e.w, e.y); ctx.lineTo(e.x + e.w - k, e.y + e.h); ctx.lineTo(e.x, e.y + e.h); ctx.closePath(); ctx.fill()
    } else if (e.type === 'text') {
      ctx.font = fontOf(e); ctx.textBaseline = 'top'; ctx.textAlign = e.align || 'left'
      const ax = e.align === 'center' ? e.x + e.w / 2 : e.align === 'right' ? e.x + e.w : e.x
      wrap(e).forEach((l, i) => ctx.fillText(e.upper ? l.toUpperCase() : l, ax, e.y + i * lineH(e)))
    } else if (e.type === 'image' && imgs.get(e.src)?.complete) {
      const im = imgs.get(e.src); const s = (e.fit === 'contain' ? Math.min : Math.max)(e.w / im.width, e.h / im.height)
      const dw = im.width * s, dh = im.height * s
      ctx.beginPath(); ctx.rect(e.x, e.y, e.w, e.h); ctx.clip()
      ctx.drawImage(im, e.x + (e.w - dw) / 2 + (e.px || 0), e.y + (e.h - dh) / 2 + (e.py || 0), dw, dh)
    }
    ctx.restore()
  }
  if (selected) { // selection chrome — never part of exports
    const b = bounds(selected); ctx.save(); ctx.strokeStyle = '#FF4D3D'; ctx.lineWidth = Math.max(2, w / 700); ctx.setLineDash([8, 6]); ctx.strokeRect(b.x, b.y, b.w, b.h)
    ctx.setLineDash([]); ctx.fillStyle = '#FF4D3D'; const s = Math.max(10, w / 120); ctx.fillRect(b.x + b.w - s / 2, b.y + b.h - s / 2, s, s); ctx.restore()
  }
}

export const hit = (doc, x, y) => [...doc.els].reverse().find((e) => { if (e.hidden) return false; const b = bounds(e); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h })

const T = (w, h, o) => ({ id: uid(), type: 'text', font: 'Space Grotesk', weight: 700, align: 'left', fill: '#F4ECDF', opacity: 1, ...o })
const R = (o) => ({ id: uid(), type: 'rect', fill: '#FF4D3D', opacity: 1, ...o })

// Templates are fractions of the canvas so they work for any tool's dimensions.
export const templates = [
  { name: 'Ember', make: (w, h) => ({ w, h, bg: '#12100E', els: [
    { id: uid(), type: 'slash', x: w * 0.58, y: -h * 0.05, w: w * 0.3, h: h * 1.1, fill: '#FF4D3D', opacity: 0.9 },
    { id: uid(), type: 'slash', x: w * 0.7, y: -h * 0.05, w: w * 0.1, h: h * 1.1, fill: '#F4ECDF', opacity: 0.15 },
    T(w, h, { x: w * 0.06, y: h * 0.28, w: w * 0.55, size: Math.round(Math.min(h * 0.15, (w * 0.55) / 6.2)), text: 'LEVEL UP\nYOUR GAME', upper: true }),
    T(w, h, { x: w * 0.06, y: h * 0.78, w: w * 0.5, size: Math.round(h * 0.05), weight: 500, font: 'IBM Plex Mono', text: 'LIVE EVERY NIGHT · 8PM', fill: '#FF4D3D' }),
  ] }) },
  { name: 'Minimal', make: (w, h) => ({ w, h, bg: '#F4ECDF', els: [
    R({ x: w * 0.06, y: h * 0.12, w: w * 0.04, h: h * 0.76, fill: '#FF4D3D' }),
    T(w, h, { x: w * 0.13, y: h * 0.3, w: w * 0.7, size: Math.round(h * 0.2), text: 'Play with purpose.', fill: '#12100E' }),
    T(w, h, { x: w * 0.13, y: h * 0.72, w: w * 0.6, size: Math.round(h * 0.06), weight: 500, font: 'Inter', text: 'Your name · your channel', fill: '#9A8F82' }),
  ] }) },
  { name: 'Spotlight', make: (w, h) => ({ w, h, bg: '#1B1815', els: [
    { id: uid(), type: 'ellipse', x: w * 0.55, y: h * 0.1, w: h * 0.8, h: h * 0.8, fill: '#FF4D3D', opacity: 0.9, glow: 40 },
    { id: uid(), type: 'ellipse', x: w * 0.6, y: h * 0.18, w: h * 0.64, h: h * 0.64, fill: '#12100E', opacity: 1 },
    T(w, h, { x: w * 0.06, y: h * 0.36, w: w * 0.5, size: Math.round(Math.min(h * 0.16, (w * 0.5) / 5)), text: 'GAME ON', upper: true, glow: 18, glowColor: '#FF4D3D' }),
    T(w, h, { x: w * 0.06, y: h * 0.62, w: w * 0.5, size: Math.round(h * 0.055), weight: 500, font: 'Inter', text: 'Add your tagline here', fill: '#9A8F82' }),
  ] }) },
]

export const addable = {
  text: (d) => T(0, 0, { x: d.w * 0.1, y: d.h * 0.1, w: d.w * 0.5, size: Math.round(d.h * 0.1), text: 'New text' }),
  rect: (d) => R({ x: d.w * 0.1, y: d.h * 0.1, w: d.w * 0.25, h: d.h * 0.2, radius: 0 }),
  ellipse: (d) => ({ id: uid(), type: 'ellipse', x: d.w * 0.1, y: d.h * 0.1, w: d.h * 0.25, h: d.h * 0.25, fill: '#FF4D3D', opacity: 1 }),
  slash: (d) => ({ id: uid(), type: 'slash', x: d.w * 0.1, y: d.h * 0.1, w: d.w * 0.15, h: d.h * 0.6, fill: '#FF4D3D', opacity: 1 }),
}
export const icons = ['★', '✦', '◆', '▲', '⚡', '☠', '♛', '✚']
export const iconEl = (d, ch) => T(0, 0, { x: d.w * 0.1, y: d.h * 0.1, w: d.h * 0.2, size: Math.round(d.h * 0.2), text: ch, fill: '#FF4D3D', font: 'Inter', align: 'center' })
