import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG      = 'linear-gradient(135deg, #fffdf8 0%, #fdf6e8 50%, #faf0d7 100%)'
const CARD_BG = '#ffffff'
const STATUSES = ['Available', 'Commission', 'Sold']
const STOCK_STATUSES = ['In Stock', 'Out of Stock']

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-amber-700 text-[10px] tracking-[0.2em] uppercase mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-white border border-amber-200 text-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors rounded shadow-sm"
const btnPrimary = "bg-amber-700 hover:bg-amber-800 text-amber-100 text-xs tracking-widest uppercase px-5 py-2.5 transition-colors disabled:opacity-40 rounded shadow-sm"
const btnOutline = "bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-200 text-xs tracking-widest uppercase px-5 py-2.5 transition-colors rounded shadow-sm"

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="w-full max-w-sm border border-amber-200 p-8 rounded-xl shadow-lg" style={{ background: CARD_BG }}>
        <div className="text-center mb-8">
          <div className="text-2xl text-amber-700 mb-1" style={{ fontFamily: "'Noto Serif Tamil', serif" }}>ஈழோவியம்</div>
          <div className="text-amber-600/70 text-[10px] tracking-[0.3em] uppercase">Admin Panel</div>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="admin@email.com" /></Field>
          <Field label="Password"><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputCls} placeholder="••••••••" /></Field>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className={`w-full ${btnPrimary}`}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Image uploader ───────────────────────────────────────────────────────────
function ImageUpload({ current, onUploaded, placeholder = '📷 Click to upload image' }) {
  const [uploading, setUploading] = useState(false)

  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const name = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('artwork-images').upload(name, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('artwork-images').getPublicUrl(name)
      onUploaded(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <div className="border-2 border-dashed border-amber-200 p-4 text-center cursor-pointer hover:border-amber-400 transition-colors rounded-lg bg-amber-50/50"
      onClick={() => document.getElementById('img-upload').click()}>
      {current
        ? <img src={current} alt="" className="mx-auto max-h-36 max-w-48 object-contain rounded" />
        : <div className="text-zinc-400 text-xs py-6">{uploading ? 'Uploading…' : placeholder}</div>}
      <input id="img-upload" type="file" accept="image/*" onChange={handle} className="hidden" />
    </div>
  )
}

// ─── Multi-image uploader (extra angles/detail shots) ─────────────────────────
function MultiImageUpload({ urls, onChange }) {
  const [uploading, setUploading] = useState(false)

  const addFile = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const name = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('artwork-images').upload(name, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('artwork-images').getPublicUrl(name)
      onChange([...urls, data.publicUrl])
    }
    setUploading(false)
    e.target.value = ''
  }

  const remove = (i) => onChange(urls.filter((_, idx) => idx !== i))

  return (
    <div className="grid grid-cols-4 gap-2">
      {urls.map((u, i) => (
        <div key={u + i} className="relative group">
          <img src={u} alt="" className="w-full h-16 object-cover rounded border border-amber-200" />
          <button type="button" onClick={() => remove(i)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-xs leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            ✕
          </button>
        </div>
      ))}
      <label className="w-full h-16 border-2 border-dashed border-amber-200 rounded flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors text-zinc-400 text-xs text-center px-1">
        {uploading ? '…' : '+ Add'}
        <input type="file" accept="image/*" onChange={addFile} className="hidden" />
      </label>
    </div>
  )
}

// ─── TAB: Artworks ────────────────────────────────────────────────────────────
function ArtworkModal({ artwork, onSave, onClose }) {
  const [form, setForm] = useState(artwork || { title: '', medium: '', price: '', status: 'Available', image_url: '', description: '', dimensions: '', year_created: '', image_urls: [], featured: false })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      if (artwork?.id) {
        const { error } = await supabase.from('artworks').update(form).eq('id', artwork.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('artworks').insert(form)
        if (error) throw error
      }
      onSave()
    } catch (e) { setErr(e.message) }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose} title={artwork ? 'Edit Artwork' : 'Add Artwork'}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Artwork Image">
          <ImageUpload current={form.image_url} onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
        </Field>
        <Field label="Additional Images (optional)">
          <MultiImageUpload urls={form.image_urls || []} onChange={urls => setForm(f => ({ ...f, image_urls: urls }))} />
        </Field>
        <Field label="Title"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className={inputCls} placeholder="e.g. Nallur at Dusk" /></Field>
        <Field label="Medium"><input value={form.medium} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} required className={inputCls} placeholder="e.g. Oil on Canvas" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price"><input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required className={inputCls} placeholder="Rs 18,000" /></Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dimensions"><input value={form.dimensions || ''} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} className={inputCls} placeholder='e.g. 24 x 36 in' /></Field>
          <Field label="Year Created"><input type="number" value={form.year_created || ''} onChange={e => setForm(f => ({ ...f, year_created: e.target.value ? +e.target.value : null }))} className={inputCls} placeholder="2024" /></Field>
        </div>
        <Field label="Description">
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Story behind the piece, techniques used, inspiration…" />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input type="checkbox" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
          <span className="text-zinc-700 text-sm">Featured — show in "Selected Works" on the homepage</span>
        </label>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <ModalActions onClose={onClose} saving={saving} />
      </form>
    </Modal>
  )
}

