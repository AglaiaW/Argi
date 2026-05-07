'use client'

import { useState } from 'react'
import {
  Cpu, HardDrive, Server, Wifi, Zap, Shield, ChevronRight,
  Search, Filter, X, LayoutGrid, List, Star, MapPin, Clock,
  ArrowUpDown, Eye, CheckCircle2, AlertCircle, TrendingUp, SlidersHorizontal
} from 'lucide-react'
import { SellerLevelBadge } from '../m2-agent-market/SellerLevelBadge'

// ── Types ───────────────────────────────────────────────────────────────────

export type HardwareCategory = 'gpu' | 'cpu' | 'memory' | 'storage' | 'network' | 'full_rack'

export interface HardwareSpec {
  label: string
  value: string
}

export interface HardwareItem {
  id: string
  name: string
  vendor: string
  vendorLogo: string
  level: 'new' | 'verified' | 'pro' | 'elite'
  category: HardwareCategory
  modelName: string
  pricePerUnit: number
  priceUnit: string
  rating: number
  reviews: number
  location: string
  leadTime: string
  specs: HardwareSpec[]
  certifications: string[]
  inStock: boolean
  highlights: string[]
  utilizationRate?: number
  totalUnits?: number
  availableUnits?: number
}

export type SortKey = 'price' | 'rating' | 'reviews' | 'utilization'
export type CardLayout = 'grid' | 'list'

const CATEGORY_LABELS: Record<HardwareCategory, string> = {
  gpu: 'GPU Cluster',
  cpu: 'Compute Node',
  memory: 'Memory Pool',
  storage: 'Storage Array',
  network: 'Network Fabric',
  full_rack: 'Full Rack',
}

const CATEGORY_ICONS: Record<HardwareCategory, React.ReactNode> = {
  gpu: <Zap className="h-3.5 w-3.5" />,
  cpu: <Cpu className="h-3.5 w-3.5" />,
  memory: <HardDrive className="h-3.5 w-3.5" />,
  storage: <Server className="h-3.5 w-3.5" />,
  network: <Wifi className="h-3.5 w-3.5" />,
  full_rack: <Server className="h-3.5 w-3.5" />,
}

const CATEGORY_COLORS: Record<HardwareCategory, string> = {
  gpu: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  cpu: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  memory: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  storage: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  network: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  full_rack: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
}

// ── Rich Mock Data ───────────────────────────────────────────────────────────

