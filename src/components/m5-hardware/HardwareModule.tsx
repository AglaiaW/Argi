'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  Search, Filter, X, LayoutGrid, List, SlidersHorizontal,
  BookOpen, BarChart3, RefreshCw, Bell
} from 'lucide-react'
import { HardwareLibrary } from './HardwareLibrary'
import { HardwareDetail } from './HardwareDetail'
import { HardwareCompare } from './HardwareCompare'
import { ComputeShop } from './ComputeShop'
import { SubscriptionManage } from './SubscriptionManage'

export type HardwareTab = 'library' | 'detail' | 'compare' | 'shop' | 'subscription'

interface HardwareModuleProps {
  activeTab?: HardwareTab
}

const HARDWARE_TABS = [
  { id: 'library' as const, label: 'Hardware Library', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'shop' as const, label: 'Compute Shop', icon: <Zap className="h-4 w-4" /> },
  { id: 'compare' as const, label: 'Compare', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'subscription' as const, label: 'My Subscriptions', icon: <RefreshCw className="h-4 w-4" /> },
  { id: 'detail' as const, label: 'Device Detail', icon: <Server className="h-4 w-4" /> },
]

const GLOBAL_STATS = [
  { label: 'Active Hardware Nodes', value: '3,847' },
  { label: 'GPU Clusters Online', value: '1,204' },
  { label: 'Total Compute Capacity', value: '9.4 EXA-FLOPS' },
  { label: 'Avg. Uptime SLA', value: '99.97%' },
]

export function HardwareModule({ activeTab = 'library' }: HardwareModuleProps) {
  const [tab, setTab] = useState<HardwareTab>(activeTab)
  const [notifications, setNotifications] = useState(3)

  const activeT = HARDWARE_TABS.find(t => t.id === tab)!

  return (
    <div className="min-h-screen bg-[#010409] text-white" data-testid="hardware-module">
      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-emerald-500/[0.07] rounded-full blur-[140px]" />
          <div className="absolute top-20 right-20 w-[300px] h-[200px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white/90">Hardware Ecosystem</h1>
                <p className="text-xs text-white/40 mt-0.5 max-w-lg">
                  Explore GPU clusters, compute nodes, storage arrays, and network fabrics. Provision on-demand or subscribe for dedicated capacity.
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(0)}
              className="relative shrink-0 flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-2 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border border-[#010409] text-[9px] text-[#010409] font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Global stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {GLOBAL_STATS.map(stat => (
              <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-white/90 tabular-nums">{stat.value}</div>
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
            {HARDWARE_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 border',
                  tab === t.id
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'text-white/40 border-transparent hover:bg-white/5 hover:text-white/70',
                ].join(' ')}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === 'library' && <HardwareLibrary />}
        {tab === 'shop' && <ComputeShop />}
        {tab === 'compare' && <HardwareCompare />}
        {tab === 'subscription' && <SubscriptionManage />}
        {tab === 'detail' && <HardwareDetail />}
      </div>
    </div>
  )
}
