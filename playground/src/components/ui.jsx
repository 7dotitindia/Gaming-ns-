import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import * as Lucide from '../lib/icons'
import { AnimatePresence, motion } from 'framer-motion'
import Art from './Art'
import { useApp } from '../lib/store'
import { fmtNum, getCat, getCreator } from '../lib/data'
import { useSeo } from '../lib/head'
import { faqsFor } from '../lib/faqs'

export const Icon = ({ name, ...p }) => { const C = Lucide[name] || Lucide.Circle; return <C size={18} strokeWidth={1.75} aria-hidden {...p} /> }

export const Logo = ({ size = 'md' }) => (
  <Link to="/" className="inline-flex items-center gap-2 font-display font-bold tracking-wide" aria-label="PLAYGROUND home">
    <svg width={size === 'lg' ? 30 : 24} height={size === 'lg' ? 30 : 24} viewBox="0 0 32 32" aria-hidden><path d="M4 3l24 13L4 29l5-13z" fill="rgb(79,70,229)" /></svg>
    <span className={size === 'lg' ? 'text-xl' : 'text-[15px]'}>PLAYGROUND</span>
  </Link>
)

// Applies per-route SEO (title, description, canonical, Open Graph, JSON-LD) and resets scroll on navigation.
export function Page({ children, wide }) {
  const { pathname } = useLocation()
  useSeo()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className={wide ? '' : 'container-x py-8 md:py-12'}>{children}</motion.main>
}

export const Crumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
    <Link to="/" className="hover:text-warm">Home</Link>
    {items.map(([label, to], i) => (
      <span key={label} className="flex items-center gap-1.5"><Icon name="ChevronRight" size={12} />{to ? <Link to={to} className="hover:text-warm">{label}</Link> : <span className="text-warm" aria-current="page">{label}</span>}</span>
    ))}
  </nav>
)

export const SectionHead = ({ title, sub, to, cta = 'View all', eyebrow }) => (
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>{eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}<h2 className="text-xl md:text-2xl font-bold">{title}</h2>{sub && <p className="mt-1 text-sm text-mute">{sub}</p>}</div>
    {to && <Link to={to} className="shrink-0 text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">{cta}<Icon name="ArrowRight" size={14} /></Link>}
  </div>
)

export const Stars = ({ v, n }) => (
  <span className="inline-flex items-center gap-1 text-xs text-mute"><Icon name="Star" size={13} className="fill-coral text-coral" />{v.toFixed(1)}{n != null && <span>({fmtNum(n)})</span>}</span>
)

export const PriceTag = ({ price }) => (
  <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold ${price ? 'bg-warm/90 text-ink' : 'bg-mint text-white'}`}>{price ? `$${price}` : 'Free'}</span>
)

export const Empty = ({ icon = 'SearchX', title, text, action }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center">
    <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-raise text-mute"><Icon name={icon} size={22} /></div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {text && <p className="mt-1 max-w-sm text-sm text-mute">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const ErrorState = ({ onRetry }) => (
  <Empty icon="TriangleAlert" title="Something went wrong" text="We couldn't load this content. Check your connection and try again." action={<button className="btn btn-secondary" onClick={onRetry}>Retry</button>} />
)

export const CardSkeleton = () => (
  <div className="card overflow-hidden"><div className="skeleton aspect-video" /><div className="space-y-2 p-3"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-1/2 rounded" /></div></div>
)

// Gate for actions that need an account — sends visitors to /login and returns them after.
export function useGate() {
  const { user } = useApp(); const nav = useNavigate(); const loc = useLocation(); const { toast } = useApp()
  return (fn) => (...a) => {
    if (!user) { toast('Sign in to continue', 'info'); nav('/login', { state: { from: loc.pathname } }); return }
    fn(...a)
  }
}

export function SaveButton({ slug, className = '' }) {
  const { favorites, toggleFav } = useApp(); const gate = useGate(); const on = favorites.includes(slug)
  return (
    <button onClick={gate(() => toggleFav(slug))} aria-pressed={on} aria-label={on ? 'Remove from favorites' : 'Save to favorites'}
      className={`grid h-8 w-8 place-items-center rounded-full bg-white/90 border border-line shadow-sm hover:border-accent transition ${className}`}>
      <Icon name="Heart" size={15} className={on ? 'fill-coral text-coral' : 'text-mute'} />
    </button>
  )
}

export function AssetCard({ a }) {
  const cat = getCat(a.cat); const cr = getCreator(a.creator)
  return (
    <article className="group relative card overflow-hidden transition hover:border-mute hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/asset/${a.slug}`} className="relative block aspect-video overflow-hidden">
        <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]"><Art kind={a.art} seed={a.seed} src={a.img} label={`${a.title} preview`} /></div>
        <span className="absolute left-2 top-2"><PriceTag price={a.price} /></span>
      </Link>
      <SaveButton slug={a.slug} className="absolute right-2 top-2" />
      <div className="p-3">
        <Link to={`/asset/${a.slug}`} className="block truncate text-sm font-semibold hover:text-accent">{a.title}</Link>
        <p className="mt-0.5 truncate text-xs text-mute">{cat?.name} · {cr?.name}</p>
        <div className="mt-2 flex items-center justify-between"><Stars v={a.rating} n={a.reviews} /><span className="inline-flex items-center gap-1 text-xs text-mute"><Icon name="Download" size={12} />{fmtNum(a.downloads)}</span></div>
      </div>
    </article>
  )
}