export const MOCK_HARDWARE_LIBRARY: HardwareItem[] = [
  {
    id: 'hw-lib-001',
    name: 'NeuralCore NGC-4090-Turbo',
    vendor: 'NeuralCore Systems',
    vendorLogo: '🖥️',
    level: 'elite',
    category: 'gpu',
    modelName: 'NGC-4090-Turbo Cluster',
    pricePerUnit: 4.2,
    priceUnit: 'GPU/hr',
    rating: 4.9,
    reviews: 3421,
    location: 'US-West, EU-Central',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'NVIDIA H100 SXM 80GB HBM3' },
      { label: 'Interconnect', value: 'NVLink 900 GB/s' },
      { label: 'InfiniBand', value: 'NDR 400Gb/s' },
      { label: 'Topology', value: 'Fat-tree, 2-tier' },
      { label: 'OS', value: 'Ubuntu 22.04 LTS, CUDA 12.8' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'FIPS 140-3'],
    inStock: true,
    highlights: ['Bare metal', 'RDMA ready', 'SLA 99.99%', 'Multi-tenant isolation'],
    utilizationRate: 87,
    totalUnits: 2048,
    availableUnits: 267,
  },
  {
    id: 'hw-lib-002',
    name: 'QuantumCompute QC-Rack-128X',
    vendor: 'QuantumCompute',
    vendorLogo: '⚡',
    level: 'pro',
    category: 'full_rack',
    modelName: 'QC-Rack-128X',
    pricePerUnit: 1800,
    priceUnit: 'rack/month',
    rating: 4.7,
    reviews: 891,
    location: 'US-East, Singapore',
    leadTime: '3–5 business days',
    specs: [
      { label: 'Compute', value: '128x NVIDIA H100 GPUs' },
      { label: 'Total VRAM', value: '10.24 TB HBM3' },
      { label: 'Storage', value: '2 PB NVMe RAID 60' },
      { label: 'Network', value: '4x 400GbE uplinks' },
      { label: 'Power', value: '45 kW per rack' },
    ],
    certifications: ['SOC 2', 'ISO 9001'],
    inStock: true,
    highlights: ['Turn-key rack', 'Co-location', 'Custom networking', 'Dedicated VLAN'],
    utilizationRate: 72,
    totalUnits: 64,
    availableUnits: 18,
  },
  {
    id: 'hw-lib-003',
    name: 'EdgeFlow EF-A6000-Pool',
    vendor: 'EdgeFlow AI',
    vendorLogo: '🌊',
    level: 'verified',
    category: 'gpu',
    modelName: 'EF-A6000-Pool',
    pricePerUnit: 1.8,
    priceUnit: 'GPU/hr',
    rating: 4.5,
    reviews: 1203,
    location: 'APAC, US-West',
    leadTime: 'Under 1 hour',
    specs: [
      { label: 'GPU', value: 'NVIDIA A6000 48GB ECC GDDR6X' },
      { label: 'Interconnect', value: 'PCIe 4.0 x16' },
      { label: 'InfiniBand', value: 'HDR 200Gb/s' },
      { label: 'Form Factor', value: '1U / 2U server' },
    ],
    certifications: ['SOC 2 Type I', 'GDPR Compliant'],
    inStock: true,
    highlights: ['Spot friendly', 'Elastic scaling', 'Multi-region failover'],
    utilizationRate: 63,
    totalUnits: 4096,
    availableUnits: 1514,
  },
  {
    id: 'hw-lib-004',
    name: 'CobaltMemory CM-512GB-DDR5',
    vendor: 'CobaltMemory Co.',
    vendorLogo: '💎',
    level: 'new',
    category: 'memory',
    modelName: 'CM-512GB-DDR5-Pool',
    pricePerUnit: 0.35,
    priceUnit: 'GB/hr',
    rating: 4.3,
    reviews: 312,
    location: 'US-Central',
    leadTime: 'Same day',
    specs: [
      { label: 'Module', value: 'DDR5-6400 ECC RDIMM' },
      { label: 'Capacity', value: '512 GB per node' },
      { label: 'Bandwidth', value: '102 GB/s' },
      { label: 'Latency', value: 'CL36-40-40-77' },
    ],
    certifications: ['CE', 'FCC Part 15'],
    inStock: true,
    highlights: ['Hot-swappable', 'NUMA-aware', 'Pay-as-you-go'],
    utilizationRate: 45,
    totalUnits: 8192,
    availableUnits: 4506,
  },
  {
    id: 'hw-lib-005',
    name: 'IronBandwidth IB-400G-Fabric',
    vendor: 'IronBandwidth',
    vendorLogo: '🔷',
    level: 'pro',
    category: 'network',
    modelName: 'IB-400G-Fabric',
    pricePerUnit: 0.12,
    priceUnit: 'GB transferred',
    rating: 4.8,
    reviews: 2104,
    location: 'Global PoPs',
    leadTime: 'Instant provisioning',
    specs: [
      { label: 'Speed', value: '400 Gbps per port' },
      { label: 'Protocol', value: 'InfiniBand NDR' },
      { label: 'Topology', value: 'Fat-tree, 3-tier' },
      { label: 'Availability', value: '99.999% uptime' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'PCI-DSS'],
    inStock: true,
    highlights: ['Global network', 'No egress fees', 'Peering included'],
    utilizationRate: 55,
    totalUnits: 99999,
    availableUnits: 99999,
  },
  {
    id: 'hw-lib-006',
    name: 'SterlingStorage SS-NVMe-1PB',
    vendor: 'SterlingStorage',
    vendorLogo: '🗄️',
    level: 'verified',
    category: 'storage',
    modelName: 'SS-NVMe-1PB-Cluster',
    pricePerUnit: 0.0008,
    priceUnit: 'GB/month',
    rating: 4.6,
    reviews: 678,
    location: 'EU-West, US-West',
    leadTime: '1–2 business days',
    specs: [
      { label: 'Drive Type', value: 'PCIe 5.0 NVMe' },
      { label: 'Raw Capacity', value: '1 PB per cluster' },
      { label: 'Throughput', value: '50 GB/s read' },
      { label: 'IOPS', value: '20M random read' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'HIPAA'],
    inStock: false,
    highlights: ['Object + Block', '99.9999% durability', 'Zero egress'],
    utilizationRate: 91,
    totalUnits: 32,
    availableUnits: 0,
  },
  {
    id: 'hw-lib-007',
    name: 'FluxCore FC-A100-64G-Cluster',
    vendor: 'FluxCore AI',
    vendorLogo: '🔥',
    level: 'elite',
    category: 'gpu',
    modelName: 'FC-A100-64G-Cluster',
    pricePerUnit: 2.9,
    priceUnit: 'GPU/hr',
    rating: 4.8,
    reviews: 1876,
    location: 'US-West, EU-West, APAC',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'NVIDIA A100 64GB SXM4' },
      { label: 'Interconnect', value: 'NVLink 600 GB/s' },
      { label: 'InfiniBand', value: 'NDR 400Gb/s' },
      { label: 'MIG', value: '7 x MIG 10GB partitions' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP Moderate'],
    inStock: true,
    highlights: ['MIG partitioning', 'SRIOV isolation', 'SLA 99.95%'],
    utilizationRate: 79,
    totalUnits: 8192,
    availableUnits: 1720,
  },
  {
    id: 'hw-lib-008',
    name: 'PrimeCompute PC-EPYC-768c',
    vendor: 'PrimeCompute',
    vendorLogo: '🏗️',
    level: 'pro',
    category: 'cpu',
    modelName: 'PC-EPYC-768c-2P',
    pricePerUnit: 0.008,
    priceUnit: 'core/hr',
    rating: 4.6,
    reviews: 945,
    location: 'US-East, EU-Central',
    leadTime: 'Under 2 hours',
    specs: [
      { label: 'CPU', value: 'AMD EPYC 9684X 768 cores' },
      { label: 'Clock', value: '2.6 GHz base / 3.9 GHz boost' },
      { label: 'L3 Cache', value: '1152 MB' },
      { label: 'Memory', value: '2 TB DDR5 ECC' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001'],
    inStock: true,
    highlights: ['SMT optimal', 'AVX-512 enabled', 'HPC workloads'],
    utilizationRate: 68,
    totalUnits: 32768,
    availableUnits: 10486,
  },
  {
    id: 'hw-lib-009',
    name: 'VaultDisk VD-SSD-100TB',
    vendor: 'VaultDisk Systems',
    vendorLogo: '🔐',
    level: 'verified',
    category: 'storage',
    modelName: 'VD-SSD-100TB-NVMe',
    pricePerUnit: 0.0012,
    priceUnit: 'GB/month',
    rating: 4.4,
    reviews: 432,
    location: 'US-East, US-West',
    leadTime: 'Same day',
    specs: [
      { label: 'Drive', value: 'PCIe 5.0 NVMe SSD' },
      { label: 'Capacity', value: '100 TB per unit' },
      { label: 'Read Throughput', value: '28 GB/s' },
      { label: 'DWPD', value: '1 DWPD' },
    ],
    certifications: ['SOC 2 Type I', 'FIPS 140-2'],
    inStock: true,
    highlights: ['Data-at-rest encryption', 'Inline deduplication', 'WORM support'],
    utilizationRate: 82,
    totalUnits: 128,
    availableUnits: 23,
  },
  {
    id: 'hw-lib-010',
    name: 'HyperScale HS-L40S-Cluster',
    vendor: 'HyperScale Networks',
    vendorLogo: '🌐',
    level: 'new',
    category: 'gpu',
    modelName: 'HS-L40S-48G-Pool',
    pricePerUnit: 1.4,
    priceUnit: 'GPU/hr',
    rating: 4.2,
    reviews: 267,
    location: 'APAC-Singapore, APAC-Tokyo',
    leadTime: 'Instant',
    specs: [
      { label: 'GPU', value: 'NVIDIA L40S 48GB GDDR6' },
      { label: 'Interconnect', value: 'PCIe 4.0 x16' },
      { label: 'Ethernet', value: '200GbE' },
      { label: 'FP32 Perf', value: '366 TFLOPS' },
    ],
    certifications: ['SOC 2 Type I'],
    inStock: true,
    highlights: ['Inference optimized', 'vGPU support', 'Cost-effective'],
    utilizationRate: 51,
    totalUnits: 2048,
    availableUnits: 1004,
  },
  {
    id: 'hw-lib-011',
    name: 'NexusMemory NX-HBM-512G',
    vendor: 'NexusMemory Labs',
    vendorLogo: '🧠',
    level: 'pro',
    category: 'memory',
    modelName: 'NX-HBM-512G-Pool',
    pricePerUnit: 0.45,
    priceUnit: 'GB/hr',
    rating: 4.7,
    reviews: 589,
    location: 'US-West, EU-Central',
    leadTime: 'Under 4 hours',
    specs: [
      { label: 'Memory Type', value: 'HBM3 1024 GB/s' },
      { label: 'Capacity', value: '512 GB per node' },
      { label: 'Latency', value: 'CL28 HBM' },
      { label: 'Interface', value: 'AXI-512 bit' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 9001'],
    inStock: true,
    highlights: ['Ultra-low latency', 'AI training ready', 'NUMA-local'],
    utilizationRate: 74,
    totalUnits: 4096,
    availableUnits: 1065,
  },
  {
    id: 'hw-lib-012',
    name: 'CloudRack CR-128xH100-Full',
    vendor: 'CloudRack Systems',
    vendorLogo: '☁️',
    level: 'elite',
    category: 'full_rack',
    modelName: 'CR-128xH100-Full-Rack',
    pricePerUnit: 2200,
    priceUnit: 'rack/month',
    rating: 4.9,
    reviews: 456,
    location: 'US-West-2, EU-West-1',
    leadTime: '5–7 business days',
    specs: [
      { label: 'Compute', value: '128x NVIDIA H100 80GB' },
      { label: 'Total VRAM', value: '10.24 TB HBM3' },
      { label: 'Storage', value: '4 PB NVMe RAID' },
      { label: 'Network', value: '8x 400GbE + IB NDR' },
      { label: 'Power', value: '55 kW, N+1 redundancy' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP High', 'HIPAA', 'PCI-DSS Level 1'],
    inStock: true,
    highlights: ['Dedicated tenant', 'Custom OS images', 'On-site Spares', 'Dedicated network ops'],
    utilizationRate: 95,
    totalUnits: 16,
    availableUnits: 1,
  },
]

// ── Filter/Sort State ─────────────────────────────────────────────────────────

interface FilterState {
  search: string
  categories: Set<HardwareCategory>
  sellerLevel: 'all' | 'new' | 'verified' | 'pro' | 'elite'
  inStockOnly: boolean
  sortKey: SortKey
  layout: CardLayout
}

// ── Sub-components ───────────────────────────────────────────────────────────

function UtilizationBar({ rate }: { rate: number }) {
  const color = rate > 85 ? 'bg-rose-500' : rate > 65 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${rate}%` }} />
      </div>
      <span className="text-[10px] text-slate-900/50 tabular-nums w-8 text-right">{rate}%</span>
    </div>
  )
}

function HardwareCardGrid({ item }: { item: HardwareItem }) {
  const catColor = CATEGORY_COLORS[item.category]
  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 cursor-pointer group space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{item.vendorLogo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900/90">{item.vendor}</h3>
            <SellerLevelBadge level={item.level} size="sm" />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-900/50">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-slate-900/60 ${catColor.split(' ').slice(1).join(' ')}`}>
              {CATEGORY_ICONS[item.category]}
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{item.location}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-base font-bold text-emerald-400">${item.pricePerUnit}</div>
          <div className="text-[10px] text-slate-900/40">{item.priceUnit}</div>
        </div>
      </div>

      {/* Model & availability */}
      <div className="rounded-xl bg-white/[0.04] border border-white/8 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900/80">{item.modelName}</p>
            <p className="text-[10px] text-slate-900/40 mt-0.5">★ {item.rating} · {item.reviews.toLocaleString()} reviews</p>
          </div>
          <div className="text-right">
            <p className={`text-xs font-medium ${item.inStock ? 'text-emerald-400' : 'text-amber-400/80'}`}>
              {item.inStock ? '● In Stock' : '○ Pre-order'}
            </p>
            <p className="text-[10px] text-slate-900/40 flex items-center gap-0.5 justify-end"><Clock className="h-2.5 w-2.5" />{item.leadTime}</p>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-xl bg-white/[0.04] border border-white/8 px-3">
        {item.specs.slice(0, 3).map(s => (
          <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
            <span className="text-[11px] text-slate-900/40">{s.label}</span>
            <span className="text-[11px] text-slate-900/70 font-medium">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Utilization */}
      {item.utilizationRate !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-900/40">Cluster Utilization</span>
            <span className="text-[10px] text-slate-900/50">{item.availableUnits?.toLocaleString()} units avail.</span>
          </div>
          <UtilizationBar rate={item.utilizationRate} />
        </div>
      )}

      {/* Certs & highlights */}
      <div className="flex flex-wrap gap-1.5">
        {item.certifications.slice(0, 2).map(cert => (
          <span key={cert} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
            <Shield className="h-2.5 w-2.5" />{cert}
          </span>
        ))}
        {item.highlights.slice(0, 2).map(h => (
          <span key={h} className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-900/50">{h}</span>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-900/70 font-medium py-2 transition-colors group/btn">
        View Details <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}

function HardwareCardList({ item }: { item: HardwareItem }) {
  const catColor = CATEGORY_COLORS[item.category]
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer flex gap-4 items-center">
      <span className="text-2xl shrink-0">{item.vendorLogo}</span>
      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900/80">{item.vendor}</p>
          <SellerLevelBadge level={item.level} size="sm" showLabel={false} />
        </div>
        <div>
          <p className="text-xs text-slate-900/50">{item.modelName}</p>
          <p className={`inline-flex items-center gap-1 text-[10px] ${catColor.split(' ')[0]}`}>
            {CATEGORY_ICONS[item.category]}{CATEGORY_LABELS[item.category]}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-400">${item.pricePerUnit}</p>
          <p className="text-[10px] text-slate-900/40">{item.priceUnit}</p>
        </div>
        <div>
          <p className={`text-xs font-medium ${item.inStock ? 'text-emerald-400' : 'text-amber-400/80'}`}>{item.inStock ? '● In Stock' : '○ Pre-order'}</p>
          <p className="text-[10px] text-slate-900/40">★ {item.rating} · {item.reviews.toLocaleString()}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-900/30 shrink-0" />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

const ALL_CATEGORIES: HardwareCategory[] = ['gpu', 'cpu', 'memory', 'storage', 'network', 'full_rack']

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Price' },
  { key: 'rating', label: 'Rating' },
  { key: 'reviews', label: 'Most Reviewed' },
  { key: 'utilization', label: 'Utilization' },
]

export function HardwareLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: new Set(),
    sellerLevel: 'all',
    inStockOnly: false,
    sortKey: 'rating',
    layout: 'grid',
  })
  const [showFilters, setShowFilters] = useState(false)

  const toggleCategory = (cat: HardwareCategory) => {
    setFilters(f => {
      const next = new Set(f.categories)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return { ...f, categories: next }
    })
  }

  const filtered = MOCK_HARDWARE_LIBRARY.filter(item => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (![item.name, item.vendor, item.modelName, item.category].some(s => s.toLowerCase().includes(q))) return false
    }
    if (filters.categories.size > 0 && !filters.categories.has(item.category)) return false
    if (filters.sellerLevel !== 'all' && item.level !== filters.sellerLevel) return false
    if (filters.inStockOnly && !item.inStock) return false
    return true
  }).sort((a, b) => {
    if (filters.sortKey === 'price') return a.pricePerUnit - b.pricePerUnit
    if (filters.sortKey === 'rating') return b.rating - a.rating
    if (filters.sortKey === 'reviews') return b.reviews - a.reviews
    if (filters.sortKey === 'utilization') return (b.utilizationRate ?? 0) - (a.utilizationRate ?? 0)
    return 0
  })

  const activeCategoryCount = filters.categories.size

  return (
    <div className="space-y-5">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900/30" />
          <input
            type="text"
            placeholder="Search hardware, vendors, models..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-900/80 placeholder:text-slate-900/30 pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
          />
          {filters.search && (
            <button onClick={() => setFilters(f => ({ ...f, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900/30 hover:text-slate-900/60">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={[
                'inline-flex items-center gap-1 rounded-lg text-[10px] px-2.5 py-1.5 border transition-all',
                filters.categories.has(cat)
                  ? `${CATEGORY_COLORS[cat]} font-medium`
                  : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]',
              ].join(' ')}
            >
              {CATEGORY_ICONS[cat]}{CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(f => !f)}
          className={['flex items-center gap-1.5 rounded-xl text-xs px-3 py-2 border transition-colors',
            showFilters ? 'bg-white/10 border-white/20 text-slate-900/80' : 'bg-white/[0.04] border-white/10 text-slate-900/40 hover:bg-white/[0.08]'].join(' ')}
        >
          <SlidersHorizontal className="h-4 w-4" />Filters
          {activeCategoryCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] min-w-[16px] h-4 px-1">{activeCategoryCount}</span>
          )}
        </button>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-900/30 shrink-0" />
          <select
            value={filters.sortKey}
            onChange={e => setFilters(f => ({ ...f, sortKey: e.target.value as SortKey }))}
            className="rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-900/60 px-2 py-1.5 focus:outline-none focus:border-white/25 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>

        {/* Layout toggle */}
        <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden ml-auto">
          <button onClick={() => setFilters(f => ({ ...f, layout: 'grid' }))} className={['p-2 transition-colors', filters.layout === 'grid' ? 'bg-white/15 text-slate-900/80' : 'text-slate-900/30 hover:text-slate-900/60'].join(' ')}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setFilters(f => ({ ...f, layout: 'list' }))} className={['p-2 transition-colors', filters.layout === 'list' ? 'bg-white/15 text-slate-900/80' : 'text-slate-900/30 hover:text-slate-900/60'].join(' ')}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Expanded Filters Panel ──────────────────────────── */}
      {showFilters && (
        <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 flex flex-wrap items-center gap-6">
          <div className="space-y-2">
            <p className="text-[10px] text-slate-900/40 uppercase tracking-wider font-medium">Seller Level</p>
            <div className="flex items-center gap-1.5">
              {(['all', 'new', 'verified', 'pro', 'elite'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFilters(f => ({ ...f, sellerLevel: level }))}
                  className={['rounded-lg text-[10px] px-2.5 py-1.5 border transition-colors',
                    filters.sellerLevel === level
                      ? 'bg-white/15 border-white/25 text-slate-900/80'
                      : 'bg-white/5 border-white/10 text-slate-900/40 hover:bg-white/10'].join(' ')}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="space-y-2">
            <p className="text-[10px] text-slate-900/40 uppercase tracking-wider font-medium">Availability</p>
            <button
              onClick={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))}
              className={['flex items-center gap-2 rounded-lg text-[10px] px-3 py-1.5 border transition-colors',
                filters.inStockOnly
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-900/40 hover:bg-white/10'].join(' ')}
            >
              {filters.inStockOnly ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              In Stock Only
            </button>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <button onClick={() => setFilters(f => ({ ...f, categories: new Set(), sellerLevel: 'all', inStockOnly: false }))} className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-900/40 hover:bg-white/10 px-3 py-1.5 transition-colors">
            <X className="h-3 w-3" />Reset All
          </button>
        </div>
      )}

      {/* ── Results header ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900/90">Hardware Catalog</h2>
          <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-900/40">
            {filtered.length} results
          </span>
        </div>
        {(filters.categories.size > 0 || filters.sellerLevel !== 'all' || filters.inStockOnly) && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.categories.size > 0 && (
              <span className="text-[10px] text-slate-900/40">{filters.categories.size} category filter(s)</span>
            )}
            {filters.sellerLevel !== 'all' && <SellerLevelBadge level={filters.sellerLevel} size="sm" />}
            <button onClick={() => setFilters(f => ({ ...f, categories: new Set(), sellerLevel: 'all', inStockOnly: false }))} className="text-[10px] text-slate-900/40 hover:text-slate-900/60 flex items-center gap-0.5">
              <X className="h-2.5 w-2.5" />clear
            </button>
          </div>
        )}
      </div>

      {/* ── Grid/List ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-900/30 text-sm">No hardware matches your current filters.</div>
      ) : filters.layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <HardwareCardGrid key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => <HardwareCardList key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
