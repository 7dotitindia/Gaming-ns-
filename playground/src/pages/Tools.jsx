import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Chip, Crumbs, Faq, Icon, Page, Toggle, copy } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { tools } from '../lib/data'
import { NotFound } from './Static'

const metaFor = {
  crosshair: 'Design a crosshair — shape, size, gap, thickness, outline and colour — and copy the settings.',
  sensitivity: 'Convert mouse sensitivity between popular FPS games using cm/360.',
  'name-generator': 'Generate gamertag ideas by style and copy your favourites.',
  fps: 'Convert FPS to frame time and compare against your monitor refresh rate.',
  'pc-builder': 'Pick PC parts, see compatibility warnings and an estimated total.',
  palette: 'Generate, lock, copy and export colour palettes.',
  resolution: 'Calculate aspect ratio, megapixels and scaled dimensions.',
  'setup-planner': 'A gaming setup checklist plus desk fit calculator.',
}

function Shell({ tool, onReset, children, note, share }) {
  const { toast } = useApp()
  return (
    <Page title={tool.name} desc={metaFor[tool.slug]}>
      <Crumbs items={[['Tools', '/tools'], [tool.name]]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold md:text-4xl">{tool.name}</h1><p className="mt-2 max-w-xl text-sm text-mute">{metaFor[tool.slug]}</p></div>
        <div className="flex gap-2"><button className="btn btn-secondary btn-sm" onClick={() => copy(location.href, toast)}><Icon name="Share2" size={14} />Share</button><button className="btn btn-secondary btn-sm" onClick={onReset}><Icon name="RotateCcw" size={14} />Reset</button></div>
      </div>
      {children}
      {note && <p className="mt-6 flex gap-2 text-xs text-mute"><Icon name="Info" size={14} className="shrink-0" />{note}</p>}
      <Faq path={`/tools/${tool.slug}`} />
    </Page>
  )
}

const Range = ({ label, v, set, min, max, step = 1 }) => <label className="block"><span className="label">{label} · {v}</span><input type="range" className="w-full" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} /></label>
const Out = ({ label, value }) => <div className="card p-4"><p className="label !mb-1">{label}</p><p className="font-display text-2xl font-bold">{value}</p></div>

