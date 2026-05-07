'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  CheckCircle2, XCircle, Plus, Minus, ArrowUpDown,
  Star, TrendingUp, BarChart3, X
} from 'lucide-react'
import { SellerLevelBadge } from '../m2-agent-market/SellerLevelBadge'
import { MOCK_HARDWARE_LIBRARY } from './HardwareLibrary'

// ── Types ───────────────────────────────────────────────────────────────────

export interface CompareItem {
  id: string
  vendor: string
  vendorLogo: string
  level: 'new' | 'verified' | 'pro' | 'elite'
  modelName: string
  category: string
  pricePerUnit: number
  priceUnit: string
  rating: number
  reviews: number
  location: string
  inStock: boolean
  leadTime: string
  specs: Record<string, string>
  certifications: string[]
  highlights: string[]
  utilizationRate?: number
}

type CompareTab = 'side_by_side' | 'ranking'

const CATEGORIES = [
  { id: 'gpu', label: 'GPU Clusters', icon: <Zap className="h-3.5 w-3.5" /> },
  { id: 'full_rack', label: 'Full Racks', icon: <Server className="h-3.5 w-3.5" /> },
  { id: 'cpu', label: 'Compute Nodes', icon: <Cpu className="h-3.5 w-3.5" /> },
  { id: 'storage', label: 'Storage Arrays', icon: <HardDrive className="h-3.5 w-3.5" /> },
  { id: 'network', label: 'Network Fabric', icon: <Wifi className="h-3.5 w-3.5" /> },
  { id: 'memory', label: 'Memory Pools', icon: <HardDrive className="h-3.5 w-3.5" /> },
]

// ── Build Compare Items ───────────────────────────────────────────────────────

function buildCompareItem(item: typeof MOCK_HARDWARE_LIBRARY[0]): CompareItem {
  const specs: Record<string, string> = {}
  item.specs.forEach(s => { specs[s.label] = s.value })
  return {
    id: item.id,
    vendor: item.vendor,
    vendorLogo: item.vendorLogo,
    level: item.level,
    modelName: item.modelName,
    category: item.category,
    pricePerUnit: item.pricePerUnit,
    priceUnit: item.priceUnit,
    rating: item.rating,
    reviews: item.reviews,
    location: item.location,
    inStock: item.inStock,
    leadTime: item.leadTime,
    specs,
    certifications: item.certifications,
    highlights: item.highlights,
    utilizationRate: item.utilizationRate,
  }
}

// ── Compare Table ──────────────────────────────────────────────────────────────