function ArtworksTab() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('artworks').select('*').order('created_at', { ascending: false })
    setList(data || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async () => {
    await supabase.from('artworks').delete().eq('id', delId)
    setDelId(null); load()
  }

  const statusColor = s => s === 'Available' ? 'text-emerald-600' : s === 'Sold' ? 'text-red-500' : 'text-amber-600'

  return (
    <div>
      <TabHeader title="Artworks" count={list.length} onAdd={() => setModal({})} />
      {loading ? <Loading /> : list.length === 0 ? <Empty label="No artworks yet" onAdd={() => setModal({})} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {list.map(a => (
            <div key={a.id} className="relative border border-amber-100 overflow-hidden group rounded-lg shadow-sm" style={{ background: CARD_BG }}>
              {a.featured && (
                <span className="absolute top-2 left-2 z-10 bg-amber-400 text-black text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full shadow-sm">★ Featured</span>
              )}
              <div className="aspect-[4/3] bg-amber-50 overflow-hidden">
                {a.image_url
                  ? <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No image</div>}
              </div>
              <div className="p-4">
                <p className="text-zinc-800 text-sm font-medium mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{a.title}</p>
                <p className="text-zinc-500 text-xs mb-2">{a.medium}</p>
                <div className="flex justify-between mb-3">
                  <span className="text-amber-600 text-xs font-medium">{a.price}</span>
                  <span className={`text-xs ${statusColor(a.status)}`}>{a.status}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(a)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-200 text-xs uppercase py-1.5 rounded transition-colors">Edit</button>
                  <button onClick={() => setDelId(a.id)} className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs uppercase py-1.5 rounded transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal !== null && <ArtworkModal artwork={modal.id ? modal : null} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      {delId && <Confirm msg="Delete this artwork? This cannot be undone." onConfirm={del} onCancel={() => setDelId(null)} />}
    </div>
  )
}

// ─── TAB: Shop (art supplies) ──────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose, categories }) {
  const [form, setForm] = useState(product || { name: '', category: categories[0]?.name || '', price: '', stock: 'In Stock', image_url: '', image_urls: [], description: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      if (product?.id) {
        const { error } = await supabase.from('products').update(form).eq('id', product.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(form)
        if (error) throw error
      }
      onSave()
    } catch (e) { setErr(e.message) }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose} title={product ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Product Image">
          <ImageUpload current={form.image_url} onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
        </Field>
        <Field label="Additional Images (optional)">
          <MultiImageUpload urls={form.image_urls || []} onChange={urls => setForm(f => ({ ...f, image_urls: urls }))} />
        </Field>
        <Field label="Name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className={inputCls} placeholder="e.g. Graphite Pencil Set (12pc)" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              {categories.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Stock">
            <select value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={inputCls}>
              {STOCK_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Price"><input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required className={inputCls} placeholder="Rs 1,500" /></Field>
        <Field label="Description">
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Details, materials, what's included…" />
        </Field>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <ModalActions onClose={onClose} saving={saving} />
      </form>
    </Modal>
  )
}

function CategoryModal({ onSubmit, onClose }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true); setErr('')
    try {
      await onSubmit(name.trim())
    } catch (e) { setErr(e.message) }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose} title="Add Category">
      <form onSubmit={save} className="space-y-4">
        <Field label="Category Name">
          <input autoFocus value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="e.g. Erasers" />
        </Field>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <ModalActions onClose={onClose} saving={saving} />
      </form>
    </Modal>
  )
}

function ProductsTab() {
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [catModal, setCatModal] = useState(false)
  const [delId, setDelId] = useState(null)
  const [delCatId, setDelCatId] = useState(null)

  const load = async () => {
    setLoading(true)
    const [{ data: products }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_categories').select('*').order('sort_order'),
    ])
    setList(products || []); setCategories(cats || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async () => {
    await supabase.from('products').delete().eq('id', delId)
    setDelId(null); load()
  }

  const addCategory = async (name) => {
    const { error } = await supabase.from('product_categories').insert({ name, sort_order: categories.length })
    if (error) throw error
    setCatModal(false); load()
  }

  const deleteCategory = async () => {
    await supabase.from('product_categories').delete().eq('id', delCatId)
    setDelCatId(null); load()
  }

  const stockColor = s => s === 'In Stock' ? 'text-emerald-600' : 'text-red-500'

  return (
    <div>
      <TabHeader title="Shop" count={list.length} onAdd={() => setModal({})}
        extra={<button onClick={() => setCatModal(true)} className={btnOutline}>+ Add Category</button>} />

      {/* Category manager */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categories.map(c => (
            <span key={c.id} className="group inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full">
              {c.name}
              <button onClick={() => setDelCatId(c.id)} className="text-amber-400 hover:text-red-600 transition-colors leading-none">✕</button>
            </span>
          ))}
        </div>
      )}

      {loading ? <Loading /> : list.length === 0 ? <Empty label="No products yet" onAdd={() => setModal({})} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {list.map(p => (
            <div key={p.id} className="relative border border-amber-100 overflow-hidden group rounded-lg shadow-sm" style={{ background: CARD_BG }}>
              <div className="aspect-[4/3] bg-amber-50 overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No image</div>}
              </div>
              <div className="p-4">
                <p className="text-zinc-800 text-sm font-medium mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{p.name}</p>
                <p className="text-zinc-500 text-xs mb-2">{p.category}</p>
                <div className="flex justify-between mb-3">
                  <span className="text-amber-600 text-xs font-medium">{p.price}</span>
                  <span className={`text-xs ${stockColor(p.stock)}`}>{p.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(p)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-200 text-xs uppercase py-1.5 rounded transition-colors">Edit</button>
                  <button onClick={() => setDelId(p.id)} className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs uppercase py-1.5 rounded transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal !== null && <ProductModal product={modal.id ? modal : null} categories={categories} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      {catModal && <CategoryModal onSubmit={addCategory} onClose={() => setCatModal(false)} />}
      {delId && <Confirm msg="Delete this product? This cannot be undone." onConfirm={del} onCancel={() => setDelId(null)} />}
      {delCatId && <Confirm msg="Delete this category? Existing products keep it as text but it won't appear as a filter option anymore." onConfirm={deleteCategory} onCancel={() => setDelCatId(null)} />}
    </div>
  )
}

// ─── TAB: About Us ────────────────────────────────────────────────────────────
function AboutTab() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => setForm(data || {}))
  }, [])

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    const { id, ...rest } = form
    if (id) await supabase.from('about').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
    else await supabase.from('about').insert(rest)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!form) return <Loading />

  return (
    <div className="max-w-2xl">
      <TabHeader title="About Us" />
      <form onSubmit={save} className="space-y-5">
        <Field label="Section Title">
          <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Where Eelam Art Lives" />
        </Field>
        <Field label="Description">
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} className={`${inputCls} resize-none`} placeholder="Tell your story…" />
        </Field>
        <Field label="Gallery Image">
          <ImageUpload current={form.image_url} onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Years Active"><input type="number" value={form.years_active || ''} onChange={e => setForm(f => ({ ...f, years_active: +e.target.value }))} className={inputCls} /></Field>
          <Field label="Artworks Created"><input type="number" value={form.artworks_created || ''} onChange={e => setForm(f => ({ ...f, artworks_created: +e.target.value }))} className={inputCls} /></Field>
          <Field label="Collectors"><input type="number" value={form.collectors || ''} onChange={e => setForm(f => ({ ...f, collectors: +e.target.value }))} className={inputCls} /></Field>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save Changes'}</button>
          {saved && <span className="text-emerald-600 text-xs">✓ Saved successfully</span>}
        </div>
      </form>
    </div>
  )
}

