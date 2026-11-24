import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { abs, graph, routeMeta } from './seo'

const upsert = (sel, make, attrs) => {
  let el = document.head.querySelector(sel)
  if (!el) { el = make(); document.head.appendChild(el) }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}
const meta = (key, val, content) => upsert(`meta[${key}="${val}"]`, () => document.createElement('meta'), { [key]: val, content })

// Client-side mirror of what scripts/prerender.mjs bakes into static HTML.
export function applyMeta(m, search = '') {
  const noindex = m.noindex || /[?&]q=/.test(search)   // internal search result pages are not indexable
  document.title = m.title
  meta('name', 'description', m.desc)
  meta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large')
  upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), { href: abs(m.path) })
  const img = abs(m.image)
  ;[['og:title', m.title], ['og:description', m.desc], ['og:url', abs(m.path)], ['og:type', m.type === 'product' ? 'product' : m.type === 'article' ? 'article' : 'website'], ['og:image', img], ['og:site_name', 'PLAYGROUND'], ['og:locale', 'en_US']].forEach(([p, c]) => meta('property', p, c))
  ;[['twitter:card', 'summary_large_image'], ['twitter:title', m.title], ['twitter:description', m.desc], ['twitter:image', img]].forEach(([n, c]) => meta('name', n, c))
  let s = document.getElementById('ld-json')
  if (!s) { s = Object.assign(document.createElement('script'), { id: 'ld-json', type: 'application/ld+json' }); document.head.appendChild(s) }
  s.textContent = m.ld.length ? JSON.stringify(graph(m.ld)) : ''
}

export function useSeo(fallback) {
  const { pathname, search } = useLocation()
  useEffect(() => {
    const m = routeMeta(pathname)
    applyMeta(m.h1 === 'Page not found' && fallback ? { ...m, ...fallback } : m, search)
  }, [pathname, search]) // eslint-disable-line
}
