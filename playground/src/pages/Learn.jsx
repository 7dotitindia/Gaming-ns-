import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Chip, Crumbs, Icon, Page } from '../components/ui'
import { assets, getAsset, guides } from '../lib/data'
import { NotFound } from './Static'

const topics = [...new Set(guides.map((g) => g.cat))]
const resources = [
  ['OBS Studio', 'Free, open-source streaming and recording software.', 'https://obsproject.com'],
  ['Blender', 'Free 3D creation suite for modelling, rigging and animation.', 'https://www.blender.org'],
  ['Godot Engine', 'Free, open-source game engine.', 'https://godotengine.org'],
  ['Photopea', 'Browser-based image editor that opens PSD files.', 'https://www.photopea.com'],
]

const sections = (g) => [
  ['The short version', `${g.excerpt} This guide is a practical walkthrough you can follow in one sitting.`],
  ['Step by step', 'Start with the smallest working version, test it, and only then add polish. Keep notes on settings you change so you can undo them.'],
  ['Common mistakes', 'Skipping the license check, overloading the screen with effects, and never testing on a second device are the three that cost people the most time.'],
]

function Article({ slug }) {
  const g = guides.find((x) => x.slug === slug); if (!g) return <NotFound />
  const rel = guides.filter((x) => x.slug !== slug && x.cat === g.cat).concat(guides.filter((x) => x.slug !== slug && x.cat !== g.cat)).slice(0, 3)
  const picks = assets.filter((a) => (g.cat === 'Streaming' ? a.cat === 'streaming' : g.cat === 'Game dev' ? ['2d', '3d', 'game-ui'].includes(a.cat) : true)).slice(0, 3)
  return (
    <Page title={g.title} desc={g.excerpt}>
      <Crumbs items={[['Guides', '/learn'], [g.title]]} />
      <article className="mx-auto max-w-2xl">
        <p className="eyebrow">{g.cat} · {g.read} read</p><h1 className="mt-2 text-4xl font-bold leading-tight">{g.title}</h1>
        <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-line"><Art kind={g.art} seed={g.seed} src={g.img} priority sizes="(min-width:768px) 672px, 100vw" /></div>
        {sections(g).map(([h, p]) => <section key={h} className="mt-8"><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 leading-relaxed text-warm/80">{p}</p></section>)}
        <p className="mt-8 rounded-lg border border-line bg-graphite p-4 text-xs text-mute">Sample article body — full editorial content is managed in the admin CMS.</p>
      </article>
      <section className="mx-auto mt-14 max-w-5xl"><h2 className="mb-4 text-xl font-bold">Related assets</h2><div className="grid gap-4 sm:grid-cols-3">{picks.map((a) => <AssetCard key={a.slug} a={a} />)}</div></section>
      <section className="mx-auto mt-14 max-w-5xl"><h2 className="mb-4 text-xl font-bold">More guides</h2><div className="grid gap-4 sm:grid-cols-3">{rel.map((r) => <GuideCard key={r.slug} g={r} />)}</div></section>
    </Page>
  )
}

const GuideCard = ({ g }) => (
  <Link to={`/guides/${g.slug}`} className="group card overflow-hidden transition hover:border-mute">
    <div className="aspect-video overflow-hidden"><div className="h-full transition duration-300 group-hover:scale-105"><Art kind={g.art} seed={g.seed} src={g.img} /></div></div>
    <div className="p-4"><p className="font-mono text-[11px] uppercase tracking-wider text-accent">{g.cat} · {g.read}</p><h3 className="mt-1 font-semibold leading-snug group-hover:text-accent">{g.title}</h3><p className="mt-1 text-sm text-mute">{g.excerpt}</p></div>
  </Link>
)

export default function Learn({ kind }) {
  const { slug } = useParams(); const [topic, setTopic] = useState('')
  if (slug) return <Article slug={slug} />
  const isRes = kind === 'resources'; const title = isRes ? 'Gaming resources' : kind === 'tutorials' ? 'Tutorials' : 'Guides & tutorials'
  const list = guides.filter((g) => !topic || g.cat === topic)
  return (
    <Page title={title} desc="Evergreen guides on streaming, design, branding and game development.">
      <Crumbs items={[[title]]} />
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-2 mb-8 max-w-xl text-sm text-mute">{isRes ? 'Free tools worth knowing. Links go to the official sites; none are paid placements.' : 'Useful, original how-to content for creators and developers.'}</p>
      {isRes ? <div className="grid gap-4 sm:grid-cols-2">{resources.map(([n, d, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="card flex items-start justify-between gap-4 p-5 transition hover:border-accent"><div><h2 className="font-semibold">{n}</h2><p className="mt-1 text-sm text-mute">{d}</p></div><Icon name="ExternalLink" size={16} className="shrink-0 text-mute" /></a>)}</div> : <>
        <div className="mb-6 flex flex-wrap gap-2"><Chip on={!topic} onClick={() => setTopic('')}>All</Chip>{topics.map((t) => <Chip key={t} on={topic === t} onClick={() => setTopic(t)}>{t}</Chip>)}</div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((g) => <GuideCard key={g.slug} g={g} />)}</div></>}
    </Page>
  )
}
