'use client'

import { useState } from 'react'
import {
  Store, Users, Cpu, Coins, TrendingUp,
  Search, Filter, X,
  LayoutGrid, List, Bell
} from 'lucide-react'
import { DigitalHumanBuilder } from './DigitalHumanBuilder'
import { IndustryCaseCard, MOCK_CASES } from './IndustryCaseCard'
import { HardwareVendorCard, MOCK_VENDORS } from './HardwareVendorCard'
import { ComputeTokenCard, MOCK_TOKENS } from './ComputeTokenCard'
import { SellerLevelBadge } from './SellerLevelBadge'

export type MarketTab = 'digital_humans' | 'industry_cases' | 'hardware' | 'compute_tokens'
export type CardLayout = 'grid' | 'list'

interface TabConfig {
  id: MarketTab
  label: string
  icon: React.ReactNode
  count: number
  accentColor: string
}

const TABS: TabConfig[] = [
  { id: 'digital_humans', label: 'Digital Humans', icon: <Users className="h-4 w-4" />, count: 4, accentColor: 'emerald' },
  { id: 'industry_cases', label: 'Industry Cases', icon: <TrendingUp className="h-4 w-4" />, count: 6, accentColor: 'blue' },
  { id: 'hardware', label: 'Hardware Vendors', icon: <Cpu className="h-4 w-4" />, count: 6, accentColor: 'cyan' },
  { id: 'compute_tokens', label: 'Compute Tokens', icon: <Coins className="h-4 w-4" />, count: 6, accentColor: 'amber' },
]

interface FilterState {
  sellerLevel: 'all' | 'new' | 'verified' | 'pro' | 'elite'
  search: string
  layout: CardLayout
}

const MOCK_BANNER = {
  title: 'Agent Market · Spring 2026',
  subtitle: 'Discover, deploy, and trade AI agents, digital humans, compute, and hardware — all in one unified marketplace.',
  stats: [
    { label: 'Active Agents', value: '2,847' },
    { label: 'Digital Humans', value: '1,204' },
    { label: 'Hardware Listings', value: '483' },
    { label: 'Compute Providers', value: '156' },
  ],
}

export function AgentMarketModule() {
  const [activeTab, setActiveTab] = useState<MarketTab>('digital_humans')
  const [filters, setFilters] = useState<FilterState>({
    sellerLevel: 'all',
    search: '',
    layout: 'grid',
  })

  const activeConfig = TABS.find(t => t.id === activeTab)!

  // Filter helpers
  function filterByLevel<T extends { sellerLevel?: string; level?: string }>(items: T[]): T[] {
    if (filters.sellerLevel === 'all') return items
    return items.filter(item => (item.sellerLevel ?? item.level) === filters.sellerLevel)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function filterBySearch<T extends Record<string, any>>(items: T[]): T[] {
    if (!filters.search.trim()) return items
    const q = filters.search.toLowerCase()
    return items.filter(item =>
      item.name?.toLowerCase().includes(q) ||
      item.title?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q) ||
      item.provider?.toLowerCase().includes(q)
    )
  }

  const filteredCases = filterBySearch(filterByLevel(MOCK_CASES)) as typeof MOCK_CASES
  const filteredVendors = filterBySearch(filterByLevel(MOCK_VENDORS)) as typeof MOCK_VENDORS
  const filteredTokens = MOCK_TOKENS // tokens have internal filtering
  const gridCols = filters.layout === 'grid'
    ? activeTab === 'industry_cases' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1'

  return (
    <div className="min-h-screen bg-[#010409] text-white" data-testid="agent-market-module">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <Store className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white/90">{MOCK_BANNER.title}</h1>
                <p className="text-xs text-white/40 mt-0.5 max-w-lg">{MOCK_BANNER.subtitle}</p>
              </div>
            </div>
            <button className="relative shrink-0 flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-2 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border border-[#010409] text-[9px] text-[#010409] font-bold flex items-center justify-center">3</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {MOCK_BANNER.stats.map(stat => (
              <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
                <div className="text-lg font-bold text-white/90">{stat.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#010409]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 border',
                  activeTab === tab.id
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'text-white/40 border-transparent hover:bg-white/5 hover:text-white/70',
                ].join(' ')}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={[
                  'inline-flex items-center justify-center rounded-full text-[10px] min-w-[18px] h-[18px] px-1',
                  activeTab === tab.id ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/40',
                ].join(' ')}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Search agents, vendors, tokens..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 placeholder:text-white/30 pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(f => ({ ...f, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-white/30 shrink-0" />
            <div className="flex items-center gap-1">
              {(['all', 'new', 'verified', 'pro', 'elite'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFilters(f => ({ ...f, sellerLevel: level }))}
                  className={[
                    'rounded-lg text-[10px] px-2 py-1 border transition-colors',
                    filters.sellerLevel === level
                      ? 'bg-white/15 border-white/25 text-white/80'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10',
                  ].join(' ')}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Layout toggle */}
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => setFilters(f => ({ ...f, layout: 'grid' }))}
              className={['p-2 transition-colors', filters.layout === 'grid' ? 'bg-white/15 text-white/80' : 'text-white/30 hover:text-white/60'].join(' ')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, layout: 'list' }))}
              className={['p-2 transition-colors', filters.layout === 'list' ? 'bg-white/15 text-white/80' : 'text-white/30 hover:text-white/60'].join(' ')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Tab header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white/90">{activeConfig.label}</h2>
            <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
              {activeTab === 'digital_humans' ? filteredCases.length : activeTab === 'industry_cases' ? filteredCases.length : filteredVendors.length} results
            </span>
          </div>
          {filters.sellerLevel !== 'all' && (
            <button
              onClick={() => setFilters(f => ({ ...f, sellerLevel: 'all' }))}
              className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50 px-2 py-1 hover:bg-white/10 transition-colors"
            >
              <SellerLevelBadge level={filters.sellerLevel} size="sm" />
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>

        {/* ── Digital Humans ── */}
        {activeTab === 'digital_humans' && (
          <DigitalHumanBuilder />
        )}

        {/* ── Industry Cases ── */}
        {activeTab === 'industry_cases' && (
          <div className="space-y-5">
            {filteredCases.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">No cases match your filters.</div>
            ) : (
              <div className={['grid gap-4 transition-all', gridCols].join(' ')}>
                {filteredCases.map(c => (
                  <IndustryCaseCard key={c.id} caseData={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Hardware Vendors ── */}
        {activeTab === 'hardware' && (
          <div className="space-y-5">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">No vendors match your filters.</div>
            ) : (
              <div className={['grid gap-4 transition-all', gridCols].join(' ')}>
                {filteredVendors.map(v => (
                  <HardwareVendorCard key={v.id} vendor={v} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Compute Tokens ── */}
        {activeTab === 'compute_tokens' && (
          <ComputeTokenCard tokens={filteredTokens} />
        )}
      </div>
    </div>
  )
}
