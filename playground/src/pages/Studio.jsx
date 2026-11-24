import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Art from '../components/Art'
import { Crumbs, Empty, Faq, Icon, Page, Tabs, Toggle, useGate } from '../components/ui'
import { useApp } from '../lib/store'
import { useSeo } from '../lib/head'
import { studioTools } from '../lib/data'
import { FONTS, addable, bounds, draw, hit, iconEl, icons, templates, uid } from '../lib/editor'

const presets = [['Banner 1500×500', 1500, 500], ['Thumbnail 1280×720', 1280, 720], ['Square 1000×1000', 1000, 1000], ['Story 1080×1920', 1080, 1920], ['HD 1920×1080', 1920, 1080]]

function Hub() {
  const { designs } = useApp()
  return (
    <Page title="Customization Studio" desc="Start from a template, edit in your browser and export PNG or JPG.">
      <Crumbs items={[['Create']]} />
      <div className="mb-8 max-w-2xl"><p className="eyebrow">Customization Studio</p><h1 className="mt-1 text-4xl font-bold">Design. Customize. Export.</h1><p className="mt-3 text-mute">Pick a tool, start from a template, edit text, shapes and images, then export. Projects save to your account so you can keep editing.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {studioTools.map((t) => (
          <Link key={t.slug} to={`/studio/${t.slug}`} className="card group overflow-hidden transition hover:border-accent">
            <div className="aspect-video overflow-hidden"><div className="h-full transition duration-300 group-hover:scale-105"><Art kind="poster" seed={t.w % 7 + 1} /></div></div>
            <div className="p-4"><h2 className="text-sm font-semibold">{t.name}</h2><p className="mt-1 text-xs text-mute">{t.desc}</p><p className="mt-2 font-mono text-[11px] text-mute">{t.w} × {t.h}</p></div>
          </Link>))}
      </div>
      {designs.length > 0 && <section className="mt-12"><h2 className="mb-4 text-xl font-bold">Continue editing</h2><div className="grid gap-4 sm:grid-cols-4">{designs.slice(0, 4).map((d) => <Link key={d.id} to={`/studio/${d.tool}?project=${d.id}`} className="card overflow-hidden hover:border-accent"><img src={d.thumb} alt={d.name} className="aspect-video w-full object-cover" /><p className="truncate p-3 text-sm">{d.name}</p></Link>)}</div></section>}
    <Faq path="/create" />
    </Page>
  )
}

const Num = ({ label, value, onChange, ...p }) => (
  <label className="block"><span className="label">{label}</span><input type="number" className="field !h-8 px-2 text-xs" value={Math.round(value)} onChange={(e) => onChange(+e.target.value)} {...p} /></label>
)
const Color = ({ label, value, onChange }) => (
  <label className="block"><span className="label">{label}</span><span className="flex h-8 items-center gap-2 rounded-lg border border-line bg-ink px-1.5"><span className="h-5 w-5 overflow-hidden rounded"><input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} /></span><span className="font-mono text-xs text-mute">{value}</span></span></label>
)

