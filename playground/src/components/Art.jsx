import { useId, useMemo } from 'react'

// Procedural, rights-clean placeholder artwork. Swap for real previews from storage/CDN.
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

const AC = '#4F46E5'  // indigo accent
const CR = '#EA580C'  // coral/orange
const motifs = {
  hud: (r) => (
    <g fill="none" stroke={AC} strokeWidth=".7">
      <circle cx="80" cy="45" r="26" opacity=".7" />
      <circle cx="80" cy="45" r="16" strokeDasharray="3 2" opacity=".5" />
      <path d="M80 12v10M80 68v10M47 45h10M103 45h10" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={10} y={12 + i * 9} width={20 + r() * 20} height="4" fill={AC} opacity=".6" stroke="none" />)}
      <rect x="120" y="60" width="30" height="20" stroke="#6C7385" opacity=".6" />
    </g>
  ),
  stream: (r) => (
    <g>
      <rect x="10" y="10" width="140" height="70" fill="none" stroke="#17192380" strokeOpacity=".25" />
      <rect x="112" y="46" width="34" height="30" fill="#F8F9FC" stroke={AC} strokeWidth=".8" />
      <rect x="10" y="64" width="70" height="8" fill={CR} />
      <rect x="10" y="74" width="48" height="3" fill="#171923" opacity=".5" />
      <circle cx="18" cy="20" r="3" fill={AC} />
    </g>
  ),
  lowpoly: (r) => (
    <g>
      <circle cx={110} cy="26" r="9" fill={CR} opacity=".9" />
      {[0, 1, 2, 3, 4].map((i) => { const x = i * 36 - 10, h = 28 + r() * 26; return <path key={i} d={`M${x} 90 L${x + 28} ${90 - h} L${x + 60} 90Z`} fill={['#E0E4ED', '#C8CDD8', '#D6DAE5', '#BFC5D2', '#D1D6E0'][i]} /> })}
      <path d="M0 90 L0 74 L40 80 L90 70 L160 78 L160 90Z" fill="#F1F3F8" />
    </g>
  ),
  hood: () => (
    <g>
      <path d="M0 90 C14 80 40 80 52 72 C58 56 56 30 80 16 C104 30 102 56 108 72 C120 80 146 80 160 90Z" fill="#F1F3F8" stroke="#E0E4ED" />
      <path d="M66 42 L94 42 L90 50 L70 50Z" fill={AC} />
      <path d="M62 38 L98 38" stroke={AC} strokeWidth=".6" opacity=".5" />
    </g>
  ),
  jersey: () => (
    <g>
      <path d="M52 14 L68 10 Q80 20 92 10 L108 14 L130 28 L118 42 L108 36 L108 82 L52 82 L52 36 L42 42 L30 28Z" fill="#F1F3F8" stroke="#E0E4ED" />
      <path d="M52 14 L68 10 Q80 20 92 10 L108 14 L108 22 L52 22Z" fill={AC} />
      <rect x="76" y="40" width="8" height="24" fill={CR} opacity=".85" />
      <path d="M52 56 H108" stroke="#171923" strokeOpacity=".15" />
    </g>
  ),
  badge: () => (
    <g>
      <path d="M80 8 L116 20 V50 Q116 70 80 84 Q44 70 44 50 V20Z" fill="#F1F3F8" stroke={AC} strokeWidth="1.5" />
      <path d="M80 22 L100 44 L80 68 L60 44Z" fill={AC} />
      <path d="M80 30 L92 44 L80 58 L68 44Z" fill="white" />
    </g>
  ),
  ui: (r) => (
    <g>
      <rect x="12" y="12" width="52" height="66" fill="#F8F9FC" stroke="#E0E4ED" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="18" y={20 + i * 11} width={i === 1 ? 40 : 28 + r() * 10} height="6" fill={i === 1 ? AC : '#E0E4ED'} />)}
      <rect x="74" y="12" width="74" height="40" fill="#F1F3F8" stroke="#E0E4ED" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={78 + (i % 3) * 23} y={56 + Math.floor(i / 3) * 12} width="20" height="9" fill="#F8F9FC" stroke="#E0E4ED" />)}
    </g>
  ),
  city: (r) => (
    <g>
      {Array.from({ length: 12 }, (_, i) => { const h = 20 + r() * 55; return <g key={i}><rect x={i * 14} y={90 - h} width="12" height={h} fill="#E0E4ED" />{Array.from({ length: 4 }, (_, k) => r() > 0.5 && <rect key={k} x={i * 14 + 3 + (k % 2) * 4} y={90 - h + 6 + Math.floor(k / 2) * 9} width="3" height="3" fill={AC} opacity=".8" />)}</g> })}
    </g>
  ),
  audio: (r) => <g fill={AC}>{Array.from({ length: 28 }, (_, i) => { const h = 6 + r() * 50 * Math.sin((i / 28) * Math.PI); return <rect key={i} x={10 + i * 5} y={45 - h / 2} width="2.5" height={h} opacity={0.4 + (h / 60)} /> })}</g>,
  type: () => <text x="80" y="62" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontWeight="700" fontSize="52" fill="#171923">A<tspan fill={AC}>a</tspan></text>,
  sprite: (r) => <g>{Array.from({ length: 8 }, (_, y) => Array.from({ length: 14 }, (_, x) => r() > 0.55 && <rect key={`${x}-${y}`} x={20 + x * 9} y={10 + y * 9} width="8" height="8" fill={r() > 0.6 ? AC : '#D6DAE5'} />))}</g>,
  poster: () => (
    <g>
      <rect x="40" y="8" width="80" height="74" fill="#F1F3F8" stroke="#E0E4ED" />
      <text x="48" y="40" fontFamily="Space Grotesk,sans-serif" fontWeight="700" fontSize="14" fill="#171923">LEVEL</text>
      <text x="48" y="56" fontFamily="Space Grotesk,sans-serif" fontWeight="700" fontSize="14" fill={AC}>UP.</text>
      <rect x="48" y="66" width="30" height="3" fill="#6C7385" />
    </g>
  ),
  anim: () => <g fill={AC}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 30} 90 L${50 + i * 30} 0 L${58 + i * 30} 0 L${28 + i * 30} 90Z`} opacity={0.25 + i * 0.2} />)}</g>,
  wall: () => <g><circle cx="120" cy="30" r="22" fill={CR} opacity=".85" /><path d="M0 70 Q40 50 80 66 T160 56 V90 H0Z" fill="#F1F3F8" /></g>,
  bracket: () => (
    <g fill="none" stroke="#6C7385" strokeWidth=".8">
      {[12, 28, 44, 60].map((y) => <rect key={y} x="12" y={y} width="26" height="10" fill="#F8F9FC" />)}
      <path d="M38 17 H48 V33 H38 M38 49 H48 V65 H38 M48 25 H58 V57 H48" />
      <rect x="58" y="36" width="30" height="12" fill="#F1F3F8" stroke={AC} />
      <path d="M88 42 H108" stroke={AC} /><rect x="108" y="34" width="38" height="16" fill={AC} stroke="none" />
    </g>
  ),
}

export default function Art({ kind = 'hud', seed = 1, className = '', label = '', src, sizes = '(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw', priority = false }) {
  const id = useId().replace(/:/g, '')
  const body = useMemo(() => (motifs[kind] || motifs.hud)(rng(seed * 977 + 13)), [kind, seed])
  if (src) { const b = src.replace(/\.\w+$/, ''); return <img src={`${b}-960.webp`} srcSet={`${b}-480.webp 480w, ${b}-960.webp 960w${b.endsWith('hero') ? `, ${b}-1600.webp 1600w` : ''}`} sizes={sizes} width="960" height="540" alt={label || `${kind} preview`} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={`block h-full w-full object-cover ${className}`} /> }
  const tilt = 20 + (seed % 5) * 14
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className={`block w-full h-full ${className}`} role="img" aria-label={label || `${kind} preview artwork`}>
      <defs>
        <linearGradient id={`g${id}`} gradientTransform={`rotate(${tilt})`}>
          <stop offset="0" stopColor="#F8F9FC" /><stop offset="1" stopColor="#E8EBF2" />
        </linearGradient>
        <radialGradient id={`r${id}`} cx={0.2 + (seed % 4) * 0.2} cy="0.2" r="0.8"><stop offset="0" stopColor={AC} stopOpacity=".08" /><stop offset="1" stopColor={AC} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#g${id})`} />
      <rect width="160" height="90" fill={`url(#r${id})`} />
      <path d={`M${60 + (seed % 3) * 20} 0 L${100 + (seed % 3) * 20} 0 L${60 + (seed % 3) * 20} 90 L${20 + (seed % 3) * 20} 90Z`} fill={AC} opacity=".04" />
      {body}
    </svg>
  )
}
