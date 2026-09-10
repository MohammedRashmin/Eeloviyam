import { useState, useEffect, useRef } from 'react'
import heroArt from './assets/WhatsApp_Image_2026-08-24_at_18.12.56-removebg-preview.png'
import butterflyArt from './assets/Butterfly_hero.svg'
import eezhoviyamLogo from './assets/Eezhoviyam.png'

// ─── Data ────────────────────────────────────────────────────────────────────
const GALLERY = [
  { id: 1, title: 'Nallur Kandaswamy',    medium: 'Oil on Canvas',   status: 'Available',  price: 'Rs 18,000',   url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
  { id: 2, title: 'Faces of Jaffna',      medium: 'Acrylic Portrait',status: 'Sold',        price: 'Rs 24,000',   url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80' },
  { id: 3, title: 'Temple at Dawn',       medium: 'Watercolour',     status: 'Available',  price: 'Rs 12,000',   url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
  { id: 4, title: 'Heritage in Gold',     medium: 'Mixed Media',     status: 'Available',  price: 'Rs 32,000',   url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80' },
  { id: 5, title: 'Eelam Sunset',         medium: 'Oil on Canvas',   status: 'Commission', price: 'On Request', url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
  { id: 6, title: 'The Silent Fisherman', medium: 'Charcoal & Ink',  status: 'Available',  price: 'Rs 9,500',    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80' },
]

const SERVICES = [
  { num: '01', icon: '🎨', title: 'Custom Portraits',        desc: 'Handcrafted oil portraits from your photographs. Every detail captured with care. Delivered within 3–4 weeks.',  cta: 'Start a Portrait' },
  { num: '02', icon: '🏛️', title: 'Cultural Artworks',       desc: 'Commissioned pieces celebrating Tamil heritage, mythology, temple art, and the living culture of Sri Lanka.',         cta: 'Commission a Piece' },
  { num: '03', icon: '🖼️', title: 'Home Décor Consultation', desc: 'Our curators help you choose or commission art that elevates your space — from living rooms to corporate offices.', cta: 'Book a Consultation' },
]

const TESTIMONIALS = [
  { name: 'Surya K.',  initials: 'SK', color: 'bg-amber-700',   text: 'Best art gallery in Sri Lanka — the quality is truly world-class. Every piece tells a story.',          stars: 5 },
  { name: 'Meena R.',  initials: 'MR', color: 'bg-rose-800',    text: 'Got a custom portrait done for my parents\' anniversary. Absolutely breathtaking. Worth every rupee.', stars: 5 },
  { name: 'Priya T.',  initials: 'PT', color: 'bg-emerald-800', text: 'Eezhoviyam preserved our culture in the most beautiful way. This is Sri Lanka\'s finest gallery.',        stars: 5 },
]

export const WHATSAPP_NUMBER = '94778322614'
const ADDRESS = '183 Navalar Rd, Jaffna, Sri Lanka'
const TICKER = ['Original Oil Paintings', 'Custom Portraits', 'Tamil Heritage Art', 'Cultural Commissions', 'Fine Art Gallery', 'Sri Lanka', 'Est. 2018']

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function formatPrice(price) {
  if (!price) return price
  const trimmed = price.trim()
  if (/^(₹|\$)/.test(trimmed)) return trimmed
  const rsMatch = trimmed.match(/^rs:?\s*(.*)$/i)
  if (rsMatch) return `Rs: ${rsMatch[1]}`
  if (/^\d/.test(trimmed)) return `Rs: ${trimmed}`
  return trimmed
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function useCountUp(end, active) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const timer = setInterval(() => {
      frame++
      setVal(Math.round((frame / 60) * end))
      if (frame >= 60) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [active, end])
  return val
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
  @keyframes fadeUp    { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer   { from { transform:translateX(-150%) skewX(-20deg) } to { transform:translateX(350%) skewX(-20deg) } }
  @keyframes pulse-ring { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(1.8); opacity:0 } }
  @keyframes bounce-y  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-5px) } }
  @keyframes marquee   { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  .shimmer-btn:hover .shimmer-sweep { animation: shimmer 0.7s ease forwards; }
  .wa-ring::before {
    content:''; position:absolute; inset:0; border-radius:9999px;
    border:2px solid #22c55e; animation: pulse-ring 1.5s ease-out infinite;
  }
  .marquee-track { animation: marquee 28s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }
`

// ─── Reusable components ──────────────────────────────────────────────────────
function NavLink({ href, children }) {
  return (
    <a href={href} className="relative group text-zinc-300 hover:text-amber-300 text-sm tracking-widest uppercase transition-colors duration-300">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 group-hover:w-full transition-all duration-300" />
    </a>
  )
}

function ShimmerBtn({ href, children, outline = false, target, rel, className = '' }) {
  const style = outline === 'light'
    ? 'border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white'
    : outline
      ? 'border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black'
      : 'bg-amber-400 text-black hover:bg-amber-300'
  return (
    <a href={href} target={target} rel={rel}
      className={`shimmer-btn relative overflow-hidden px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2
        ${style}
        ${className}`}>
      <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full pointer-events-none" />
      {children}
    </a>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="flex items-center justify-center gap-3 text-amber-700 tracking-[0.3em] text-xs uppercase mb-4">
      <span className="text-amber-600/60">◆</span>
      {children}
      <span className="text-amber-600/60">◆</span>
    </p>
  )
}

export function GoldDivider() {
  return (
    <div className="flex items-center gap-3 justify-center my-6">
      <div className="h-px w-8 bg-amber-700/40" />
      <div className="w-1 h-1 bg-amber-500/60 rotate-45" />
      <div className="h-px w-8 bg-amber-700/40" />
    </div>
  )
}

// ─── Social icons (footer) ─────────────────────────────────────────────────────
const SOCIALS = [
  { key: 'IG', href: '#', Icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ) },
  { key: 'FB', href: '#', Icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M13.5 21v-8.5h2.85l.43-3.3h-3.28V7.05c0-.96.27-1.61 1.64-1.61h1.75V2.14C15.98 2.03 14.9 2 13.65 2 11 2 9.2 3.6 9.2 6.7v2.5H6.35v3.3H9.2V21h4.3z" />
    </svg>
  ) },
  { key: 'YT', href: '#', Icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" />
    </svg>
  ) },
]

// ─── WA icon (reused) ─────────────────────────────────────────────────────────
export const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"

// ─── Navbar ──────────────────────────────────────────────────────────────────
export function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const isSolid = solid || scrolled
  const links = ['Home', 'Gallery', 'Shop', 'About', 'Artist', 'Services', 'Contact']
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isSolid ? 'bg-[#1a1208]/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/#home" className="flex items-center gap-2 leading-none">
          <img src={eezhoviyamLogo} alt="Eezhoviyam" className="h-9 w-auto" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold tracking-widest text-amber-300 hover:text-amber-200 transition-colors">EEZHOVIYAM</span>
            <span className="text-amber-700/50 text-[9px] tracking-[0.3em] uppercase">ஈழோவியம் · ඊලෝවියම් · Fine Art</span>
          </span>
        </a>
        <ul className="hidden md:flex gap-8">
          {links.map(l => <li key={l}><NavLink href={`/#${l.toLowerCase()}`}>{l}</NavLink></li>)}
        </ul>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
          className="hidden md:flex items-center gap-2 border border-amber-700/50 text-amber-400 text-xs tracking-widest uppercase px-4 py-2 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d={WA_PATH} /></svg>
          WhatsApp
        </a>
        <button className="md:hidden text-amber-300 text-2xl" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#1a1208]/95 px-6 pb-6 flex flex-col gap-5 border-t border-amber-900/20">
          {links.map(l => <NavLink key={l} href={`/#${l.toLowerCase()}`}>{l}</NavLink>)}
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Marquee() {
  const repeated = [...TICKER, ...TICKER]
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-amber-900/30 overflow-hidden py-3 bg-black/20 backdrop-blur-sm">
      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {repeated.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-amber-600/60 text-xs tracking-[0.2em] uppercase">
            {t}
            <span className="text-amber-700/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const onMove = (e) => {
    const { clientX, clientY, currentTarget } = e
    const { width, height } = currentTarget.getBoundingClientRect()
    setMousePos({ x: (clientX / width - 0.5) * 20, y: (clientY / height - 0.5) * 20 })
  }
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0d0d0d 0%,#22170c 50%,#0d0d0d 100%)' }}
      onMouseMove={onMove}>

      {/* Left art image — absolute, does not affect text layout */}
      <div className="absolute left-0 bottom-0 h-full flex items-end pointer-events-none"
        style={{ animation: 'fadeUp 1.2s ease 0.5s both' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(180,83,9,0.18) 0%, rgba(217,119,6,0.08) 50%, transparent 80%)' }} />
        <img
          src={heroArt}
          alt=""
          className="h-2/5 md:h-4/5 w-auto object-contain relative z-10"
          style={{
            filter: 'drop-shadow(0 0 32px rgba(180,83,9,0.55)) drop-shadow(0 0 10px rgba(253,186,116,0.28))',
            opacity: 0.95,
          }}
        />
      </div>

      {/* First butterfly — upper right */}
      <img src={butterflyArt} alt="" className="absolute pointer-events-none"
        style={{
          right: '0.5rem', top: '12%', height: '12%', width: 'auto',
          filter: 'sepia(95%) saturate(280%) hue-rotate(-20deg) brightness(0.78) contrast(1.2) drop-shadow(0 0 32px rgba(180,83,9,0.55)) drop-shadow(0 0 10px rgba(253,186,116,0.28))',
          opacity: 0.9, transform: 'scaleX(-1)',
          animation: 'fadeUp 1.2s ease 0.7s both',
        }}
      />
      {/* Second butterfly — lower right, smaller */}
      <img src={butterflyArt} alt="" className="absolute pointer-events-none"
        style={{
          right: '3rem', top: '52%', height: '9%', width: 'auto',
          filter: 'sepia(95%) saturate(280%) hue-rotate(-20deg) brightness(0.72) contrast(1.2) drop-shadow(0 0 20px rgba(180,83,9,0.4)) drop-shadow(0 0 8px rgba(253,186,116,0.2))',
          opacity: 0.7, transform: 'scaleX(-1)',
          animation: 'fadeUp 1.2s ease 0.9s both',
        }}
      />

      {/* Parallax lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-700/30 to-transparent transition-transform duration-100"
          style={{ transform: `translateX(${mousePos.x * 0.3}px)` }} />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-700/30 to-transparent transition-transform duration-100"
          style={{ transform: `translateX(${-mousePos.x * 0.3}px)` }} />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-amber-900/20 via-transparent to-transparent" />
        {/* Cursor glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-transform duration-200"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%)', left: '50%', top: '50%',
            transform: `translate(calc(-50% + ${mousePos.x * 4}px), calc(-50% + ${mousePos.y * 4}px))` }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 border border-amber-800/40 px-4 py-1.5 mb-8 rounded-full"
          style={{ animation: 'fadeUp 1s ease 0.1s both', background: 'rgba(217,119,6,0.05)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase">Sri Lanka's Premier Fine Art Gallery</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight mb-3"
          style={{ animation: 'fadeUp 1s ease 0.4s both', textShadow: '0 0 80px rgba(217,119,6,0.2)' }}>
          Eezhoviyam
        </h1>

        {/* Gold ornament divider */}
        <div className="flex items-center justify-center gap-3 mb-6" style={{ animation: 'fadeUp 1s ease 0.7s both' }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/50" />
          <span className="text-amber-600/50 text-xs">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        <p className="text-zinc-400 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ animation: 'fadeUp 1s ease 0.8s both' }}>
          Where Eelam's Heritage Meets Fine Art.<br />
          <span className="text-zinc-500 text-base">Experience the soul of Sri Lanka through every stroke.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: 'fadeUp 1s ease 1s both' }}>
          <ShimmerBtn href="#gallery" outline>View Gallery</ShimmerBtn>
          <ShimmerBtn href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d={WA_PATH} /></svg>
            Commission Art
          </ShimmerBtn>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-zinc-600 mt-16" style={{ animation: 'fadeUp 1s ease 1.2s both' }}>
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" style={{ animation: 'bounce-y 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Marquee ticker */}
      <Marquee />
    </section>
  )
}

// ─── Selected Works (curated homepage highlights) ─────────────────────────────
function SelectedWorks() {
  const [ref, visible] = useScrollReveal()
  const [items, setItems] = useState([])

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('artworks').select('*').eq('featured', true).order('created_at', { ascending: false })
        .then(({ data }) => { if (data && data.length > 0) setItems(data) })
    })
  }, [])

  const shown = items.length > 0 ? items : GALLERY.slice(0, 3)

  return (
    <section className="pt-10 pb-8 px-6">
      <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <SectionLabel>Portfolio</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2" style={{ color: '#241A12' }}>Selected Works</h2>
            <p className="text-zinc-600 text-sm max-w-md">A curated look at our finest pieces - each one hand-picked to capture the soul of Sri Lankan art.</p>
          </div>
          <a href="#gallery" className="group flex items-center gap-3 text-amber-700 text-xs tracking-widest uppercase hover:text-amber-800 transition-colors shrink-0">
            View Collection
            <span className="h-px w-8 bg-amber-700/40 group-hover:w-12 transition-all duration-300" />
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {shown.map((item, i) => (
            <div key={item.id || i} className={`group cursor-default ${i === 1 ? 'md:mt-16' : ''}`}>
              <div className="overflow-hidden rounded-lg shadow-sm mb-4">
                <img src={item.image_url || item.url} alt={item.title}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-xl font-semibold" style={{ color: '#241A12' }}>{item.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-zinc-500 text-xs tracking-widest uppercase">{item.medium}</span>
                {item.year_created && <span className="text-zinc-400 text-xs">{item.year_created}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────
function StatCounter({ num, suffix, label, active }) {
  const count = useCountUp(num, active)
  return (
    <div className="group cursor-default text-center">
      <div className="font-serif text-4xl text-amber-700 transition-all duration-300 group-hover:text-amber-600 group-hover:scale-110 inline-block">
        {active ? count : 0}{suffix}
      </div>
      <div className="text-zinc-500 text-xs tracking-widest uppercase mt-1 group-hover:text-zinc-600 transition-colors">{label}</div>
    </div>
  )
}

function About() {
  const [ref, visible] = useScrollReveal()
  const [data, setData] = useState(null)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('about').select('*').single().then(({ data }) => { if (data) setData(data) })
    })
  }, [])

  const title = data?.title || 'Preserving Culture Through Canvas'
  const desc = data?.description || 'Eezhoviyam — meaning "Eelam Art" in Tamil — was born from a deep reverence for the rich cultural tapestry of Sri Lanka.'
  const imgUrl = data?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80'
  const years = data?.years_active ?? 6
  const artworks = data?.artworks_created ?? 200
  const collectors = data?.collectors ?? 150

  return (
    <section id="about" className="pt-8 pb-8 px-6">
      <div ref={ref} className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Image block */}
        <div className="relative group">
          <div className="overflow-hidden">
            <img src={imgUrl} alt="Gallery"
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-amber-700/30 group-hover:border-amber-500/50 transition-colors duration-500 pointer-events-none" />
          <div className="absolute -bottom-5 left-6 bg-amber-400 text-black px-5 py-3">
            <div className="font-serif text-lg font-semibold leading-none">Est. 2018</div>
            <div className="text-xs tracking-widest uppercase mt-0.5 opacity-70">Sri Lanka</div>
          </div>
        </div>

        {/* Text block */}
        <div>
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 leading-tight" style={{ color: '#241A12' }}>{title}</h2>
          <GoldDivider />
          <blockquote className="border-l-2 border-amber-600/50 pl-4 mb-6 italic text-amber-800/80 text-sm leading-relaxed">
            "Every stroke is a declaration that our heritage lives on."
          </blockquote>
          <p className="font-light leading-relaxed mb-10 text-sm" style={{ color: '#5C5145' }}>{desc}</p>
          <div className="grid grid-cols-3 gap-4 p-6 border border-amber-300/50 bg-[#FBF7EF]/70">
            <StatCounter num={years}      suffix="+" label="Years"     active={visible} />
            <StatCounter num={artworks}   suffix="+" label="Artworks"  active={visible} />
            <StatCounter num={collectors} suffix="+" label="Collectors" active={visible} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Artist Story ──────────────────────────────────────────────────────────────
function ArtistStory() {
  const [ref, visible] = useScrollReveal()
  const [data, setData] = useState(null)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('artist').select('*').single().then(({ data }) => { if (data) setData(data) })
    })
  }, [])

  const name = data?.name || 'The Artist Behind Eezhoviyam'
  const role = data?.role || 'Founder & Artist'
  const bio = data?.bio || 'Born with a deep passion for colour and form, I have dedicated my life to capturing the soul of Sri Lanka through paint. Each canvas holds a piece of home.\n\nMy work draws from the temples, the fishermen, and the quiet dignity of everyday life across the island - painted so the stories are never forgotten.'
  const photoUrl = data?.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80'
  const years = data?.years_active ?? 3
  const paragraphs = bio.split(/\n+/).filter(Boolean)

  return (
    <section id="artist" className="pt-8 pb-8 px-6">
      <div ref={ref} className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Photo block */}
        <div className="relative group">
          <div className="overflow-hidden border-8" style={{ borderColor: '#FBF7EF' }}>
            <img src={photoUrl} alt={name}
              className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="absolute -bottom-5 left-6 bg-[#FBF7EF] border border-amber-300/50 px-5 py-3 shadow-sm">
            <div className="font-serif text-2xl font-semibold leading-none" style={{ color: '#241A12' }}>{years}+</div>
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase mt-1">Years of Art</div>
          </div>
        </div>

        {/* Text block */}
        <div>
          <SectionLabel>The Artist</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 leading-tight" style={{ color: '#241A12' }}>{name}</h2>
          <GoldDivider />
          <div className="space-y-4 mb-8">
            {paragraphs.map((p, i) => (
              <p key={i} className="font-light leading-relaxed text-sm" style={{ color: '#5C5145' }}>{p}</p>
            ))}
          </div>
          <div className="border-t border-amber-300/40 pt-6">
            <p className="font-serif text-2xl italic" style={{ color: '#241A12' }}>{name}</p>
            <p className="text-amber-700 text-xs tracking-widest uppercase mt-1">{role}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Available', 'Commission', 'Sold']

function GalleryCard({ item, onOpen }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [activeImg, setActiveImg] = useState(0)
  const images = [item.image_url || item.url, ...(item.image_urls || [])].filter(Boolean)
  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 10, y: -x * 10 })
  }
  return (
    <div ref={cardRef} onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onClick={() => onOpen(item, activeImg)}
      style={{
        transform: hovered ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)` : 'perspective(700px) rotateX(0) rotateY(0) scale(1)',
        transition: hovered ? 'transform 0.08s ease' : 'transform 0.5s ease',
      }}
      className="relative overflow-hidden cursor-pointer group rounded-xl mb-4 break-inside-avoid">
      <img src={images[activeImg]} alt={item.title}
        className={`w-full h-auto block transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`} />
      {images.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button key={i} type="button"
              onClick={(e) => { e.stopPropagation(); setActiveImg(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? 'bg-amber-400 scale-125' : 'bg-white/60 hover:bg-white'}`} />
          ))}
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-400 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <h3 className="font-serif text-lg text-white font-semibold">{item.title}</h3>
        <p className="text-zinc-400 text-xs mt-0.5 tracking-wider">
          {item.medium}{item.dimensions ? ` · ${item.dimensions}` : ''}{item.year_created ? ` · ${item.year_created}` : ''}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-amber-300 text-sm font-medium">{formatPrice(item.price)}</span>
          <span className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
            item.status === 'Sold'       ? 'bg-zinc-700/80 text-zinc-300' :
            item.status === 'Commission' ? 'bg-amber-900/60 text-amber-300' :
                                           'bg-emerald-100 text-emerald-800'}`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 pointer-events-none ${hovered ? 'border-amber-500/40' : 'border-transparent'}`} />
    </div>
  )
}