/* ---------- Crosshair ---------- */
const CH0 = { style: 'cross', size: 8, gap: 4, thick: 2, outline: true, color: '#FF4D3D', dot: false }
function Crosshair({ tool }) {
  const { toast } = useApp(); const [c, setC] = useState(CH0); const cv = useRef(); const set = (k) => (v) => setC((x) => ({ ...x, [k]: v }))
  useEffect(() => {
    const g = cv.current.getContext('2d'); const W = 240, m = W / 2; g.clearRect(0, 0, W, W); g.fillStyle = '#16120F'; g.fillRect(0, 0, W, W)
    const S = 4; const draw = (col, extra = 0) => {
      g.fillStyle = col; g.strokeStyle = col; g.lineWidth = (c.thick + extra) * S
      if (c.style === 'circle') { g.beginPath(); g.arc(m, m, (c.size + c.gap) * S, 0, 7); g.stroke() }
      else if (c.style === 'cross') { const t = (c.thick + extra) * S, a = c.gap * S, l = c.size * S; [[m - a - l, m - t / 2, l, t], [m + a, m - t / 2, l, t], [m - t / 2, m - a - l, t, l], [m - t / 2, m + a, t, l]].forEach(([x, y, w, h]) => g.fillRect(x - extra * S / 2, y - extra * S / 2, w + extra * S, h + extra * S)) }
      if (c.dot || c.style === 'dot') g.fillRect(m - (c.thick + extra) * S / 2, m - (c.thick + extra) * S / 2, (c.thick + extra) * S, (c.thick + extra) * S)
    }
    if (c.outline) draw('#000', 1); draw(c.color)
  }, [c])
  const cmd = `cl_crosshairstyle 4; cl_crosshairsize ${c.size}; cl_crosshairgap ${c.gap - 3}; cl_crosshairthickness ${c.thick}; cl_crosshair_drawoutline ${+c.outline}; cl_crosshairdot ${+c.dot}; cl_crosshaircolor 5; cl_crosshaircolor_r ${parseInt(c.color.slice(1, 3), 16)}; cl_crosshaircolor_g ${parseInt(c.color.slice(3, 5), 16)}; cl_crosshaircolor_b ${parseInt(c.color.slice(5, 7), 16)}`
  return (
    <Shell tool={tool} onReset={() => setC(CH0)} note="Console commands follow Counter-Strike naming. Other games use their own crosshair editors — use the preview and values as a reference.">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="card grid place-items-center p-3"><canvas ref={cv} width="240" height="240" className="rounded-lg" aria-label="Crosshair preview" /></div>
        <div className="card space-y-4 p-5">
          <div className="flex flex-wrap gap-2">{['cross', 'dot', 'circle'].map((s) => <Chip key={s} on={c.style === s} onClick={() => set('style')(s)}>{s[0].toUpperCase() + s.slice(1)}</Chip>)}</div>
          <div className="grid gap-4 sm:grid-cols-3"><Range label="Size" v={c.size} set={set('size')} min={1} max={20} /><Range label="Gap" v={c.gap} set={set('gap')} min={0} max={15} /><Range label="Thickness" v={c.thick} set={set('thick')} min={1} max={6} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><Toggle label="Outline" checked={c.outline} onChange={set('outline')} /><Toggle label="Center dot" checked={c.dot} onChange={set('dot')} /></div>
          <label className="flex items-center gap-3 text-sm">Colour<input type="color" value={c.color} onChange={(e) => set('color')(e.target.value)} className="!h-8 !w-12" /><span className="font-mono text-xs text-mute">{c.color}</span></label>
          <div className="flex flex-wrap gap-2"><button className="btn btn-primary btn-sm" onClick={() => copy(cmd, toast)}>Copy console commands</button><button className="btn btn-secondary btn-sm" onClick={() => copy(JSON.stringify(c), toast)}>Copy JSON</button></div>
          <code className="block break-all rounded-lg bg-ink p-3 font-mono text-[11px] text-mute">{cmd}</code>
        </div>
      </div>
    </Shell>
  )
}

/* ---------- Sensitivity ---------- */
const GAMES = { 'CS2 / CS:GO': 0.022, Valorant: 0.07, 'Overwatch 2': 0.0066, 'Apex Legends': 0.022, 'Call of Duty': 0.0066 }
function Sensitivity({ tool }) {
  const { toast } = useApp()
  const [f, setF] = useState({ from: 'CS2 / CS:GO', to: 'Valorant', sens: 1.2, dpi: 800, dpi2: 800 })
  const cm360 = (360 * 2.54) / (f.sens * GAMES[f.from] * f.dpi); const out = (360 * 2.54) / (cm360 * GAMES[f.to] * f.dpi2)
  const valid = f.sens > 0 && f.dpi > 0 && f.dpi2 > 0
  const sel = (k, label) => <label key={k} className="block"><span className="label">{label}</span><select className="field" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{Object.keys(GAMES).map((g) => <option key={g}>{g}</option>)}</select></label>
  const inp = (k, label) => <label key={k} className="block"><span className="label">{label}</span><input type="number" min="0" step="any" className="field" value={f[k]} onChange={(e) => setF({ ...f, [k]: +e.target.value })} /></label>
  return (
    <Shell tool={tool} onReset={() => setF({ from: 'CS2 / CS:GO', to: 'Valorant', sens: 1.2, dpi: 800, dpi2: 800 })} note="Assumptions: raw input, 1:1 hipfire conversion by cm/360, game yaw values as published by the community (CS2 0.022, Valorant 0.07, Overwatch 2 0.0066, Apex 0.022, CoD 0.0066). Scoped / ADS sensitivity is not converted. Verify in-game.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card grid gap-4 p-5 sm:grid-cols-2">{sel('from', 'From game')}{inp('sens', 'Sensitivity')}{inp('dpi', 'Mouse DPI')}{sel('to', 'To game')}{inp('dpi2', 'Target DPI')}</div>
        <div className="grid grid-cols-2 gap-4 content-start"><Out label={`${f.to} sensitivity`} value={valid ? out.toFixed(3) : '—'} /><Out label="cm / 360°" value={valid ? cm360.toFixed(1) : '—'} /><button disabled={!valid} className="btn btn-primary col-span-2" onClick={() => copy(out.toFixed(3), toast)}>Copy result</button></div>
      </div>
    </Shell>
  )
}

