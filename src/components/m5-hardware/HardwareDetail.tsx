'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  Star, MapPin, Clock, CheckCircle2, ArrowLeft, Download,
  ExternalLink, Share2, Heart, Eye, AlertTriangle, Copy,
  Activity, Gauge, Thermometer, Database, Network
} from 'lucide-react'
import { SellerLevelBadge } from '../m2-agent-market/SellerLevelBadge'
import { MOCK_HARDWARE_LIBRARY } from './HardwareLibrary'

// ── Hardware Detail Types ────────────────────────────────────────────────────

export interface HardwareMetric {
  label: string
  value: string
  unit?: string
  icon: React.ReactNode
  color: string
}

export interface HardwareEvent {
  id: string
  type: 'info' | 'warning' | 'maintenance' | 'alert'
  message: string
  timestamp: string
}

export interface HardwareAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SELECTED_HARDWARE = MOCK_HARDWARE_LIBRARY[0] // NeuralCore NGC-4090-Turbo

const MOCK_METRICS: HardwareMetric[] = [
  { label: 'GPU Utilization', value: '87', unit: '%', icon: <Gauge className="h-4 w-4" />, color: 'text-emerald-400' },
  { label: 'Memory Used', value: '11.2', unit: 'TB / 16 TB', icon: <Database className="h-4 w-4" />, color: 'text-cyan-400' },
  { label: 'Network In', value: '412', unit: 'GB/s', icon: <Network className="h-4 w-4" />, color: 'text-blue-400' },
  { label: 'Network Out', value: '389', unit: 'GB/s', icon: <Network className="h-4 w-4" />, color: 'text-violet-400' },
  { label: 'Temp Avg', value: '68', unit: '°C', icon: <Thermometer className="h-4 w-4" />, color: 'text-amber-400' },
  { label: 'Power Draw', value: '38.4', unit: 'kW', icon: <Zap className="h-4 w-4" />, color: 'text-rose-400' },
  { label: 'IOPS', value: '18.4', unit: 'M /s', icon: <Activity className="h-4 w-4" />, color: 'text-teal-400' },
  { label: 'Pkt Rate', value: '2.1', unit: 'B/s', icon: <Cpu className="h-4 w-4" />, color: 'text-indigo-400' },
]

const MOCK_ALERTS: HardwareAlert[] = [
  { id: 'a1', severity: 'critical', message: 'GPU #47 temperature exceeding 85°C threshold — throttling active', timestamp: '2026-05-06 09:41 UTC', acknowledged: false },
  { id: 'a2', severity: 'high', message: 'Memory pool B utilization at 94% — consider scaling', timestamp: '2026-05-06 08:15 UTC', acknowledged: false },
  { id: 'a3', severity: 'medium', message: 'Scheduled maintenance window: 2026-05-08 02:00–04:00 UTC', timestamp: '2026-05-05 22:00 UTC', acknowledged: true },
  { id: 'a4', severity: 'low', message: 'Firmware update available for InfiniBand switches (v4.12.3)', timestamp: '2026-05-05 14:30 UTC', acknowledged: true },
]

const MOCK_EVENTS: HardwareEvent[] = [
  { id: 'e1', type: 'info', message: 'Node provisioned successfully via API call', timestamp: '2026-05-06 10:12 UTC' },
  { id: 'e2', type: 'warning', message: 'GPU #31 ECC correctable error — logged, monitoring', timestamp: '2026-05-06 07:58 UTC' },
  { id: 'e3', type: 'maintenance', message: 'Network fabric switch SW-04 restarted (rolling upgrade)', timestamp: '2026-05-06 03:00 UTC' },
  { id: 'e4', type: 'info', message: 'New GPU MIG partition created: 7x10GB instances', timestamp: '2026-05-05 18:44 UTC' },
  { id: 'e5', type: 'alert', message: 'Spine switch SP-02 redundancy lost — failover active', timestamp: '2026-05-05 12:33 UTC' },
]

