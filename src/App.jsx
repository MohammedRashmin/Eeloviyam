import { useState, useEffect, useRef } from 'react'
import heroArt from './assets/Hero Art.svg'
import butterflyArt from './assets/Butterfly_hero.svg'

// ─── Data ────────────────────────────────────────────────────────────────────
const GALLERY = [
  { id: 1, title: 'Nallur Kandaswamy',    medium: 'Oil on Canvas',   status: 'Available',  price: '₹18,000',   url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
  { id: 2, title: 'Faces of Jaffna',      medium: 'Acrylic Portrait',status: 'Sold',        price: '₹24,000',   url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80' },
  { id: 3, title: 'Temple at Dawn',       medium: 'Watercolour',     status: 'Available',  price: '₹12,000',   url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
  { id: 4, title: 'Heritage in Gold',     medium: 'Mixed Media',     status: 'Available',  price: '₹32,000',   url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80' },
  { id: 5, title: 'Eelam Sunset',         medium: 'Oil on Canvas',   status: 'Commission', price: 'On Request', url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
  { id: 6, title: 'The Silent Fisherman', medium: 'Charcoal & Ink',  status: 'Available',  price: '₹9,500',    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80' },
]

const SERVICES = [
  { num: '01', icon: '🎨', title: 'Custom Portraits',        desc: 'Handcrafted oil portraits from your photographs. Every detail captured with care. Delivered within 3–4 weeks.',  cta: 'Start a Portrait' },
  { num: '02', icon: '🏛️', title: 'Cultural Artworks',       desc: 'Commissioned pieces celebrating Tamil heritage, mythology, temple art, and the living culture of Jaffna.',         cta: 'Commission a Piece' },
  { num: '03', icon: '🖼️', title: 'Home Décor Consultation', desc: 'Our curators help you choose or commission art that elevates your space — from living rooms to corporate offices.', cta: 'Book a Consultation' },
]

const TESTIMONIALS = [
  { name: 'Surya K.',  initials: 'SK', color: 'bg-amber-700',   text: 'Best art gallery in Jaffna — the quality is truly world-class. Every piece tells a story.',          stars: 5 },
  { name: 'Meena R.',  initials: 'MR', color: 'bg-rose-800',    text: 'Got a custom portrait done for my parents\' anniversary. Absolutely breathtaking. Worth every rupee.', stars: 5 },
  { name: 'Priya T.',  initials: 'PT', color: 'bg-emerald-800', text: 'Eeloviyam preserved our culture in the most beautiful way. This is Jaffna\'s finest gallery.',        stars: 5 },
]

const WHATSAPP_NUMBER = '94778322614'
const ADDRESS = '183 Navalar Rd, Jaffna, Sri Lanka'
const TICKER = ['Original Oil Paintings', 'Custom Portraits', 'Tamil Heritage Art', 'Cultural Commissions', 'Fine Art Gallery', 'Jaffna · Sri Lanka', 'Est. 2018']

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
const GLOBAL_CSS = `
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
  return (
    <a href={href} target={target} rel={rel}
      className={`shimmer-btn relative overflow-hidden px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2
        ${outline ? 'border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black' : 'bg-amber-400 text-black hover:bg-amber-300'}
        ${className}`}>
      <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full pointer-events-none" />
      {children}
    </a>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="flex items-center justify-center gap-3 text-amber-400/70 tracking-[0.3em] text-xs uppercase mb-4">
      <span className="text-amber-600/50">◆</span>
      {children}
      <span className="text-amber-600/50">◆</span>
    </p>
  )
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 justify-center my-6">
      <div className="h-px w-8 bg-amber-700/40" />
      <div className="w-1 h-1 bg-amber-500/60 rotate-45" />
      <div className="h-px w-8 bg-amber-700/40" />
    </div>
  )
}

// ─── WA icon (reused) ─────────────────────────────────────────────────────────
const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = ['Home', 'Gallery', 'About', 'Services', 'Contact']
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#1a1208]/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-semibold tracking-widest text-amber-300 hover:text-amber-200 transition-colors">EELOVIYAM</span>
          <span className="text-amber-700/50 text-[9px] tracking-[0.3em] uppercase">ஈழோவியம் · Fine Art</span>
        </a>
        <ul className="hidden md:flex gap-8">
          {links.map(l => <li key={l}><NavLink href={`#${l.toLowerCase()}`}>{l}</NavLink></li>)}
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
          {links.map(l => <NavLink key={l} href={`#${l.toLowerCase()}`}>{l}</NavLink>)}
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
      style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#1a1209 50%,#0a0a0a 100%)' }}
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
            filter: 'sepia(95%) saturate(280%) hue-rotate(-20deg) brightness(0.78) contrast(1.2) drop-shadow(0 0 32px rgba(180,83,9,0.55)) drop-shadow(0 0 10px rgba(253,186,116,0.28))',
            opacity: 0.9,
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
          <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase">Jaffna's Premier Fine Art Gallery</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight mb-3"
          style={{ animation: 'fadeUp 1s ease 0.4s both', textShadow: '0 0 80px rgba(217,119,6,0.2)' }}>
          Eeloviyam
        </h1>
        <p className="font-serif text-2xl md:text-4xl text-amber-300/70 italic mb-3"
          style={{ animation: 'fadeUp 1s ease 0.6s both' }}>ஈழோவியம்</p>

        {/* Gold ornament divider */}
        <div className="flex items-center justify-center gap-3 mb-6" style={{ animation: 'fadeUp 1s ease 0.7s both' }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/50" />
          <span className="text-amber-600/50 text-xs">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        <p className="text-zinc-400 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ animation: 'fadeUp 1s ease 0.8s both' }}>
          Where Eelam's Heritage Meets Fine Art.<br />
          <span className="text-zinc-500 text-base">Experience the soul of Jaffna through every stroke.</span>
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

// ─── About ───────────────────────────────────────────────────────────────────
function StatCounter({ num, suffix, label, active }) {
  const count = useCountUp(num, active)
  return (
    <div className="group cursor-default text-center">
      <div className="font-serif text-4xl text-amber-300 transition-all duration-300 group-hover:text-amber-200 group-hover:scale-110 inline-block">
        {active ? count : 0}{suffix}
      </div>
      <div className="text-zinc-500 text-xs tracking-widest uppercase mt-1 group-hover:text-zinc-400 transition-colors">{label}</div>
    </div>
  )
}

function About() {
  const [ref, visible] = useScrollReveal()
  return (
    <section id="about" className="py-10 px-6">
      <div ref={ref} className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Image block */}
        <div className="relative group">
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" alt="Gallery"
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {/* Gold frame offset */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-amber-700/30 group-hover:border-amber-500/50 transition-colors duration-500 pointer-events-none" />
          {/* Badge overlay */}
          <div className="absolute -bottom-5 left-6 bg-amber-400 text-black px-5 py-3">
            <div className="font-serif text-lg font-semibold leading-none">Est. 2018</div>
            <div className="text-xs tracking-widest uppercase mt-0.5 opacity-70">Jaffna, Sri Lanka</div>
          </div>
        </div>

        {/* Text block */}
        <div>
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-4 leading-tight">
            Preserving Culture<br />Through Canvas
          </h2>
          <GoldDivider />

          {/* Pull quote */}
          <blockquote className="border-l-2 border-amber-600/50 pl-4 mb-6 italic text-amber-300/60 text-sm leading-relaxed">
            "Every stroke is a declaration that our heritage lives on."
          </blockquote>

          <p className="text-zinc-400 font-light leading-relaxed mb-4 text-sm">
            Eeloviyam — meaning <span className="text-amber-400/80">"Eelam Art"</span> in Tamil — was born from a deep reverence for the rich cultural
            tapestry of Jaffna. From the golden gopurams of Nallur to the serene faces of our fishermen,
            our artists document the soul of the North.
          </p>
          <p className="text-zinc-500 font-light leading-relaxed mb-10 text-sm">
            Each painting is not just art — it is memory, identity, and pride. We work with over 8 local
            artists to bring authentic Tamil art to collectors worldwide.
          </p>

          <div className="grid grid-cols-3 gap-4 p-6 border border-amber-900/30 bg-amber-950/10">
            <StatCounter num={8}   suffix="+" label="Artists"  active={visible} />
            <StatCounter num={200} suffix="+" label="Artworks" active={visible} />
            <StatCounter num={5}   suffix="★" label="Reviews"  active={visible} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Available', 'Commission', 'Sold']

function GalleryCard({ item }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
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
      style={{
        transform: hovered ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)` : 'perspective(700px) rotateX(0) rotateY(0) scale(1)',
        transition: hovered ? 'transform 0.08s ease' : 'transform 0.5s ease',
      }}
      className="relative overflow-hidden cursor-pointer group">
      <img src={item.url} alt={item.title}
        className={`w-full h-72 object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-400 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <h3 className="font-serif text-lg text-white font-semibold">{item.title}</h3>
        <p className="text-zinc-400 text-xs mt-0.5 tracking-wider">{item.medium}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-amber-300 text-sm font-medium">{item.price}</span>
          <span className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
            item.status === 'Sold'       ? 'bg-zinc-700/80 text-zinc-300' :
            item.status === 'Commission' ? 'bg-amber-900/60 text-amber-300' :
                                           'bg-emerald-900/60 text-emerald-300'}`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className={`absolute inset-0 border-2 transition-all duration-300 pointer-events-none ${hovered ? 'border-amber-500/40' : 'border-transparent'}`} />
    </div>
  )
}

function Gallery() {
  const [ref, visible] = useScrollReveal()
  const [filter, setFilter] = useState('All')
  const items = filter === 'All' ? GALLERY : GALLERY.filter(g => g.status === filter)
  return (
    <section id="gallery" className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>Our Works</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-semibold">The Collection</h2>
          <GoldDivider />
          <p className="text-zinc-500 text-sm max-w-md mx-auto">Each piece is an original work — painted by hand, rooted in Tamil culture.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                filter === f
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-zinc-700 text-zinc-500 hover:border-amber-700/50 hover:text-amber-400'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {items.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>

        <div className="text-center mt-12">
          <ShimmerBtn href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in a painting.`} target="_blank" rel="noreferrer" outline>
            Enquire About a Piece →
          </ShimmerBtn>
        </div>
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServiceCard({ s, i, visible }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`relative border p-10 transition-all duration-500 cursor-default overflow-hidden flex flex-col ${
        hovered ? 'border-amber-600/60 -translate-y-2' : 'border-zinc-800/80'
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
      <div className="text-amber-700/40 text-xs tracking-widest mb-2">{s.num}</div>
      <h3 className={`font-serif text-2xl font-semibold mb-3 transition-colors duration-300 ${hovered ? 'text-amber-300' : 'text-white'}`}>{s.title}</h3>
      <p className="text-zinc-500 font-light leading-relaxed text-sm flex-1">{s.desc}</p>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'd like to enquire about ${s.title}.`}
        target="_blank" rel="noreferrer"
        className={`mt-6 text-xs tracking-widest uppercase transition-colors duration-300 flex items-center gap-2 ${hovered ? 'text-amber-400' : 'text-zinc-600'}`}>
        {s.cta} <span className={`transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`}>→</span>
      </a>
    </div>
  )
}

function Services() {
  const [ref, visible] = useScrollReveal()
  return (
    <section id="services" className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`text-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-semibold">Our Services</h2>
          <GoldDivider />
          <p className="text-zinc-500 text-sm max-w-md mx-auto">From custom portraits to full interior art curation — we bring Jaffna's art to your world.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} i={i} visible={visible} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`text-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SectionLabel>Google Reviews</SectionLabel>
          <h2 className="font-serif text-4xl text-white font-semibold">What People Say</h2>
          <GoldDivider />
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {'★★★★★'.split('').map((s, i) => <span key={i} className="text-lg">{s}</span>)}
            <span className="text-zinc-500 text-sm ml-2">5.0 · Verified on Google</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name}
              className={`group relative border border-zinc-800/80 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-amber-700/40 cursor-default overflow-hidden ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${i * 150}ms` }}>

              {/* Large decorative quote mark */}
              <span className="absolute top-4 right-6 font-serif text-7xl text-amber-900/15 leading-none select-none pointer-events-none">"</span>
              {/* Top accent on hover */}
              <div className="absolute top-0 left-0 h-0.5 w-0 bg-amber-500/50 group-hover:w-full transition-all duration-500" />

              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-semibold tracking-wider shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <div className="text-amber-400 text-xs mt-0.5">{'★'.repeat(t.stars)}</div>
                </div>
              </div>

              <p className="text-zinc-300 font-light italic leading-relaxed text-sm group-hover:text-white transition-colors">
                "{t.text}"
              </p>
              <p className="text-zinc-600 text-xs tracking-widest uppercase mt-4 group-hover:text-zinc-500 transition-colors">
                Verified Review
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, visible] = useScrollReveal()
  const details = [
    { icon: '📍', label: 'Visit Us',    value: ADDRESS },
    { icon: '🕐', label: 'Open Hours', value: 'Tue – Sun · 10 AM – 7 PM' },
    { icon: '📞', label: 'Call Us',    value: '+94 77 123 4567' },
    { icon: '✉️', label: 'Email',      value: 'hello@eeloviyam.art' },
  ]
  return (
    <section id="contact" className="py-10 px-6">
      <div ref={ref} className={`max-w-5xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-16">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-semibold">Commission an Artwork</h2>
          <GoldDivider />
          <p className="text-zinc-500 text-sm max-w-md mx-auto">Ready to own a piece of Tamil heritage? Reach out and we'll bring your vision to life.</p>
        </div>

        {/* Contact details grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {details.map(d => (
            <div key={d.label} className="group border border-zinc-800/80 p-6 hover:border-amber-700/40 transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-3">{d.icon}</div>
              <div className="text-amber-700/60 text-xs tracking-widest uppercase mb-1">{d.label}</div>
              <div className="text-zinc-300 text-sm font-light leading-relaxed group-hover:text-white transition-colors">{d.value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to commission an artwork from Eeloviyam.`}
            target="_blank" rel="noreferrer"
            className="shimmer-btn relative overflow-hidden inline-flex items-center gap-3 px-12 py-5 bg-green-700 hover:bg-green-600 text-white text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-900/30">
            <span className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full pointer-events-none" />
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d={WA_PATH} /></svg>
            Start on WhatsApp
          </a>
          <p className="text-zinc-600 text-xs mt-4">Typically responds within 1 hour</p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-amber-900/20 pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl text-amber-300 tracking-widest mb-1">EELOVIYAM</div>
            <div className="text-amber-700/40 text-xs tracking-widest mb-4">ஈழோவியம் · Fine Art Gallery</div>
            <p className="text-zinc-600 text-xs leading-relaxed">Celebrating Tamil culture and Jaffna heritage through original fine art since 2018.</p>
          </div>
          {/* Quick links */}
          <div>
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Quick Links</div>
            <div className="flex flex-col gap-2">
              {['Home', 'Gallery', 'About', 'Services', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
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
            <p className="text-zinc-600 text-xs mb-4">Tue–Sun · 10 AM – 7 PM</p>
            <div className="flex gap-4">
              {['IG', 'FB', 'YT'].map(s => (
                <a key={s} href="#"
                  className="w-8 h-8 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:border-amber-600/50 hover:text-amber-400 text-xs tracking-wider transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-xs">© {new Date().getFullYear()} Eeloviyam. All rights reserved.</p>
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
function WhatsAppFloat() {
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to commission an artwork from Eeloviyam.`}
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
      <div className="min-h-screen" style={{ background: 'linear-gradient(to right, #231d0f 0%, #21180e 18%, #000000 50%, #0d0905 82%, #241c0b 100%)' }}>
        <Navbar />
        <Hero />
        <About />
        <Gallery />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  )
}