export function SearchBar({ big, placeholder = 'Search assets, templates, or tools…', className = '', defaultValue = '' }) {
  const nav = useNavigate(); const [q, setQ] = useState(defaultValue)
  const submit = (e) => { e.preventDefault(); nav(`/explore?q=${encodeURIComponent(q.trim())}`) }
  return (
    <form onSubmit={submit} role="search" className={`flex items-center gap-2 rounded-full border border-line bg-raise pl-4 ${big ? 'h-14 pr-1.5' : 'h-10 pr-1'} ${className}`}>
      <Icon name="Search" size={16} className="text-mute shrink-0" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Search" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mute" />
      <button className={`btn btn-primary rounded-full ${big ? 'h-11 px-6' : 'btn-sm'}`}>Search</button>
    </form>
  )
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-warm/30 p-4" onClick={onClose}>
          <motion.div role="dialog" aria-modal aria-label={title} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} className="card w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">{title}</h3><button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close"><Icon name="X" /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-auto flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-lg">
            <Icon name={t.kind === 'info' ? 'Info' : 'CircleCheck'} size={16} className="text-accent" />{t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export const Tabs = ({ tabs, value, onChange, className = '' }) => (
  <div role="tablist" className={`scroll-hide flex gap-1 overflow-x-auto border-b border-line ${className}`}>
    {tabs.map(([k, label]) => (
      <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
        className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${value === k ? 'text-warm' : 'text-mute hover:text-warm'}`}>
        {label}{value === k && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />}
      </button>
    ))}
  </div>
)

export const Stat = ({ label, value }) => (
  <div className="card p-4"><p className="label !mb-1">{label}</p><p className="font-display text-2xl font-bold">{value}</p></div>
)

export const Demo = () => <span className="rounded-md border border-line bg-raise px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">Sample data</span>

export const Chip = ({ on, children, ...p }) => <button aria-pressed={on} className={`chip ${on ? 'chip-on' : ''}`} {...p}>{children}</button>

export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">{label}
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-accent' : 'bg-line'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  </label>
)

export const copy = async (text, toast) => { try { await navigator.clipboard.writeText(text); toast('Copied to clipboard') } catch { toast('Copy failed — select and copy manually', 'info') } }

// Answer-first FAQ (visible on the page and mirrored as FAQPage JSON-LD in lib/seo.js).
export function Faq({ path, title = 'Frequently asked questions' }) {
  const items = faqsFor(path)
  if (!items.length) return null
  return (
    <section className="mt-16" aria-labelledby="faq-h"><h2 id="faq-h" className="mb-4 text-xl font-bold md:text-2xl">{title}</h2>
      <div className="divide-y divide-line rounded-xl border border-line bg-white">{items.map(([q, a]) => (
        <details key={q} className="group px-5 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold md:text-base">{q}<Icon name="ChevronDown" size={16} className="shrink-0 text-mute transition group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-relaxed text-warm/75">{a}</p></details>))}</div>
    </section>
  )
}
