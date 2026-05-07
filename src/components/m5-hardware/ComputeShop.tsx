'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  Search, Filter, X, ShoppingCart, CreditCard, Clock,
  TrendingUp, TrendingDown, Star, MapPin, CheckCircle2,
  AlertCircle, BarChart3, ArrowUpDown, Eye, Plus, Minus,
  Tag, Percent, Zap as ZapIcon, Database, Network
} from 'lucide-react'
import { SellerLevelBadge } from '../m2-agent-market/SellerLevelBadge'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ComputeCategory = 'gpu_on_demand' | 'gpu_spot' | 'cpu_compute' | 'memory_ondemand' | 'storage' | 'network'

export interface ComputeOffer {
  id: string
  name: string
  provider: string
  providerLogo: string
  level: 'new' | 'verified' | 'pro' | 'elite'
  category: ComputeCategory
  modelName: string
  pricePerUnit: number
  priceUnit: string
  priceOriginal?: number
  rating: number
  reviews: number
  location: string
  leadTime: string
  specs: { label: string; value: string }[]
  certifications: string[]
  inStock: boolean
  highlights: string[]
  discount?: number
  badge?: string
  minUnits?: number
  maxUnits?: number
  sla?: string
  utilizationRate?: number
  availableUnits?: number
}

export interface CartItem {
  offer: ComputeOffer
  quantity: number
  hours: number
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_COMPUTE_SHOP: ComputeOffer[] = [
  {
    id: 'shop-001',
    name: 'H100 SXM On-Demand',
    provider: 'NeuralCore Systems',
    providerLogo: '🖥️',
    level: 'elite',
    category: 'gpu_on_demand',
    modelName: 'NGC-H100-80G-OND',
    pricePerUnit: 4.2,
    priceUnit: 'GPU/hr',
    rating: 4.9,
    reviews: 3421,
    location: 'US-West, EU-Central',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'NVIDIA H100 SXM 80GB HBM3' },
      { label: 'CUDA Cores', value: '16,896' },
      { label: 'Tensor Cores', value: '528' },
      { label: 'FP16 Perf', value: '1,979 TFLOPS' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'FIPS 140-3'],
    inStock: true,
    highlights: ['Bare metal', 'RDMA ready', 'SLA 99.99%'],
    sla: '99.99%',
    utilizationRate: 87,
    availableUnits: 267,
  },
  {
    id: 'shop-002',
    name: 'H100 SXM Spot — 40% Off',
    provider: 'NeuralCore Systems',
    providerLogo: '🖥️',
    level: 'elite',
    category: 'gpu_spot',
    modelName: 'NGC-H100-80G-SPOT',
    pricePerUnit: 2.52,
    priceUnit: 'GPU/hr',
    priceOriginal: 4.2,
    rating: 4.9,
    reviews: 3421,
    location: 'US-West, EU-Central',
    leadTime: 'Under 5 min',
    specs: [
      { label: 'GPU', value: 'NVIDIA H100 SXM 80GB HBM3' },
      { label: 'Interruptions', value: 'Possible (preemptible)' },
      { label: 'SLA', value: 'Best-effort' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001'],
    inStock: true,
    highlights: ['40% discount', 'Instant provisioning', 'Bare metal'],
    discount: 40,
    badge: 'SAVE 40%',
    sla: 'Best-effort',
    utilizationRate: 87,
    availableUnits: 1024,
  },
  {
    id: 'shop-003',
    name: 'A6000 Compute Pool',
    provider: 'EdgeFlow AI',
    providerLogo: '🌊',
    level: 'verified',
    category: 'gpu_on_demand',
    modelName: 'EF-A6000-48G',
    pricePerUnit: 1.8,
    priceUnit: 'GPU/hr',
    rating: 4.5,
    reviews: 1203,
    location: 'APAC, US-West',
    leadTime: 'Under 1 hour',
    specs: [
      { label: 'GPU', value: 'NVIDIA A6000 48GB ECC' },
      { label: 'FP16 Perf', value: '309 TFLOPS' },
      { label: 'Memory BW', value: '768 GB/s' },
    ],
    certifications: ['SOC 2 Type I', 'GDPR Compliant'],
    inStock: true,
    highlights: ['Spot friendly', 'Elastic scaling'],
    sla: '99.5%',
    utilizationRate: 63,
    availableUnits: 1514,
  },
  {
    id: 'shop-004',
    name: 'A100 64GB MIG Instances',
    provider: 'FluxCore AI',
    providerLogo: '🔥',
    level: 'elite',
    category: 'gpu_on_demand',
    modelName: 'FC-A100-64G-MIG',
    pricePerUnit: 0.42,
    priceUnit: 'MIG-10GB/hr',
    rating: 4.8,
    reviews: 1876,
    location: 'US-West, EU-West, APAC',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'A100 64GB MIG (10GB slice)' },
      { label: 'MIG Config', value: '7 x 10GB partitions' },
      { label: 'Isolation', value: 'Hardware-level MIG' },
    ],
    certifications: ['SOC 2 Type II', 'FedRAMP Moderate'],
    inStock: true,
    highlights: ['MIG partitioning', 'SRIOV isolation', 'SLA 99.95%'],
    badge: 'MIG OPTIMIZED',
    sla: '99.95%',
    utilizationRate: 79,
    availableUnits: 1720,
  },
  {
    id: 'shop-005',
    name: 'L40S Inference Bundle',
    provider: 'HyperScale Networks',
    providerLogo: '🌐',
    level: 'new',
    category: 'gpu_on_demand',
    modelName: 'HS-L40S-48G-INF',
    pricePerUnit: 1.4,
    priceUnit: 'GPU/hr',
    rating: 4.2,
    reviews: 267,
    location: 'APAC-Singapore, APAC-Tokyo',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'NVIDIA L40S 48GB GDDR6' },
      { label: 'FP32 Perf', value: '366 TFLOPS' },
      { label: 'RT Cores', value: '72' },
    ],
    certifications: ['SOC 2 Type I'],
    inStock: true,
    highlights: ['Inference optimized', 'vGPU support', 'Cost-effective'],
    badge: 'INFERENCE',
    sla: '99.9%',
    utilizationRate: 51,
    availableUnits: 1004,
  },
  {
    id: 'shop-006',
    name: 'EPYC 768c CPU Nodes',
    provider: 'PrimeCompute',
    providerLogo: '🏗️',
    level: 'pro',
    category: 'cpu_compute',
    modelName: 'PC-EPYC-768C-2P',
    pricePerUnit: 0.008,
    priceUnit: 'core/hr',
    rating: 4.6,
    reviews: 945,
    location: 'US-East, EU-Central',
    leadTime: 'Under 2 hours',
    specs: [
      { label: 'CPU', value: 'AMD EPYC 9684X 768 cores' },
      { label: 'Clock', value: '2.6 GHz / 3.9 GHz boost' },
      { label: 'Memory', value: '2 TB DDR5 ECC' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001'],
    inStock: true,
    highlights: ['SMT optimal', 'AVX-512', 'HPC workloads'],
    sla: '99.9%',
    utilizationRate: 68,
    availableUnits: 10486,
  },
  {
    id: 'shop-007',
    name: 'NVMe Block Storage',
    provider: 'SterlingStorage',
    providerLogo: '🗄️',
    level: 'verified',
    category: 'storage',
    modelName: 'SS-NVMe-2TB-BLOCK',
    pricePerUnit: 0.0012,
    priceUnit: 'GB/month',
    rating: 4.6,
    reviews: 678,
    location: 'EU-West, US-West',
    leadTime: 'Same day',
    specs: [
      { label: 'Drive', value: 'PCIe 5.0 NVMe SSD' },
      { label: 'Capacity', value: '2 TB per volume' },
      { label: 'IOPS', value: '1M random read' },
    ],
    certifications: ['SOC 2 Type II', 'HIPAA'],
    inStock: true,
    highlights: ['Block storage', 'Inline encryption', 'Snapshots'],
    sla: '99.99%',
    utilizationRate: 82,
    availableUnits: 2048,
  },
  {
    id: 'shop-008',
    name: '400G InfiniBand Fabric',
    provider: 'IronBandwidth',
    providerLogo: '🔷',
    level: 'pro',
    category: 'network',
    modelName: 'IB-400G-PORT',
    pricePerUnit: 0.12,
    priceUnit: 'GB transferred',
    rating: 4.8,
    reviews: 2104,
    location: 'Global PoPs',
    leadTime: 'Instant',
    specs: [
      { label: 'Speed', value: '400 Gbps per port' },
      { label: 'Protocol', value: 'InfiniBand NDR' },
      { label: 'Availability', value: '99.999% uptime' },
    ],
    certifications: ['SOC 2 Type II', 'PCI-DSS'],
    inStock: true,
    highlights: ['No egress fees', 'Peering included', 'Global network'],
    badge: 'NO EGRESS',
    sla: '99.999%',
    utilizationRate: 55,
    availableUnits: 99999,
  },
]

const CATEGORY_LABELS: Record<ComputeCategory, string> = {
  gpu_on_demand: 'GPU On-Demand',
  gpu_spot: 'GPU Spot',
  cpu_compute: 'CPU Compute',
  memory_ondemand: 'Memory On-Demand',
  storage: 'Block Storage',
  network: 'Network Fabric',
}

const CATEGORY_ICONS: Record<ComputeCategory, React.ReactNode> = {
  gpu_on_demand: <Zap className="h-3.5 w-3.5" />,
  gpu_spot: <Zap className="h-3.5 w-3.5" />,
  cpu_compute: <Cpu className="h-3.5 w-3.5" />,
  memory_ondemand: <Database className="h-3.5 w-3.5" />,
  storage: <HardDrive className="h-3.5 w-3.5" />,
  network: <Wifi className="h-3.5 w-3.5" />,
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ShopOfferCard({ offer, onAdd }: { offer: ComputeOffer; onAdd: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{offer.providerLogo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900/90">{offer.provider}</h3>
            <SellerLevelBadge level={offer.level} size="sm" />
          </div>
          <p className="text-xs text-slate-900/40">{offer.modelName} · {offer.location}</p>
          {offer.badge && (
            <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400 font-medium">
              <Percent className="h-2.5 w-2.5" />{offer.badge}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          {offer.priceOriginal && (
            <span className="text-[10px] text-slate-900/30 line-through">${offer.priceOriginal}</span>
          )}
          <div className="text-base font-bold text-emerald-400">${offer.pricePerUnit}</div>
          <div className="text-[10px] text-slate-900/40">{offer.priceUnit}</div>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-xl bg-white/[0.04] border border-white/8 px-3 space-y-1">
        {offer.specs.slice(0, 3).map(s => (
          <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
            <span className="text-[11px] text-slate-900/40">{s.label}</span>
            <span className="text-[11px] text-slate-900/70 font-medium">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[10px] text-slate-900/50">
        <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{offer.rating}</span>
        <span>{offer.reviews.toLocaleString()} reviews</span>
        <span className={`inline-flex items-center gap-1 ${offer.inStock ? 'text-emerald-400' : 'text-amber-400/80'}`}>
          {offer.inStock ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          {offer.inStock ? 'Available' : 'Pre-order'}
        </span>
        {offer.sla && <span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" />SLA {offer.sla}</span>}
      </div>

      {/* Availability bar */}
      {offer.utilizationRate !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-900/40">
            <span>Cluster Load</span>
            <span>{offer.utilizationRate}% utilized · {(offer.availableUnits ?? 0).toLocaleString()} units free</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${offer.utilizationRate > 85 ? 'bg-rose-500' : offer.utilizationRate > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${offer.utilizationRate}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium py-2.5 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />Add to Cart
        </button>
        <button className="flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-900/60 px-3 py-2 transition-colors">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ── Cart ───────────────────────────────────────────────────────────────────────

function CartSummary({ items, onRemove }: { items: CartItem[]; onRemove: (id: string) => void }) {
  const subtotal = items.reduce((sum, i) => sum + i.offer.pricePerUnit * i.quantity * i.hours, 0)
  const estimated = subtotal * 730 // rough monthly est.

  if (items.length === 0) return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center">
      <ShoppingCart className="h-8 w-8 text-slate-900/20 mx-auto mb-2" />
      <p className="text-sm text-slate-900/40">Cart is empty</p>
      <p className="text-[10px] text-slate-900/30 mt-1">Add compute offers to provision them</p>
    </div>
  )

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900/80 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />Cart ({items.length})
        </h3>
        <span className="text-xs text-slate-900/40">Est. ${estimated.toFixed(2)}/mo</span>
      </div>
      {items.map(item => (
        <div key={item.offer.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/8 p-3">
          <span className="text-lg">{item.offer.providerLogo}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900/80 truncate">{item.offer.name}</p>
            <p className="text-[10px] text-slate-900/40">{item.quantity}x · {item.hours}h · ${(item.offer.pricePerUnit * item.quantity * item.hours).toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10">
              <button className="p-1 text-slate-900/40 hover:text-slate-900/70"><Minus className="h-3 w-3" /></button>
              <span className="text-xs text-slate-900/70 px-1 tabular-nums">{item.quantity}</span>
              <button className="p-1 text-slate-900/40 hover:text-slate-900/70"><Plus className="h-3 w-3" /></button>
            </div>
            <button onClick={() => onRemove(item.offer.id)} className="text-slate-900/30 hover:text-rose-400/70 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-900/40">Subtotal</p>
          <p className="text-lg font-bold text-emerald-400">${subtotal.toFixed(4)}<span className="text-[10px] text-slate-900/40 font-normal">/hr</span></p>
        </div>
        <button className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-5 py-2.5 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

const ALL_CATEGORIES: ComputeCategory[] = ['gpu_on_demand', 'gpu_spot', 'cpu_compute', 'memory_ondemand', 'storage', 'network']

export function ComputeShop() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ComputeCategory | 'all'>('all')
  const [sortKey, setSortKey] = useState<'price' | 'rating' | 'discount'>('rating')
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const addToCart = (offer: ComputeOffer) => {
    const existing = cart.find(i => i.offer.id === offer.id)
    if (existing) {
      setCart(prev => prev.map(i => i.offer.id === offer.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setCart(prev => [...prev, { offer, quantity: 1, hours: 1 }])
    }
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.offer.id !== id))

  const filtered = MOCK_COMPUTE_SHOP.filter(offer => {
    if (search) {
      const q = search.toLowerCase()
      if (![offer.name, offer.provider, offer.modelName].some(s => s.toLowerCase().includes(q))) return false
    }
    if (categoryFilter !== 'all' && offer.category !== categoryFilter) return false
    if (showOnlyDiscounted && !offer.discount) return false
    return true
  }).sort((a, b) => {
    if (sortKey === 'price') return a.pricePerUnit - b.pricePerUnit
    if (sortKey === 'rating') return b.rating - a.rating
    if (sortKey === 'discount') return (b.discount ?? 0) - (a.discount ?? 0)
    return 0
  })

  return (
    <div className="space-y-5">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900/30" />
          <input
            type="text"
            placeholder="Search compute offers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-900/80 placeholder:text-slate-900/30 pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/25 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900/30 hover:text-slate-900/60">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={['inline-flex items-center gap-1 rounded-lg text-[10px] px-2.5 py-1.5 border transition-all',
              categoryFilter === 'all'
                ? 'bg-white/15 border-white/25 text-slate-900/80 font-medium'
                : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]'].join(' ')}
          >
            All
          </button>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={['inline-flex items-center gap-1 rounded-lg text-[10px] px-2.5 py-1.5 border transition-all',
                categoryFilter === cat
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-medium'
                  : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]'].join(' ')}
            >
              {CATEGORY_ICONS[cat]}{CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Discount toggle */}
        <button
          onClick={() => setShowOnlyDiscounted(f => !f)}
          className={['flex items-center gap-1.5 rounded-xl text-xs px-3 py-2 border transition-colors',
            showOnlyDiscounted
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]'].join(' ')}
        >
          <Percent className="h-4 w-4" />Discounted Only
        </button>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-900/30 shrink-0" />
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as typeof sortKey)}
            className="rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-900/60 px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setShowCart(f => !f)}
          className={['relative flex items-center gap-2 rounded-xl text-xs px-3 py-2 border transition-colors ml-auto',
            showCart ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]'].join(' ')}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border border-[#010409] text-[9px] text-[#010409] font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Layout: grid + cart sidebar ─────────────────────── */}
      <div className="flex gap-5" style={{ gridTemplateColumns: showCart ? '1fr 320px' : '1fr' }}>
        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900/90">
              Compute Shop
              <span className="text-xs text-slate-900/40 font-normal ml-2">{filtered.length} offers</span>
            </h2>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-900/30 text-sm">No compute offers match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(offer => (
                <ShopOfferCard key={offer.id} offer={offer} onAdd={() => addToCart(offer)} />
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="w-80 shrink-0">
            <CartSummary items={cart} onRemove={removeFromCart} />
          </div>
        )}
      </div>
    </div>
  )
}
