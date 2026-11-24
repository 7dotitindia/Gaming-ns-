import { useEffect, useRef } from 'react'
import { draw, templates } from '../lib/editor'

// Renders a real Studio template with the same canvas renderer the editor uses for export.
export function TemplatePreview({ index = 0, w = 1500, h = 500, className = '' }) {
  const ref = useRef()
  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    const paint = () => draw(ctx, templates[index % templates.length].make(w, h), new Map())
    paint()
    document.fonts?.ready.then(paint)
  }, [index, w, h])
  return <canvas ref={ref} width={w} height={h} className={`block h-auto w-full ${className}`} role="img" aria-label={`${templates[index % templates.length].name} template preview`} />
}

export const Mono = ({ children, className = '' }) => <span className={`font-mono text-[11px] uppercase tracking-[0.16em] ${className}`}>{children}</span>
