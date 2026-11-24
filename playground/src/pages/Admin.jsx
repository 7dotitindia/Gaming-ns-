import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Empty, Icon, Page, Stat, Tabs, Demo } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { assets, categories, creators, guides } from '../lib/data'

const STATUS = ['draft', 'submitted', 'under review', 'published', 'rejected']
const tone = { published: 'text-accent border-accent/50', rejected: 'text-red-400 border-red-500/40' }
const Pill = ({ s }) => <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${tone[s] || 'border-line text-mute'}`}>{s}</span>
const Table = ({ head, rows }) => (
  <div className="card overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b border-line">{head.map((h) => <th key={h} className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-mute">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i} className="border-b border-line last:border-0">{r.map((c, j) => <td key={j} className="px-4 py-3">{c}</td>)}</tr>)}</tbody></table></div>
)

export default function Admin() {
  const { user, toast } = useApp(); const [tab, setTab] = useState('overview')
  const [status, setStatus] = usePersist('pg.admin.status', Object.fromEntries(assets.map((a, i) => [a.slug, i % 7 === 3 ? 'under review' : 'published'])))
  const [featured, setFeatured] = usePersist('pg.admin.featured', assets.filter((a) => a.trending).map((a) => a.slug))
  const [reports, setReports] = usePersist('pg.admin.reports', [{ id: 1, what: 'Copyright report — Low Poly World', by: 'user_204', state: 'open' }, { id: 2, what: 'Spam comment on a shot', by: 'user_118', state: 'open' }])
  const [audit, setAudit] = usePersist('pg.admin.audit', [])
  const [suspended, setSuspended] = usePersist('pg.admin.susp', [])
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />
  if (user.role !== 'admin') return <Page title="Access denied"><Empty icon="ShieldAlert" title="Admin access required" text="Your account doesn’t have permission to view the CMS. Roles: visitor, user, creator, moderator, admin." action={<Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>} /></Page>

  const log = (msg) => setAudit([{ msg, who: user.name, at: new Date().toLocaleTimeString() }, ...audit]) // audit trail for sensitive actions
  const setS = (slug, s) => { setStatus({ ...status, [slug]: s }); log(`Set ${slug} → ${s}`); toast(`Status: ${s}`) }
  const queue = assets.filter((a) => ['submitted', 'under review'].includes(status[a.slug]))
  const tabs = [['overview', 'Overview'], ['assets', 'Assets'], ['moderation', `Moderation (${queue.length})`], ['categories', 'Categories'], ['creators', 'Creators & users'], ['homepage', 'Homepage'], ['reports', `Reports (${reports.filter((r) => r.state === 'open').length})`], ['audit', 'Audit log']]

  return (
    <Page title="Admin CMS">
      <div className="mb-6 flex items-center gap-3"><h1 className="text-3xl font-bold">Admin CMS</h1><Demo /></div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === 'overview' && <><div className="grid gap-4 sm:grid-cols-4"><Stat label="Assets" value={assets.length} /><Stat label="Creators" value={creators.length} /><Stat label="In moderation" value={queue.length} /><Stat label="Open reports" value={reports.filter((r) => r.state === 'open').length} /></div>
          <p className="mt-6 max-w-xl text-sm text-mute">Asset workflow: draft → submitted → under review → published or rejected. Sensitive actions (status changes, suspensions, report resolutions) are written to the audit log.</p></>}
        {tab === 'assets' && <Table head={['Asset', 'Category', 'Price', 'Status', 'Featured', 'Set status']} rows={assets.map((a) => [a.title, categories.find((c) => c.slug === a.cat).name, a.price ? `$${a.price}` : 'Free', <Pill key="p" s={status[a.slug]} />, <input key="f" type="checkbox" aria-label={`Feature ${a.title}`} className="accent-[#2447F5]" checked={featured.includes(a.slug)} onChange={() => { setFeatured(featured.includes(a.slug) ? featured.filter((x) => x !== a.slug) : [...featured, a.slug]); log(`Toggled featured: ${a.slug}`) }} />, <select key="s" className="field !h-8 !w-36 px-2 text-xs" aria-label={`Status for ${a.title}`} value={status[a.slug]} onChange={(e) => setS(a.slug, e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>])} />}
        {tab === 'moderation' && (queue.length ? <Table head={['Asset', 'Creator', 'Status', 'Actions']} rows={queue.map((a) => [a.title, a.creator, <Pill key="p" s={status[a.slug]} />, <span key="a" className="flex gap-2"><button className="btn btn-primary btn-sm" onClick={() => setS(a.slug, 'published')}>Approve</button><button className="btn btn-secondary btn-sm" onClick={() => setS(a.slug, 'rejected')}>Reject</button></span>])} /> : <Empty icon="CircleCheck" title="Queue is clear" text="Nothing waiting for review." />)}
        {tab === 'categories' && <Table head={['Category', 'Slug', 'Assets']} rows={categories.map((c) => [c.name, `/assets/${c.slug}`, assets.filter((a) => a.cat === c.slug).length])} />}
        {tab === 'creators' && <Table head={['Creator', 'Region', 'Followers', 'Account']} rows={creators.map((c) => [c.name, c.region, c.followers.toLocaleString(), <button key="b" className={`btn btn-sm ${suspended.includes(c.username) ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setSuspended(suspended.includes(c.username) ? suspended.filter((x) => x !== c.username) : [...suspended, c.username]); log(`${suspended.includes(c.username) ? 'Reinstated' : 'Suspended'} ${c.username}`) }}>{suspended.includes(c.username) ? 'Reinstate' : 'Suspend'}</button>])} />}
        {tab === 'homepage' && <div className="grid gap-6 md:grid-cols-2"><div className="card p-5"><h2 className="mb-3 font-semibold">Featured placements</h2><ul className="space-y-2 text-sm">{featured.map((s) => <li key={s} className="flex justify-between"><span>{assets.find((a) => a.slug === s)?.title}</span><button className="text-accent" onClick={() => setFeatured(featured.filter((x) => x !== s))}>Remove</button></li>)}{!featured.length && <li className="text-mute">None featured.</li>}</ul></div><div className="card p-5"><h2 className="mb-3 font-semibold">Guides</h2><ul className="space-y-2 text-sm text-mute">{guides.slice(0, 5).map((g) => <li key={g.slug}>{g.title}</li>)}</ul></div></div>}
        {tab === 'reports' && (reports.length ? <Table head={['Report', 'Reported by', 'State', 'Action']} rows={reports.map((r) => [r.what, r.by, <Pill key="p" s={r.state === 'open' ? 'under review' : 'published'} />, r.state === 'open' ? <button key="b" className="btn btn-secondary btn-sm" onClick={() => { setReports(reports.map((x) => (x.id === r.id ? { ...x, state: 'resolved' } : x))); log(`Resolved report #${r.id}`) }}>Mark resolved</button> : 'Resolved'])} /> : <Empty title="No reports" />)}
        {tab === 'audit' && (audit.length ? <Table head={['Time', 'Admin', 'Action']} rows={audit.map((a) => [a.at, a.who, a.msg])} /> : <Empty icon="ScrollText" title="No audit entries yet" text="Moderation and commerce actions appear here." />)}
      </div>
    </Page>
  )
}