// ─── Lightbox (full-size popup, browses all images for a piece) ───────────────
export function Lightbox({ item, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex || 0)
  const images = [item.image_url || item.url, ...(item.image_urls || [])].filter(Boolean)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [images.length])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="max-w-3xl w-full rounded-lg shadow-2xl relative" style={{ background: '#150f09' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close"
          className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center text-lg leading-none z-10 hover:bg-amber-300 transition-colors shadow-lg">✕</button>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch justify-center">
            {images.length > 1 && (
              <div className={`flex flex-row sm:flex-col gap-2 order-2 sm:order-1 w-full sm:w-20 h-16 sm:h-[360px] overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto no-scrollbar ${images.length <= 3 ? 'justify-center' : ''}`}>
                {images.map((src, i) => (
                  <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setIdx(i) }} aria-label={`Show image ${i + 1}`}
                    className={`rounded overflow-hidden border-2 transition-all shrink-0 w-16 h-16 sm:w-full ${
                      images.length <= 3 ? 'sm:flex-1 sm:h-auto' : 'sm:h-20'
                    } ${i === idx ? 'border-amber-400' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="order-1 sm:order-2 w-full sm:w-[380px] h-[240px] sm:h-[360px] overflow-hidden rounded">
              <img src={images[idx]} alt={item.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center mt-5">
            <h3 className="font-serif text-white text-xl font-semibold">{item.title}</h3>
            <p className="text-zinc-400 text-sm mt-1">
              {item.medium}{item.dimensions ? ` · ${item.dimensions}` : ''}{item.year_created ? ` · ${item.year_created}` : ''}
            </p>
            <p className="text-amber-300 text-sm font-medium mt-2">{formatPrice(item.price)}</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in "${item.title}".`} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 border border-amber-400 text-amber-300 text-xs tracking-widest uppercase px-6 py-2.5 mt-5 hover:bg-amber-400 hover:text-black transition-all duration-300">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d={WA_PATH} /></svg>
              Enquire About This Piece
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Gallery() {
  const [ref, visible] = useScrollReveal()
  const [filter, setFilter] = useState('All')
  const [allItems, setAllItems] = useState(GALLERY)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('artworks').select('*').order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0)
            setAllItems(data.map(a => ({ ...a, url: a.image_url })))
          setLoading(false)
        })
    })
  }, [])

  const items = filter === 'All' ? allItems : allItems.filter(g => g.status === filter)
  return (
    <section id="gallery" className="pt-8 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>Our Works</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: '#241A12' }}>The Collection</h2>
          <GoldDivider />
          <p className="text-zinc-600 text-sm max-w-md mx-auto">Each piece is an original work - painted by hand, rooted in Tamil culture.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                filter === f
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-amber-800/40 text-zinc-600 hover:border-amber-600/70 hover:text-amber-700'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {items.map(item => (
            <GalleryCard key={item.id} item={item}
              onOpen={(it, startIndex) => setLightbox({ item: it, startIndex })} />
          ))}
        </div>

        {lightbox && (
          <Lightbox item={lightbox.item} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)} />
        )}

        <div className="text-center mt-12">
          <ShimmerBtn href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in a painting.`} target="_blank" rel="noreferrer" outline="light">
            Enquire About a Piece →
          </ShimmerBtn>
        </div>
      </div>
    </section>
  )
}

// ─── Shop (art supplies) ───────────────────────────────────────────────────────
export function ProductCard({ product, onOpen, boxed = false }) {
  const [activeImg, setActiveImg] = useState(0)
  const images = [product.image_url, ...(product.image_urls || [])].filter(Boolean)
  const outOfStock = product.stock === 'Out of Stock'

  return (
    <div className={`group h-full flex flex-col ${boxed ? 'bg-white border border-amber-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300' : ''}`}>
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-[#FBF7EF]"
        onClick={() => onOpen({ ...product, title: product.name, medium: product.category }, activeImg)}>
        <img src={images[activeImg]} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {images.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button key={i} type="button"
                onClick={(e) => { e.stopPropagation(); setActiveImg(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? 'bg-amber-400 scale-125' : 'bg-white/70 hover:bg-white'}`} />
            ))}
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs tracking-widest uppercase border border-white/50 px-3 py-1">Out of Stock</span>
          </div>
        )}
      </div>
      <div className={`flex flex-col flex-1 ${boxed ? 'p-4' : 'pt-4'}`}>
        <h3 className="font-serif text-lg font-semibold" style={{ color: '#241A12' }}>{product.name}</h3>
        <p className="text-amber-700 text-xs tracking-wide uppercase mt-1">{product.category}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-zinc-500 text-sm">{formatPrice(product.price)}</span>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in "${product.name}".`} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 border border-amber-400 text-amber-700 text-[10px] tracking-widest uppercase px-3 py-1.5 hover:bg-amber-400 hover:text-black transition-all duration-300">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d={WA_PATH} /></svg>
            Buy
          </a>
        </div>
      </div>
    </div>
  )
}

