import { Link, useSearchParams } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Crumbs, Empty, Icon, Page } from '../components/ui'
import { Mono, TemplatePreview } from '../components/Previews'
import { assets, kitTypes } from '../lib/data'

const deliverables = ['Team logos & badges', 'Jersey mockups', 'Hoodie mockups', 'Player profile cards', 'Roster announcements', 'Matchday posters', 'Tournament brackets', 'MVP cards', 'Match result graphics', 'Social media templates', 'Team banners', 'Identity guidelines']

export default function Esports() {
  const [sp, setSp] = useSearchParams()
  const type = sp.get('type') || ''
  const kits = assets.filter((a) => a.kit)
  const list = kits.filter((a) => !type || a.kitType === type)
  const hero = kits.find((a) => a.slug === 'team-identity-system') || kits[0]

  return (
    <Page wide title="Esports Team Kits" desc="Team identity systems, jerseys, hoodies, player cards, rosters, brackets and matchday graphics with clear licenses.">
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Art kind="jersey" seed={4} src="/images/arena.jpg" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="container-x py-20 md:py-32">
          <Crumbs items={[['Esports Team Kits']]} />
          <Mono className="text-accent">Esports Team Kits</Mono>
          <h1 className="display-xl mt-4 max-w-4xl">Built for the <span className="text-accent">whole roster.</span></h1>
          <p className="mt-6 max-w-xl text-lg text-warm/75">Identity systems, apparel mockups and matchday graphics designed as one system, so every post, poster and jersey looks like the same team.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#kits" className="btn btn-primary h-12 px-6">Shop the kits<Icon name="ArrowDown" size={16} /></a><Link to="/studio/team-poster" className="btn btn-secondary h-12 px-6">Make a poster in the Studio</Link></div>
        </div>
      </section>

      <section className="container-x grid gap-px border-x border-b border-line bg-line sm:grid-cols-2 lg:grid-cols-4" aria-label="What's in a kit">
        {deliverables.map((d, i) => <div key={d} className="bg-ink p-4"><Mono className="text-mute">{String(i + 1).padStart(2, '0')}</Mono><p className="mt-2 font-display font-medium">{d}</p></div>)}
      </section>

      <section className="container-x pt-20" id="kits">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div><Mono className="text-mute">Storefront</Mono><h2 className="display-lg mt-2">{type ? kitTypes.find((k) => k.slug === type)?.name : 'All team kits'}</h2></div>
          <p className="font-mono text-xs uppercase tracking-wider text-mute" aria-live="polite">{list.length} kit{list.length !== 1 && 's'}</p>
        </div>
        <div className="scroll-hide mb-8 flex gap-2 overflow-x-auto pb-1">
          <button className={`chip ${!type ? 'chip-on' : ''}`} onClick={() => setSp({})}>All kits</button>
          {kitTypes.map((k) => <button key={k.slug} className={`chip ${type === k.slug ? 'chip-on' : ''}`} onClick={() => setSp({ type: k.slug })}>{k.name}</button>)}
        </div>
        {list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <AssetCard key={a.slug} a={a} />)}</div>
          : <Empty title="No kits in this group yet" action={<button className="btn btn-secondary" onClick={() => setSp({})}>Show all kits</button>} />}
      </section>

      <section className="container-x pt-24">
        <div className="mb-8 border-b border-line pb-5"><Mono className="text-mute">Shop by system</Mono><h2 className="display-lg mt-2">Five kit families</h2></div>
        <div className="grid gap-4 md:grid-cols-5">
          {kitTypes.map((k, i) => (
            <button key={k.slug} onClick={() => { setSp({ type: k.slug }); document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth' }) }} className={`group text-left ${i === 0 ? 'md:col-span-2' : ''}`}>
              <div className={`overflow-hidden border border-line ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}><div className="h-full transition duration-500 group-hover:scale-105"><Art kind={k.art} seed={i + 4} src={k.img} sizes="30vw" /></div></div>
              <p className="mt-3 font-display text-lg font-semibold group-hover:text-accent">{k.name}</p><p className="mt-1 text-sm text-mute">{k.blurb}</p>
            </button>))}
        </div>
      </section>

      <section className="mt-24 border-y border-line bg-graphite">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Mono className="text-accent">Customize it</Mono>
            <h2 className="display-lg mt-3">Make it yours in the Studio</h2>
            <p className="mt-4 max-w-md text-warm/70">Start from a poster template, swap in your team name, colours and logo, then export PNG or JPG. No account needed to try it.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/studio/team-poster" className="btn btn-primary">Team Poster Maker</Link><Link to="/studio/logo" className="btn btn-secondary">Logo / Badge Maker</Link></div>
          </div>
          <div className="mx-auto w-full max-w-sm border border-line p-3"><TemplatePreview index={0} w={1080} h={1350} /></div>
        </div>
      </section>

      <section className="container-x pt-16">
        <h2 className="font-display text-xl font-semibold">Licensing for teams</h2>
        <p className="mt-2 max-w-2xl text-sm text-mute">Every kit lists its license before you download. Standard licenses cover your own team's channels and merch; Extended covers wider commercial use. Source files can't be resold. <Link to="/licensing" className="text-accent hover:underline">Read the full terms</Link>. Hero artwork on this page uses sample imagery.</p>
        {hero && <p className="mt-2 text-sm text-mute">New to kits? Start with <Link to={`/asset/${hero.slug}`} className="text-accent hover:underline">{hero.title}</Link>.</p>}
      </section>
    </Page>
  )
}
