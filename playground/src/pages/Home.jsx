import { Link, useNavigate } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Faq, Icon, Page, SearchBar, SectionHead } from '../components/ui'
import { assets, categories, collections, creators, guides, getAsset, shots, tools } from '../lib/data'

const heroChips = [['All Assets', '/explore'], ['3D Models', '/assets/3d'], ['Game UI', '/assets/game-ui'], ['Streaming', '/assets/streaming'], ['Wallpapers', '/assets/wallpapers']]

function Hero() {
  const nav = useNavigate()
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-accent/5 via-ink to-sky/5">
      <div className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[62%] lg:opacity-100" aria-hidden>
        <Art kind="hood" seed={2} src="/images/hero.jpg" priority sizes="(min-width:1024px) 62vw, 100vw" label="Gamer in an orange headset playing on a lit monitor" className="object-[80%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      </div>
      <div className="container-x relative grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="eyebrow inline-block rounded-full border border-accent/30 bg-accent/8 px-3 py-1">The gaming creative marketplace</span>
          <h1 className="mt-5 text-5xl font-bold leading-[1.02] md:text-7xl">Create beyond<br />the <span className="text-accent">game.</span></h1>
          <p className="mt-5 max-w-md text-base text-warm/70 md:text-lg">Discover assets, customize your gaming identity, and build something extraordinary.</p>
          <SearchBar big className="mt-8 max-w-xl" />
          <div className="mt-4 flex flex-wrap gap-2">{heroChips.map(([l, to], i) => <button key={l} className={`chip ${i === 0 ? 'chip-on' : ''}`} onClick={() => nav(to)}>{l}</button>)}</div>
        </div>
        <Link to="/create" className="card group relative mt-4 self-end overflow-hidden p-5 transition hover:border-accent hover:shadow-md lg:ml-auto lg:max-w-sm">
          <p className="eyebrow">Customization Studio</p>
          <h3 className="mt-1 text-xl font-bold">Design. Customize. Export.</h3>
          <p className="mt-1 text-sm text-mute">Create banners, logos and thumbnails with our in-browser editor.</p>
          <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-line"><Art kind="poster" seed={5} /></div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">Open the editor <Icon name="ArrowRight" size={14} className="transition group-hover:translate-x-1" /></span>
        </Link>
      </div>
    </section>
  )
}

const Block = ({ children, className = '' }) => <section className={`container-x pt-14 ${className}`}>{children}</section>

export default function Home() {
  const trending = assets.filter((a) => a.trending)
  return (
    <Page wide title="" desc="Discover gaming assets, customize your identity, build team-ready visuals and share your work — all in one place.">
      <Hero />

      <Block>
        <SectionHead title="Trending this week" to="/trending" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{trending.map((a) => <AssetCard key={a.slug} a={a} />)}</div>
      </Block>

      <Block>
        <SectionHead title="Browse by category" to="/categories" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.slug} to={`/assets/${c.slug}`} className="card group flex flex-col items-center gap-3 px-3 py-5 text-center text-sm font-medium transition hover:border-accent hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white"><Icon name={c.icon} size={20} /></span>{c.name}
            </Link>
          ))}
        </div>
      </Block>

      <Block>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <SectionHead title="Powerful gaming tools" sub="Tools to level up your creativity and performance." to="/tools" cta="View all tools" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{tools.map((t) => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card group p-4 transition hover:border-accent hover:shadow-md">
                <span className="text-accent"><Icon name={t.icon} size={22} /></span><p className="mt-3 text-sm font-semibold leading-tight">{t.name}</p><p className="mt-1 text-xs text-mute">{t.desc}</p>
              </Link>))}</div>
          </div>
          <div className="relative flex flex-col justify-end overflow-hidden rounded-xl border border-line">
            <div className="absolute inset-0 opacity-70" aria-hidden><Art kind="hood" seed={9} /></div><div className="absolute inset-0 bg-gradient-to-t from-warm via-warm/80 to-transparent" />
            <div className="relative p-6"><h3 className="text-2xl font-bold leading-tight text-ink">Join our creator community</h3><p className="mt-2 text-sm text-ink/70">Publish work, follow creators and enter design challenges.</p><Link to="/community" className="btn btn-primary mt-5">Join community <Icon name="ArrowRight" size={14} /></Link></div>
          </div>
        </div>
      </Block>

      <Block>
        <SectionHead title="Inspiration gallery" sub="Explore stunning designs and ideas from our creative community." to="/inspiration" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {shots.slice(0, 6).map((s) => (
            <Link key={s.slug} to={`/shots/${s.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-line md:aspect-square lg:aspect-[3/4]">
              <div className="h-full transition duration-300 group-hover:scale-105"><Art kind={s.art} seed={s.seed} src={s.img} label={s.title} /></div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-warm/90 to-transparent p-2.5 text-xs font-medium text-ink opacity-0 transition group-hover:opacity-100">{s.title}</div>
            </Link>))}
        </div>
      </Block>

      <Block>
        <SectionHead title="Featured collections" to="/collections" />
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="card group overflow-hidden transition hover:border-mute hover:shadow-md">
              <div className="grid aspect-[16/8] grid-cols-3 gap-px bg-line">{c.items.slice(0, 3).map((s) => <div key={s} className="overflow-hidden"><Art kind={getAsset(s).art} seed={getAsset(s).seed} src={getAsset(s).img} sizes="15vw" /></div>)}</div>
              <div className="p-4"><div className="flex items-center gap-2"><h3 className="font-semibold">{c.title}</h3>{c.sponsored && <span className="rounded-md border border-coral/40 px-1.5 font-mono text-[10px] uppercase text-coral">Sponsored</span>}</div><p className="mt-1 text-sm text-mute">{c.desc}</p></div>
            </Link>))}
        </div>
      </Block>

      <Block>
        <div className="card grid items-center gap-8 overflow-hidden p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div><p className="eyebrow">Creator spotlight</p><h2 className="mt-2 text-3xl font-bold">Publish your work. Get discovered.</h2><p className="mt-3 text-mute">Upload assets, share projects, follow creators you admire and join challenges. Every submission is reviewed for quality and rights.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/upload" className="btn btn-primary">Submit your work</Link><Link to="/challenges" className="btn btn-secondary">See challenges</Link></div></div>
          <div className="grid grid-cols-3 gap-3">{creators.slice(0, 3).map((c, i) => (
            <Link key={c.username} to={`/creators/${c.username}`} className="rounded-xl border border-line bg-raise p-3 text-center transition hover:border-accent hover:shadow-md">
              <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border border-line"><Art kind="badge" seed={i + 3} /></div><p className="mt-2 truncate text-sm font-semibold">{c.name}</p><p className="text-xs text-mute">Sample creator</p>
            </Link>))}</div>
        </div>
      </Block>

      <Block>
        <SectionHead title="Guides & resources" sub="Evergreen how-tos for streamers, designers and developers." to="/learn" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{guides.slice(0, 4).map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="group">
            <div className="aspect-video overflow-hidden rounded-xl border border-line"><div className="h-full transition duration-300 group-hover:scale-105"><Art kind={g.art} seed={g.seed} src={g.img} /></div></div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-accent">{g.cat} · {g.read}</p><h3 className="mt-1 text-sm font-semibold leading-snug group-hover:text-accent">{g.title}</h3>
          </Link>))}</div>
      </Block>
      <div className="container-x"><Faq path="/" /></div>
    </Page>
  )
}