/* ---------- Name generator ---------- */
const WORDS = {
  Cool: [['Shadow', 'Ghost', 'Neon', 'Frost', 'Viper', 'Onyx'], ['Blade', 'Strike', 'Pulse', 'Rift', 'Fang', 'Storm']],
  Fantasy: [['Ember', 'Arcane', 'Moon', 'Iron', 'Raven', 'Dusk'], ['Warden', 'Wisp', 'Sage', 'Bane', 'Crown', 'Thorn']],
  Tactical: [['Alpha', 'Delta', 'Recon', 'Vector', 'Apex', 'Zero'], ['Six', 'One', 'Actual', 'Wolf', 'Hawk', 'Echo']],
  Cute: [['Mochi', 'Pixel', 'Bun', 'Pico', 'Fluff', 'Boba'], ['Bean', 'Paws', 'Pop', 'Bit', 'Kitty', 'Dot']],
  Retro: [['Arcade', 'Turbo', 'Joy', 'Cyber', 'Pixel', 'Chip'], ['Kid', 'Master', 'Byte', 'Runner', 'Boy', 'Quest']],
}
const pick = (a) => a[Math.floor(Math.random() * a.length)]
function Names({ tool }) {
  const { toast } = useApp(); const [style, setStyle] = useState('Cool'); const [nums, setNums] = useState(true)
  const gen = () => { const out = new Set(); while (out.size < 12) { const [a, b] = WORDS[style]; out.add(pick(a) + pick(b) + (nums && Math.random() > 0.5 ? Math.floor(Math.random() * 99) : '')) } return [...out] }
  const [list, setList] = useState(gen); useEffect(() => setList(gen()), [style, nums]) // eslint-disable-line
  return (
    <Shell tool={tool} onReset={() => { setStyle('Cool'); setNums(true) }} note="Names are generated randomly and not checked for availability — search the platform before you commit.">
      <div className="flex flex-wrap items-center gap-2">{Object.keys(WORDS).map((s) => <Chip key={s} on={style === s} onClick={() => setStyle(s)}>{s}</Chip>)}<div className="ml-auto w-44"><Toggle label="Add numbers" checked={nums} onChange={setNums} /></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">{list.map((n) => <button key={n} onClick={() => copy(n, toast)} className="card flex items-center justify-between px-4 py-3 text-left font-display font-semibold transition hover:border-accent">{n}<Icon name="Copy" size={14} className="text-mute" /></button>)}</div>
      <button className="btn btn-primary mt-6" onClick={() => setList(gen())}><Icon name="RefreshCw" size={16} />Generate more</button>
    </Shell>
  )
}

/* ---------- FPS ---------- */
function Fps({ tool }) {
  const [fps, setFps] = useState(144); const [hz, setHz] = useState(144); const [target, setTarget] = useState(240)
  const ms = (n) => (n > 0 ? (1000 / n).toFixed(2) : '—')
  return (
    <Shell tool={tool} onReset={() => { setFps(144); setHz(144); setTarget(240) }} note="Approximate: this tool converts between FPS and frame time and compares with your refresh rate. It does not predict FPS for specific hardware or games — benchmark your own system for that.">
      <div className="grid gap-6 md:grid-cols-2"><div className="card grid gap-4 p-5 sm:grid-cols-3">{[['Current FPS', fps, setFps], ['Monitor Hz', hz, setHz], ['Target FPS', target, setTarget]].map(([l, v, s]) => <label key={l}><span className="label">{l}</span><input type="number" min="1" className="field" value={v} onChange={(e) => s(+e.target.value)} /></label>)}</div>
        <div className="grid grid-cols-2 gap-4"><Out label="Frame time now" value={`${ms(fps)} ms`} /><Out label="Frame time at target" value={`${ms(target)} ms`} /><Out label="Refresh interval" value={`${ms(hz)} ms`} /><Out label="Needed uplift" value={fps > 0 ? `${(((target / fps) - 1) * 100).toFixed(0)}%` : '—'} />
          <p className="col-span-2 text-sm text-warm/80">{fps < hz ? `You’re ${hz - fps} FPS below your display’s refresh rate — some refreshes repeat a frame.` : fps > hz ? `FPS exceeds ${hz} Hz; extra frames still lower input latency but won’t display fully.` : 'FPS matches your refresh rate.'}</p></div></div>
    </Shell>
  )
}

