// Post-build: bakes per-route <head> SEO tags, JSON-LD and a crawlable HTML summary into static files,
// and writes sitemap.xml, robots.txt and llms.txt. Run automatically by `npm run build`.
// Set SITE_URL=https://your-domain.com before building to change the canonical origin.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
const { routeMeta, allRoutes, graph, abs, SITE, PRIVATE } = await vite.ssrLoadModule('/src/lib/seo.js')
const { faqsFor } = await vite.ssrLoadModule('/src/lib/faqs.js')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const template = await readFile(join(dist, 'index.html'), 'utf8')

const nav = [['Explore assets', '/explore'], ['Esports team kits', '/assets/esports-kits'], ['Customization Studio', '/create'], ['Gaming tools', '/tools'], ['Inspiration', '/inspiration'], ['Guides', '/learn'], ['Licensing', '/licensing'], ['About', '/about']]

function render(path, m) {
  const url = abs(path), img = abs(m.image)
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.desc)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${url}" />`, `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`, `<meta property="og:description" content="${esc(m.desc)}" />`, `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${m.type === 'product' ? 'product' : m.type === 'article' ? 'article' : 'website'}" />`, `<meta property="og:image" content="${img}" />`, `<meta property="og:site_name" content="PLAYGROUND" />`, `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${esc(m.title)}" />`, `<meta name="twitter:description" content="${esc(m.desc)}" />`, `<meta name="twitter:image" content="${img}" />`,
    path === '/' ? '<link rel="preload" as="image" href="/images/hero-960.webp" imagesrcset="/images/hero-480.webp 480w, /images/hero-960.webp 960w, /images/hero-1600.webp 1600w" imagesizes="(min-width:1024px) 62vw, 100vw" fetchpriority="high" />' : '',
    m.ld.length ? `<script type="application/ld+json" id="ld-json">${JSON.stringify(graph(m.ld)).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')

  const faq = faqsFor(path)
  const body = `<header><a href="/">PLAYGROUND</a><nav aria-label="Primary">${nav.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join(' ')}</nav></header>
<main><h1>${esc(m.h1)}</h1><p>${esc(m.desc)}</p>
${m.links?.length ? `<ul>${m.links.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul>` : ''}
${faq.length ? `<section><h2>Frequently asked questions</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>` : ''}
${path === '/' ? `<section><h2>Browse</h2><ul>${nav.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></section>` : ''}</main>`

  return template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

const write = async (file, content) => { await mkdir(dirname(file), { recursive: true }); await writeFile(file, content) }

const routes = allRoutes()
for (const path of routes) await write(join(dist, path === '/' ? '' : path, 'index.html'), render(path, routeMeta(path)))
await write(join(dist, '404.html'), render('/404', routeMeta('/__404__')))
// Private/app routes still need to boot the SPA when hosted statically — they get noindex shells.
for (const path of PRIVATE) await write(join(dist, path, 'index.html'), render(path, routeMeta(path)))

const today = SITE.modified
await write(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${routes.map((p) => {
  const pri = p === '/' ? '1.0' : p.split('/').length <= 2 ? '0.8' : '0.6'
  return `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod><changefreq>${p.startsWith('/asset') ? 'weekly' : 'monthly'}</changefreq><priority>${pri}</priority><xhtml:link rel="alternate" hreflang="en" href="${abs(p)}"/></url>`
}).join('\n')}\n</urlset>\n`)

// robots.txt — explicitly welcomes search AND AI answer-engine crawlers (GEO), keeps account/admin areas out.
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
await write(join(dist, 'robots.txt'), `${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nUser-agent: *\nAllow: /\n${PRIVATE.map((p) => `Disallow: ${p}`).join('\n')}\nDisallow: /explore?q=\n\nSitemap: ${abs('/sitemap.xml')}\n`)

// llms.txt — concise, link-rich site summary for LLM-based search and assistants.
const section = (title, list) => `## ${title}\n${list.map((p) => { const m = routeMeta(p); return `- [${m.h1}](${abs(p)}): ${m.desc}` }).join('\n')}\n`
await write(join(dist, 'llms.txt'), `# PLAYGROUND\n\n> PLAYGROUND is a gaming creative marketplace for gamers, streamers, esports teams, designers and game developers. It combines a searchable asset marketplace, a browser-based Customization Studio, an inspiration community, free gaming tools and guides. All listings, ratings and creators in this prototype are sample data.\n\n${section('Marketplace', ['/explore', '/categories', '/free', '/premium', '/assets/esports-kits'])}\n${section('Create', ['/create', ...routes.filter((p) => p.startsWith('/studio/'))])}\n${section('Tools', ['/tools', ...routes.filter((p) => p.startsWith('/tools/'))])}\n${section('Guides', ['/learn', ...routes.filter((p) => p.startsWith('/guides/'))])}\n${section('Trust & policy', ['/licensing', '/about', '/contact'])}`)

await vite.close()
console.log(`prerendered ${routes.length} routes + ${PRIVATE.length} app shells → sitemap.xml, robots.txt, llms.txt (${SITE.url})`)
