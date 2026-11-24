import { useState } from 'react'
import { Link } from 'react-router-dom'
import Art from '../components/Art'
import { Crumbs, Demo, Icon, Page, useGate } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { categories, challenges, creators } from '../lib/data'

function Hub() {
  return (
    <Page title="Community" desc="Publish work, follow creators and join design challenges.">
      <Crumbs items={[['Community']]} />
      <div className="max-w-2xl"><p className="eyebrow">Creator hub</p><h1 className="mt-1 text-4xl font-bold">Make it. Share it. Get discovered.</h1><p className="mt-3 text-mute">Follow creators, like and bookmark work, join challenges and publish your own assets.</p>
        <div className="mt-6 flex gap-3"><Link to="/upload" className="btn btn-primary">Submit your work</Link><Link to="/challenges" className="btn btn-secondary">Join a challenge</Link></div></div>
      <section className="mt-14"><h2 className="mb-5 text-xl font-bold">Top creators <Demo /></h2><div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">{creators.map((c, i) => <Link key={c.username} to={`/creators/${c.username}`} className="card p-4 text-center transition hover:border-accent"><div className="mx-auto h-14 w-14 overflow-hidden rounded-full"><Art kind="badge" seed={i + 2} /></div><p className="mt-2 truncate text-sm font-semibold">{c.name}</p><p className="text-xs text-mute">{c.followers.toLocaleString()} followers</p></Link>)}</div></section>
      <section className="mt-14"><h2 className="mb-5 text-xl font-bold">Open challenges</h2><Challenges inline /></section>
    </Page>
  )
}

function Challenges({ inline }) {
  const { toast } = useApp(); const gate = useGate(); const [joined, setJoined] = usePersist('pg.challenges', [])
  const body = (
    <div className="grid gap-5 md:grid-cols-3">{challenges.map((c) => { const ended = c.ends.includes('ended'), j = joined.includes(c.slug); return (
      <div key={c.slug} className="card overflow-hidden"><div className="aspect-video"><Art kind={c.art} seed={c.seed} /></div>
        <div className="p-4"><h3 className="font-semibold">{c.title}</h3><p className="mt-1 text-xs text-mute">{c.ends} · {c.entries + (j ? 1 : 0)} entries</p>
          <button disabled={ended} className={`btn btn-sm mt-4 w-full ${j ? 'btn-secondary' : 'btn-primary'}`} onClick={gate(() => { setJoined(j ? joined.filter((x) => x !== c.slug) : [...joined, c.slug]); toast(j ? 'Left challenge' : 'You’re in! Submit from Upload.') })}>{ended ? 'Ended' : j ? 'Joined ✓' : 'Join challenge'}</button></div></div>) })}</div>
  )
  if (inline) return body
  return <Page title="Challenges" desc="Design challenges for the PLAYGROUND community."><Crumbs items={[['Community', '/community'], ['Challenges']]} /><div className="mb-8 flex items-end justify-between"><h1 className="text-3xl font-bold md:text-4xl">Design challenges</h1><Demo /></div>{body}</Page>
}

const steps = ['Files', 'Details', 'License & price', 'Preview']
const blank = { title: '', desc: '', cat: 'graphics', tags: '', formats: '', license: 'Standard', price: '0', preview: '', previewName: '', source: '' }