/* ---------- PC builder ---------- */
const PARTS = {
  CPU: [['Ryzen 5 (AM5)', 200, { sock: 'AM5' }], ['Ryzen 7 (AM5)', 330, { sock: 'AM5' }], ['Core i5 (LGA1700)', 220, { sock: 'LGA1700' }], ['Core i7 (LGA1700)', 340, { sock: 'LGA1700' }]],
  Motherboard: [['B650 (AM5, DDR5)', 170, { sock: 'AM5', ram: 'DDR5' }], ['B760 (LGA1700, DDR5)', 160, { sock: 'LGA1700', ram: 'DDR5' }], ['B760 (LGA1700, DDR4)', 130, { sock: 'LGA1700', ram: 'DDR4' }]],
  Memory: [['16GB DDR4', 45, { ram: 'DDR4' }], ['16GB DDR5', 65, { ram: 'DDR5' }], ['32GB DDR5', 120, { ram: 'DDR5' }]],
  GPU: [['Mid-range GPU (200W)', 330, { w: 200, len: 280 }], ['High-end GPU (320W)', 650, { w: 320, len: 330 }]],
  PSU: [['550W', 70, { w: 550 }], ['750W', 100, { w: 750 }], ['850W', 130, { w: 850 }]],
  Case: [['Compact case (max GPU 290mm)', 80, { len: 290 }], ['Mid tower (max GPU 360mm)', 110, { len: 360 }]],
}
function Pc({ tool }) {
  const [sel, setSel] = usePersist('pg.pc', {})
  const p = (k) => PARTS[k].find((x) => x[0] === sel[k])?.[2]
  const warn = useMemo(() => {
    const w = [], cpu = p('CPU'), mb = p('Motherboard'), ram = p('Memory'), gpu = p('GPU'), psu = p('PSU'), cs = p('Case')
    if (cpu && mb && cpu.sock !== mb.sock) w.push(`CPU socket (${cpu.sock}) doesn’t match the motherboard (${mb.sock}).`)
    if (mb && ram && mb.ram !== ram.ram) w.push(`Motherboard takes ${mb.ram} but you picked ${ram.ram} memory.`)
    if (gpu && psu && psu.w < gpu.w * 2) w.push(`A ${psu.w}W PSU is tight for a ${gpu.w}W GPU — aim for about ${gpu.w * 2}W+.`)
    if (gpu && cs && gpu.len > cs.len) w.push(`GPU (${gpu.len}mm) is longer than the case allows (${cs.len}mm).`)
    return w
  }, [sel]) // eslint-disable-line
  const total = Object.keys(PARTS).reduce((s, k) => s + (PARTS[k].find((x) => x[0] === sel[k])?.[1] || 0), 0)
  return (
    <Shell tool={tool} onReset={() => setSel({})} note="Prices are sample estimates, not live market prices. Compatibility checks cover socket, memory type, PSU headroom and GPU length only.">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">{Object.keys(PARTS).map((k) => <label key={k} className="card flex items-center gap-4 p-3"><span className="w-28 shrink-0 text-sm font-semibold">{k}</span><select className="field" value={sel[k] || ''} onChange={(e) => setSel({ ...sel, [k]: e.target.value })}><option value="">Choose {k}…</option>{PARTS[k].map(([n, pr]) => <option key={n} value={n}>{n} — ${pr}</option>)}</select></label>)}</div>
        <div className="card h-fit p-5"><p className="label">Estimated total</p><p className="font-display text-4xl font-bold">${total}</p>
          <div className="mt-4 space-y-2" aria-live="polite">{warn.length ? warn.map((w) => <p key={w} className="flex gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3 text-xs"><Icon name="TriangleAlert" size={14} className="mt-0.5 shrink-0 text-accent" />{w}</p>) : <p className="flex gap-2 text-sm text-warm/80"><Icon name="CircleCheck" size={16} className="text-accent" />{Object.keys(sel).length ? 'No compatibility issues found.' : 'Choose parts to check compatibility.'}</p>}</div></div>
      </div>
    </Shell>
  )
}

