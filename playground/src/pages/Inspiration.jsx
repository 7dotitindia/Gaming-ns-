import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Chip, Crumbs, Demo, Empty, Icon, Page, SaveButton, Tabs, useGate } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { assets, collections, creators, fmtNum, getAsset, getCreator, shots, teams } from '../lib/data'
import { NotFound } from './Static'

const allTags = [...new Set(shots.flatMap((s) => s.tags))]

function ShotTile({ s }) {
  const cr = getCreator(s.creator)
  return (
    <Link to={`/shots/${s.slug}`} className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-xl border border-line">
      <div className={`${s.ratio} transition duration-300 group-hover:scale-[1.03]`}><Art kind={s.art} seed={s.seed} src={s.img} label={s.title} /></div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <div><p className="text-sm font-semibold">{s.title}</p><p className="text-xs text-mute">{cr.name}</p></div>
        <span className="inline-flex items-center gap-1 text-xs"><Icon name="Heart" size={13} />{s.likes}</span>
      </div>
    </Link>
  )
}

function Feed() {
  const [tag, setTag] = useState(''); const [sort, setSort] = useState('featured')
  const list = shots.filter((s) => !tag || s.tags.includes(tag)).sort((a, b) => (sort === 'popular' ? b.likes - a.likes : sort === 'recent' ? b.seed - a.seed : a.seed - b.seed))
  return (
    <Page title="Inspiration" desc="Explore gaming designs, esports identities, setups and interfaces from the community.">
      <Crumbs items={[['Inspiration']]} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold md:text-4xl">Inspiration gallery</h1><p className="mt-2 text-sm text-mute">Designs and ideas from our creative community.</p></div><Demo /></div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="scroll-hide flex gap-2 overflow-x-auto"><Chip on={!tag} onClick={() => setTag('')}>All</Chip>{allTags.map((t) => <Chip key={t} on={tag === t} onClick={() => setTag(t)}>#{t}</Chip>)}</div>
        <div className="flex gap-1" role="group" aria-label="Sort">{['featured', 'recent', 'popular'].map((s) => <Chip key={s} on={sort === s} onClick={() => setSort(s)}>{s[0].toUpperCase() + s.slice(1)}</Chip>)}</div>
      </div>
      {list.length ? <div className="columns-2 gap-4 lg:columns-4">{list.map((s) => <ShotTile key={s.slug} s={s} />)}</div> : <Empty title="No shots with that tag" action={<button className="btn btn-secondary" onClick={() => setTag('')}>Show all</button>} />}
    </Page>
  )
}

