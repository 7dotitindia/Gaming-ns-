import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Faq, Icon, Page, SearchBar } from '../components/ui'
import { Mono, TemplatePreview } from '../components/Previews'
import { assets, categories, collections, creators, guides, getAsset, kitTypes, shots, studioTools, tools } from '../lib/data'

const heroChips = [['Game UI', '/assets/game-ui'], ['3D Assets', '/assets/3d'], ['Streaming', '/assets/streaming'], ['Esports Kits', '/esports'], ['Wallpapers', '/assets/wallpapers'], ['Audio', '/assets/audio']]

function Hero() {
  const nav = useNavigate()
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Art kind="hood" seed={2} src="/images/hero.jpg" priority sizes="100vw" label="Gamer in an orange headset playing on a lit monitor" className="object-[70%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>
      <div className="container-x flex min-h-[88vh] flex-col justify-end pb-10 pt-28 md:pb-14">
        <Mono className="text-accent">The gaming creative marketplace</Mono>
        <h1 className="display-xl mt-5 max-w-5xl">Create beyond<br />the <span className="text-accent">game.</span></h1>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <p className="text-lg text-warm/80">Discover assets, customize your gaming identity, and build something extraordinary.</p>
            <SearchBar big placeholder="Search HUDs, overlays, jerseys, sprites…" className="mt-6 !rounded !bg-ink/80 backdrop-blur-sm" />
            <div className="mt-4 flex flex-wrap gap-2">{heroChips.map(([l, to]) => <button key={l} className="chip bg-ink/60" onClick={() => nav(to)}>{l}</button>)}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/explore" className="btn btn-primary h-12 px-6">Explore the marketplace<Icon name="ArrowRight" size={16} /></Link>
            <Link to="/create" className="btn btn-secondary h-12 px-6">Open the Studio</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const Block = ({ children, className = '' }) => <section className={`container-x pt-24 ${className}`}>{children}</section>
const Head = ({ n, eyebrow, title, to, cta = 'View all' }) => (
  <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-5">
    <div><Mono className="text-mute">{n} / {eyebrow}</Mono><h2 className="display-lg mt-2">{title}</h2></div>
    {to && <Link to={to} className="hidden shrink-0 items-center gap-1 text-sm text-warm/70 hover:text-accent sm:inline-flex">{cta}<Icon name="ArrowRight" size={14} /></Link>}
  </div>
)

function Trending() {
  const list = assets.filter((a) => a.trending).slice(0, 5)
  const [lead, ...rest] = list
  return (
    <Block>
      <Head n="01" eyebrow="Editor's picks" title="Trending assets" to="/trending" />
      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        <div className="lg:col-span-2 lg:row-span-2 [&>article]:h-full [&_a.relative]:aspect-auto [&_a.relative]:h-[calc(100%-96px)] [&_a.relative]:min-h-[320px]"><AssetCard a={lead} /></div>
        {rest.map((a) => <AssetCard key={a.slug} a={a} />)}
      </div>
    </Block>
  )
}

function Categories() {
  return (
    <Block>
      <Head n="02" eyebrow="Browse" title="Every kind of asset" to="/categories" cta="All categories" />
      <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <Link to={c.slug === 'esports-kits' ? '/esports' : `/assets/${c.slug}`} className="group relative block h-44 overflow-hidden border-b border-r border-line p-4 transition hover:bg-graphite">
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-25" aria-hidden><Art kind={c.art} seed={i + 2} /></div>
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between"><Mono className="text-mute">{String(i + 1).padStart(2, '0')}</Mono><span className="text-mute transition group-hover:text-accent"><Icon name={c.icon} size={20} /></span></div>
                <div><h3 className="font-display text-lg font-semibold">{c.name}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-mute">{assets.filter((a) => a.cat === c.slug).length} listings</p></div>
              </div>
            </Link>
          </li>))}
      </ul>
    </Block>
  )
}