/* ---------- Palette ---------- */
const hsl = (h, s, l) => { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)) }; return '#' + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') }
const makePalette = () => { const h = Math.random() * 360; return [hsl(h, 70, 55), hsl((h + 30) % 360, 60, 40), hsl((h + 180) % 360, 55, 50), hsl(h, 20, 15), hsl(h, 25, 90)] }
function Palette({ tool }) {
  const { toast } = useApp(); const [cols, setCols] = useState(() => ['#FF4D3D', '#9A8F82', '#1B1815', '#12100E', '#F4ECDF']); const [locked, setLocked] = useState([])
  const gen = () => { const n = makePalette(); setCols(cols.map((c, i) => (locked.includes(i) ? c : n[i]))) }
  useEffect(() => { const k = (e) => { if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); gen() } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) })
  const exp = (fmt) => copy(fmt === 'css' ? `:root {\n${cols.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}` : JSON.stringify(cols), toast)
  return (
    <Shell tool={tool} onReset={() => { setCols(['#FF4D3D', '#9A8F82', '#1B1815', '#12100E', '#F4ECDF']); setLocked([]) }}>
      <div className="grid h-64 grid-cols-5 overflow-hidden rounded-xl border border-line">{cols.map((c, i) => (
        <div key={i} className="flex flex-col items-center justify-end gap-2 pb-4" style={{ background: c }}>
          <button onClick={() => setLocked(locked.includes(i) ? locked.filter((x) => x !== i) : [...locked, i])} aria-pressed={locked.includes(i)} aria-label={`${locked.includes(i) ? 'Unlock' : 'Lock'} colour ${i + 1}`} className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white"><Icon name={locked.includes(i) ? 'Lock' : 'LockOpen'} size={14} /></button>
          <button onClick={() => copy(c.toUpperCase(), toast)} className="rounded bg-black/50 px-2 py-1 font-mono text-xs text-white">{c.toUpperCase()}</button></div>))}</div>
      <div className="mt-5 flex flex-wrap gap-2"><button className="btn btn-primary" onClick={gen}><Icon name="Shuffle" size={16} />Generate <kbd className="ml-1 rounded bg-black/20 px-1 font-mono text-[10px]">Space</kbd></button><button className="btn btn-secondary" onClick={() => exp('css')}>Copy CSS variables</button><button className="btn btn-secondary" onClick={() => exp('json')}>Copy JSON</button></div>
    </Shell>
  )
}