function ShopTeaser() {
  const [ref, visible] = useScrollReveal()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('products').select('*').order('created_at', { ascending: false }).limit(5)
        .then(({ data }) => { setItems(data || []); setLoading(false) })
    })
  }, [])

  return (
    <section id="shop" className="pt-8 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`flex items-end justify-between mb-10 flex-wrap gap-4 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div>
            <SectionLabel>Art Supplies</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2" style={{ color: '#241A12' }}>Drawing Tools & Supplies</h2>
            <p className="text-zinc-600 text-sm max-w-md">From pencils to sketch boards - everything you need to bring your ideas to life.</p>
          </div>
          {!loading && items.length > 0 && (
            <a href="/shop" className="group inline-flex items-center gap-2 border border-amber-400 text-amber-700 text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-amber-400 hover:text-black transition-all duration-300 shrink-0">
              Shop Products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}
        </div>

        {!loading && items.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-10">More supplies coming soon — check back shortly.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {items.map(p => (
              <ProductCard key={p.id} product={p} onOpen={(item, startIndex) => setLightbox({ item, startIndex })} />
            ))}
          </div>
        )}

        {lightbox && (
          <Lightbox item={lightbox.item} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)} />
        )}
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServiceCard({ s, i, visible }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`relative border p-10 transition-all duration-500 cursor-default overflow-hidden flex flex-col bg-[#FBF7EF] ${
        hovered ? 'border-amber-600/60 -translate-y-2' : 'border-zinc-200'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${i * 150}ms`, boxShadow: hovered ? '0 24px 48px rgba(217,119,6,0.1)' : 'none' }}>

      {/* Large background number */}
      <span className="absolute top-4 right-6 font-serif text-7xl font-bold text-amber-900/10 select-none leading-none pointer-events-none">
        {s.num}
      </span>

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 h-0.5 bg-amber-500/60 transition-all duration-500 ${hovered ? 'w-full' : 'w-0'}`} />

      <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-600/8 blur-2xl transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`text-3xl mb-5 transition-transform duration-300 ${hovered ? 'scale-125' : 'scale-100'}`}>{s.icon}</div>
      <div className="text-amber-700/50 text-xs tracking-widest mb-2">{s.num}</div>
      <h3 className={`font-serif text-2xl font-semibold mb-3 transition-colors duration-300 ${hovered ? 'text-amber-700' : ''}`} style={!hovered ? { color: '#241A12' } : undefined}>{s.title}</h3>
      <p className="text-zinc-600 font-light leading-relaxed text-sm flex-1">{s.desc}</p>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'd like to enquire about ${s.title}.`}
        target="_blank" rel="noreferrer"
        className={`mt-6 text-xs tracking-widest uppercase transition-colors duration-300 flex items-center gap-2 ${hovered ? 'text-amber-700' : 'text-zinc-500'}`}>
        {s.cta} <span className={`transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`}>→</span>
      </a>
    </div>
  )
}

