import { assets, categories, collections, creators, getAsset, getCat, getCreator, guides, shots, studioTools, teams, tools } from './data'
import { faqsFor } from './faqs'

export const SITE = {
  name: 'PLAYGROUND',
  // Set SITE_URL at build time (or VITE_SITE_URL) — placeholder domain until the real one is chosen.
  url: (globalThis.process?.env?.SITE_URL || import.meta.env?.VITE_SITE_URL || 'https://www.playground.example').replace(/\/$/, ''),
  image: '/images/og-image.jpg',
  published: '2025-01-15',
  modified: '2025-11-24',
}
export const abs = (p) => (p.startsWith('http') ? p : SITE.url + p)
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')
const webp = (img) => (img ? img.replace(/\.\w+$/, '-960.webp') : SITE.image)
const crumb = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })) })
const itemList = (list) => ({ '@type': 'ItemList', itemListElement: list.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/asset/${a.slug}`), name: a.title })) })
const faqLd = (path) => { const f = faqsFor(path); return f.length ? { '@type': 'FAQPage', mainEntity: f.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } : null }

export const organization = {
  '@type': 'Organization', '@id': abs('/#org'), name: SITE.name, url: abs('/'), logo: abs('/logo.svg'),
  description: 'PLAYGROUND is a gaming creative marketplace for gamers, streamers, esports teams, designers and game developers.',
  areaServed: 'Worldwide', knowsAbout: ['game assets', 'stream overlays', 'esports branding', 'game UI', 'gaming tools'],
}
const website = {
  '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: SITE.name, inLanguage: 'en', publisher: { '@id': abs('/#org') },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs('/explore?q={search_term_string}') }, 'query-input': 'required name=search_term_string' },
}

export const PRIVATE = ['/login', '/register', '/dashboard', '/downloads', '/purchases', '/favorites', '/my-collections', '/my-designs', '/settings', '/admin', '/upload', '/my-uploads', '/creator-profile', '/license-history']
const STATIC = {
  '/esports': { title: 'Esports Team Kits: Jerseys, Logos & Matchday Graphics | PLAYGROUND', desc: 'Team identity systems, jersey and hoodie mockups, player cards, rosters, brackets and matchday graphics with clear licenses.', h1: 'Esports Team Kits' },
  '/': { title: 'PLAYGROUND | Gaming Assets, Esports Kits & Free Tools', desc: 'Discover game UI, 3D assets, stream overlays and esports team kits. Customize templates in your browser and use free gaming tools, all with clear licenses.', h1: 'Create beyond the game.' },
  '/explore': { title: 'Browse Gaming Assets & Esports Kits | PLAYGROUND', desc: 'Search and filter game UI, 3D models, overlays, audio, fonts and wallpapers by format, engine, license and price. Every listing shows its license upfront.', h1: 'Explore gaming assets' },
  '/categories': { title: 'Gaming Asset Categories | PLAYGROUND', desc: 'Browse every PLAYGROUND category: Game UI, 3D, 2D, streaming, audio, graphics, typography, animation, wallpapers and esports team kits.', h1: 'Browse by category' },
  '/trending': { title: 'Trending Gaming Assets This Week | PLAYGROUND', desc: 'See the gaming assets creators are downloading most this week: HUD kits, overlays, 3D environments and identity packs.', h1: 'Trending assets' },
  '/free': { title: 'Free Gaming Assets & Templates | PLAYGROUND', desc: 'Free game UI kits, wallpapers, sprites and stream packs with the license shown before you download, so you know exactly how you can use them.', h1: 'Free assets' },
  '/premium': { title: 'Premium Gaming Assets & Kits | PLAYGROUND', desc: 'Premium overlays, 3D environments, esports kits and sound packs from independent creators, with transparent one-time pricing and license terms.', h1: 'Premium assets' },
  '/create': { title: 'Free Gaming Banner, Logo & Thumbnail Maker | PLAYGROUND', desc: 'Design gaming banners, logos, YouTube thumbnails, overlays and team posters in your browser. Start from a template, edit, and export PNG or JPG.', h1: 'Customization Studio' },
  '/inspiration': { title: 'Gaming Design Inspiration Gallery | PLAYGROUND', desc: 'Explore community HUD concepts, esports identities, stream setups and key art. Follow creators, save work and get inspired.', h1: 'Inspiration gallery' },
  '/collections': { title: 'Curated Gaming Asset Collections | PLAYGROUND', desc: 'Themed packs like the FPS Stream Starter Pack and Esports Matchday Essentials, curated from the PLAYGROUND marketplace.', h1: 'Featured collections' },
  '/tools': { title: 'Free Gaming Tools: Crosshair, Sensitivity & More | PLAYGROUND', desc: 'Free browser gaming tools: crosshair generator, sensitivity converter, name generator, FPS calculator, PC build planner, palette and resolution tools.', h1: 'Powerful gaming tools' },
  '/learn': { title: 'Gaming Design & Streaming Guides | PLAYGROUND', desc: 'Practical guides on OBS setup, stream overlays, gaming branding, thumbnails, free game assets, Unity vs Unreal and PC setup.', h1: 'Guides & tutorials' },
  '/tutorials': { title: 'Gaming & Creator Tutorials | PLAYGROUND', desc: 'Step-by-step tutorials for streamers, designers and game developers.', h1: 'Tutorials' },
  '/gaming-resources': { title: 'Free Gaming Creator Resources | PLAYGROUND', desc: 'Free tools worth knowing for streaming, 3D, game development and design, linked to their official sites.', h1: 'Gaming resources' },
  '/community': { title: 'Creator Community & Challenges | PLAYGROUND', desc: 'Follow creators, join design challenges and publish your own gaming assets on PLAYGROUND.', h1: 'Make it. Share it. Get discovered.' },
  '/challenges': { title: 'Gaming Design Challenges | PLAYGROUND', desc: 'Join community design challenges: redesign a HUD, make a matchday poster or build an emote set.', h1: 'Design challenges' },
  '/pricing': { title: 'Pricing: Free, Pro & Team Plans | PLAYGROUND', desc: 'Start free. Upgrade to Pro for unlimited designs and extra export options, or Team for shared esports kits.', h1: 'Simple pricing' },
  '/about': { title: 'About PLAYGROUND | The Gaming Creative Marketplace', desc: 'PLAYGROUND is a creative space for gamers, streamers, esports teams, designers and game developers: assets, a browser editor, tools and community.', h1: 'About PLAYGROUND' },
  '/contact': { title: 'Contact PLAYGROUND', desc: 'Get in touch about support, copyright takedowns, creator questions or advertising.', h1: 'Contact us' },
  '/licensing': { title: 'Licensing Guide: Free, Standard & Extended | PLAYGROUND', desc: 'How PLAYGROUND licenses work: Free, Standard, Extended and CC0, what each allows, and how to report a copyright issue.', h1: 'Licensing' },
  '/advertise': { title: 'Advertise on PLAYGROUND', desc: 'Reach gamers, streamers and creators with clearly labelled display, sponsored collections and featured listings.', h1: 'Advertise on PLAYGROUND' },
  '/privacy': { title: 'Privacy Policy | PLAYGROUND', desc: 'How PLAYGROUND handles data in this prototype release.', h1: 'Privacy Policy' },
  '/login': { title: 'Sign in | PLAYGROUND', desc: 'Sign in to PLAYGROUND to access your downloads, favorites and saved designs.', h1: 'Sign in' },
  '/register': { title: 'Create your account | PLAYGROUND', desc: 'Join PLAYGROUND to save assets, track downloads, build designs and publish your work.', h1: 'Create account' },
  '/dashboard': { title: 'Dashboard | PLAYGROUND', desc: 'Your PLAYGROUND dashboard: downloads, favorites, designs and uploads.', h1: 'Dashboard' },
  '/downloads': { title: 'Downloads | PLAYGROUND', desc: 'Your downloaded PLAYGROUND assets and the licenses you accepted.', h1: 'Downloads' },
  '/purchases': { title: 'Purchases | PLAYGROUND', desc: 'Your PLAYGROUND purchases and license history.', h1: 'Purchases' },
  '/favorites': { title: 'Favorites | PLAYGROUND', desc: 'Assets you saved on PLAYGROUND.', h1: 'Favorites' },
  '/my-collections': { title: 'My collections | PLAYGROUND', desc: 'Your PLAYGROUND asset collections.', h1: 'My collections' },
  '/my-designs': { title: 'My designs | PLAYGROUND', desc: 'Your saved Customization Studio projects.', h1: 'My designs' },
  '/settings': { title: 'Account settings | PLAYGROUND', desc: 'Manage your PLAYGROUND profile and notification settings.', h1: 'Settings' },
  '/admin': { title: 'Admin CMS | PLAYGROUND', desc: 'PLAYGROUND administration: assets, moderation, creators and reports.', h1: 'Admin CMS' },
  '/upload': { title: 'Submit your work | PLAYGROUND', desc: 'Upload your gaming asset for review and publishing on PLAYGROUND.', h1: 'Submit your work' },
  '/terms': { title: 'Terms of Service | PLAYGROUND', desc: 'Terms for using PLAYGROUND in this prototype release.', h1: 'Terms of Service' },
}

const NOT_FOUND = { title: 'Page not found | PLAYGROUND', desc: 'This page does not exist.', h1: 'Page not found', noindex: true }

// Single source of truth for per-route SEO: used by the client <Page> and by the build-time prerender script.
export function routeMeta(path) {
  path = path.replace(/\/$/, '') || '/'
  const seg = path.split('/').filter(Boolean)
  const crumbs = [['Home', '/']]; let ld = []; let m = STATIC[path] && { ...STATIC[path] }
  if (path === '/') ld = [organization, website]
  else if (m) crumbs.push([m.h1, path])

  if (!m && seg[0] === 'assets') {
    const c = getCat(seg[1])
    if (c) {
      const list = assets.filter((a) => a.cat === c.slug)
      m = { title: `${clip(c.name, 30)} for Games, Streams & Teams | PLAYGROUND`, desc: clip(`${c.blurb} Free and premium, with license, formats and compatibility shown upfront.`, 158), h1: c.name, links: list.map((a) => [a.title, `/asset/${a.slug}`]) }
      crumbs.push(['Explore', '/explore'], [c.name, path])
      ld = [{ '@type': 'CollectionPage', name: c.name, url: abs(path), description: c.blurb, isPartOf: { '@id': abs('/#website') } }, itemList(list)]
    }
  }
  if (!m && seg[0] === 'asset') {
    const a = getAsset(seg[1])
    if (a) {
      const c = getCat(a.cat), cr = getCreator(a.creator)
      m = { title: `${clip(a.title, 34)} — ${c.name} | PLAYGROUND`, desc: clip(`${a.desc} Formats: ${a.formats.join(', ')}. ${a.price ? `$${a.price}` : 'Free'}.`, 158), h1: a.title, type: 'product', image: webp(a.img), links: [[c.name, `/assets/${c.slug}`], [cr.name, `/creators/${cr.username}`]] }
      crumbs.push(['Explore', '/explore'], [c.name, `/assets/${c.slug}`], [a.title, path])
      // No aggregateRating on purpose: ratings are sample data and must not be marked up as real reviews.
      ld = [{ '@type': 'Product', name: a.title, description: a.desc, image: abs(m.image), category: c.name, brand: { '@type': 'Brand', name: cr.name }, offers: { '@type': 'Offer', price: String(a.price), priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: abs(path) } }]
    }
  }
  if (!m && seg[0] === 'tools' && seg[1]) {
    const t = tools.find((x) => x.slug === seg[1])
    if (t) {
      m = { title: `${t.name}, Free Online | PLAYGROUND`, desc: clip(`${t.desc} Free, no sign-up, works in your browser on desktop and mobile.`, 158), h1: t.name }
      crumbs.push(['Tools', '/tools'], [t.name, path])
      ld = [{ '@type': 'WebApplication', name: t.name, url: abs(path), description: t.desc, applicationCategory: 'GameApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, isPartOf: { '@id': abs('/#website') } }]
    }
  }
  if (!m && seg[0] === 'studio' && seg[1]) {
    const t = studioTools.find((x) => x.slug === seg[1])
    if (t) {
      m = { title: `${t.name}, Free Online Editor | PLAYGROUND`, desc: `${t.name}: ${t.desc} Edit a template in your browser and export PNG or JPG at ${t.w}×${t.h}.`, h1: t.name }
      crumbs.push(['Create', '/create'], [t.name, path])
      ld = [{ '@type': 'WebApplication', name: t.name, url: abs(path), applicationCategory: 'DesignApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]
    }
  }
  if (!m && seg[0] === 'guides') {
    const g = guides.find((x) => x.slug === seg[1])
    if (g) {
      m = { title: `${clip(g.title, 44)} | PLAYGROUND Guides`, desc: clip(`${g.excerpt} A ${g.read} read for ${g.cat.toLowerCase()} creators.`, 158), h1: g.title, type: 'article', image: webp(g.img) }
      crumbs.push(['Guides', '/learn'], [g.title, path])
      ld = [{ '@type': 'Article', headline: g.title, description: g.excerpt, image: abs(m.image), datePublished: SITE.published, dateModified: SITE.modified, author: { '@type': 'Organization', name: SITE.name }, publisher: { '@id': abs('/#org') }, mainEntityOfPage: abs(path), inLanguage: 'en' }]
    }
  }
  if (!m && seg[0] === 'shots') {
    const s = shots.find((x) => x.slug === seg[1])
    if (s) {
      const cr = getCreator(s.creator)
      m = { title: `${clip(s.title, 34)} by ${cr.name} | PLAYGROUND`, desc: clip(`${s.desc} Shared by ${cr.name} on the PLAYGROUND inspiration gallery. Tools: ${s.tools.join(', ')}.`, 158), h1: s.title, type: 'article', image: webp(s.img) }
      crumbs.push(['Inspiration', '/inspiration'], [s.title, path])
      ld = [{ '@type': 'CreativeWork', name: s.title, description: s.desc, creator: { '@type': 'Person', name: cr.name }, keywords: s.tags.join(', '), image: abs(m.image) }]
    }
  }
  if (!m && seg[0] === 'creators') {
    const c = getCreator(seg[1])
    if (c) {
      m = { title: `${c.name}, Creator Profile | PLAYGROUND`, desc: clip(c.bio, 158), h1: c.name, links: assets.filter((a) => a.creator === c.username).map((a) => [a.title, `/asset/${a.slug}`]) }
      crumbs.push(['Creators', '/community'], [c.name, path])
      ld = [{ '@type': 'ProfilePage', mainEntity: { '@type': 'Person', name: c.name, description: c.bio, url: abs(path) } }]
    }
  }
  if (!m && seg[0] === 'collections' && seg[1]) {
    const c = collections.find((x) => x.slug === seg[1])
    if (c) {
      m = { title: `${clip(c.title, 40)} | PLAYGROUND`, desc: clip(`${c.desc} ${c.items.length} curated assets with license, formats and compatibility shown upfront.`, 158), h1: c.title, links: c.items.map((s) => [getAsset(s).title, `/asset/${s}`]) }
      crumbs.push(['Collections', '/collections'], [c.title, path])
      ld = [{ '@type': 'CollectionPage', name: c.title, description: c.desc, url: abs(path) }, itemList(c.items.map(getAsset))]
    }
  }
  if (!m && seg[0] === 'teams' && teams.find((x) => x.slug === seg[1])) m = { title: 'Esports Team Profile | PLAYGROUND', desc: 'Sample esports team profile with roster and achievements.', h1: 'Team profile', noindex: true }

  if (!m) return { ...NOT_FOUND, path, ld: [], crumbs, type: 'website', image: SITE.image, links: [] }
  const faq = faqLd(path); if (faq) ld.push(faq)
  if (path !== '/' && crumbs.length > 1) ld.push(crumb(crumbs))
  return { image: SITE.image, type: 'website', links: [], ...m, path, crumbs, noindex: !!m.noindex || PRIVATE.includes(path), ld }
}

export const graph = (ld) => ({ '@context': 'https://schema.org', '@graph': ld })

// Every indexable route — used by the sitemap + prerender scripts.
export const allRoutes = () => [
  ...Object.keys(STATIC).filter((p) => !PRIVATE.includes(p)), ...categories.map((c) => `/assets/${c.slug}`), ...assets.map((a) => `/asset/${a.slug}`),
  ...tools.map((t) => `/tools/${t.slug}`), ...studioTools.map((t) => `/studio/${t.slug}`), ...guides.map((g) => `/guides/${g.slug}`),
  ...shots.map((s) => `/shots/${s.slug}`), ...creators.map((c) => `/creators/${c.username}`), ...collections.map((c) => `/collections/${c.slug}`),
]
