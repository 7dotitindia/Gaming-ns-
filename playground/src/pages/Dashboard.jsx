import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Art from '../components/Art'
import { AssetCard, Empty, Icon, Modal, Page, Stat, Toggle } from '../components/ui'
import { useApp, usePersist } from '../lib/store'
import { getAsset } from '../lib/data'

const nav = [['overview', 'Overview', 'LayoutDashboard', '/dashboard'], ['downloads', 'Downloads', 'Download', '/downloads'], ['purchases', 'Purchases', 'Receipt', '/purchases'], ['favorites', 'Favorites', 'Heart', '/favorites'], ['collections', 'Collections', 'FolderHeart', '/my-collections'], ['designs', 'My designs', 'PenTool', '/my-designs'], ['uploads', 'My uploads', 'Upload', '/upload'], ['licenses', 'License history', 'ScrollText', '/purchases'], ['settings', 'Settings', 'Settings', '/settings']]
const fmtDate = (s) => new Date(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export default function Dashboard({ tab }) {
  const { user, downloads, favorites, designs, setDesigns, toast, updateUser, logout } = useApp(); const go = useNavigate()
  const [coll, setColl] = usePersist('pg.colls', []); const [name, setName] = useState(''); const [del, setDel] = useState(null)
  const [prefs, setPrefs] = usePersist('pg.prefs', { news: true, notif: true }); const [dn, setDn] = useState(user?.name || '')
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />   // permission-denied → sign in
  const uploads = JSON.parse(localStorage.getItem('pg.uploads') || '[]'); const paid = downloads.filter((d) => d.price > 0)
  const favAssets = favorites.map(getAsset).filter(Boolean)

  const body = {
    overview: <>
      <div className="grid gap-4 sm:grid-cols-4"><Stat label="Downloads" value={downloads.length} /><Stat label="Favorites" value={favorites.length} /><Stat label="Designs" value={designs.length} /><Stat label="Uploads" value={uploads.length} /></div>
      <h2 className="mb-3 mt-10 text-lg font-bold">Recent downloads</h2>
      {downloads.length ? <div className="grid gap-4 sm:grid-cols-3">{downloads.slice(0, 3).map((d, i) => <AssetCard key={i} a={getAsset(d.slug)} />)}</div> : <Empty icon="Download" title="No downloads yet" text="Assets you download appear here." action={<Link to="/explore" className="btn btn-primary">Explore assets</Link>} />}
    </>,
    downloads: downloads.length ? <ul className="space-y-2">{downloads.map((d, i) => { const a = getAsset(d.slug); return <li key={i} className="card flex items-center gap-4 p-3"><div className="h-12 w-20 shrink-0 overflow-hidden rounded"><Art kind={a.art} seed={a.seed} /></div><Link to={`/asset/${a.slug}`} className="min-w-0 flex-1 truncate font-medium hover:text-accent">{a.title}</Link><span className="text-xs text-mute">{fmtDate(d.at)}</span></li> })}</ul> : <Empty icon="Download" title="No downloads yet" action={<Link to="/explore" className="btn btn-primary">Explore assets</Link>} />,
    purchases: paid.length ? <ul className="space-y-2">{paid.map((d, i) => { const a = getAsset(d.slug); return <li key={i} className="card p-4"><div className="flex justify-between gap-4 text-sm"><Link to={`/asset/${a.slug}`} className="font-medium hover:text-accent">{a.title}</Link><span>${d.price}</span></div><p className="mt-1 text-xs text-mute">{fmtDate(d.at)} · {a.license}</p></li> })}</ul> : <Empty icon="Receipt" title="No purchases yet" text="Purchases and their license terms are listed here." action={<Link to="/premium" className="btn btn-primary">Browse premium</Link>} />,
    favorites: favAssets.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{favAssets.map((a) => <AssetCard key={a.slug} a={a} />)}</div> : <Empty icon="Heart" title="No favorites yet" text="Tap the heart on any asset to save it." action={<Link to="/explore" className="btn btn-primary">Explore assets</Link>} />,
    collections: <>
      <form className="mb-6 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setColl([...coll, { id: Date.now(), name: name.trim(), items: favorites }]); setName(''); toast('Collection created from your favorites') }}><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="New collection name" aria-label="Collection name" /><button className="btn btn-primary">Create</button></form>
      {coll.length ? <div className="grid gap-4 sm:grid-cols-3">{coll.map((c) => <div key={c.id} className="card p-4"><h3 className="font-semibold">{c.name}</h3><p className="mt-1 text-xs text-mute">{c.items.length} assets (snapshot of favorites)</p><button className="btn btn-ghost btn-sm mt-3 !px-0 text-accent" onClick={() => setDel({ kind: 'coll', id: c.id, label: c.name })}>Delete</button></div>)}</div> : <Empty icon="FolderHeart" title="No collections yet" text="Group assets into collections for projects." />}</>,
    designs: designs.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{designs.map((d) => <div key={d.id} className="card overflow-hidden"><Link to={`/studio/${d.tool}?project=${d.id}`}><img src={d.thumb} alt={d.name} className="aspect-video w-full object-cover" /></Link><div className="flex items-center justify-between p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{d.name}</p><p className="text-xs text-mute">Edited {fmtDate(d.updated)}</p></div><div className="flex"><Link to={`/studio/${d.tool}?project=${d.id}`} className="btn btn-ghost btn-sm" aria-label="Edit"><Icon name="Pencil" size={14} /></Link><button className="btn btn-ghost btn-sm" aria-label="Delete" onClick={() => setDel({ kind: 'design', id: d.id, label: d.name })}><Icon name="Trash2" size={14} /></button></div></div></div>)}</div> : <Empty icon="PenTool" title="No saved designs" text="Open the Studio, build something and hit Save." action={<Link to="/create" className="btn btn-primary">Open Studio</Link>} />,
    uploads: uploads.length ? <ul className="space-y-2">{uploads.map((u) => <li key={u.id} className="card flex items-center gap-3 p-3 text-sm"><img src={u.preview} alt="" className="h-10 w-16 rounded object-cover" /><span className="flex-1 truncate">{u.title}</span><span className="font-mono text-[10px] uppercase text-accent">Awaiting review</span></li>)}</ul> : <Empty icon="Upload" title="No uploads yet" action={<Link to="/upload" className="btn btn-primary">Submit work</Link>} />,
    licenses: paid.length || downloads.length ? <ul className="space-y-2">{downloads.map((d, i) => <li key={i} className="card p-4 text-sm"><p className="font-medium">{getAsset(d.slug).title}</p><p className="mt-1 text-xs text-mute">{fmtDate(d.at)} — {getAsset(d.slug).license}</p></li>)}</ul> : <Empty icon="ScrollText" title="No licenses yet" text="Each download records the license you accepted." />,
    settings: <form className="card max-w-md space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); if (dn.trim().length < 2) return toast('Name is too short', 'info'); updateUser({ name: dn.trim() }); toast('Settings saved') }}>
      <div><label className="label" htmlFor="dn">Display name</label><input id="dn" className="field" value={dn} onChange={(e) => setDn(e.target.value)} /></div>
      <div><span className="label">Email</span><p className="text-sm text-mute">{user.email}</p></div>
      <Toggle label="Notifications" checked={prefs.notif} onChange={(v) => setPrefs({ ...prefs, notif: v })} /><Toggle label="Newsletter" checked={prefs.news} onChange={(v) => setPrefs({ ...prefs, news: v })} />
      <div className="flex gap-2"><button className="btn btn-primary">Save changes</button><button type="button" className="btn btn-secondary" onClick={() => { logout(); go('/') }}>Sign out</button></div></form>,
  }[tab] ?? null
  const title = nav.find((n) => n[0] === tab)[1]

  const confirm = () => { if (del.kind === 'design') setDesigns(designs.filter((d) => d.id !== del.id)); else setColl(coll.filter((c) => c.id !== del.id)); toast('Deleted'); setDel(null) }
  return (
    <Page title={title}>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Dashboard" className="scroll-hide flex gap-1 overflow-x-auto lg:block lg:space-y-1">{nav.map(([k, l, ic, to]) => <Link key={k} to={to} aria-current={tab === k ? 'page' : undefined} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${tab === k ? 'bg-graphite text-warm' : 'text-mute hover:text-warm'}`}><Icon name={ic} size={16} className={tab === k ? 'text-accent' : ''} />{l}</Link>)}</nav>
        <div><h1 className="mb-6 text-3xl font-bold">{tab === 'overview' ? `Welcome back, ${user.name}` : title}</h1>{body}</div>
      </div>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete permanently?"><p className="text-sm text-mute">“{del?.label}” will be removed. This can’t be undone.</p><div className="mt-5 flex justify-end gap-2"><button className="btn btn-secondary" onClick={() => setDel(null)}>Cancel</button><button className="btn btn-primary" onClick={confirm}>Delete</button></div></Modal>
    </Page>
  )
}