const GPU_SOCKETS = [
  { id: 'GPU-0', status: 'active' as const, temp: 71, power: 420, util: 92 },
  { id: 'GPU-1', status: 'active' as const, temp: 69, power: 398, util: 88 },
  { id: 'GPU-2', status: 'active' as const, temp: 73, power: 441, util: 95 },
  { id: 'GPU-3', status: 'idle' as const, temp: 44, power: 85, util: 2 },
  { id: 'GPU-4', status: 'active' as const, temp: 68, power: 412, util: 90 },
  { id: 'GPU-5', status: 'throttling' as const, temp: 86, power: 380, util: 78 },
  { id: 'GPU-6', status: 'active' as const, temp: 72, power: 435, util: 91 },
  { id: 'GPU-7', status: 'active' as const, temp: 70, power: 405, util: 87 },
]

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  idle: { label: 'Idle', color: 'text-white/40 bg-white/5 border-white/10' },
  throttling: { label: 'Throttling', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  offline: { label: 'Offline', color: 'text-white/30 bg-white/5 border-white/5' },
}

const ALERT_SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  high: { label: 'HIGH', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  medium: { label: 'MEDIUM', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  low: { label: 'LOW', color: 'text-white/40 bg-white/5 border-white/10' },
}

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({ m }: { m: HardwareMetric }) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className={m.color}>{m.icon}</span>
        <span className="text-[10px] text-white/40">{m.label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white/90 tabular-nums">{m.value}</span>
        <span className="text-[10px] text-white/40">{m.unit}</span>
      </div>
    </div>
  )
}

// ── GPU Socket Row ─────────────────────────────────────────────────────────────