function Upload() {
  const { toast, user } = useApp(); const gate = useGate(); const [uploads, setUploads] = usePersist('pg.uploads', [])
  const [step, setStep] = useState(0); const [f, setF] = useState(blank); const [err, setErr] = useState({})
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const pickPreview = (e) => {
    const file = e.target.files[0]; if (!file) return
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return toast('Preview must be PNG, JPG or WebP', 'info')
    if (file.size > 5e6) return toast('Preview is over 5 MB', 'info')
    const r = new FileReader(); r.onload = () => setF((x) => ({ ...x, preview: r.result, previewName: file.name })); r.readAsDataURL(file)
  }
  const validate = (s) => {
    const er = {}
    if (s === 0 && !f.preview) er.preview = 'Add a preview image'
    if (s === 1) { if (f.title.trim().length < 3) er.title = 'Title needed (3+ characters)'; if (f.desc.trim().length < 20) er.desc = 'Describe the asset (20+ characters)'; if (!f.formats.trim()) er.formats = 'List the formats you actually include' }
    if (s === 2 && (isNaN(+f.price) || +f.price < 0)) er.price = 'Enter a valid price'
    setErr(er); return !Object.keys(er).length
  }
  const next = () => validate(step) && setStep(step + 1)
  const submit = gate(() => {
    setUploads([{ ...f, id: Date.now(), status: 'submitted', at: new Date().toISOString() }, ...uploads]); setF(blank); setStep(0); toast('Submitted for moderation')
  })
  const E = ({ k }) => err[k] ? <p className="mt-1 text-xs text-red-400">{err[k]}</p> : null
  return (
    <Page title="Upload" desc="Submit your asset for review and publishing.">
      <Crumbs items={[['Community', '/community'], ['Upload']]} />
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">Submit your work</h1>
      <p className="mb-8 text-sm text-mute">Assets are reviewed before publishing: draft → submitted → under review → published or rejected. {!user && 'You’ll need to sign in to submit.'}</p>
      <ol className="mb-8 flex gap-2" aria-label="Steps">{steps.map((s, i) => <li key={s} className={`flex-1 border-t-2 pt-2 text-xs ${i <= step ? 'border-accent text-warm' : 'border-line text-mute'}`}><span className="font-mono">0{i + 1}</span> {s}</li>)}</ol>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="card space-y-5 p-6">
          {step === 0 && <>
            <div><span className="label">Preview image *</span><label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-raise p-8 text-center hover:border-accent"><Icon name="ImagePlus" size={26} className="text-mute" /><span className="mt-2 text-sm">{f.previewName || 'Choose PNG, JPG or WebP (max 5 MB)'}</span><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={pickPreview} /></label><E k="preview" /></div>
            <div><label className="label" htmlFor="src">Source file name (optional)</label><input id="src" className="field" value={f.source} onChange={(e) => set('source', e.target.value)} placeholder="e.g. hud-kit-source.zip" /><p className="mt-1 text-xs text-mute">Source files upload to private storage once the backend is connected. Only the name is recorded in this prototype.</p></div></>}
          {step === 1 && <>
            <div><label className="label" htmlFor="ti">Title *</label><input id="ti" className="field" value={f.title} onChange={(e) => set('title', e.target.value)} /><E k="title" /></div>
            <div><label className="label" htmlFor="de">Description *</label><textarea id="de" className="field !h-28 py-2" value={f.desc} onChange={(e) => set('desc', e.target.value)} /><E k="desc" /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="label" htmlFor="ca">Category</label><select id="ca" className="field" value={f.cat} onChange={(e) => set('cat', e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
              <div><label className="label" htmlFor="ta">Tags (comma separated)</label><input id="ta" className="field" value={f.tags} onChange={(e) => set('tags', e.target.value)} /></div></div>
            <div><label className="label" htmlFor="fo">Formats included *</label><input id="fo" className="field" value={f.formats} onChange={(e) => set('formats', e.target.value)} placeholder="PSD, SVG, PNG" /><E k="formats" /><p className="mt-1 text-xs text-mute">Only list formats that are actually in your download.</p></div></>}
          {step === 2 && <>
            <div><label className="label" htmlFor="li">License</label><select id="li" className="field" value={f.license} onChange={(e) => set('license', e.target.value)}>{['Free', 'Standard', 'Extended', 'CC0'].map((l) => <option key={l}>{l}</option>)}</select></div>
            <div><label className="label" htmlFor="pr">Price (USD, 0 = free)</label><input id="pr" type="number" min="0" className="field" value={f.price} onChange={(e) => set('price', e.target.value)} /><E k="price" /></div>
            <p className="rounded-lg border border-line bg-raise p-3 text-xs text-mute">Creator earnings, commission and payout rules are defined before paid sales go live (Release 4).</p></>}
          {step === 3 && <p className="text-sm text-mute">Review your listing on the right. By submitting you confirm you own the rights to everything uploaded.</p>}
          <div className="flex justify-between pt-2"><button className="btn btn-secondary" disabled={!step} onClick={() => setStep(step - 1)}>Back</button>{step < 3 ? <button className="btn btn-primary" onClick={next}>Continue</button> : <button className="btn btn-primary" onClick={submit}>Submit for review</button>}</div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start"><p className="label">Listing preview</p>
          <div className="card overflow-hidden"><div className="aspect-video bg-ink">{f.preview ? <img src={f.preview} alt="Preview" className="h-full w-full object-cover" /> : <Art kind="poster" seed={1} />}</div><div className="p-3"><p className="truncate text-sm font-semibold">{f.title || 'Untitled asset'}</p><p className="text-xs text-mute">{categories.find((c) => c.slug === f.cat).name} · {+f.price ? `$${f.price}` : 'Free'} · {f.license} license</p></div></div>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-mute"><span className="h-2 w-2 rounded-full bg-mute" />Status: Draft</p></aside>
      </div>
      {uploads.length > 0 && <section className="mt-12"><h2 className="mb-4 text-xl font-bold">Your submissions</h2><ul className="space-y-2">{uploads.map((u) => <li key={u.id} className="card flex items-center gap-3 p-3 text-sm"><img src={u.preview} alt="" className="h-10 w-16 rounded object-cover" /><span className="flex-1 truncate">{u.title}</span><span className="rounded-full border border-accent/50 px-2 py-0.5 font-mono text-[10px] uppercase text-accent">Submitted · awaiting review</span></li>)}</ul></section>}
    </Page>
  )
}

export default function Community({ view }) {
  return { hub: <Hub />, challenges: <Challenges />, upload: <Upload /> }[view]
}
