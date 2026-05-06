'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  Search, Filter, X, CreditCard, RefreshCw, Pause, Play,
  Trash2, ExternalLink, Clock, CheckCircle2, AlertCircle,
  TrendingUp, TrendingDown, Star, Calendar, Bell,
  ArrowUpRight, ArrowDownRight, Plus, Settings, MoreHorizontal,
  AlertTriangle, Download
} from 'lucide-react'
import { SellerLevelBadge } from '../m2-agent-market/SellerLevelBadge'

// ── Types ─────────────────────────────────────────────────────────────────────

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'pending'

export interface Subscription {
  id: string
  name: string
  provider: string
  providerLogo: string
  level: 'new' | 'verified' | 'pro' | 'elite'
  category: string
  modelName: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  pricePerMonth: number
  priceUnit: string
  nextBillingDate: string
  startDate: string
  autoRenew: boolean
  specs: { label: string; value: string }[]
  utilizationRate?: number
  nextBillingAmount?: number
  totalSpend?: number
  alerts?: string[]
  usageThisMonth?: {
    hours: number
    computeUnits: number
    cost: number
    limit: number
  }
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  items: string[]
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-001',
    name: 'NeuralCore NGC-4090 Pro',
    provider: 'NeuralCore Systems',
    providerLogo: '🖥️',
    level: 'elite',
    category: 'GPU Cluster',
    modelName: 'NGC-4090-Turbo',
    tier: 'pro',
    status: 'active',
    pricePerMonth: 2890,
    priceUnit: 'GPU/month',
    nextBillingDate: '2026-06-06',
    startDate: '2026-01-06',
    autoRenew: true,
    specs: [
      { label: 'GPU', value: 'NVIDIA H100 SXM 80GB' },
      { label: 'Allocated Units', value: '8 GPUs' },
      { label: 'SLA', value: '99.99% uptime' },
    ],
    utilizationRate: 87,
    nextBillingAmount: 2890,
    totalSpend: 11560,
    alerts: [],
    usageThisMonth: {
      hours: 624,
      computeUnits: 4992,
      cost: 2410,
      limit: 720,
    },
  },
  {
    id: 'sub-002',
    name: 'EdgeFlow A6000 Pool',
    provider: 'EdgeFlow AI',
    providerLogo: '🌊',
    level: 'verified',
    category: 'GPU Cluster',
    modelName: 'EF-A6000-Pool',
    tier: 'starter',
    status: 'active',
    pricePerMonth: 980,
    priceUnit: 'GPU/month',
    nextBillingDate: '2026-06-15',
    startDate: '2026-03-15',
    autoRenew: true,
    specs: [
      { label: 'GPU', value: 'NVIDIA A6000 48GB' },
      { label: 'Allocated Units', value: '4 GPUs' },
      { label: 'SLA', value: '99.5% uptime' },
    ],
    utilizationRate: 63,
    nextBillingAmount: 980,
    totalSpend: 1960,
    alerts: ['Usage at 87% of monthly limit'],
    usageThisMonth: {
      hours: 580,
      computeUnits: 2320,
      cost: 850,
      limit: 720,
    },
  },
  {
    id: 'sub-003',
    name: 'IronBandwidth 400G Fabric',
    provider: 'IronBandwidth',
    providerLogo: '🔷',
    level: 'pro',
    category: 'Network Fabric',
    modelName: 'IB-400G-Fabric',
    tier: 'enterprise',
    status: 'active',
    pricePerMonth: 4500,
    priceUnit: 'month',
    nextBillingDate: '2026-06-01',
    startDate: '2025-12-01',
    autoRenew: true,
    specs: [
      { label: 'Speed', value: '400 Gbps' },
      { label: 'PoPs', value: 'Global (12 regions)' },
      { label: 'SLA', value: '99.999% uptime' },
    ],
    utilizationRate: 55,
    nextBillingAmount: 4500,
    totalSpend: 27000,
    alerts: [],
    usageThisMonth: {
      hours: 720,
      computeUnits: 99999,
      cost: 4210,
      limit: 99999,
    },
  },
  {
    id: 'sub-004',
    name: 'SterlingStorage NVMe Cluster',
    provider: 'SterlingStorage',
    providerLogo: '🗄️',
    level: 'verified',
    category: 'Storage Array',
    modelName: 'SS-NVMe-500TB',
    tier: 'pro',
    status: 'paused',
    pricePerMonth: 1200,
    priceUnit: 'TB/month',
    nextBillingDate: '2026-05-20',
    startDate: '2026-02-20',
    autoRenew: false,
    specs: [
      { label: 'Storage', value: '500 TB NVMe' },
      { label: 'IOPS', value: '10M random read' },
      { label: 'SLA', value: '99.99% durability' },
    ],
    utilizationRate: 0,
    nextBillingAmount: 0,
    totalSpend: 3600,
    alerts: ['Subscription paused — reactivate to resume'],
    usageThisMonth: {
      hours: 0,
      computeUnits: 0,
      cost: 0,
      limit: 500,
    },
  },
  {
    id: 'sub-005',
    name: 'PrimeCompute EPYC Nodes',
    provider: 'PrimeCompute',
    providerLogo: '🏗️',
    level: 'pro',
    category: 'Compute Node',
    modelName: 'PC-EPYC-768c',
    tier: 'starter',
    status: 'cancelled',
    pricePerMonth: 640,
    priceUnit: 'core/month',
    nextBillingDate: '—',
    startDate: '2026-03-01',
    autoRenew: false,
    specs: [
      { label: 'CPU', value: 'AMD EPYC 9684X' },
      { label: 'Cores', value: '128 cores allocated' },
    ],
    utilizationRate: 0,
    totalSpend: 1280,
    alerts: [],
    usageThisMonth: {
      hours: 0,
      computeUnits: 0,
      cost: 0,
      limit: 128,
    },
  },
]

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-001', date: '2026-05-01', amount: 8370, status: 'paid', items: ['NeuralCore NGC-4090 Pro', 'IronBandwidth 400G Fabric', 'EdgeFlow A6000 Pool'] },
  { id: 'inv-002', date: '2026-04-01', amount: 7890, status: 'paid', items: ['NeuralCore NGC-4090 Pro', 'IronBandwidth 400G Fabric', 'SterlingStorage NVMe'] },
  { id: 'inv-003', date: '2026-03-01', amount: 5620, status: 'paid', items: ['NeuralCore NGC-4090 Pro', 'EdgeFlow A6000 Pool'] },
  { id: 'inv-004', date: '2026-02-01', amount: 2890, status: 'paid', items: ['NeuralCore NGC-4090 Pro'] },
  { id: 'inv-005', date: '2026-06-01', amount: 8390, status: 'pending', items: ['NeuralCore NGC-4090 Pro', 'IronBandwidth 400G Fabric', 'EdgeFlow A6000 Pool'] },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  free: { label: 'Free', color: 'text-white/40 bg-white/5 border-white/10' },
  starter: { label: 'Starter', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  pro: { label: 'Pro', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  enterprise: { label: 'Enterprise', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  paused: { label: 'Paused', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-white/30 bg-white/5 border-white/10' },
  pending: { label: 'Pending', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
}

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  if (limit >= 99999) return <p className="text-xs text-white/40">Unlimited</p>
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-white/40">{label}</span>
        <span className={pct > 90 ? 'text-rose-400' : 'text-white/50'}>{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SubscriptionCard({ sub }: { sub: Subscription }) {
  const [expanded, setExpanded] = useState(false)
  const tierCfg = TIER_CONFIG[sub.tier]
  const statusCfg = STATUS_CONFIG[sub.status]

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.05] transition-colors">
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        <span className="text-2xl shrink-0">{sub.providerLogo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white/90">{sub.name}</h3>
            <span className={`inline-flex items-center rounded-full text-[10px] px-2 py-0.5 border font-medium ${tierCfg.color}`}>{tierCfg.label}</span>
            <span className={`inline-flex items-center rounded-full text-[10px] px-2 py-0.5 border font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{sub.provider} · {sub.modelName}</p>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-sm font-bold text-white/80">${sub.pricePerMonth.toLocaleString()}</p>
          <p className="text-[10px] text-white/40">/{sub.priceUnit}</p>
        </div>
        <div className="text-right shrink-0 hidden md:block">
          <p className="text-xs text-white/50">Next billing</p>
          <p className="text-[11px] text-white/70">{sub.nextBillingDate}</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="shrink-0 text-white/30 hover:text-white/60 transition-colors">
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Alerts */}
      {sub.alerts && sub.alerts.length > 0 && (
        <div className="px-4 pb-2 flex flex-col gap-1">
          {sub.alerts.map(alert => (
            <div key={alert} className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] text-amber-400">{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sub.specs.map(s => (
              <div key={s.label} className="rounded-lg bg-white/[0.03] border border-white/8 p-2.5">
                <p className="text-[10px] text-white/40">{s.label}</p>
                <p className="text-xs text-white/70 font-medium mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Usage */}
          {sub.usageThisMonth && (
            <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 space-y-2">
              <p className="text-[10px] text-white/40 uppercase tracking-wider">This Month&apos;s Usage</p>
              <UsageBar used={sub.usageThisMonth.hours} limit={sub.usageThisMonth.limit} label="Hours Used" />
              {sub.totalSpend !== undefined && (
                <div className="flex justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-white/40">Total Spend</span>
                  <span className="text-white/70 font-medium">${sub.totalSpend.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {sub.status === 'active' && (
              <>
                <button className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-1.5 transition-colors">
                  <Settings className="h-3.5 w-3.5" />Manage
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs text-amber-400 px-3 py-1.5 transition-colors">
                  <Pause className="h-3.5 w-3.5" />Pause
                </button>
              </>
            )}
            {sub.status === 'paused' && (
              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs text-emerald-400 px-3 py-1.5 transition-colors">
                <Play className="h-3.5 w-3.5" />Reactivate
              </button>
            )}
            <button className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-1.5 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />Renew
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs text-rose-400/80 px-3 py-1.5 transition-colors ml-auto">
              <Trash2 className="h-3.5 w-3.5" />Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Invoice Row ────────────────────────────────────────────────────────────────

function InvoiceRow({ inv }: { inv: Invoice }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 hover:bg-white/[0.05] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80">{inv.id}</p>
        <p className="text-[10px] text-white/40">{inv.date} · {inv.items.join(', ')}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white/80">${inv.amount.toLocaleString()}</p>
        <span className={`inline-flex items-center gap-1 text-[10px] ${
          inv.status === 'paid' ? 'text-emerald-400' :
          inv.status === 'pending' ? 'text-amber-400' : 'text-rose-400'
        }`}>
          {inv.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
        </span>
      </div>
      {inv.status === 'pending' && (
        <button className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 font-medium transition-colors">
          Pay Now
        </button>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

type SubTab = 'active' | 'all' | 'invoices'

export function SubscriptionManage() {
  const [tab, setTab] = useState<SubTab>('active')
  const [search, setSearch] = useState('')

  const activeSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'active')
  const pausedSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'paused')
  const totalMonthly = activeSubscriptions.reduce((sum, s) => sum + s.pricePerMonth, 0)
  const totalSpendAll = MOCK_SUBSCRIPTIONS.reduce((sum, s) => sum + (s.totalSpend ?? 0), 0)
  const pendingInvoices = MOCK_INVOICES.filter(i => i.status === 'pending')

  const filtered = MOCK_SUBSCRIPTIONS.filter(sub => {
    if (search) {
      const q = search.toLowerCase()
      return [sub.name, sub.provider, sub.modelName].some(s => s.toLowerCase().includes(q))
    }
    if (tab === 'active') return sub.status === 'active' || sub.status === 'paused'
    return true
  })

  return (
    <div className="space-y-5">
      {/* ── Summary Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
          <p className="text-lg font-bold text-white/90 tabular-nums">{activeSubscriptions.length}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Active Subscriptions</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
          <p className="text-lg font-bold text-emerald-400 tabular-nums">${totalMonthly.toLocaleString()}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Monthly Cost</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
          <p className="text-lg font-bold text-white/90 tabular-nums">${totalSpendAll.toLocaleString()}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Total Spend</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
          <p className="text-lg font-bold text-amber-400 tabular-nums">{pendingInvoices.length}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Pending Invoices</p>
          {pendingInvoices.length > 0 && (
            <p className="text-[10px] text-amber-400 mt-0.5">
              ${pendingInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} due
            </p>
          )}
        </div>
      </div>

      {/* ── Tab Nav ─────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-white/10">
        {([
          { key: 'active' as const, label: 'Active', count: activeSubscriptions.length + pausedSubscriptions.length },
          { key: 'all' as const, label: 'All Subscriptions', count: MOCK_SUBSCRIPTIONS.length },
          { key: 'invoices' as const, label: 'Invoices & Billing', count: pendingInvoices.length },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              'relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors',
              tab === t.key ? 'text-white' : 'text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`inline-flex items-center justify-center rounded-full text-[10px] min-w-[18px] h-4 px-1 ${tab === t.key ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/40'}`}>
                {t.count}
              </span>
            )}
            {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────── */}
      {tab !== 'invoices' && (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/80 placeholder:text-white/30 pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/25 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Subscription list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">No subscriptions found.</div>
            ) : (
              filtered.map(sub => <SubscriptionCard key={sub.id} sub={sub} />)
            )}
          </div>
        </>
      )}

      {tab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">Invoice History</h3>
            <button className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-1.5 transition-colors">
              <Download className="h-3.5 w-3.5" />Export All
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_INVOICES.map(inv => <InvoiceRow key={inv.id} inv={inv} />)}
          </div>

          {/* Billing summary */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-white/80">Billing Summary</h4>
            <div className="space-y-2">
              {([
                { label: 'NeuralCore NGC-4090 Pro', amount: 2890 },
                { label: 'IronBandwidth 400G Fabric', amount: 4500 },
                { label: 'EdgeFlow A6000 Pool', amount: 980 },
              ]).map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-xs">
                  <span className="text-white/50">{item.label}</span>
                  <span className="text-white/70 font-medium">${item.amount.toLocaleString()}/mo</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-white/80">Total</span>
                <span className="text-lg font-bold text-emerald-400">$8,370<span className="text-xs text-white/40 font-normal">/mo</span></span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium py-2.5 transition-colors">
              <CreditCard className="h-4 w-4" />Manage Payment Methods
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
