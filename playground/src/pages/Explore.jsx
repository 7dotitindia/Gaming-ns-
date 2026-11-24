import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AssetCard, CardSkeleton, Chip, Crumbs, Demo, Empty, ErrorState, Faq, Icon, Page, SearchBar } from '../components/ui'
import Art from '../components/Art'
import { assets, categories, creators, getCat } from '../lib/data'

const PAGE = 9
const sorts = [['relevance', 'Relevance'], ['newest', 'Newest'], ['trending', 'Trending'], ['downloads', 'Most downloaded'], ['rating', 'Highest rated']]
const allFormats = [...new Set(assets.flatMap((a) => a.formats))].sort()
const allCompat = [...new Set(assets.flatMap((a) => a.compat))].sort()
const licenseKind = (a) => (a.license.startsWith('CC0') ? 'CC0' : a.license.includes('Extended') ? 'Extended' : a.license.includes('Free') ? 'Free' : 'Standard')

const Group = ({ title, children }) => <fieldset className="border-b border-line py-4 first:pt-0"><legend className="label">{title}</legend><div className="space-y-2">{children}</div></fieldset>
const Check = ({ checked, onChange, children }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-warm/80"><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#FF4D3D]" />{children}</label>
)

function Filters({ f, set, toggle, reset }) {
  return (
    <div>
      <Group title="Price">{[['', 'All'], ['free', 'Free'], ['premium', 'Premium']].map(([v, l]) => (
        <label key={v} className="flex cursor-pointer items-center gap-2 text-sm text-warm/80"><input type="radio" name="price" checked={f.price === v} onChange={() => set({ price: v })} className="accent-[#FF4D3D]" />{l}</label>))}</Group>
      <Group title="File format"><div className="flex flex-wrap gap-1.5">{allFormats.map((x) => <Chip key={x} on={f.fmt.includes(x)} onClick={() => toggle('fmt', x)}>{x}</Chip>)}</div></Group>
      <Group title="Compatibility"><div className="flex flex-wrap gap-1.5">{allCompat.slice(0, 12).map((x) => <Chip key={x} on={f.compat.includes(x)} onClick={() => toggle('compat', x)}>{x}</Chip>)}</div></Group>
      <Group title="License">{['Free', 'Standard', 'Extended', 'CC0'].map((l) => <Check key={l} checked={f.lic.includes(l)} onChange={() => toggle('lic', l)}>{l}</Check>)}</Group>
      <Group title="Minimum rating">{[0, 4, 4.5, 4.8].map((r) => (
        <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-warm/80"><input type="radio" name="rating" checked={f.rating === r} onChange={() => set({ rating: r })} className="accent-[#FF4D3D]" />{r ? `${r}+ stars` : 'Any'}</label>))}</Group>
      <Group title="Creator"><select className="field" value={f.creator} onChange={(e) => set({ creator: e.target.value })} aria-label="Creator"><option value="">All creators</option>{creators.map((c) => <option key={c.username} value={c.username}>{c.name}</option>)}</select></Group>
      <button className="btn btn-secondary mt-4 w-full" onClick={reset}>Reset filters</button>
    </div>
  )
}

const blank = { price: '', fmt: [], compat: [], lic: [], rating: 0, creator: '' }

export function Explore({ preset }) {
  const { cat } = useParams(); const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''; const sort = sp.get('sort') || (preset === 'trending' ? 'trending' : 'relevance')
  const [f, setF] = useState({ ...blank, price: preset === 'free' ? 'free' : preset === 'premium' ? 'premium' : '' })
  const [shown, setShown] = useState(PAGE); const [drawer, setDrawer] = useState(false)
  const [state, setState] = useState('loading'); const [attempt, setAttempt] = useState(0)
  const category = cat ? getCat(cat) : null
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const toggle = (k, v) => setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((i) => i !== v) : [...x[k], v] }))
  const reset = () => { setF({ ...blank }); setSp({}) }

  // Simulated async load so skeleton / error states are real, exercised UI.
  useEffect(() => { setState('loading'); const t = setTimeout(() => setState(sp.get('fail') ? 'error' : 'ready'), 450); return () => clearTimeout(t) }, [cat, preset, attempt]) // eslint-disable-line
  useEffect(() => setShown(PAGE), [f, q, sort, cat])
  useEffect(() => { if (preset) setF({ ...blank, price: preset === 'free' ? 'free' : preset === 'premium' ? 'premium' : '' }) }, [preset])

  const list = useMemo(() => {
    let r = assets.filter((a) =>
      (!cat || a.cat === cat) && (!q || `${a.title} ${a.tags.join(' ')} ${a.desc}`.toLowerCase().includes(q.toLowerCase())) &&
      (!f.price || (f.price === 'free') === !a.price) && (!f.fmt.length || f.fmt.some((x) => a.formats.includes(x))) &&
      (!f.compat.length || f.compat.some((x) => a.compat.includes(x))) && (!f.lic.length || f.lic.includes(licenseKind(a))) &&
      a.rating >= f.rating && (!f.creator || a.creator === f.creator))
    const key = { downloads: 'downloads', rating: 'rating' }[sort]
    if (key) r = [...r].sort((a, b) => b[key] - a[key])
    if (sort === 'trending') r = [...r].sort((a, b) => (b.trending - a.trending) || b.downloads - a.downloads)
    if (sort === 'newest') r = [...r].reverse()
    return r
  }, [cat, q, f, sort])

  const title = category?.name || { trending: 'Trending assets', free: 'Free assets', premium: 'Premium assets' }[preset] || (q ? `Results for “${q}”` : 'Explore assets')
  const activeCount = f.fmt.length + f.compat.length + f.lic.length + (f.price ? 1 : 0) + (f.rating ? 1 : 0) + (f.creator ? 1 : 0)

  return (
    <Page title={title} desc={category?.blurb || 'Browse gaming UI, 3D, streaming, audio, wallpapers and esports kits with clear licenses and formats.'}>
      <Crumbs items={category ? [['Explore', '/explore'], [category.name]] : [[title]]} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold md:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-sm text-mute">{category?.blurb || 'Every listing shows its license, formats and compatibility up front.'}</p></div>
        <Demo />
      </div>

      {category?.slug === 'esports-kits' && (
        <div className="card mb-6 grid gap-4 p-5 sm:grid-cols-4">{[['Identity packs', 'Logo, marks, palette, type'], ['Jersey mockups', 'Jersey, hoodie, merch'], ['Roster & matchday', 'Player cards, posters, results'], ['Social packs', 'Feed, story, headers']].map(([t, d]) => <div key={t}><p className="text-sm font-semibold">{t}</p><p className="mt-0.5 text-xs text-mute">{d}</p></div>)}</div>
      )}

      <div className="scroll-hide mb-6 flex gap-2 overflow-x-auto pb-1">
        <Link to="/explore" className={`chip ${!cat ? 'chip-on' : ''}`}>All</Link>
        {categories.map((c) => <Link key={c.slug} to={`/assets/${c.slug}`} className={`chip ${cat === c.slug ? 'chip-on' : ''}`}>{c.name}</Link>)}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters"><Filters {...{ f, set, toggle, reset }} /></aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button className="btn btn-secondary btn-sm lg:hidden" onClick={() => setDrawer(true)}><Icon name="SlidersHorizontal" size={14} />Filters{activeCount ? ` (${activeCount})` : ''}</button>
            <div className="min-w-[200px] flex-1"><SearchBar key={q} defaultValue={q} placeholder="Search within results…" /></div>
            <label className="flex items-center gap-2 text-sm text-mute">Sort<select className="field !h-9 !w-auto" value={sort} onChange={(e) => setSp((p) => { p.set('sort', e.target.value); return p })}>{sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          </div>
          {state !== 'loading' && <p className="mb-4 font-mono text-xs uppercase tracking-wider text-mute" aria-live="polite">{list.length} result{list.length !== 1 && 's'}</p>}

          {state === 'loading' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
            : state === 'error' ? <ErrorState onRetry={() => { setSp({}); setAttempt((n) => n + 1) }} />
            : !list.length ? <Empty title="No assets match" text="Try removing a filter or searching for something broader." action={<button className="btn btn-secondary" onClick={reset}>Clear all filters</button>} />
            : <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.slice(0, shown).map((a) => <AssetCard key={a.slug} a={a} />)}</div>
              {shown < list.length && <div className="mt-8 text-center"><button className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE)}>Load more ({list.length - shown} left)</button></div>}
            </>}
        </div>
      </div>

      <Faq path={cat ? `/assets/${cat}` : preset ? `/${preset}` : '/explore'} />

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal aria-label="Filters">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-line bg-ink p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button className="btn btn-ghost btn-sm" onClick={() => setDrawer(false)} aria-label="Close"><Icon name="X" /></button></div>
            <Filters {...{ f, set, toggle, reset }} /><button className="btn btn-primary mt-4 w-full" onClick={() => setDrawer(false)}>Show {list.length} results</button>
          </div>
        </div>
      )}
    </Page>
  )
}

export function Categories() {
  return (
    <Page title="Categories" desc="Browse every PLAYGROUND asset category.">
      <Crumbs items={[['Categories']]} />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Browse by category</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.slug} to={`/assets/${c.slug}`} className="card group overflow-hidden transition hover:border-accent">
            <div className="aspect-[16/7] overflow-hidden"><div className="h-full transition duration-300 group-hover:scale-105"><Art kind={c.art} seed={c.slug.length} /></div></div>
            <div className="flex items-start gap-3 p-4"><span className="text-accent"><Icon name={c.icon} size={22} /></span><div><h2 className="font-semibold">{c.name}</h2><p className="mt-1 text-sm text-mute">{c.blurb}</p><p className="mt-2 font-mono text-[11px] uppercase text-mute">{assets.filter((a) => a.cat === c.slug).length} sample assets</p></div></div>
          </Link>))}
      </div>
    </Page>
  )
}