function GPUSocketRow({ socket }: { socket: typeof GPU_SOCKETS[0] }) {
  const cfg = STATUS_CONFIG[socket.status]
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/8 px-3 py-2">
      <span className="text-[11px] font-mono text-white/60 w-12">{socket.id}</span>
      <span className={`inline-flex items-center rounded-full text-[10px] px-2 py-0.5 border font-medium ${cfg.color}`}>{cfg.label}</span>
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right">
          <p className="text-[10px] text-white/40">Temp</p>
          <p className={`text-xs font-medium tabular-nums ${socket.temp > 80 ? 'text-rose-400' : 'text-white/70'}`}>{socket.temp}°C</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40">Power</p>
          <p className="text-xs font-medium tabular-nums text-white/70">{socket.power}W</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40">Util</p>
          <p className="text-xs font-medium tabular-nums text-white/70">{socket.util}%</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function HardwareDetail() {
  const hw = SELECTED_HARDWARE
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'alerts' | 'events'>('overview')
  const [copied, setCopied] = useState(false)
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set())

  const unackCount = MOCK_ALERTS.filter(a => !a.acknowledged && !acknowledgedAlerts.has(a.id)).length

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, id]))
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(hw.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="space-y-5">
      {/* ── Breadcrumb / Header ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <button className="inline-flex items-center gap-1 hover:text-white/70 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />Back to Library
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>{hw.vendor}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/60">{hw.modelName}</span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{hw.vendorLogo}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white/90">{hw.modelName}</h2>
                <SellerLevelBadge level={hw.level} size="md" />
              </div>
              <p className="text-xs text-white/40 mt-0.5">{hw.vendor} · {hw.location}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-white/50"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{hw.rating} ({hw.reviews.toLocaleString()} reviews)</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-white/50"><Clock className="h-3 w-3" />{hw.leadTime}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${hw.inStock ? 'text-emerald-400' : 'text-amber-400/80'}`}>
                  {hw.inStock ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {hw.inStock ? 'In Stock' : 'Pre-order'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-2 transition-colors">
              <Eye className="h-4 w-4" />Watch
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-2 transition-colors">
              <Share2 className="h-4 w-4" />Share
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 px-3 py-2 transition-colors">
              <Heart className="h-4 w-4" />Save
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2 font-medium transition-colors">
              Provision Now
            </button>
          </div>
        </div>

        {/* ID & quick actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1">
            <span className="text-[10px] text-white/40 font-mono">{hw.id}</span>
            <button onClick={handleCopyId} className="text-white/30 hover:text-white/60 transition-colors">
              {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          {hw.certifications.map(cert => (
            <span key={cert} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
              <Shield className="h-2.5 w-2.5" />{cert}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tab Nav ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-white/10">
        {(['overview', 'metrics', 'alerts', 'events'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={[
              'relative px-4 py-2.5 text-xs font-medium capitalize transition-colors',
              activeTab === t ? 'text-white' : 'text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            {t === 'alerts' && unackCount > 0 ? `${t} (${unackCount})` : t}
            {activeTab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Specs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/80">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hw.specs.map(s => (
                  <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/40">{s.label}</span>
                    <span className="text-xs text-white/70 font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/80">GPU Socket Status</h3>
              <div className="space-y-2">
                {GPU_SOCKETS.map(s => <GPUSocketRow key={s.id} socket={s} />)}
              </div>
            </div>
          </div>

          {/* Right: Quick metrics + highlights */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {MOCK_METRICS.slice(0, 4).map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Highlights</h3>
              <div className="space-y-1.5">
                {hw.highlights.map(h => (
                  <div key={h} className="flex items-center gap-2 text-xs text-white/60">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />{h}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Capacity</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Total Units</span>
                  <span className="text-white/70 font-medium tabular-nums">{hw.totalUnits?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Available</span>
                  <span className="text-emerald-400 font-medium tabular-nums">{hw.availableUnits?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Utilization</span>
                  <span className="text-white/70 font-medium tabular-nums">{hw.utilizationRate}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hw.utilizationRate}%` }} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Pricing</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-400">${hw.pricePerUnit}</span>
                <span className="text-xs text-white/40">/{hw.priceUnit}</span>
              </div>
              <button className="w-full rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium py-2.5 transition-colors">
                Start Provisioning
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOCK_METRICS.map(m => <MetricCard key={m.label} m={m} />)}
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Live Metrics Stream</h3>
            <div className="space-y-2 font-mono text-[10px] text-white/40">
              <p>[10:48:01 UTC] metrics_stream: gpu_util_avg=87.3% mem_used=11.24TB net_in=412.7GB/s</p>
              <p>[10:47:59 UTC] alert: gpu_temp GPU-5 exceeds 85C threshold (86.2C) — throttling engaged</p>
              <p>[10:47:55 UTC] metrics_stream: power_draw=38.4kW temp_avg=68.2C iops=18.4M/s</p>
              <p>[10:47:50 UTC] health_check: all NVMe drives nominal (32/32 healthy)</p>
              <p>[10:47:45 UTC] metrics_stream: net_out=389.1GB/s pkt_rate=2.14B/s</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">Active Alerts</h3>
            <span className="text-xs text-white/40">{unackCount} unacknowledged</span>
          </div>
          {MOCK_ALERTS.map(alert => {
            const cfg = ALERT_SEVERITY_CONFIG[alert.severity]
            const isAcked = acknowledgedAlerts.has(alert.id) || alert.acknowledged
            return (
              <div key={alert.id} className={['rounded-xl border p-4 flex items-start gap-3', isAcked ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/[0.03] border-white/10']}>
                <span className={`inline-flex items-center rounded-full text-[10px] px-2 py-0.5 border font-medium shrink-0 mt-0.5 ${cfg.color}`}>{cfg.label}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isAcked ? 'text-white/50 line-through' : 'text-white/70'}`}>{alert.message}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 font-mono">{alert.timestamp}</p>
                </div>
                {!isAcked && (
                  <button onClick={() => handleAcknowledge(alert.id)} className="shrink-0 text-[10px] text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 transition-colors">
                    Ack
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white/80 mb-3">Event Log</h3>
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2">
              <div className={[
                'w-1.5 h-1.5 rounded-full mt-1 shrink-0',
                event.type === 'info' ? 'bg-blue-400' :
                event.type === 'warning' ? 'bg-amber-400' :
                event.type === 'maintenance' ? 'bg-violet-400' : 'bg-rose-400',
              ].join(' ')} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60">{event.message}</p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