function Shot() {
  const { slug } = useParams(); const s = shots.find((x) => x.slug === slug)
  const { likes, toggleLike, follows, toggleFollow, toast } = useApp(); const gate = useGate()
  const [comments, setComments] = usePersist(`pg.comments.${slug}`, [['Ava R.', 'Love the restraint here.'], ['Kenji', 'The type hierarchy is spot on.']]); const [txt, setTxt] = useState('')
  if (!s) return <NotFound />
  const cr = getCreator(s.creator); const liked = likes.includes(s.slug); const fol = follows.includes(cr.username)
  const post = gate((e) => { e.preventDefault(); if (!txt.trim()) return; setComments([...comments, ['You', txt.trim()]]); setTxt('') })
  return (
    <Page title={s.title} desc={s.desc}>
      <Crumbs items={[['Inspiration', '/inspiration'], [s.title]]} />
      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div><div className="aspect-[4/3] overflow-hidden rounded-xl border border-line"><Art kind={s.art} seed={s.seed} src={s.img} label={s.title} /></div>
          <h1 className="mt-6 text-3xl font-bold">{s.title}</h1><p className="mt-3 text-warm/80">{s.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">{s.tags.map((t) => <Link key={t} to="/inspiration" className="chip">#{t}</Link>)}</div>
          <section className="mt-10"><h2 className="text-lg font-bold">Comments ({comments.length})</h2>
            <form onSubmit={post} className="mt-3 flex gap-2"><input className="field" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Add a comment…" aria-label="Comment" /><button className="btn btn-primary">Post</button></form>
            <ul className="mt-4 divide-y divide-line">{comments.map(([n, t], i) => <li key={i} className="py-3 text-sm"><span className="font-medium">{n}</span><p className="mt-0.5 text-warm/75">{t}</p></li>)}</ul></section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-full"><Art kind="badge" seed={cr.followers % 9} /></div><div className="min-w-0 flex-1"><Link to={`/creators/${cr.username}`} className="block truncate font-semibold hover:text-accent">{cr.name}</Link><p className="text-xs text-mute">{fmtNum(cr.followers + (fol ? 1 : 0))} followers</p></div>
            <button className={`btn btn-sm ${fol ? 'btn-secondary' : 'btn-primary'}`} onClick={gate(() => toggleFollow(cr.username))}>{fol ? 'Following' : 'Follow'}</button></div>
            <div className="mt-5 flex gap-2"><button className={`btn flex-1 ${liked ? 'btn-primary' : 'btn-secondary'}`} aria-pressed={liked} onClick={gate(() => toggleLike(s.slug))}><Icon name="Heart" size={16} className={liked ? 'fill-ink' : ''} />{s.likes + (liked ? 1 : 0)}</button>
              <button className="btn btn-secondary flex-1" onClick={() => toast('Report received — our team will review it (demo)')}><Icon name="Flag" size={16} />Report</button></div>
            <p className="label mt-5">Tools used</p><div className="flex flex-wrap gap-1.5">{s.tools.map((t) => <span key={t} className="chip">{t}</span>)}</div></div>
        </aside>
      </div>
      <section className="mt-14"><h2 className="mb-5 text-xl font-bold">Related work</h2><div className="columns-2 gap-4 lg:columns-4">{shots.filter((x) => x.slug !== s.slug && x.tags.some((t) => s.tags.includes(t)) || x.creator === s.creator && x.slug !== s.slug).slice(0, 4).map((x) => <ShotTile key={x.slug} s={x} />)}</div></section>
    </Page>
  )
}

function Collections() {
  return (
    <Page title="Collections" desc="Curated themed packs of gaming assets.">
      <Crumbs items={[['Collections']]} />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Featured collections</h1>
      <div className="grid gap-5 md:grid-cols-3">{collections.map((c) => (
        <Link key={c.slug} to={`/collections/${c.slug}`} className="card group overflow-hidden transition hover:border-mute">
          <div className="grid aspect-[16/8] grid-cols-2 gap-px bg-line">{c.items.slice(0, 4).map((s) => <Art key={s} kind={getAsset(s).art} seed={getAsset(s).seed} src={getAsset(s).img} sizes="25vw" />)}</div>
          <div className="p-4"><div className="flex items-center gap-2"><h2 className="font-semibold">{c.title}</h2>{c.sponsored && <span className="rounded border border-accent/50 px-1.5 font-mono text-[10px] uppercase text-accent">Sponsored</span>}</div><p className="mt-1 text-sm text-mute">{c.desc}</p><p className="mt-2 font-mono text-[11px] uppercase text-mute">{c.items.length} assets</p></div>
        </Link>))}</div>
    </Page>
  )
}

function Collection() {
  const c = collections.find((x) => x.slug === useParams().slug); if (!c) return <NotFound />
  return (
    <Page title={c.title} desc={c.desc}>
      <Crumbs items={[['Collections', '/collections'], [c.title]]} />
      <div className="mb-8 flex items-center gap-3"><h1 className="text-3xl font-bold md:text-4xl">{c.title}</h1>{c.sponsored && <span className="rounded border border-accent/50 px-2 py-0.5 font-mono text-[11px] uppercase text-accent">Sponsored · {c.sponsor}</span>}</div>
      <p className="mb-8 max-w-xl text-mute">{c.desc}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{c.items.map((s) => <AssetCard key={s} a={getAsset(s)} />)}</div>
    </Page>
  )
}

function Creator() {
  const { username } = useParams(); const cr = getCreator(username); const { follows, toggleFollow } = useApp(); const gate = useGate(); const [tab, setTab] = useState('assets')
  if (!cr) return <NotFound />
  const fol = follows.includes(username); const mine = assets.filter((a) => a.creator === username); const myShots = shots.filter((s) => s.creator === username)
  return (
    <Page title={cr.name} desc={cr.bio}>
      <Crumbs items={[['Creators'], [cr.name]]} />
      <div className="card flex flex-wrap items-center gap-5 p-6"><div className="h-20 w-20 overflow-hidden rounded-full border border-line"><Art kind="badge" seed={cr.followers % 9} /></div>
        <div className="min-w-0 flex-1"><h1 className="text-2xl font-bold">{cr.name}</h1><p className="mt-1 text-sm text-mute">@{cr.username} · {cr.region}</p><p className="mt-2 max-w-xl text-sm text-warm/80">{cr.bio}</p></div>
        <div className="text-center"><p className="font-display text-2xl font-bold">{fmtNum(cr.followers + (fol ? 1 : 0))}</p><p className="text-xs text-mute">followers</p></div>
        <button className={`btn ${fol ? 'btn-secondary' : 'btn-primary'}`} onClick={gate(() => toggleFollow(username))}>{fol ? 'Following' : 'Follow'}</button></div>
      <Tabs className="mt-8" tabs={[['assets', `Assets (${mine.length})`], ['shots', `Shots (${myShots.length})`], ...(username === 'kitforge' ? [['team', 'Team']] : [])]} value={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === 'assets' && (mine.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{mine.map((a) => <AssetCard key={a.slug} a={a} />)}</div> : <Empty icon="Package" title="No published assets yet" />)}
        {tab === 'shots' && (myShots.length ? <div className="columns-2 gap-4 lg:columns-4">{myShots.map((s) => <ShotTile key={s.slug} s={s} />)}</div> : <Empty icon="Image" title="No shots yet" />)}
        {tab === 'team' && <Link to="/teams/ember-fc" className="card inline-flex items-center gap-3 p-4 hover:border-accent"><Icon name="Trophy" className="text-accent" />View sample team profile: Ember FC</Link>}
      </div>
    </Page>
  )
}

function Team() {
  const t = teams.find((x) => x.slug === useParams().slug); if (!t) return <NotFound />
  return (
    <Page title={t.name} desc="Sample esports team profile.">
      <Crumbs items={[['Teams'], [t.name]]} />
      <div className="card flex flex-wrap items-center gap-5 p-6"><div className="h-24 w-24 overflow-hidden rounded-xl"><Art kind="badge" seed={3} /></div><div><h1 className="text-3xl font-bold">{t.name}</h1><p className="mt-1 text-sm text-mute">{t.game} · {t.region}</p></div><Demo /></div>
      <div className="mt-8 grid gap-8 md:grid-cols-2"><section><h2 className="mb-3 text-lg font-bold">Roster</h2><ul className="grid grid-cols-2 gap-3">{t.roster.map((p, i) => <li key={p} className="card flex items-center gap-3 p-3"><div className="h-10 w-10 overflow-hidden rounded-full"><Art kind="hood" seed={i + 1} /></div><span className="text-sm font-medium">{p}</span></li>)}</ul></section>
        <section><h2 className="mb-3 text-lg font-bold">Achievements</h2><ul className="space-y-2">{t.achievements.map((a) => <li key={a} className="card flex gap-2 p-3 text-sm"><Icon name="Trophy" size={16} className="text-accent" />{a}</li>)}</ul></section></div>
      <section className="mt-10"><h2 className="mb-3 text-lg font-bold">Published designs</h2><div className="grid gap-4 sm:grid-cols-3">{assets.filter((a) => a.kit).slice(0, 3).map((a) => <AssetCard key={a.slug} a={a} />)}</div></section>
    </Page>
  )
}

export default function Inspiration({ view }) {
  return { feed: <Feed />, shot: <Shot />, collections: <Collections />, collection: <Collection />, creator: <Creator />, team: <Team /> }[view]
}