function Esports() {
  const kits = assets.filter((a) => a.kit)
  return (
    <section className="mt-24 border-y border-line bg-graphite">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-24">
        <div className="flex flex-col">
          <Mono className="text-accent">03 / Esports Team Kits</Mono>
          <h2 className="display-lg mt-3">One identity.<br />Every matchday.</h2>
          <p className="mt-5 max-w-md text-warm/70">Logos, jerseys, hoodies, player cards, rosters, brackets, MVP cards and result graphics, built as systems so your team looks the same on every channel.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {kitTypes.map((k, i) => (
              <li key={k.slug}><Link to={`/esports?type=${k.slug}`} className="group flex items-center justify-between py-3.5 text-sm"><span className="flex items-baseline gap-4"><Mono className="text-mute">{String(i + 1).padStart(2, '0')}</Mono><span className="font-display text-lg font-medium group-hover:text-accent">{k.name}</span></span><Icon name="ArrowRight" size={16} className="text-mute transition group-hover:translate-x-1 group-hover:text-accent" /></Link></li>))}
          </ul>
          <Link to="/esports" className="btn btn-primary mt-8 self-start h-12 px-6">Enter the storefront<Icon name="ArrowRight" size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {kits.slice(0, 4).map((a, i) => (
            <Link key={a.slug} to={`/asset/${a.slug}`} className={`group relative overflow-hidden border border-line ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}>
              <div className="h-full transition duration-500 group-hover:scale-105"><Art kind={a.art} seed={a.seed} src={a.img} sizes="40vw" label={a.title} /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4"><span className="font-display text-base font-semibold">{a.title}</span><span className="font-mono text-xs">{a.price ? `$${a.price}` : 'Free'}</span></div>
            </Link>))}
        </div>
      </div>
    </section>
  )
}

function StudioShowcase() {
  const [t, setT] = useState(0)
  const names = ['Ember', 'Minimal', 'Spotlight', 'Matchday', 'Player card']
  return (
    <Block>
      <Head n="04" eyebrow="Customization Studio" title="Edit in the browser" to="/create" cta="Open the Studio" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="border border-line bg-graphite p-3">
          <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute"><span>Gaming Banner · 1500 × 500</span><span>Live template render</span></div>
          <TemplatePreview index={t} w={1500} h={500} />
          <div className="mt-3 flex gap-2">{names.map((n, i) => <button key={n} onClick={() => setT(i)} aria-pressed={t === i} className={`chip ${t === i ? 'chip-on' : ''}`}>{n}</button>)}</div>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <ul className="divide-y divide-line border-y border-line">
            {['Templates for every tool', 'Text, shapes, icons and image uploads', 'Layers, undo/redo, zoom and canvas resize', 'Save projects, export PNG or JPG'].map((x) => <li key={x} className="flex gap-3 py-3 text-sm"><Icon name="Check" size={16} className="mt-0.5 shrink-0 text-accent" />{x}</li>)}
          </ul>
          <div className="grid grid-cols-2 gap-2">{studioTools.slice(0, 6).map((s) => <Link key={s.slug} to={`/studio/${s.slug}`} className="border border-line p-3 text-sm transition hover:border-accent"><span className="block font-medium">{s.name}</span><span className="font-mono text-[10px] uppercase text-mute">{s.w} × {s.h}</span></Link>)}</div>
        </div>
      </div>
    </Block>
  )
}

function Collections() {
  return (
    <Block>
      <Head n="05" eyebrow="Curated bundles" title="Featured collections" to="/collections" />
      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.slug} to={`/collections/${c.slug}`} className="group border border-line bg-graphite transition hover:border-warm/50">
            <div className="grid aspect-[16/9] grid-cols-3 gap-px bg-line">{c.items.slice(0, 3).map((s) => <div key={s} className="overflow-hidden"><Art kind={getAsset(s).art} seed={getAsset(s).seed} src={getAsset(s).img} sizes="15vw" /></div>)}</div>
            <div className="p-5"><div className="flex items-center gap-2"><h3 className="font-display text-lg font-semibold">{c.title}</h3>{c.sponsored && <span className="border border-accent/50 px-1.5 font-mono text-[10px] uppercase text-accent">Sponsored</span>}</div><p className="mt-1.5 text-sm text-mute">{c.desc}</p><p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-accent">{c.items.length} assets in bundle</p></div>
          </Link>))}
      </div>
    </Block>
  )
}

function Inspiration() {
  const s = shots.slice(0, 8)
  const ratios = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[4/5]', 'aspect-square']
  return (
    <Block>
      <Head n="06" eyebrow="Inspiration" title="From the community" to="/inspiration" cta="Open the gallery" />
      <div className="columns-2 gap-3 md:columns-4 [&>a]:mb-3">
        {s.map((x, i) => (
          <Link key={x.slug} to={`/shots/${x.slug}`} className={`group relative block break-inside-avoid overflow-hidden border border-line ${ratios[i]}`}>
            <div className="h-full transition duration-500 group-hover:scale-105"><Art kind={x.art} seed={x.seed} src={x.img} label={x.title} /></div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 to-transparent p-3 opacity-0 transition group-hover:opacity-100"><p className="text-sm font-medium">{x.title}</p><p className="font-mono text-[10px] uppercase text-mute">{x.tags.join(' · ')}</p></div>
          </Link>))}
      </div>
    </Block>
  )
}

function ToolsShowcase() {
  return (
    <Block>
      <Head n="07" eyebrow="Gaming tools" title="Tools that actually calculate" to="/tools" cta="All tools" />
      <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t) => (
          <Link key={t.slug} to={`/tools/${t.slug}`} className="group border-b border-r border-line p-5 transition hover:bg-graphite">
            <span className="text-accent"><Icon name={t.icon} size={22} /></span>
            <p className="mt-6 font-display text-base font-semibold group-hover:text-accent">{t.name}</p><p className="mt-1 text-sm text-mute">{t.desc}</p>
          </Link>))}
      </div>
    </Block>
  )
}

function Spotlight() {
  return (
    <Block>
      <Head n="08" eyebrow="Creator spotlight" title="Meet the studios" to="/community" cta="Community" />
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c, i) => (
          <Link key={c.username} to={`/creators/${c.username}`} className="group flex items-center gap-4 bg-ink p-5 transition hover:bg-graphite">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line"><Art kind="badge" seed={i + 3} /></div>
            <div className="min-w-0"><p className="truncate font-display text-lg font-semibold group-hover:text-accent">{c.name}</p><p className="line-clamp-2 text-sm text-mute">{c.bio.replace(' Sample creator profile.', '')}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-mute">{c.region} · {assets.filter((a) => a.creator === c.username).length} listings</p></div>
          </Link>))}
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-mute">Sample creator profiles for the demo build.</p>
    </Block>
  )
}

function Guides() {
  return (
    <Block>
      <Head n="09" eyebrow="Guides & resources" title="Learn the craft" to="/learn" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{guides.slice(0, 4).map((g) => (
        <Link key={g.slug} to={`/guides/${g.slug}`} className="group">
          <div className="aspect-[4/3] overflow-hidden border border-line"><div className="h-full transition duration-500 group-hover:scale-105"><Art kind={g.art} seed={g.seed} src={g.img} /></div></div>
          <Mono className="mt-4 block text-accent">{g.cat} · {g.read}</Mono><h3 className="mt-1.5 font-display text-lg font-semibold leading-snug group-hover:text-accent">{g.title}</h3>
        </Link>))}</div>
    </Block>
  )
}

export default function Home() {
  return (
    <Page wide title="" desc="Discover gaming assets, customize your identity, build team-ready esports kits and share your work — all in one place.">
      <Hero />
      <Trending />
      <Categories />
      <Esports />
      <StudioShowcase />
      <Collections />
      <Inspiration />
      <ToolsShowcase />
      <Spotlight />
      <Guides />
      <Block className="pb-4">
        <div className="relative overflow-hidden border border-line p-8 md:p-14">
          <div className="absolute -right-10 -top-10 h-72 w-72 opacity-20" aria-hidden><Art kind="badge" seed={5} /></div>
          <Mono className="text-accent">Create beyond the game</Mono>
          <h2 className="display-lg mt-3 max-w-2xl">Publish your work. Get discovered.</h2>
          <p className="mt-4 max-w-lg text-warm/70">Submit assets and projects for review, join design challenges and follow creators you admire.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link to="/upload" className="btn btn-primary">Submit your work</Link><Link to="/challenges" className="btn btn-secondary">See challenges</Link></div>
        </div>
      </Block>
      <div className="container-x"><Faq path="/" /></div>
    </Page>
  )
}
