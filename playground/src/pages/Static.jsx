import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Crumbs, Empty, Icon, Page } from '../components/ui'
import { useApp } from '../lib/store'

const legal = (t, ps) => ({ title: t, body: ps })
const docs = {
  licensing: legal('Licensing', [
    ['How licenses work', 'Every asset shows its license before you download or buy it. An asset is never free for commercial use unless its license explicitly says so.'],
    ['Free License', 'Personal use and monetised streams. Attribution required. No resale or redistribution.'],
    ['Standard License', 'Use in your own projects, streams and client work. Source files may not be resold or redistributed.'],
    ['Extended License', 'Use in shipped games and commercial products. Source files may not be resold as assets.'],
    ['CC0', 'Public domain dedication. Use for anything, attribution optional.'],
    ['Copyright reports', 'If you believe an asset infringes your rights, use "Report copyright issue" on the asset page. We review reports and remove content where required.'],
  ]),
  privacy: legal('Privacy Policy', [['Prototype notice', 'This prototype stores preferences, favorites and designs in your browser\u2019s local storage only. Nothing is sent to a server. A production policy will be added before launch.'], ['What a live service would collect', 'Account details, download and purchase history, and uploaded content — each with retention and deletion rules documented here.']]),
  terms: legal('Terms of Service', [['Prototype notice', 'These terms are placeholder structure for the first release and must be reviewed by legal counsel before launch.'], ['Your content', 'You keep ownership of what you upload and grant PLAYGROUND the rights needed to host and distribute it under the license you choose.'], ['Acceptable use', 'No infringing, deceptive or harmful content. Accounts that break these rules may be suspended.']]),
  about: legal('About PLAYGROUND', [['Our mission', 'A creative operating space for gamers, streamers, esports teams, designers and game developers — discover assets, customize your identity, and share your work.'], ['Principles', 'Useful before monetized. Visual-first discovery. Customization over passive downloads. Trust and clarity on licenses and pricing.']]),
}

const plans = [
  ['Free', '$0', 'Everything you need to start', ['Browse and download free assets', '3 saved designs', 'PNG export', 'All gaming tools']],
  ['Pro', '$9/mo', 'For active creators and streamers', ['Premium asset discounts', 'Unlimited saved designs', 'Transparent PNG + JPG export', 'Larger collections'], true],
  ['Team', '$29/mo', 'For esports teams and orgs', ['5 seats', 'Shared team kit library', 'Team profile page', 'Priority support']],
]

function Pricing() {
  const { toast } = useApp()
  return (
    <>
      <div className="mx-auto max-w-xl text-center"><h1 className="text-4xl font-bold">Simple pricing</h1><p className="mt-3 text-mute">Free is genuinely useful. Upgrade when you need more. Sample pricing — subscriptions launch in Release 4.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{plans.map(([n, p, d, f, hot]) => (
        <div key={n} className={`card p-6 ${hot ? '!border-accent shadow-md' : ''}`}><h2 className="text-lg font-bold">{n}</h2><p className="mt-3 font-display text-4xl font-bold">{p}</p><p className="mt-1 text-sm text-mute">{d}</p>
          <ul className="mt-5 space-y-2">{f.map((x) => <li key={x} className="flex gap-2 text-sm"><Icon name="Check" size={16} className="mt-0.5 text-mint" />{x}</li>)}</ul>
          <button className={`btn mt-6 w-full ${hot ? 'btn-primary' : 'btn-secondary'}`} onClick={() => toast(n === 'Free' ? 'You\u2019re on the Free plan' : 'Subscriptions are coming in Release 4 — we\u2019ll notify you', 'info')}>{n === 'Free' ? 'Current plan' : `Get ${n}`}</button></div>))}</div>
    </>
  )
}

function Contact() {
  const { toast } = useApp(); const [f, setF] = useState({ name: '', email: '', topic: 'General', msg: '' }); const [sent, setSent] = useState(false)
  const submit = (e) => { e.preventDefault(); if (!f.name || !/^\S+@\S+\.\S+$/.test(f.email) || f.msg.length < 10) return toast('Complete all fields', 'info'); setSent(true) }
  if (sent) return <Empty icon="CircleCheck" title="Message ready to send" text="This prototype has no mail backend, so nothing was transmitted. In production this posts to the support inbox." action={<button className="btn btn-secondary" onClick={() => setSent(false)}>Write another</button>} />
  return (
    <form onSubmit={submit} className="card mx-auto max-w-lg space-y-4 p-6"><h1 className="text-3xl font-bold">Contact us</h1>
      {[['name', 'Name'], ['email', 'Email']].map(([k, l]) => <div key={k}><label className="label" htmlFor={k}>{l}</label><input id={k} className="field" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>)}
      <div><label className="label" htmlFor="t">Topic</label><select id="t" className="field" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{['General', 'Copyright / takedown', 'Creator support', 'Advertising'].map((x) => <option key={x}>{x}</option>)}</select></div>
      <div><label className="label" htmlFor="m">Message</label><textarea id="m" className="field !h-28 py-2" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></div>
      <button className="btn btn-primary w-full">Send message</button></form>
  )
}

function Advertise() {
  return (
    <div className="mx-auto max-w-2xl"><h1 className="text-4xl font-bold">Advertise on PLAYGROUND</h1><p className="mt-3 text-mute">Reach gamers, streamers and creators with tasteful, clearly labelled placements that never interrupt the editor or checkout.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">{[['Display', 'Labelled "Ad" placements beside listings'], ['Sponsored collections', 'Curated packs marked "Sponsored"'], ['Featured listings', 'Promoted assets, clearly disclosed']].map(([t, d]) => <div key={t} className="card p-4"><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm text-mute">{d}</p></div>)}</div>
      <Link to="/contact" className="btn btn-primary mt-8">Talk to us</Link></div>
  )
}

export function Static({ page }) {
  const d = docs[page]; const title = d?.title || { pricing: 'Pricing', contact: 'Contact', advertise: 'Advertise' }[page]
  return (
    <Page title={title}>
      <Crumbs items={[[title]]} />
      {page === 'pricing' ? <Pricing /> : page === 'contact' ? <Contact /> : page === 'advertise' ? <Advertise /> : (
        <article className="mx-auto max-w-2xl"><h1 className="text-4xl font-bold">{d.title}</h1>{d.body.map(([h, p]) => <section key={h} className="mt-8"><h2 className="text-lg font-semibold">{h}</h2><p className="mt-2 text-warm/75">{p}</p></section>)}</article>
      )}
    </Page>
  )
}

export const NotFound = () => (
  <Page title="Page not found"><Empty icon="Compass" title="Page not found" text="That page doesn't exist or the asset has been removed." action={<Link to="/" className="btn btn-primary">Back to home</Link>} /></Page>
)