// ─── TAB: Artist ──────────────────────────────────────────────────────────────
function ArtistTab() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('artist').select('*').single().then(({ data }) => setForm(data || {}))
  }, [])

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    const { id, ...rest } = form
    if (id) await supabase.from('artist').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
    else await supabase.from('artist').insert(rest)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!form) return <Loading />

  return (
    <div className="max-w-2xl">
      <TabHeader title="About Our Collective & Community" />
      <form onSubmit={save} className="space-y-5">
        <Field label="Team / Community Photo">
          <ImageUpload current={form.photo_url} onUploaded={url => setForm(f => ({ ...f, photo_url: url }))}
            placeholder="Click to upload team photo or community banner" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Community / Team Name"><input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Oviyam Artist Collective" /></Field>
          <Field label="Short Tagline"><input value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} placeholder="Empowering Artists & Building Real-World Creative Connections" /></Field>
        </div>
        <Field label="Bio">
          <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={6} className={`${inputCls} resize-none`} placeholder="Your story, inspiration, style… (separate paragraphs with a blank line)" />
        </Field>
        <Field label="Years Active"><input type="number" value={form.years_active || ''} onChange={e => setForm(f => ({ ...f, years_active: +e.target.value }))} className={inputCls} /></Field>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save Changes'}</button>
          {saved && <span className="text-emerald-600 text-xs">✓ Saved successfully</span>}
        </div>
      </form>
    </div>
  )
}