/* ---------- Resolution ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
function Resolution({ tool }) {
  const [w, setW] = useState(2560); const [h, setH] = useState(1440); const [nw, setNw] = useState(1920)
  const ok = w > 0 && h > 0; const g = ok ? gcd(Math.round(w), Math.round(h)) : 1
  return (
    <Shell tool={tool} onReset={() => { setW(2560); setH(1440); setNw(1920) }}>
      <div className="flex flex-wrap gap-2">{[[1920, 1080], [2560, 1440], [3440, 1440], [3840, 2160], [1280, 720]].map(([a, b]) => <Chip key={a} on={w === a && h === b} onClick={() => { setW(a); setH(b) }}>{a}×{b}</Chip>)}</div>
      <div className="mt-6 grid gap-6 md:grid-cols-2"><div className="card grid gap-4 p-5 sm:grid-cols-3">{[['Width', w, setW], ['Height', h, setH], ['Scale to width', nw, setNw]].map(([l, v, s]) => <label key={l}><span className="label">{l}</span><input type="number" min="1" className="field" value={v} onChange={(e) => s(+e.target.value)} /></label>)}</div>
        <div className="grid grid-cols-2 gap-4"><Out label="Aspect ratio" value={ok ? `${w / g}:${h / g}` : '—'} /><Out label="Megapixels" value={ok ? ((w * h) / 1e6).toFixed(2) : '—'} /><Out label="Total pixels" value={ok ? (w * h).toLocaleString() : '—'} /><Out label={`Height at ${nw}w`} value={ok ? Math.round((nw * h) / w) : '—'} /></div></div>
    </Shell>
  )
}

/* ---------- Setup planner ---------- */
const CHECK = ['Monitor at eye level', 'Mouse + mousepad sized for sensitivity', 'Keyboard', 'Headset or speakers', 'Microphone + pop filter', 'Webcam + lighting', 'Cable management', 'Surge protector / UPS', 'Chair height & posture check', 'Ethernet connection']
function Setup({ tool }) {
  const [done, setDone] = usePersist('pg.setup', []); const [extra, setExtra] = usePersist('pg.setup.extra', []); const [txt, setTxt] = useState(''); const [desk, setDesk] = useState(140); const [mons, setMons] = useState(2); const [diag, setDiag] = useState(27)
  const all = [...CHECK, ...extra]; const mw = diag * 0.8715 * 2.54; const need = mw * mons
  return (
    <Shell tool={tool} onReset={() => { setDone([]); setExtra([]) }}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5"><h2 className="mb-3 font-semibold">Checklist · {done.filter((d) => all.includes(d)).length}/{all.length}</h2>
          <ul className="space-y-2">{all.map((c) => <li key={c}><label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="accent-[#FF4D3D]" checked={done.includes(c)} onChange={() => setDone(done.includes(c) ? done.filter((x) => x !== c) : [...done, c])} /><span className={done.includes(c) ? 'text-mute line-through' : ''}>{c}</span></label></li>)}</ul>
          <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (txt.trim() && !all.includes(txt.trim())) setExtra([...extra, txt.trim()]); setTxt('') }}><input className="field" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Add your own item" aria-label="New item" /><button className="btn btn-secondary">Add</button></form></div>
        <div className="card h-fit p-5"><h2 className="mb-3 font-semibold">Desk fit</h2><div className="grid gap-4 sm:grid-cols-3">{[['Desk width (cm)', desk, setDesk], ['Monitors', mons, setMons], ['Diagonal (in)', diag, setDiag]].map(([l, v, s]) => <label key={l}><span className="label">{l}</span><input type="number" min="1" className="field" value={v} onChange={(e) => s(+e.target.value)} /></label>)}</div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink"><div className={`h-full ${need > desk ? 'bg-red-500' : 'bg-accent'}`} style={{ width: `${Math.min(100, (need / desk) * 100)}%` }} /></div>
          <p className="mt-3 text-sm" aria-live="polite">{need > desk ? `Monitors need about ${Math.round(need)} cm but the desk is ${desk} cm — too wide.` : `Monitors take about ${Math.round(need)} cm of ${desk} cm (16:9 estimate).`}</p></div>
      </div>
    </Shell>
  )
}

const impl = { crosshair: Crosshair, sensitivity: Sensitivity, 'name-generator': Names, fps: Fps, 'pc-builder': Pc, palette: Palette, resolution: Resolution, 'setup-planner': Setup }

export default function Tools() {
  const { slug } = useParams()
  if (slug) { const t = tools.find((x) => x.slug === slug); if (!t) return <NotFound />; const C = impl[slug]; return <C tool={t} /> }
  return (
    <Page title="Gaming tools" desc="Free gaming utilities: crosshair generator, sensitivity converter, name generator, palette generator and more.">
      <Crumbs items={[['Tools']]} />
      <h1 className="text-3xl font-bold md:text-4xl">Powerful gaming tools</h1><p className="mt-2 mb-8 text-sm text-mute">Lightweight utilities that solve real tasks. Free, no sign-in needed.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map((t) => <Link key={t.slug} to={`/tools/${t.slug}`} className="card group p-5 transition hover:border-accent"><span className="text-accent"><Icon name={t.icon} size={26} /></span><h2 className="mt-4 font-semibold">{t.name}</h2><p className="mt-1 text-sm text-mute">{metaFor[t.slug]}</p></Link>)}</div>
    </Page>
  )
}
