'use client'

import { useState } from 'react'
import { Coins, ArrowDown, TrendingUp, Zap, Clock, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { SellerLevelBadge } from './SellerLevelBadge'

export type TokenTier = 'standard' | 'priority' | 'dedicated' | 'enterprise'

export interface ComputeToken {
  id: string
  provider: string
  logo: string
  level: 'new' | 'verified' | 'pro' | 'elite'
  tier: TokenTier
  tokenName: string
  pricePerUnit: number
  priceUnit: string
  minPurchase: number
  maxPurchase: number
  available: number
  rating: number
  reviews: number
  location: string
  usageMode: string
  avgLatency: string
  reliability: string
  features: string[]
  validUntil: string
  batchDiscount?: string
}

const TIER_STYLES: Record<TokenTier, { label: string; bg: string; text: string; border: string }> = {
  standard: {
    label: 'Standard',
    bg: 'bg-white/5',
    text: 'text-white/60',
    border: 'border-white/10',
  },
  priority: {
    label: 'Priority',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  dedicated: {
    label: 'Dedicated',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  enterprise: {
    label: 'Enterprise',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
}

const MOCK_TOKENS: ComputeToken[] = [
  {
    id: 'ct-001',
    provider: 'ComputeCloud Pro',
    logo: '☁️',
    level: 'elite',
    tier: 'enterprise',
    tokenName: 'CCP-Enterprise-100K',
    pricePerUnit: 0.0042,
    priceUnit: 'per token',
    minPurchase: 100_000,
    maxPurchase: 10_000_000,
    available: 4_820_000,
    rating: 4.9,
    reviews: 8721,
    location: 'US-East, EU-Central, APAC',
    usageMode: 'Async & Real-time',
    avgLatency: '< 45ms',
    reliability: '99.99%',
    features: ['Auto-scaling', 'RDMA', 'Bare metal fallback', 'Multi-region failover', 'Custom SLAs'],
    validUntil: '2026-06-30',
    batchDiscount: '5% off 1M+ tokens',
  },
  {
    id: 'ct-002',
    provider: 'NeuroCompute',
    logo: '🧠',
    level: 'pro',
    tier: 'dedicated',
    tokenName: 'NC-Dedicated-50K',
    pricePerUnit: 0.0055,
    priceUnit: 'per token',
    minPurchase: 50_000,
    maxPurchase: 5_000_000,
    available: 1_340_000,
    rating: 4.7,
    reviews: 4102,
    location: 'US-West, Singapore',
    usageMode: 'Real-time only',
    avgLatency: '< 30ms',
    reliability: '99.95%',
    features: ['Dedicated GPU queue', 'Priority scheduling', 'No cold starts', 'JWT auth'],
    validUntil: '2026-03-31',
    batchDiscount: '3% off 500K+ tokens',
  },
  {
    id: 'ct-003',
    provider: 'FastLane AI',
    logo: '⚡',
    level: 'verified',
    tier: 'priority',
    tokenName: 'FL-Priority-10K',
    pricePerUnit: 0.007,
    priceUnit: 'per token',
    minPurchase: 10_000,
    maxPurchase: 500_000,
    available: 820_500,
    rating: 4.5,
    reviews: 2341,
    location: 'US-Central, EU-West',
    usageMode: 'Async & Real-time',
    avgLatency: '< 80ms',
    reliability: '99.9%',
    features: ['Instant provisioning', 'Auto-scaling', 'REST & gRPC API'],
    validUntil: '2026-04-15',
  },
  {
    id: 'ct-004',
    provider: 'BudgetCompute',
    logo: '💸',
    level: 'new',
    tier: 'standard',
    tokenName: 'BC-Standard-5K',
    pricePerUnit: 0.009,
    priceUnit: 'per token',
    minPurchase: 5_000,
    maxPurchase: 200_000,
    available: 98_000,
    rating: 4.2,
    reviews: 892,
    location: 'US-East',
    usageMode: 'Async only',
    avgLatency: '< 150ms',
    reliability: '99.5%',
    features: ['Pay-as-you-go', 'No commitment', 'Basic analytics'],
    validUntil: '2026-02-28',
  },
  {
    id: 'ct-005',
    provider: 'HyperScaler',
    logo: '🚀',
    level: 'pro',
    tier: 'dedicated',
    tokenName: 'HS-Dedicated-200K',
    pricePerUnit: 0.0048,
    priceUnit: 'per token',
    minPurchase: 200_000,
    maxPurchase: 8_000_000,
    available: 3_100_000,
    rating: 4.8,
    reviews: 6532,
    location: 'Global',
    usageMode: 'Async & Real-time',
    avgLatency: '< 35ms',
    reliability: '99.97%',
    features: ['Global edge network', 'RDMA', 'Multi-tenancy isolation', 'SLA guarantee', 'WebSocket support'],
    validUntil: '2026-08-31',
    batchDiscount: '7% off 2M+ tokens',
  },
  {
    id: 'ct-006',
    provider: 'EdgeToken',
    logo: '📡',
    level: 'verified',
    tier: 'priority',
    tokenName: 'ET-Priority-25K',
    pricePerUnit: 0.0065,
    priceUnit: 'per token',
    minPurchase: 25_000,
    maxPurchase: 1_000_000,
    available: 412_000,
    rating: 4.6,
    reviews: 1876,
    location: 'APAC, US-West',
    usageMode: 'Real-time only',
    avgLatency: '< 20ms',
    reliability: '99.92%',
    features: ['Ultra-low latency', 'Edge compute', 'Mobile SDK', 'WebSocket + SSE'],
    validUntil: '2026-05-20',
  },
]

interface PurchaseModalProps {
  token: ComputeToken
  onClose: () => void
}

function PurchaseModal({ token: t, onClose }: PurchaseModalProps) {
  const [amount, setAmount] = useState(t.minPurchase)

  const total = amount * t.pricePerUnit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/20 p-6 space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{t.logo}</span>
            <div>
              <h3 className="text-base font-semibold text-white/90">{t.provider}</h3>
              <p className="text-xs text-white/40">{t.tokenName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-sm">✕</button>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Unit price</span>
            <span className="text-emerald-400 font-medium">${t.pricePerUnit.toFixed(4)} / token</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Min purchase</span>
            <span className="text-white/70">{t.minPurchase.toLocaleString()} tokens</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Available</span>
            <span className="text-white/70">{t.available.toLocaleString()} tokens</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/50">
            <span>Amount (tokens)</span>
            <span>{amount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={t.minPurchase}
            max={Math.min(t.maxPurchase, t.available)}
            step={1000}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex gap-2">
            {[10000, 50000, 100000, 500000].map(n => (
              <button
                key={n}
                onClick={() => setAmount(Math.min(n, t.maxPurchase, t.available))}
                className="flex-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/60 py-1.5 hover:bg-white/10 transition-colors"
              >
                {n >= 1000 ? `${n/1000}K` : n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex justify-between items-center">
          <span className="text-sm text-white/60">Total cost</span>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-400">${total.toFixed(2)}</div>
            {t.batchDiscount && <div className="text-[10px] text-emerald-400/70 mt-0.5">{t.batchDiscount}</div>}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#010409] font-semibold text-sm py-2.5 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase Tokens
        </button>
      </div>
    </div>
  )
}

interface TokenRowProps {
  token: ComputeToken
  onPurchase: (t: ComputeToken) => void
}

function TokenRow({ token: t, onPurchase }: TokenRowProps) {
  const [expanded, setExpanded] = useState(false)
  const tier = TIER_STYLES[t.tier]

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/8 hover:border-white/20 transition-all duration-200">
      <div className="p-4 flex items-center gap-3">
        {/* Logo + provider */}
        <span className="text-2xl shrink-0">{t.logo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white/90">{t.provider}</h3>
            <SellerLevelBadge level={t.level} size="sm" />
            <span className={['text-[10px] rounded-full px-2 py-0.5 border font-medium', tier.bg, tier.text, tier.border].join(' ')}>
              {tier.label}
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{t.tokenName} · {t.location}</p>
        </div>

        {/* Price + key stats */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-400">${t.pricePerUnit.toFixed(4)}</div>
            <div className="text-[10px] text-white/40">{t.priceUnit}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/70">{t.avgLatency}</div>
            <div className="text-[10px] text-white/40">latency</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/70">{t.reliability}</div>
            <div className="text-[10px] text-white/40">SLA</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPurchase(t)}
            className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-3 py-1.5 transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 text-xs p-1.5 transition-colors"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Available', value: t.available.toLocaleString() },
              { label: 'Min Purchase', value: t.minPurchase.toLocaleString() },
              { label: 'Rating', value: `★ ${t.rating}` },
              { label: 'Reviews', value: t.reviews.toLocaleString() },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg bg-white/5 p-2.5">
                <div className="text-xs font-semibold text-white/80">{stat.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {t.features.map(f => (
              <span key={f} className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/50">{f}</span>
            ))}
          </div>
          {t.batchDiscount && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400">{t.batchDiscount}</span>
            </div>
          )}
          <div className="text-[10px] text-white/30 flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            Valid until {t.validUntil} · {t.usageMode}
          </div>
        </div>
      )}
    </div>
  )
}

export interface ComputeTokenCardProps {
  tokens?: ComputeToken[]
}

export function ComputeTokenCard({ tokens = MOCK_TOKENS }: ComputeTokenCardProps) {
  const [sortKey, setSortKey] = useState<'price' | 'reliability' | 'available'>('price')
  const [sortDesc, setSortDesc] = useState(true)
  const [purchaseTarget, setPurchaseTarget] = useState<ComputeToken | null>(null)
  const [filterTier, setFilterTier] = useState<TokenTier | 'all'>('all')

  const sorted = [...tokens]
    .filter(t => filterTier === 'all' || t.tier === filterTier)
    .sort((a, b) => {
      let va = 0, vb = 0
      if (sortKey === 'price') { va = a.pricePerUnit; vb = b.pricePerUnit }
      else if (sortKey === 'reliability') { va = parseFloat(a.reliability); vb = parseFloat(b.reliability) }
      else { va = a.available; vb = b.available }
      return sortDesc ? vb - va : va - vb
    })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90">Compute Tokens</h2>
          <p className="text-xs text-white/40 mt-0.5">Trade GPU & AI compute by the token</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-xs text-blue-400">
          <TrendingUp className="h-3 w-3" />
          Live Market
        </span>
      </div>

      {/* Sort & filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-white/40">Sort:</span>
        {(['price', 'reliability', 'available'] as const).map(key => (
          <button
            key={key}
            onClick={() => {
              if (sortKey === key) setSortDesc(!sortDesc)
              else { setSortKey(key); setSortDesc(true) }
            }}
            className={[
              'flex items-center gap-1 rounded-lg text-[10px] px-2 py-1 border transition-colors',
              sortKey === key
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10',
            ].join(' ')}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            {sortKey === key && (sortDesc ? ' ↓' : ' ↑')}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] text-white/40">Tier:</span>
          {(['all', 'standard', 'priority', 'dedicated', 'enterprise'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={[
                'rounded-lg text-[10px] px-2 py-1 border transition-colors',
                filterTier === t
                  ? 'bg-white/15 border-white/25 text-white/80'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10',
              ].join(' ')}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Token rows */}
      <div className="space-y-2">
        {sorted.map(t => (
          <TokenRow key={t.id} token={t} onPurchase={setPurchaseTarget} />
        ))}
      </div>

      {purchaseTarget && (
        <PurchaseModal token={purchaseTarget} onClose={() => setPurchaseTarget(null)} />
      )}
    </section>
  )
}

export { MOCK_TOKENS }
