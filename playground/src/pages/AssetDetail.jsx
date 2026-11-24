import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Crumbs, Demo, Faq, Icon, Modal, Page, PriceTag, SaveButton, Stars, useGate } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { assets, fmtNum, getAsset, getCat, getCreator, kitGallery } from '../lib/data'
import { NotFound } from './Static'

const sampleReviews = [
  ['Rin K.', 5, 'Clean, well organised files. Dropped straight into my project.'],
  ['Marco T.', 4, 'Great quality. Would love a few more colour variants.'],
  ['Sam D.', 5, 'License was clear and the formats matched the listing.'],
]

const Spec = ({ k, v }) => <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0"><dt className="text-mute">{k}</dt><dd className="text-right font-medium">{v}</dd></div>

export default function AssetDetail() {
  const { slug } = useParams(); const a = getAsset(slug)
  const { downloads, recordDownload, toast } = useApp(); const gate = useGate()
  const [shot, setShot] = useState(0); const [lic, setLic] = useState(false); const [agree, setAgree] = useState(false)
  const [myReviews, setMyReviews] = usePersist(`pg.reviews.${slug}`, []); const [rv, setRv] = useState({ rating: 5, text: '' })
  if (!a) return <NotFound />
  const cat = getCat(a.cat); const cr = getCreator(a.creator)
  const owned = downloads.some((d) => d.slug === a.slug)
  const related = assets.filter((x) => x.slug !== a.slug && (x.cat === a.cat || x.creator === a.creator)).slice(0, 4)
  const gallery = a.kit ? kitGallery : ['Cover', 'Detail', 'In context', 'Variants']

  // No binary asset files exist in this prototype, so we deliver a real manifest + license file.
  const download = () => {
    recordDownload(a)
    const body = `${a.title}\nby ${cr.name}\n\nIncluded:\n- ${a.included.join('\n- ')}\n\nFormats: ${a.formats.join(', ')}\nLicense: ${a.license}\n\n(Demo package manifest — sample data.)\n`
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }))
    Object.assign(document.createElement('a'), { href: url, download: `${a.slug}-manifest.txt` }).click(); URL.revokeObjectURL(url)
    setLic(false); setAgree(false)
  }
  const submitReview = (e) => { e.preventDefault(); if (rv.text.trim().length < 10) return toast('Write at least 10 characters', 'info'); setMyReviews([{ name: 'You', ...rv }, ...myReviews]); setRv({ rating: 5, text: '' }); toast('Review posted') }

  return (
    <Page title={a.title} desc={a.desc}>
      <Crumbs items={[['Explore', '/explore'], [cat.name, `/assets/${cat.slug}`], [a.title]]} />
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-line"><Art kind={a.art} seed={a.seed + shot * 3} src={a.img} label={`${a.title} — ${gallery[shot]}`} /><span className="absolute left-3 top-3 rounded-md bg-ink/80 px-2 py-1 font-mono text-[11px] uppercase text-mute shadow-sm">{gallery[shot]}</span></div>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-4">{gallery.slice(0, a.kit ? 8 : 4).map((g, i) => (
            <button key={g} onClick={() => setShot(i)} aria-label={`Show ${g}`} aria-pressed={shot === i} className={`aspect-video overflow-hidden rounded-lg border-2 transition ${shot === i ? 'border-accent' : 'border-line hover:border-mute'}`}><Art kind={a.art} seed={a.seed + i * 3} src={a.img} /></button>))}</div>

          <section className="mt-10"><h2 className="text-xl font-bold">About this asset</h2><p className="mt-3 text-warm/80">{a.desc}</p>
            <h3 className="mt-6 text-sm font-semibold">What's included</h3><ul className="mt-2 space-y-2">{a.included.map((i) => <li key={i} className="flex gap-2 text-sm text-warm/80"><Icon name="Check" size={16} className="mt-0.5 shrink-0 text-mint" />{i}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-2">{a.tags.map((t) => <Link key={t} to={`/explore?q=${t}`} className="chip">#{t}</Link>)}</div></section>

          <section className="mt-10" aria-labelledby="rev"><div className="flex items-center justify-between"><h2 id="rev" className="text-xl font-bold">Reviews</h2><Demo /></div>
            <form onSubmit={gate(submitReview)} className="card mt-4 p-4"><div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setRv({ ...rv, rating: n })} aria-label={`${n} stars`} aria-checked={rv.rating === n} role="radio"><Icon name="Star" size={20} className={n <= rv.rating ? 'fill-coral text-coral' : 'text-mute'} /></button>)}</div>
              <textarea className="field mt-3 !h-20 py-2" value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} placeholder="Share how you used this asset…" aria-label="Review" /><button className="btn btn-secondary btn-sm mt-3">Post review</button></form>
            <ul className="mt-4 divide-y divide-line">{myReviews.map((r) => [r.name, r.rating, r.text]).map(([n, r, t], i) => <li key={i} className="py-4"><div className="flex items-center gap-2 text-sm font-medium">{n}<Stars v={r} /></div><p className="mt-1 text-sm text-warm/75">{t}</p></li>)}</ul>{!myReviews.length && <p className="mt-4 text-sm text-mute">No reviews yet. Reviews appear once buyers submit them. Anything you write here is stored in this browser only (demo mode).</p>}</section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3"><h1 className="text-2xl font-bold leading-tight">{a.title}</h1><SaveButton slug={a.slug} /></div>
            <p className="mt-2 text-sm text-mute">by <Link to={`/creators/${a.creator}`} className="text-warm hover:text-accent">{cr.name}</Link> in <Link to={`/assets/${cat.slug}`} className="text-warm hover:text-accent">{cat.name}</Link></p>
            <div className="mt-3 flex items-center gap-3">{a.rating != null ? <Stars v={a.rating} n={a.reviews} /> : <span className="font-mono text-[11px] uppercase tracking-wider text-mute">No ratings yet</span>}</div>
            <p className="mt-5 font-display text-3xl font-bold">{a.price ? `$${a.price}` : 'Free'}</p>
            <button className="btn btn-primary mt-4 w-full h-11" onClick={gate(() => setLic(true))}><Icon name="Download" size={16} />{owned ? 'Download again' : a.price ? `Get it · $${a.price} (demo)` : 'Download free'}</button>
            <p className="mt-2 text-center text-xs text-mute">You'll review the license before downloading.</p>
            <dl className="mt-5"><Spec k="Formats" v={a.formats.join(', ')} /><Spec k="Compatibility" v={a.compat.join(', ')} /><Spec k="Dimensions" v={a.dims} /><Spec k="File size" v={a.size} /></dl>
            <div className="mt-4 rounded-lg border border-line bg-raise p-3"><p className="label !mb-1">License summary</p><p className="text-xs text-warm/75">{a.license}</p><Link to="/licensing" className="mt-2 inline-block text-xs text-accent hover:underline">Read full licensing terms</Link></div>
            <button onClick={() => toast('Report received — our team will review it (demo)')} className="mt-4 text-xs text-mute underline hover:text-warm">Report copyright issue</button>
          </div>
          <Link to={`/creators/${a.creator}`} className="card mt-4 flex items-center gap-3 p-4 transition hover:border-mute hover:shadow-md"><div className="h-11 w-11 overflow-hidden rounded-full"><Art kind="badge" seed={a.seed} /></div><div><p className="text-sm font-semibold">{cr.name}</p><p className="text-xs text-mute">View creator profile</p></div></Link>
        </aside>
      </div>

      <section className="mt-14"><h2 className="mb-5 text-xl font-bold">Related assets</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((x) => <AssetCard key={x.slug} a={x} />)}</div></section>

      <Faq path={`/asset/${a.slug}`} />

      <Modal open={lic} onClose={() => setLic(false)} title={a.price && !owned ? 'Confirm purchase' : 'Confirm license'}>
        <p className="text-sm text-warm/80">{a.license}</p>
        {a.price > 0 && !owned && <p className="mt-3 rounded-lg border border-line bg-raise p-3 text-xs text-mute">Demo mode: no payment is taken and no card details are collected. A payment provider must be connected before real sales can happen.</p>}
        <label className="mt-4 flex cursor-pointer gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#2447F5]" />I have read and agree to the license terms.</label>
        <button disabled={!agree} onClick={download} className="btn btn-primary mt-5 w-full">{a.price && !owned ? `Complete demo order · $${a.price}` : 'Download'}</button>
      </Modal>
    </Page>
  )
}