function Services() {
  const [ref, visible] = useScrollReveal()
  const [list, setList] = useState(SERVICES)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('services').select('*').order('sort_order')
        .then(({ data }) => { if (data && data.length > 0) setList(data.map(s => ({ ...s, num: String(s.sort_order).padStart(2,'0'), desc: s.description }))) })
    })
  }, [])

  return (
    <section id="services" className="pt-8 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: '#241A12' }}>Our Services</h2>
          <GoldDivider />
          <p className="text-zinc-600 text-sm max-w-md mx-auto">From custom portraits to full interior art curation - we bring Sri Lanka's art to your world.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((s, i) => <ServiceCard key={s.title} s={s} i={i} visible={visible} />)}
        </div>
      </div>
      
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function ReviewForm({ onClose }) {
  const [form, setForm] = useState({ name: '', review: '', stars: 5 })
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const { supabase: sb } = await import('./supabase')
    const { error } = await sb.from('testimonials').insert({ ...form, approved: false })
    setStatus(error ? 'error' : 'done')
    if (!error) setForm({ name: '', review: '', stars: 5 })
  }

  return (
    <div className="border border-amber-200 p-8 mt-10 bg-[#FBF7EF] shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-serif text-2xl" style={{ color: '#241A12' }}>Share Your Experience</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-xl leading-none transition-colors">✕</button>
      </div>
      <p className="text-zinc-500 text-xs tracking-widest mb-6">Your review will be visible after approval</p>
      {status === 'done' ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-3">🙏</div>
          <p className="text-amber-700 text-sm">Thank you! Your review has been submitted.</p>
          <button onClick={onClose} className="text-zinc-500 text-xs mt-3 underline underline-offset-4">Close</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-700/70 text-[10px] tracking-widest uppercase mb-1.5">Your Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full bg-white border border-amber-200 text-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g. Surya K." />
            </div>
            <div>
              <label className="block text-amber-700/70 text-[10px] tracking-widest uppercase mb-1.5">Rating</label>
              <div className="flex gap-2 mt-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, stars: n }))}
                    className={`text-xl transition-colors ${n <= form.stars ? 'text-amber-500' : 'text-zinc-300'}`}>★</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-amber-700/70 text-[10px] tracking-widest uppercase mb-1.5">Your Review</label>
            <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} required rows={3}
              className="w-full bg-white border border-amber-200 text-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors resize-none"
              placeholder="Tell us about your experience…" />
          </div>
          {status === 'error' && <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>}
          <button type="submit" disabled={status === 'sending'}
            className="shimmer-btn relative overflow-hidden px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs tracking-widest uppercase transition-colors disabled:opacity-50">
            <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none" />
            {status === 'sending' ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  )
}

function Testimonials() {
  const [ref, visible] = useScrollReveal()
  const [reviews, setReviews] = useState(TESTIMONIALS)
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef(null)
  const scrollRef = useRef(null)
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      sb.from('testimonials').select('*').eq('approved', true).order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0)
            setReviews(data.map(r => ({ name: r.name, text: r.review, stars: r.stars, initials: r.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(), color: 'bg-amber-800' })))
        })
    })
  }, [])

  const handleWriteReview = () => {
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <section className="pt-8 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>Customer Reviews</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold" style={{ color: '#241A12' }}>What People Say</h2>
          <GoldDivider />
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'.split('').map((s, i) => <span key={i} className="text-lg">{s}</span>)}
              <span className="text-zinc-500 text-sm ml-2">5.0 · Verified Reviews</span>
            </div>
            <button onClick={handleWriteReview}
              className="shimmer-btn relative overflow-hidden border border-amber-600/60 text-amber-700 text-xs tracking-widest uppercase px-5 py-2 hover:bg-amber-600 hover:text-white transition-all duration-300">
              <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none" />
              ✍ Write a Review
            </button>
          </div>
        </div>
        <div className="relative">
          {reviews.length > 3 && (
            <>
              <button onClick={() => scroll(-1)} aria-label="Scroll left"
                className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#FBF7EF] border border-amber-300 text-amber-700 items-center justify-center hover:bg-amber-400 hover:text-black transition-colors shadow-sm">
                ‹
              </button>
              <button onClick={() => scroll(1)} aria-label="Scroll right"
                className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#FBF7EF] border border-amber-300 text-amber-700 items-center justify-center hover:bg-amber-400 hover:text-black transition-colors shadow-sm">
                ›
              </button>
            </>
          )}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {reviews.map((t, i) => (
              <div key={t.name + i}
                className={`group relative border border-zinc-200 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/50 cursor-default overflow-hidden bg-[#FBF7EF] shadow-sm shrink-0 w-[320px] ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150}ms` }}>
                <span className="absolute top-4 right-6 font-serif text-7xl text-amber-900/10 leading-none select-none pointer-events-none">"</span>
                <div className="absolute top-0 left-0 h-0.5 w-0 bg-amber-500/60 group-hover:w-full transition-all duration-500" />
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-semibold tracking-wider shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#241A12' }}>{t.name}</p>
                    <div className="text-amber-500 text-xs mt-0.5">{'★'.repeat(t.stars)}</div>
                  </div>
                </div>
                <p className="text-zinc-600 font-light italic leading-relaxed text-sm group-hover:text-zinc-900 transition-colors">
                  "{t.text}"
                </p>
                <p className="text-zinc-400 text-xs tracking-widest uppercase mt-4 group-hover:text-zinc-500 transition-colors">
                  Verified Review
                </p>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div ref={formRef}>
            <ReviewForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────
const DEFAULT_CONTACT = [
  { icon: '📍', label: 'Visit Us',   value: ADDRESS },
  { icon: '🕐', label: 'Open Hours', value: 'Tue – Sun · 10 AM – 7 PM' },
  { icon: '📞', label: 'Call Us',    value: '+94 77 123 4567' },
  { icon: '✉️', label: 'Email',      value: 'hello@eezhoviyam.art' },
]
function Contact() {
  const [ref, visible] = useScrollReveal()
  const [details, setDetails] = useState(DEFAULT_CONTACT)

  useEffect(() => {
    import('./supabase').then(({ supabase }) =>
      supabase.from('contact').select('*').order('sort_order').then(({ data }) => {
        if (data && data.length > 0) setDetails(data)
      })
    )
  }, [])
  return (
    <section id="contact" className="pt-8 pb-8 px-6">
      <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-16">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: '#241A12' }}>Commission an Artwork</h2>
          <GoldDivider />
          <p className="text-zinc-600 text-sm max-w-md mx-auto">Ready to own a piece of Sri Lankan heritage? Reach out and we'll bring your vision to life.</p>
        </div>

        {/* Contact details grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {details.map(d => (
            <div key={d.label} className="group border border-zinc-300 bg-[#FBF7EF] p-6 hover:border-amber-600/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-3">{d.icon}</div>
              <div className="text-amber-700/70 text-xs tracking-widest uppercase mb-1">{d.label}</div>
              <div className="text-zinc-600 text-sm font-light leading-relaxed group-hover:text-zinc-900 transition-colors">{d.value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to commission an artwork from Eezhoviyam.`}
            target="_blank" rel="noreferrer"
            className="shimmer-btn relative overflow-hidden inline-flex items-center gap-3 px-12 py-5 bg-green-700 hover:bg-green-600 text-white text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-900/30">
            <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full pointer-events-none" />
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d={WA_PATH} /></svg>
            Start on WhatsApp
          </a>
          <p className="text-zinc-500 text-xs mt-4">Typically responds within 1 hour</p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-amber-900/20 pt-6 pb-6 px-6" style={{ background: '#1a1208' }}>
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl text-amber-300 tracking-widest mb-1">EEZHOVIYAM</div>
            <div className="text-amber-700/40 text-xs tracking-widest mb-4">ஈழோவியம் · Fine Art Gallery</div>
            <p className="text-zinc-600 text-xs leading-relaxed">Celebrating Sri Lankan heritage and artistic soul through original fine art since 2018.</p>
          </div>
          {/* Quick links */}
          <div>
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Quick Links</div>
            <div className="flex flex-col gap-2">
              {['Home', 'Gallery', 'About', 'Services', 'Contact'].map(l => (
                <a key={l} href={`/#${l.toLowerCase()}`}
                  className="text-zinc-600 hover:text-amber-400 text-xs tracking-wider uppercase transition-colors w-fit">
                  {l}
                </a>
              ))}
            </div>
          </div>
          {/* Contact mini */}
          <div>
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Find Us</div>
            <p className="text-zinc-600 text-xs leading-relaxed mb-2">{ADDRESS}</p>
            <p className="text-zinc-600 text-xs mb-4">Mon – Sat · 9 AM – 7 PM</p>
            <div className="flex gap-4">
              {SOCIALS.map(({ key, href, Icon }) => (
                <a key={key} href={href} aria-label={key}
                  className="w-8 h-8 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:border-amber-600/50 hover:text-amber-400 transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-xs">© {new Date().getFullYear()} Eezhoviyam. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group text-zinc-600 hover:text-amber-400 text-xs tracking-widest uppercase transition-all duration-300 border border-zinc-800 hover:border-amber-700/50 px-4 py-2 hover:-translate-y-1">
            <span className="inline-block group-hover:-translate-y-0.5 transition-transform">↑</span> Back to Top
          </button>
        </div>
      </div>
    </footer>
  )
}

// ─── WhatsApp float ───────────────────────────────────────────────────────────
export function WhatsAppFloat() {
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to commission an artwork from Eezhoviyam.`}
      target="_blank" rel="noreferrer"
      className="wa-ring fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-900/50 transition-all duration-300 hover:scale-110"
      title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d={WA_PATH} /></svg>
    </a>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <div style={{
          background: `
            radial-gradient(ellipse at 15% 0%, rgba(255,248,230,0.45) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 100%, rgba(120,90,40,0.15) 0%, transparent 50%),
            linear-gradient(135deg, #EFE2C4 0%, #C9AD78 22%, #E6D5AC 50%, #B8985F 78%, #EFE2C4 100%)
          `,
        }}>
          <SelectedWorks />
          <About />
          <Gallery />
          <ArtistStory />
          <ShopTeaser />
          <Services />
          <Testimonials />
          <Contact />
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  )
}
