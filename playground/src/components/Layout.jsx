import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Icon, Logo, SearchBar, Toasts } from './ui'
import { useApp } from '../lib/store'
import { categories, studioTools, tools } from '../lib/data'

const menus = [
  { label: 'Explore', to: '/explore', items: [['All assets', '/explore'], ['Trending', '/trending'], ['Free', '/free'], ['Premium', '/premium'], ['Esports kits', '/assets/esports-kits'], ['Categories', '/categories']] },
  { label: 'Create', to: '/create', items: [['Studio home', '/create'], ...studioTools.slice(0, 5).map((t) => [t.name, `/studio/${t.slug}`])] },
  { label: 'Inspiration', to: '/inspiration', items: [['Gallery', '/inspiration'], ['Collections', '/collections'], ['Creators', '/creators/northframe']] },
  { label: 'Tools', to: '/tools', items: [['All tools', '/tools'], ...tools.slice(0, 5).map((t) => [t.name, `/tools/${t.slug}`])] },
  { label: 'Community', to: '/community', items: [['Community hub', '/community'], ['Challenges', '/challenges'], ['Upload work', '/upload'], ['Guides', '/learn']] },
]

function Dropdown({ m }) {
  const [open, setOpen] = useState(false); const ref = useRef()
  useEffect(() => { const h = (e) => !ref.current?.contains(e.target) && setOpen(false); document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-warm/80 hover:text-warm">{m.label}<Icon name="ChevronDown" size={13} /></button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 w-56 pt-1">
          <div className="card p-1.5 shadow-2xl">{m.items.map(([l, to]) => <Link role="menuitem" key={l} to={to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm text-warm/80 hover:bg-raise hover:text-warm">{l}</Link>)}</div>
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useApp(); const [open, setOpen] = useState(false); const ref = useRef()
  useEffect(() => { const h = (e) => !ref.current?.contains(e.target) && setOpen(false); document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  if (!user) return <><Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">Sign in</Link><Link to="/pricing" className="btn btn-primary btn-sm">Join Pro</Link></>
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Account menu" aria-expanded={open} className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-sm font-bold text-ink">{user.name[0].toUpperCase()}</button>
      {open && (
        <div className="card absolute right-0 top-full z-50 mt-2 w-52 p-1.5 shadow-2xl" role="menu">
          <p className="px-3 py-2 text-xs text-mute">Signed in as <span className="text-warm">{user.name}</span></p>
          {[['Dashboard', '/dashboard'], ['Downloads', '/downloads'], ['Favorites', '/favorites'], ['My designs', '/my-designs'], ['Settings', '/settings'], ...(user.role === 'admin' ? [['Admin CMS', '/admin']] : [])].map(([l, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-raise" role="menuitem">{l}</Link>)}
          <button onClick={() => { logout(); setOpen(false) }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-accent hover:bg-raise" role="menuitem">Sign out</button>
        </div>
      )}
    </div>
  )
}

function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme !== 'dark')
  const flip = () => {
    const next = !light; setLight(next)
    document.documentElement.dataset.theme = next ? 'light' : 'dark'
    localStorage.setItem('pg.theme', next ? 'light' : 'dark')
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', next ? '#FFFFFF' : '#12100E')
  }
  return <button onClick={flip} className="btn btn-ghost btn-sm !px-2" aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'} aria-pressed={light}><Icon name={light ? 'Moon' : 'Sun'} size={18} /></button>
}

function Header() {
  const [drawer, setDrawer] = useState(false); const { pathname } = useLocation()
  useEffect(() => setDrawer(false), [pathname])
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-x flex h-16 items-center gap-4">
        <button className="btn btn-ghost btn-sm lg:hidden -ml-2" aria-label="Open menu" onClick={() => setDrawer(true)}><Icon name="Menu" size={20} /></button>
        <Logo />
        <nav className="ml-4 hidden items-center lg:flex" aria-label="Primary">{menus.map((m) => <Dropdown key={m.label} m={m} />)}</nav>
        <div className="ml-auto hidden w-full max-w-xs md:block"><SearchBar placeholder="Search assets, designs…" /></div>
        <span className="ml-auto flex items-center md:ml-0"><ThemeToggle /><Link to="/dashboard" className="btn btn-ghost btn-sm !px-2" aria-label="Notifications"><Icon name="Bell" size={18} /></Link></span>
        <UserMenu />
      </div>
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Menu">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto border-r border-line bg-ink p-5">
            <div className="mb-5 flex items-center justify-between"><Logo /><button className="btn btn-ghost btn-sm" onClick={() => setDrawer(false)} aria-label="Close"><Icon name="X" /></button></div>
            <SearchBar className="mb-5" />
            {menus.map((m) => (<div key={m.label} className="mb-4"><p className="label">{m.label}</p>{m.items.map(([l, to]) => <NavLink key={to + l} to={to} className="block py-2 text-sm text-warm/80">{l}</NavLink>)}</div>))}
          </div>
        </div>
      )}
    </header>
  )
}

const cols = [
  ['Explore', [['All Assets', '/explore'], ['Trending', '/trending'], ['Free Assets', '/free'], ['Premium Assets', '/premium'], ['Esports Kits', '/assets/esports-kits']]],
  ['Create', [['Design Studio', '/create'], ['Logo Maker', '/studio/logo'], ['Banner Maker', '/studio/banner'], ['Overlay Editor', '/studio/overlay']]],
  ['Resources', [['Guides & Tutorials', '/learn'], ['Gaming Tools', '/tools'], ['Gaming Resources', '/gaming-resources'], ['Pricing', '/pricing'], ['Advertise', '/advertise']]],
  ['Community', [['Creator Hub', '/community'], ['Challenges', '/challenges'], ['Top Creators', '/creators/ashenpixel'], ['Submit Asset', '/upload']]],
  ['Legal', [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Licensing', '/licensing'], ['Contact Us', '/contact'], ['About', '/about']]],
]

function Newsletter() {
  const [email, setEmail] = useState(''); const [done, setDone] = useState(false); const { toast } = useApp()
  const submit = (e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Enter a valid email', 'info'); setDone(true); toast('Subscribed — demo only, nothing was stored') }
  return (
    <div>
      <h3 className="text-lg font-bold">Stay in the loop</h3>
      <p className="mt-1 text-sm text-mute">Latest updates and exclusive resources.</p>
      {done ? <p className="mt-4 text-sm text-accent">Thanks — you’re on the list.</p> : (
        <form onSubmit={submit} className="mt-4 flex gap-2"><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" aria-label="Email address" /><button className="btn btn-primary !px-3" aria-label="Subscribe"><Icon name="ArrowRight" /></button></form>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_3fr_1.4fr]">
        <div><Logo size="lg" /><p className="mt-4 max-w-[200px] text-sm text-mute">Your creative universe for gaming.</p>
          <div className="mt-5 flex gap-3 text-mute">{['MessageCircle', 'Twitter', 'Youtube', 'Instagram'].map((n) => <a key={n} href="#" onClick={(e) => e.preventDefault()} aria-label={n} className="hover:text-accent"><Icon name={n} /></a>)}</div></div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">{cols.map(([h, l]) => (<div key={h}><p className="mb-3 text-sm font-semibold">{h}</p><ul className="space-y-2">{l.map(([t, to]) => <li key={t}><Link to={to} className="text-sm text-mute hover:text-warm">{t}</Link></li>)}</ul></div>))}</div>
        <Newsletter />
      </div>
      <div className="border-t border-line"><div className="container-x flex flex-wrap justify-between gap-2 py-5 text-xs text-mute"><span>© 2025 Playground. All rights reserved. Prototype — all listings, ratings and creators are sample data. Some photos via Unsplash.</span><span>Made for Gamers · Built by Creators</span></div></div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-ink">Skip to content</a>
      <Header /><div id="main" className="flex-1"><Outlet /></div><Footer /><Toasts />
    </div>
  )
}