function CompareTable({ items }: { items: CompareItem[] }) {
  const allSpecLabels = Array.from(new Set(items.flatMap(i => Object.keys(i.specs))))

  function SpecValue({ value }: { value: string | undefined }) {
    if (!value) return <span className="text-slate-900/20">—</span>
    return <span className="text-slate-900/80">{value}</span>
  }

  function BoolValue({ value }: { value: boolean | undefined }) {
    if (value === undefined) return <span className="text-slate-900/20">—</span>
    return value
      ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
      : <XCircle className="h-4 w-4 text-rose-400/50 mx-auto" />
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-xs">
        <thead>
          {/* Header row */}
          <tr className="border-b border-white/10">
            <th className="text-left p-4 bg-white/[0.03] sticky left-0 z-10 min-w-[180px]">
              <span className="text-[10px] text-slate-900/40 uppercase tracking-wider font-medium">Hardware</span>
            </th>
            {items.map(item => (
              <th key={item.id} className="p-4 bg-white/[0.03] min-w-[200px] text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{item.vendorLogo}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900/90">{item.vendor}</p>
                    <p className="text-[10px] text-slate-900/40 mt-0.5">{item.modelName}</p>
                  </div>
                  <SellerLevelBadge level={item.level} size="sm" />
                  <div className="text-base font-bold text-emerald-400">${item.pricePerUnit}<span className="text-[10px] text-slate-900/40 font-normal">/{item.priceUnit}</span></div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-900/40">★ {item.rating}</span>
                    <span className="text-[10px] text-slate-900/40">{item.reviews.toLocaleString()} reviews</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${item.inStock ? 'text-emerald-400' : 'text-amber-400/80'}`}>
                    {item.inStock ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {item.inStock ? 'In Stock' : 'Pre-order'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price / Availability */}
          <tr className="border-b border-white/5">
            <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">Lead Time</td>
            {items.map(i => <td key={i.id} className="p-3 text-center text-slate-900/60">{i.leadTime}</td>)}
          </tr>
          <tr className="border-b border-white/5">
            <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">Location</td>
            {items.map(i => <td key={i.id} className="p-3 text-center text-slate-900/60">{i.location}</td>)}
          </tr>
          {items[0]?.utilizationRate !== undefined && (
            <tr className="border-b border-white/5">
              <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">Utilization</td>
              {items.map(i => (
                <td key={i.id} className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${i.utilizationRate}%` }} />
                    </div>
                    <span className="text-slate-900/60 tabular-nums">{i.utilizationRate}%</span>
                  </div>
                </td>
              ))}
            </tr>
          )}

          {/* Specs */}
          {allSpecLabels.map(label => (
            <tr key={label} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">{label}</td>
              {items.map(i => (
                <td key={i.id} className="p-3 text-center"><SpecValue value={i.specs[label]} /></td>
              ))}
            </tr>
          ))}

          {/* Certifications */}
          <tr className="border-b border-white/5">
            <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">Certifications</td>
            {items.map(i => (
              <td key={i.id} className="p-3 text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {i.certifications.map(c => (
                    <span key={c} className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[9px] text-blue-400">{c}</span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Highlights */}
          <tr className="border-b border-white/5">
            <td className="p-3 pl-4 text-slate-900/40 sticky left-0 bg-[#010409]">Highlights</td>
            {items.map(i => (
              <td key={i.id} className="p-3 text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {i.highlights.slice(0, 3).map(h => (
                    <span key={h} className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] text-slate-900/50">{h}</span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* CTA */}
          <tr>
            <td className="p-4 sticky left-0 bg-[#010409]" />
            {items.map(i => (
              <td key={i.id} className="p-4 text-center">
                <button className="w-full rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium py-2 transition-colors">
                  Provision
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── Ranking Card ───────────────────────────────────────────────────────────────

function RankingRow({ item, rank, metric }: { item: CompareItem; rank: number; metric: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-3 hover:bg-white/[0.05] transition-colors">
      <span className={[
        'text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
        rank === 2 ? 'bg-white/10 text-slate-900/60 border border-white/20' :
        rank === 3 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
        'bg-white/5 text-slate-900/30 border border-white/10'
      ].join(' ')}>#{rank}</span>
      <span className="text-xl">{item.vendorLogo}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900/80 truncate">{item.vendor}</p>
        <p className="text-[10px] text-slate-900/40 truncate">{item.modelName}</p>
      </div>
      <SellerLevelBadge level={item.level} size="sm" showLabel={false} />
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-emerald-400">${item.pricePerUnit}</p>
        <p className="text-[10px] text-slate-900/40">{item.priceUnit}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium text-slate-900/70">★ {item.rating}</p>
        <p className="text-[10px] text-slate-900/40">{item.reviews.toLocaleString()}</p>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

const PRESET_COMPARES = [
  { label: 'GPU Clusters (Top 3)', filter: { category: 'gpu' as const, sortBy: 'rating' as const } },
  { label: 'Full Racks', filter: { category: 'full_rack' as const, sortBy: 'rating' as const } },
  { label: 'Best Value GPU', filter: { category: 'gpu' as const, sortBy: 'price' as const } },
]

export function HardwareCompare() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([
    buildCompareItem(MOCK_HARDWARE_LIBRARY[0]),
    buildCompareItem(MOCK_HARDWARE_LIBRARY[2]),
    buildCompareItem(MOCK_HARDWARE_LIBRARY[6]),
  ])
  const [activeTab, setActiveTab] = useState<CompareTab>('side_by_side')
  const [rankingMetric, setRankingMetric] = useState<'rating' | 'price' | 'reviews'>('rating')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const availableItems = MOCK_HARDWARE_LIBRARY
    .map(buildCompareItem)
    .filter(i => !compareItems.find(c => c.id === i.id))
    .filter(i => categoryFilter === 'all' || i.category === categoryFilter)

  const rankedItems = [...availableItems, ...compareItems]
    .filter(i => categoryFilter === 'all' || i.category === categoryFilter)
    .sort((a, b) => {
      if (rankingMetric === 'rating') return b.rating - a.rating
      if (rankingMetric === 'price') return a.pricePerUnit - b.pricePerUnit
      return b.reviews - a.reviews
    })

  const addItem = (item: CompareItem) => {
    if (compareItems.length < 4) setCompareItems(prev => [...prev, item])
    setShowAddModal(false)
  }

  const removeItem = (id: string) => setCompareItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="space-y-5">
      {/* ── Header & Controls ──────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900/90">Hardware Comparison</h2>
          <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-900/40">
            {compareItems.length} selected
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden">
            <button onClick={() => setActiveTab('side_by_side')} className={['px-3 py-2 text-xs font-medium transition-colors', activeTab === 'side_by_side' ? 'bg-white/15 text-slate-900/80' : 'text-slate-900/40 hover:text-slate-900/60'].join(' ')}>
              <BarChart3 className="h-4 w-4 inline mr-1" />Side by Side
            </button>
            <button onClick={() => setActiveTab('ranking')} className={['px-3 py-2 text-xs font-medium transition-colors', activeTab === 'ranking' ? 'bg-white/15 text-slate-900/80' : 'text-slate-900/40 hover:text-slate-900/60'].join(' ')}>
              <TrendingUp className="h-4 w-4 inline mr-1" />Ranking
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={compareItems.length >= 4}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-900/60 px-3 py-2 transition-colors disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />Add to Compare
          </button>
        </div>
      </div>

      {/* ── Preset Comparisons ───────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-900/40">Quick compare:</span>
        {PRESET_COMPARES.map(preset => (
          <button
            key={preset.label}
            onClick={() => {
              const filtered = MOCK_HARDWARE_LIBRARY.filter(i => i.category === preset.filter.category)
                .sort((a, b) => preset.filter.sortBy === 'price' ? a.pricePerUnit - b.pricePerUnit : b.rating - a.rating)
                .slice(0, 3)
                .map(buildCompareItem)
              setCompareItems(filtered)
              setActiveTab('side_by_side')
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-900/50 px-2.5 py-1.5 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── Side by Side ─────────────────────────────────── */}
      {activeTab === 'side_by_side' && (
        <div className="space-y-4">
          {compareItems.length < 2 && (
            <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/10">
              <BarChart3 className="h-8 w-8 text-slate-900/20 mx-auto mb-2" />
              <p className="text-sm text-slate-900/40">Select at least 2 items to compare</p>
              <button onClick={() => setShowAddModal(true)} className="mt-3 text-xs text-emerald-400 hover:text-emerald-300">+ Add hardware</button>
            </div>
          )}
          {compareItems.length >= 2 && <CompareTable items={compareItems} />}
          {/* Item chips */}
          {compareItems.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {compareItems.map(item => (
                <span key={item.id} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-900/60">
                  <span>{item.vendorLogo}</span>
                  <span>{item.vendor}</span>
                  <button onClick={() => removeItem(item.id)} className="text-slate-900/30 hover:text-slate-900/60 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Ranking ─────────────────────────────────────── */}
      {activeTab === 'ranking' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] text-slate-900/40">Rank by:</span>
            {([
              { key: 'rating' as const, label: 'Rating' },
              { key: 'price' as const, label: 'Best Price' },
              { key: 'reviews' as const, label: 'Most Reviewed' },
            ]).map(m => (
              <button
                key={m.key}
                onClick={() => setRankingMetric(m.key)}
                className={['rounded-lg text-[10px] px-2.5 py-1.5 border transition-colors',
                  rankingMetric === m.key
                    ? 'bg-white/15 border-white/25 text-slate-900/80'
                    : 'bg-white/5 border-white/10 text-slate-900/40 hover:bg-white/10'].join(' ')}
              >
                {m.label}
              </button>
            ))}
            <div className="h-4 w-px bg-white/10 mx-1" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-900/60 px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {rankedItems.slice(0, 8).map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3">
                <RankingRow item={item} rank={idx + 1} metric={rankingMetric} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add to Compare Modal ──────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1a28] border border-white/20 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900/90">Add to Compare</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-900/40 hover:text-slate-900/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-900/40">Select hardware to add ({compareItems.length}/4 selected)</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableItems.length === 0 ? (
                <p className="text-center py-8 text-slate-900/30 text-xs">All available hardware is already in the comparison.</p>
              ) : (
                availableItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3 hover:bg-white/[0.07] transition-colors">
                    <span className="text-xl">{item.vendorLogo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900/80">{item.vendor}</p>
                      <p className="text-[10px] text-slate-900/40">{item.modelName} · ${item.pricePerUnit}/{item.priceUnit}</p>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