// ─── TAB: Services ────────────────────────────────────────────────────────────
function ServiceModal({ service, onSave, onClose }) {
  const [form, setForm] = useState(service || { icon: '🎨', title: '', description: '', cta: 'Learn More', sort_order: 0 })
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    if (form.id) await supabase.from('services').update(form).eq('id', form.id)
    else await supabase.from('services').insert(form)
    setSaving(false); onSave()
  }

  return (
    <Modal onClose={onClose} title={form.id ? 'Edit Service' : 'Add Service'}>
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Icon (emoji)"><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className={inputCls} placeholder="🎨" /></Field>
          <Field label="Sort Order"><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} className={inputCls} /></Field>
        </div>
        <Field label="Title"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className={inputCls} placeholder="Custom Portraits" /></Field>
        <Field label="Description"><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} /></Field>
        <Field label="Button Text"><input value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} className={inputCls} placeholder="Start a Portrait" /></Field>
        <ModalActions onClose={onClose} saving={saving} />
      </form>
    </Modal>
  )
}

function ServicesTab() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setList(data || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <TabHeader title="Services" count={list.length} onAdd={() => setModal({})} />
      {loading ? <Loading /> : list.length === 0 ? <Empty label="No services yet" onAdd={() => setModal({})} /> : (
        <div className="space-y-3">
          {list.map(s => (
            <div key={s.id} className="border border-amber-100 p-4 flex items-start gap-4 rounded-lg shadow-sm" style={{ background: CARD_BG }}>
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-zinc-800 text-sm font-medium mb-1">{s.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{s.description}</p>
                <p className="text-amber-500 text-xs mt-1">CTA: {s.cta}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setModal(s)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-200 text-xs uppercase px-3 py-1.5 rounded transition-colors">Edit</button>
                <button onClick={() => setDelId(s.id)} className="bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs uppercase px-3 py-1.5 rounded transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal !== null && <ServiceModal service={modal.id ? modal : null} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      {delId && <Confirm msg="Delete this service?" onConfirm={async () => { await supabase.from('services').delete().eq('id', delId); setDelId(null); load() }} onCancel={() => setDelId(null)} />}
    </div>
  )
}

// ─── TAB: Reviews ─────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setList(data || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const approve = async (id) => { await supabase.from('testimonials').update({ approved: true }).eq('id', id); load() }
  const reject  = async (id) => { await supabase.from('testimonials').delete().eq('id', id); load() }

  const pending  = list.filter(r => !r.approved)
  const approved = list.filter(r => r.approved)
  const shown    = filter === 'pending' ? pending : approved

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-zinc-800 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
          Reviews
          <span className="text-zinc-400 text-sm ml-2 font-normal">
            {pending.length} pending · {approved.length} approved
          </span>
        </h2>
        <div className="flex gap-2">
          {['pending', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs tracking-widest uppercase px-4 py-2 rounded transition-colors ${filter === f ? 'bg-amber-700 text-amber-100' : 'bg-zinc-800 border border-zinc-600 text-amber-300 hover:bg-zinc-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loading /> : shown.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 text-sm border border-dashed border-amber-200 rounded-lg">
          No {filter} reviews
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(r => (
            <div key={r.id} className="border border-amber-100 p-5 rounded-lg shadow-sm" style={{ background: CARD_BG }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-zinc-800 text-sm font-medium">{r.name}</span>
                    <span className="text-amber-400 text-xs">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    <span className="text-zinc-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed">"{r.review}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.approved && (
                    <button onClick={() => approve(r.id)} className="bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-emerald-100 text-xs uppercase px-3 py-1.5 rounded transition-colors">Approve</button>
                  )}
                  <button onClick={() => reject(r.id)} className="bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs uppercase px-3 py-1.5 rounded transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-lg border border-amber-100 p-6 overflow-y-auto max-h-[90vh] rounded-xl shadow-2xl" style={{ background: CARD_BG }}>
        <h2 className="text-amber-700 text-lg mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

function ModalActions({ onClose, saving }) {
  return (
    <div className="flex gap-3 pt-1">
      <button type="submit" disabled={saving} className={`flex-1 ${btnPrimary}`}>{saving ? 'Saving…' : 'Save'}</button>
      <button type="button" onClick={onClose} className={`flex-1 ${btnOutline}`}>Cancel</button>
    </div>
  )
}

function Confirm({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-sm border border-red-100 p-6 rounded-xl shadow-2xl" style={{ background: CARD_BG }}>
        <p className="text-zinc-700 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 text-red-100 text-xs tracking-widest uppercase py-2.5 rounded transition-colors">Delete</button>
          <button onClick={onCancel} className={`flex-1 ${btnOutline}`}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function TabHeader({ title, count, onAdd, extra }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-zinc-800 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
        {title} {count !== undefined && <span className="text-zinc-400 text-sm font-normal">({count})</span>}
      </h2>
      <div className="flex items-center gap-3">
        {extra}
        {onAdd && <button onClick={onAdd} className={btnPrimary}>+ Add</button>}
      </div>
    </div>
  )
}

function Loading() {
  return <div className="text-zinc-400 text-sm text-center py-16">Loading…</div>
}

function Empty({ label, onAdd }) {
  return (
    <div className="text-center py-16 border border-dashed border-amber-200 rounded-lg">
      <p className="text-zinc-400 text-sm mb-3">{label}</p>
      {onAdd && <button onClick={onAdd} className="text-amber-600 text-sm underline underline-offset-4">Add one now</button>}
    </div>
  )
}

// ─── TAB: Contact ─────────────────────────────────────────────────────────────
const DEFAULT_CONTACT_ROWS = [
  { icon: '📍', label: 'Visit Us',   value: '183 Navalar Rd, Jaffna, Sri Lanka', sort_order: 1 },
  { icon: '🕐', label: 'Open Hours', value: 'Tue – Sun · 10 AM – 7 PM',         sort_order: 2 },
  { icon: '📞', label: 'Call Us',    value: '+94 77 123 4567',                   sort_order: 3 },
  { icon: '✉️', label: 'Email',      value: 'hello@eezhoviyam.art',               sort_order: 4 },
]

function ContactTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('contact').select('*').order('sort_order').then(({ data }) => {
      setRows(data && data.length > 0 ? data : DEFAULT_CONTACT_ROWS)
      setLoading(false)
    })
  }, [])

  const update = (i, key, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row))

  const save = async () => {
    setSaving(true)
    await supabase.from('contact').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('contact').insert(rows.map(({ id, ...r }) => r))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    supabase.from('contact').select('*').order('sort_order').then(({ data }) => { if (data) setRows(data) })
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-zinc-800 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Details</h2>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-xs">✓ Saved</span>}
          <button onClick={save} disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save All'}</button>
        </div>
      </div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="border border-amber-100 p-5 rounded-lg shadow-sm" style={{ background: CARD_BG }}>
            <div className="grid grid-cols-[60px_1fr_1fr] gap-3 items-start">
              <Field label="Icon">
                <input value={row.icon} onChange={e => update(i, 'icon', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Label">
                <input value={row.label} onChange={e => update(i, 'label', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Value">
                <input value={row.value} onChange={e => update(i, 'value', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'artworks', label: '🖼 Artworks' },
  { id: 'about',    label: '📖 About Us' },
  { id: 'artist',   label: '🧑‍🎨 Artist'  },
  { id: 'services', label: '⚙️ Services' },
  { id: 'shop',     label: '🛍️ Shop'     },
  { id: 'reviews',  label: '⭐ Reviews'  },
  { id: 'contact',  label: '📬 Contact'  },
]

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('artworks')

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#1c120a' }}>
        <div>
          <div className="text-xl text-amber-300" style={{ fontFamily: "'Noto Serif Tamil', serif" }}>ஈழோவியம்</div>
          <div className="text-amber-500/60 text-[10px] tracking-[0.3em] uppercase">Admin Panel</div>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); onLogout() }}
          className="border border-amber-500/50 text-amber-300 text-xs tracking-widest uppercase px-5 py-2 hover:bg-amber-500/20 transition-colors rounded">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-amber-900/30 px-6 flex gap-1 overflow-x-auto no-scrollbar" style={{ background: '#2a1a0e' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-colors shrink-0 whitespace-nowrap ${tab === t.id ? 'border-amber-400 text-amber-300 font-medium' : 'border-transparent text-amber-700 hover:text-amber-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'artworks' && <ArtworksTab />}
        {tab === 'about'    && <AboutTab />}
        {tab === 'artist'   && <ArtistTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'shop'     && <ProductsTab />}
        {tab === 'reviews'  && <ReviewsTab />}
        {tab === 'contact'  && <ContactTab />}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!supabase) { setChecking(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setChecking(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (!supabase) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="text-center">
        <p className="text-red-500 text-sm mb-2">Supabase environment variables not configured.</p>
        <p className="text-zinc-500 text-xs">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your hosting platform.</p>
      </div>
    </div>
  )

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="text-amber-600/50 text-sm">Loading…</div>
    </div>
  )

  return session ? <Dashboard onLogout={() => setSession(null)} /> : <LoginPage />
}
