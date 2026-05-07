'use client'

import { Server, Shield, Zap, HardDrive, Wifi, Cpu, ChevronRight } from 'lucide-react'
import { SellerLevelBadge } from './SellerLevelBadge'

export type HardwareCategory = 'gpu' | 'cpu' | 'memory' | 'storage' | 'network' | 'full_rack'

export interface HardwareSpec {
  label: string
  value: string
}

export interface HardwareVendor {
  id: string
  name: string
  logo: string
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
}

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

const MOCK_VENDORS: HardwareVendor[] = [
  {
    id: 'hw-001',
    name: 'NeuralCore Systems',
    logo: '🖥️',
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
      { label: 'GPU', value: 'NVIDIA H100 SXM' },
      { label: 'VRAM', value: '80GB HBM3 / GPU' },
      { label: 'Interconnect', value: 'NVLink 900 GB/s' },
      { label: 'InfiniBand', value: 'NDR 400Gb/s' },
    ],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'FIPS 140-3'],
    inStock: true,
    highlights: ['Bare metal', 'RDMA ready', 'SLA 99.99%'],
  },
  {
    id: 'hw-002',
    name: 'QuantumCompute',
    logo: '⚡',
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
      { label: 'Compute', value: '128x H100 GPUs' },
      { label: 'Total VRAM', value: '10.24 TB HBM3' },
      { label: 'Storage', value: '2 PB NVMe RAID' },
      { label: 'Network', value: '4x 400GbE uplinks' },
    ],
    certifications: ['SOC 2', 'ISO 9001'],
    inStock: true,
    highlights: ['Turn-key rack', 'Co-location', 'Custom networking'],
  },
  {
    id: 'hw-003',
    name: 'EdgeFlow AI',
    logo: '🌊',
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
      { label: 'GPU', value: 'NVIDIA A6000' },
      { label: 'VRAM', value: '48GB ECC GDDR6X' },
      { label: 'Interconnect', value: 'PCIe 4.0 x16' },
      { label: 'InfiniBand', value: 'HDR 200Gb/s' },
    ],
    certifications: ['SOC 2 Type I', 'GDPR Compliant'],
    inStock: true,
    highlights: ['Spot friendly', 'Elastic scaling', 'Multi-region'],
  },
  {
    id: 'hw-004',
    name: 'CobaltMemory Co.',
    logo: '💎',
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
      { label: 'Latency', value: 'CL36' },
    ],
    certifications: ['CE', 'FCC Part 15'],
    inStock: true,
    highlights: ['Hot-swappable', 'NUMA-aware', 'Pay-as-you-go'],
  },
  {
    id: 'hw-005',
    name: 'IronBandwidth',
    logo: '🔷',
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
  },
  {
    id: 'hw-006',
    name: 'SterlingStorage',
    logo: '🗄️',
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
  },
]

interface SpecRowProps {
  label: string
  value: string
}

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-[11px] text-slate-900/40">{label}</span>
      <span className="text-[11px] text-slate-900/70 font-medium">{value}</span>
    </div>
  )
}

export interface HardwareVendorCardProps {
  vendor: HardwareVendor
  compact?: boolean
}

export function HardwareVendorCard({ vendor: v, compact = false }: HardwareVendorCardProps) {
  const catIcon = CATEGORY_ICONS[v.category]

  if (compact) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer group flex gap-3 items-start">
        <span className="text-2xl shrink-0">{v.logo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-medium text-slate-900/80 truncate">{v.name}</h3>
            <SellerLevelBadge level={v.level} size="sm" showLabel={false} />
          </div>
          <p className="text-[11px] text-slate-900/40 mt-0.5 truncate">{v.modelName}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-bold text-emerald-400">${v.pricePerUnit}</span>
            <span className="text-[10px] text-slate-900/40">{v.priceUnit}</span>
            {!v.inStock && (
              <span className="text-[10px] text-amber-400/80 bg-amber-500/10 rounded px-1.5 py-0.5">Out of stock</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer group space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{v.logo}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900/90">{v.name}</h3>
            <SellerLevelBadge level={v.level} size="sm" />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-900/50">
            <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 border border-white/10 bg-white/5 text-slate-900/60',].join(' ')}>
              {catIcon}
              {CATEGORY_LABELS[v.category]}
            </span>
            <span>{v.location}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-base font-bold text-emerald-400">${v.pricePerUnit}</div>
          <div className="text-[10px] text-slate-900/40">{v.priceUnit}</div>
        </div>
      </div>

      {/* Model & lead time */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900/80">{v.modelName}</p>
            <p className="text-[10px] text-slate-900/40 mt-0.5">
              ★ {v.rating} · {v.reviews.toLocaleString()} reviews
            </p>
          </div>
          <div className="text-right">
            <p className={['text-xs font-medium', v.inStock ? 'text-emerald-400' : 'text-amber-400/80'].join(' ')}>
              {v.inStock ? '● In Stock' : '○ Pre-order'}
            </p>
            <p className="text-[10px] text-slate-900/40">{v.leadTime}</p>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-xl bg-white/5 border border-white/10 px-3">
        {v.specs.map(s => <SpecRow key={s.label} label={s.label} value={s.value} />)}
      </div>

      {/* Certifications & highlights */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {v.certifications.map(cert => (
            <span key={cert} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
              <Shield className="h-2.5 w-2.5" />
              {cert}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {v.highlights.map(h => (
            <span key={h} className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-900/50">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-900/70 font-medium py-2 transition-colors group/btn">
        Contact Vendor
        <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}

export { MOCK_VENDORS }
