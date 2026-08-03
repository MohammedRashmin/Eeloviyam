import { useState, useEffect } from 'react'
import {
  GLOBAL_CSS, Navbar, Footer, WhatsAppFloat, Lightbox,
  ProductCard,
} from './App.jsx'

function AllProducts() {
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    import('./supabase').then(({ supabase: sb }) => {
      Promise.all([
        sb.from('products').select('*').order('created_at', { ascending: false }),
        sb.from('product_categories').select('*').order('sort_order'),
      ]).then(([{ data: products }, { data: cats }]) => {
        setItems(products || []); setCategories(cats || []); setLoading(false)
      })
    })
  }, [])

  const shown = filter === 'All' ? items : items.filter(p => p.category === filter)
  const filters = ['All', ...categories.map(c => c.name)]

  return (
    <section className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {!loading && items.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                  filter === c
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-amber-800/40 text-zinc-600 hover:border-amber-600/70 hover:text-amber-700'
                }`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? null : items.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-10">More supplies coming soon — check back shortly.</p>
        ) : shown.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-10">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {shown.map(p => (
              <ProductCard key={p.id} product={p} boxed onOpen={(item, startIndex) => setLightbox({ item, startIndex })} />
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

export default function ShopPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="min-h-screen bg-white">
        <Navbar solid />
        <div style={{ background: 'linear-gradient(180deg, #F2E8D5 0%, #E4D3AE 25%, #F2E8D5 50%, #E4D3AE 75%, #F2E8D5 100%)' }}>
          <AllProducts />
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  )
}