function Editor({ tool }) {
  const { designs, setDesigns, toast } = useApp(); const gate = useGate(); const [sp] = useSearchParams()
  const saved = designs.find((d) => d.id === sp.get('project'))
  const [doc, setDoc] = useState(() => saved?.doc || templates[0].make(tool.w, tool.h))
  const [name, setName] = useState(saved?.name || `${tool.name} design`)
  const [selId, setSelId] = useState(null); const [zoom, setZoom] = useState(null); const [fit, setFit] = useState(0.4)
  const [tab, setTab] = useState('templates'); const [fmt, setFmt] = useState('png'); const [transparent, setTransparent] = useState(false)
  const [, tick] = useState(0); const [dirty, setDirty] = useState(false)
  const cv = useRef(); const wrap = useRef(); const imgs = useRef(new Map()); const hist = useRef({ past: [], future: [], key: '', t: 0 })
  const drag = useRef(null); const pid = useRef(saved?.id || uid())
  const sel = doc.els.find((e) => e.id === selId); const z = zoom ?? fit

  // History: coalesce rapid edits to the same field (sliders, typing) into one undo step.
  const commit = useCallback((next, key = '') => {
    const h = hist.current; const now = Date.now()
    if (!(key && h.key === key && now - h.t < 700)) { h.past.push(doc); h.future = [] }
    h.key = key; h.t = now; setDoc(next); setDirty(true)
  }, [doc])
  const undo = () => { const h = hist.current; if (!h.past.length) return; h.future.push(doc); setDoc(h.past.pop()); h.key = '' }
  const redo = () => { const h = hist.current; if (!h.future.length) return; h.past.push(doc); setDoc(h.future.pop()); h.key = '' }
  const patch = (id, p, key) => commit({ ...doc, els: doc.els.map((e) => (e.id === id ? { ...e, ...p } : e)) }, key && `${id}.${key}`)
  const add = (el) => { commit({ ...doc, els: [...doc.els, el] }); setSelId(el.id) }
  const remove = (id) => { commit({ ...doc, els: doc.els.filter((e) => e.id !== id) }); setSelId(null) }
  const move = (id, d) => { const i = doc.els.findIndex((e) => e.id === id), j = i + d; if (j < 0 || j >= doc.els.length) return; const els = [...doc.els];[els[i], els[j]] = [els[j], els[i]]; commit({ ...doc, els }) }
  const dup = (e) => add({ ...e, id: uid(), x: e.x + 24, y: e.y + 24 })

  // Preload images + fonts, then repaint.
  useEffect(() => {
    doc.els.filter((e) => e.type === 'image' && !imgs.current.has(e.src)).forEach((e) => { const im = new Image(); im.onload = () => tick((n) => n + 1); im.src = e.src; imgs.current.set(e.src, im) })
  }, [doc])
  useEffect(() => { Promise.all(FONTS.map((f) => document.fonts.load(`700 20px "${f}"`))).then(() => tick((n) => n + 1)) }, [])
  useEffect(() => { const c = cv.current; c.width = doc.w; c.height = doc.h; draw(c.getContext('2d'), doc, imgs.current, { selected: sel }) })

  // Fit-to-container zoom.
  useEffect(() => {
    const el = wrap.current; const f = () => setFit(Math.min((el.clientWidth - 32) / doc.w, 520 / doc.h, 1))
    f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect()
  }, [doc.w, doc.h])

  useEffect(() => {
    const k = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo() }
      else if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo() }
      else if (sel && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); remove(sel.id) }
      else if (sel && e.key.startsWith('Arrow')) { e.preventDefault(); const s = e.shiftKey ? 20 : 2; patch(sel.id, { x: sel.x + ({ ArrowLeft: -s, ArrowRight: s }[e.key] || 0), y: sel.y + ({ ArrowUp: -s, ArrowDown: s }[e.key] || 0) }, 'nudge') }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  })

  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return [(e.clientX - r.left) * (doc.w / r.width), (e.clientY - r.top) * (doc.h / r.height)] }
  const down = (e) => {
    const [x, y] = pt(e); cv.current.setPointerCapture(e.pointerId)
    if (sel) { const b = bounds(sel), s = Math.max(24, doc.w / 60); if (Math.abs(x - (b.x + b.w)) < s && Math.abs(y - (b.y + b.h)) < s) { drag.current = { mode: 'resize', x, y, start: doc, id: sel.id, o: sel }; return } }
    const h = hit(doc, x, y); setSelId(h?.id ?? null)
    if (h) drag.current = { mode: 'move', x, y, start: doc, id: h.id, o: h }
  }
  const dragMove = (e) => {
    const d = drag.current; if (!d) return; const [x, y] = pt(e); const dx = x - d.x, dy = y - d.y
    const p = d.mode === 'move' ? { x: d.o.x + dx, y: d.o.y + dy } : d.o.type === 'text' ? { w: Math.max(40, d.o.w + dx) } : { w: Math.max(10, d.o.w + dx), h: Math.max(10, d.o.h + dy) }
    setDoc({ ...d.start, els: d.start.els.map((el) => (el.id === d.id ? { ...el, ...p } : el)) })
  }
  const up = () => { const d = drag.current; drag.current = null; if (d && doc !== d.start) { hist.current.past.push(d.start); hist.current.future = []; hist.current.key = ''; setDirty(true) } }

  const upload = (e) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) return toast('Use a PNG, JPG, WebP or GIF image', 'info')
    if (file.size > 5e6) return toast('Image is over 5 MB', 'info')
    const r = new FileReader(); r.onload = () => add({ id: uid(), type: 'image', src: r.result, x: doc.w * 0.1, y: doc.h * 0.1, w: doc.w * 0.4, h: doc.h * 0.6, fit: 'cover', opacity: 1, fill: '#000' }); r.readAsDataURL(file)
  }

  const resize = (w, h) => {
    w = Math.min(4000, Math.max(100, w || 0)); h = Math.min(4000, Math.max(100, h || 0)); const rx = w / doc.w, ry = h / doc.h, rs = Math.min(rx, ry)
    commit({ ...doc, w, h, els: doc.els.map((e) => ({ ...e, x: e.x * rx, y: e.y * ry, w: e.w * rx, h: e.h * ry, ...(e.size ? { size: Math.round(e.size * rs) } : {}) })) })
  }
  const render = (tr) => { const c = document.createElement('canvas'); c.width = doc.w; c.height = doc.h; draw(c.getContext('2d'), doc, imgs.current, { transparent: tr }); return c }
  const exportFile = () => {
    const tr = transparent && fmt === 'png'
    render(tr).toBlob((b) => { const url = URL.createObjectURL(b); Object.assign(document.createElement('a'), { href: url, download: `${name.replace(/\W+/g, '-').toLowerCase()}.${fmt === 'png' ? 'png' : 'jpg'}` }).click(); URL.revokeObjectURL(url); toast(`Exported ${doc.w}×${doc.h} ${fmt.toUpperCase()}`) }, fmt === 'png' ? 'image/png' : 'image/jpeg', 0.92)
  }
  const save = gate(() => {
    const t = document.createElement('canvas'); t.width = 480; t.height = Math.round((480 * doc.h) / doc.w); t.getContext('2d').drawImage(render(false), 0, 0, t.width, t.height)
    const rec = { id: pid.current, tool: tool.slug, name, doc, thumb: t.toDataURL('image/jpeg', 0.7), updated: new Date().toISOString() }
    try { setDesigns([rec, ...designs.filter((d) => d.id !== rec.id)]); setDirty(false); toast('Project saved to My designs') } catch { toast('Could not save — storage full', 'info') }
  })

  useSeo(); useEffect(() => { window.scrollTo(0, 0) }, [tool])
  const p = (k, v, key) => patch(sel.id, { [k]: v }, key ?? k)
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-graphite px-3 py-2" role="toolbar" aria-label="Editor toolbar">
        <Link to="/create" className="btn btn-ghost btn-sm" aria-label="Back to studio"><Icon name="ArrowLeft" size={16} /></Link>
        <input className="field !h-8 !w-48 text-xs" value={name} onChange={(e) => { setName(e.target.value); setDirty(true) }} aria-label="Project name" />
        <div className="mx-1 h-5 w-px bg-line" />
        <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!hist.current.past.length} aria-label="Undo"><Icon name="Undo2" size={16} /></button>
        <button className="btn btn-ghost btn-sm" onClick={redo} disabled={!hist.current.future.length} aria-label="Redo"><Icon name="Redo2" size={16} /></button>
        <div className="mx-1 h-5 w-px bg-line" />
        <button className="btn btn-ghost btn-sm" onClick={() => setZoom(Math.max(0.1, z - 0.1))} aria-label="Zoom out"><Icon name="ZoomOut" size={16} /></button>
        <button className="btn btn-ghost btn-sm w-14 font-mono" onClick={() => setZoom(null)} title="Fit to screen">{Math.round(z * 100)}%</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setZoom(Math.min(2, z + 0.1))} aria-label="Zoom in"><Icon name="ZoomIn" size={16} /></button>
        <span className="hidden font-mono text-[11px] text-mute md:inline">{doc.w} × {doc.h}px</span>
        <div className="ml-auto flex items-center gap-2">
          {dirty && <span className="hidden text-xs text-mute sm:inline">Unsaved</span>}
          <button className="btn btn-secondary btn-sm" onClick={save}><Icon name="Save" size={14} />Save</button>
          <button className="btn btn-primary btn-sm" onClick={exportFile}><Icon name="Download" size={14} />Export {fmt.toUpperCase()}</button>
        </div>
      </div>

      <div className="grid flex-1 lg:grid-cols-[264px_1fr_280px]">
        <aside className="order-2 border-line bg-graphite lg:order-1 lg:border-r" aria-label="Templates, assets and layers">
          <Tabs tabs={[['templates', 'Templates'], ['add', 'Add'], ['layers', 'Layers']]} value={tab} onChange={setTab} />
          <div className="max-h-[60vh] space-y-3 overflow-y-auto p-4 lg:max-h-[calc(100vh-9.5rem)]">
            {tab === 'templates' && templates.map((t) => { const d = t.make(320, Math.round((320 * doc.h) / doc.w)); return (
              <button key={t.name} className="block w-full overflow-hidden rounded-lg border border-line text-left hover:border-accent" onClick={() => { commit(t.make(doc.w, doc.h)); setSelId(null) }}>
                <MiniPreview doc={d} imgs={imgs.current} /><span className="block px-3 py-2 text-xs font-medium">{t.name}</span></button>) })}
            {tab === 'add' && <>
              <div className="grid grid-cols-2 gap-2">{[['text', 'Type', 'Text'], ['rect', 'Square', 'Rectangle'], ['ellipse', 'Circle', 'Circle'], ['slash', 'Slash', 'Slash']].map(([k, ic, l]) => <button key={k} className="btn btn-secondary flex-col !h-16 gap-1 text-xs" onClick={() => add(addable[k](doc))}><Icon name={ic === 'Slash' ? 'Minus' : ic} />{l}</button>)}</div>
              <label className="btn btn-secondary w-full cursor-pointer"><Icon name="ImagePlus" size={16} />Upload image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={upload} /></label>
              <div><p className="label">Icons</p><div className="grid grid-cols-4 gap-2">{icons.map((c) => <button key={c} className="btn btn-secondary !px-0 text-lg" onClick={() => add(iconEl(doc, c))} aria-label={`Add ${c}`}>{c}</button>)}</div></div>
            </>}
            {tab === 'layers' && (doc.els.length ? [...doc.els].reverse().map((e) => (
              <div key={e.id} className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs ${e.id === selId ? 'border-accent bg-ink' : 'border-line'}`}>
                <button className="min-w-0 flex-1 truncate text-left" onClick={() => setSelId(e.id)}>{e.type === 'text' ? e.text.split('\n')[0] || 'Text' : e.type === 'image' ? 'Image' : e.type[0].toUpperCase() + e.type.slice(1)}</button>
                <button onClick={() => patch(e.id, { hidden: !e.hidden })} aria-label={e.hidden ? 'Show layer' : 'Hide layer'} className="p-1 text-mute hover:text-warm"><Icon name={e.hidden ? 'EyeOff' : 'Eye'} size={14} /></button>
                <button onClick={() => move(e.id, 1)} aria-label="Bring forward" className="p-1 text-mute hover:text-warm"><Icon name="ArrowUp" size={14} /></button>
                <button onClick={() => move(e.id, -1)} aria-label="Send backward" className="p-1 text-mute hover:text-warm"><Icon name="ArrowDown" size={14} /></button>
                <button onClick={() => remove(e.id)} aria-label="Delete layer" className="p-1 text-mute hover:text-accent"><Icon name="Trash2" size={14} /></button>
              </div>)) : <p className="text-sm text-mute">No layers yet. Add something from the Add tab.</p>)}
          </div>
        </aside>

        <section ref={wrap} className="order-1 grid min-h-[320px] place-items-center overflow-auto bg-raise p-4 lg:order-2" aria-label="Canvas">
          <canvas ref={cv} onPointerDown={down} onPointerMove={dragMove} onPointerUp={up} role="img" aria-label={`${name} canvas, ${doc.w} by ${doc.h}`}
            style={{ width: doc.w * z, height: doc.h * z, touchAction: 'none', cursor: 'default', boxShadow: '0 0 0 1px #3A322B, 0 20px 60px #000' }}
            className={fmt === 'png' && transparent ? '[background:repeating-conic-gradient(#d4d4d8_0_25%,#f4f4f5_0_50%)_0_0/16px_16px]' : ''} />
        </section>

        <aside className="order-3 border-line bg-graphite p-4 lg:border-l" aria-label="Properties">
          {sel ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-sm font-semibold capitalize">{sel.type}</h2><div className="flex"><button className="btn btn-ghost btn-sm" onClick={() => dup(sel)} aria-label="Duplicate"><Icon name="Copy" size={14} /></button><button className="btn btn-ghost btn-sm" onClick={() => remove(sel.id)} aria-label="Delete"><Icon name="Trash2" size={14} /></button></div></div>
              {sel.type === 'text' && <>
                <label className="block"><span className="label">Text</span><textarea className="field !h-20 py-2" value={sel.text} onChange={(e) => p('text', e.target.value)} /></label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block"><span className="label">Font</span><select className="field !h-8 px-2 text-xs" value={sel.font} onChange={(e) => p('font', e.target.value)}>{FONTS.map((f) => <option key={f}>{f}</option>)}</select></label>
                  <Num label="Size" value={sel.size} onChange={(v) => p('size', Math.max(8, v))} />
                </div>
                <div className="flex gap-1.5">{['left', 'center', 'right'].map((a) => <button key={a} onClick={() => p('align', a)} aria-label={`Align ${a}`} aria-pressed={sel.align === a} className={`btn btn-sm flex-1 ${sel.align === a ? 'btn-primary' : 'btn-secondary'}`}><Icon name={`Align${a[0].toUpperCase() + a.slice(1)}`} size={14} /></button>)}
                  <button onClick={() => p('weight', sel.weight >= 700 ? 500 : 700)} aria-label="Toggle bold" aria-pressed={sel.weight >= 700} className={`btn btn-sm flex-1 ${sel.weight >= 700 ? 'btn-primary' : 'btn-secondary'}`}><Icon name="Bold" size={14} /></button>
                  <button onClick={() => p('upper', !sel.upper)} aria-label="Uppercase" aria-pressed={!!sel.upper} className={`btn btn-sm flex-1 text-xs ${sel.upper ? 'btn-primary' : 'btn-secondary'}`}>AA</button></div>
              </>}
              {sel.type !== 'image' && <Color label="Color" value={sel.fill} onChange={(v) => p('fill', v)} />}
              {sel.type === 'image' && <div className="flex gap-1.5">{['cover', 'contain'].map((f) => <button key={f} onClick={() => p('fit', f)} className={`btn btn-sm flex-1 capitalize ${sel.fit === f ? 'btn-primary' : 'btn-secondary'}`}>{f === 'cover' ? 'Fill / crop' : 'Fit'}</button>)}</div>}
              <div className="grid grid-cols-2 gap-2"><Num label="X" value={sel.x} onChange={(v) => p('x', v, 'pos')} /><Num label="Y" value={sel.y} onChange={(v) => p('y', v, 'pos')} /><Num label="Width" value={sel.w} onChange={(v) => p('w', Math.max(10, v), 'dim')} />{sel.type !== 'text' && <Num label="Height" value={sel.h} onChange={(v) => p('h', Math.max(10, v), 'dim')} />}</div>
              {sel.type === 'rect' && <label className="block"><span className="label">Corner radius · {sel.radius || 0}</span><input type="range" min="0" max="200" value={sel.radius || 0} onChange={(e) => p('radius', +e.target.value)} className="w-full" /></label>}
              <label className="block"><span className="label">Opacity · {Math.round((sel.opacity ?? 1) * 100)}%</span><input type="range" min="0" max="1" step="0.05" value={sel.opacity ?? 1} onChange={(e) => p('opacity', +e.target.value)} className="w-full" /></label>
              {sel.type !== 'image' && <label className="block"><span className="label">Glow · {sel.glow || 0}</span><input type="range" min="0" max="80" value={sel.glow || 0} onChange={(e) => p('glow', +e.target.value)} className="w-full" /></label>}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Canvas</h2>
              <Color label="Background" value={doc.bg} onChange={(v) => commit({ ...doc, bg: v }, 'bg')} />
              <div className="grid grid-cols-2 gap-2"><Num label="Width" value={doc.w} onChange={(v) => resize(v, doc.h)} /><Num label="Height" value={doc.h} onChange={(v) => resize(doc.w, v)} /></div>
              <label className="block"><span className="label">Size preset</span><select className="field !h-8 px-2 text-xs" value="" onChange={(e) => { const [, w, h] = presets[e.target.value]; resize(w, h) }}><option value="" disabled>Choose…</option>{presets.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></label>
              <div className="border-t border-line pt-4"><h2 className="mb-3 text-sm font-semibold">Export</h2>
                <div className="flex gap-1.5">{['png', 'jpg'].map((f) => <button key={f} onClick={() => setFmt(f)} aria-pressed={fmt === f} className={`btn btn-sm flex-1 uppercase ${fmt === f ? 'btn-primary' : 'btn-secondary'}`}>{f}</button>)}</div>
                <div className={`mt-3 ${fmt !== 'png' ? 'opacity-40' : ''}`}><Toggle label="Transparent background" checked={transparent && fmt === 'png'} onChange={(v) => fmt === 'png' && setTransparent(v)} /></div>
                <p className="mt-3 font-mono text-[11px] text-mute">Output: {doc.w} × {doc.h}px</p></div>
              <p className="text-xs text-mute">Select a layer on the canvas to edit it. Drag to move, drag the corner square to resize. Shortcuts: Del, arrows, Ctrl+Z / Ctrl+Y.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function MiniPreview({ doc, imgs }) {
  const ref = useRef()
  useEffect(() => { const c = ref.current; c.width = doc.w; c.height = doc.h; draw(c.getContext('2d'), doc, imgs); Promise.all(FONTS.map((f) => document.fonts.load(`700 20px "${f}"`))).then(() => draw(c.getContext('2d'), doc, imgs)) }, [doc, imgs])
  return <canvas ref={ref} className="block w-full" aria-hidden />
}

export default function Studio() {
  const { tool } = useParams(); if (!tool) return <Hub />
  const t = studioTools.find((x) => x.slug === tool)
  if (!t) return <Page title="Tool not found"><Empty title="Studio tool not found" action={<Link to="/create" className="btn btn-primary">Back to studio</Link>} /></Page>
  return <Editor key={tool} tool={t} />
}
