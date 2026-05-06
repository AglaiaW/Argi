'use client'

import { BarChart2, ArrowUpRight } from 'lucide-react'
import { SellerLevelBadge } from './SellerLevelBadge'

export type CaseCategory = 'finance' | 'healthcare' | 'retail' | 'education' | 'manufacturing' | 'media'

export interface IndustryCase {
  id: string
  title: string
  company: string
  sellerLevel: 'new' | 'verified' | 'pro' | 'elite'
  category: CaseCategory
  summary: string
  metrics: {
    label: string
    value: string
    delta?: string
    positive?: boolean
  }[]
  tags: string[]
  agentType: string
  deployedAt: string
}

const CATEGORY_LABELS: Record<CaseCategory, string> = {
  finance: 'Finance',
  healthcare: 'Healthcare',
  retail: 'Retail',
  education: 'Education',
  manufacturing: 'Manufacturing',
  media: 'Media & Content',
}

const CATEGORY_COLORS: Record<CaseCategory, string> = {
  finance: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  healthcare: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  retail: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  education: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
  manufacturing: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  media: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
}

const MOCK_CASES: IndustryCase[] = [
  {
    id: 'case-001',
    title: 'AI-Powered Loan Underwriting Agent',
    company: 'Meridian Capital',
    sellerLevel: 'elite',
    category: 'finance',
    summary: 'Deployed a multi-agent pipeline that reduced loan approval time from 5 days to 4 hours, handling document extraction, risk scoring, and compliance checks autonomously.',
    metrics: [
      { label: 'Approval Time', value: '4 hrs', delta: '-92%', positive: true },
      { label: 'Volume/Day', value: '1,200', delta: '+3.4x', positive: true },
      { label: 'Default Rate', value: '1.8%', delta: '-0.4pp', positive: true },
      { label: 'Cost/Loan', value: '$18', delta: '-67%', positive: true },
    ],
    tags: ['Loan Processing', 'Risk Assessment', 'KYC/AML'],
    agentType: 'Finance Agent v3.2',
    deployedAt: '2025-11-03',
  },
  {
    id: 'case-002',
    title: 'Autonomous Patient Intake Coordinator',
    company: 'NovaHealth Systems',
    sellerLevel: 'pro',
    category: 'healthcare',
    summary: 'Digital human intake agent handles 85% of patient routing without staff intervention, using natural language symptom analysis and insurance verification in real time.',
    metrics: [
      { label: 'Routing Accuracy', value: '96.3%', delta: '+4.1%', positive: true },
      { label: 'Avg Wait Time', value: '1.2 min', delta: '-78%', positive: true },
      { label: 'Staff Hours Saved', value: '320/wk', delta: '+AI Scale', positive: true },
      { label: 'Patient CSAT', value: '4.7/5', delta: '+0.6', positive: true },
    ],
    tags: ['Triage', 'Insurance Check', 'Scheduling'],
    agentType: 'Healthcare Agent v2.8',
    deployedAt: '2025-10-18',
  },
  {
    id: 'case-003',
    title: 'Live-Commerce AI Shopping Guide',
    company: 'LuxeMart Asia',
    sellerLevel: 'elite',
    category: 'retail',
    summary: 'Real-time product recommendation engine powered by multi-modal agents analyzing viewer demographics and live chat sentiment to drive conversion during streaming sales events.',
    metrics: [
      { label: 'Conversion Rate', value: '12.8%', delta: '+210%', positive: true },
      { label: 'GMV/Event', value: '$2.4M', delta: '+3.1x', positive: true },
      { label: 'AOV Lift', value: '+34%', delta: 'vs. control', positive: true },
      { label: 'Engagement', value: '8.3 min', delta: '+2x', positive: true },
    ],
    tags: ['Live Commerce', 'Recommendations', 'Sentiment AI'],
    agentType: 'Retail Agent v4.1',
    deployedAt: '2025-12-01',
  },
  {
    id: 'case-004',
    title: 'Adaptive Learning Path Orchestrator',
    company: 'EduNexus',
    sellerLevel: 'pro',
    category: 'education',
    summary: 'Multi-agent system that generates personalized curricula based on learner performance, adjusts difficulty dynamically, and flags at-risk students for human tutors.',
    metrics: [
      { label: 'Completion Rate', value: '89%', delta: '+22pp', positive: true },
      { label: 'Learning Gain', value: '+0.8σ', delta: 'vs. baseline', positive: true },
      { label: 'Tutor Efficiency', value: '1:40', delta: '+4x capacity', positive: true },
      { label: 'Student Rating', value: '4.6/5', delta: '+0.4', positive: true },
    ],
    tags: ['LMS', 'Adaptive Learning', 'Analytics'],
    agentType: 'Edu Agent v2.5',
    deployedAt: '2025-09-15',
  },
  {
    id: 'case-005',
    title: 'Predictive Maintenance Agent Swarm',
    company: 'Titanium Works',
    sellerLevel: 'verified',
    category: 'manufacturing',
    summary: 'Fleet of sensor-reading agents monitors 2,000+ PLC endpoints, predicts equipment failures 72 hours in advance, and auto-schedules maintenance windows without human dispatch.',
    metrics: [
      { label: 'Uptime', value: '99.2%', delta: '+1.8pp', positive: true },
      { label: 'Unplanned Downtime', value: '-61%', delta: 'YoY', positive: true },
      { label: 'Parts Inventory', value: '-28%', delta: 'reduction', positive: true },
      { label: 'MTTR', value: '2.4 hrs', delta: '-44%', positive: true },
    ],
    tags: ['IoT', 'Predictive', 'SCADA Integration'],
    agentType: 'Industrial Agent v1.9',
    deployedAt: '2025-08-22',
  },
  {
    id: 'case-006',
    title: 'AI Newsroom Content Agent',
    company: 'BroadScript Media',
    sellerLevel: 'new',
    category: 'media',
    summary: 'Automated story generation pipeline monitors 40+ sources, writes first-draft articles in sub-90 seconds, and routes copy through human editors with AI quality scoring.',
    metrics: [
      { label: 'Articles/Day', value: '380', delta: '+12x', positive: true },
      { label: 'Publishing Speed', value: '90s', delta: 'draft time', positive: true },
      { label: 'Reader CTR', value: '6.2%', delta: '+0.9pp', positive: true },
      { label: 'SEO Score', value: '94/100', delta: '+8pts', positive: true },
    ],
    tags: ['Automated Writing', 'SEO', 'Multi-source'],
    agentType: 'Media Agent v1.4',
    deployedAt: '2026-01-10',
  },
]

interface MetricPillProps {
  label: string
  value: string
  delta?: string
  positive?: boolean
}

function MetricPill({ label, value, delta, positive }: MetricPillProps) {
  return (
    <div className="flex flex-col rounded-xl bg-white/5 border border-white/10 p-2.5 min-w-[90px]">
      <div className="text-sm font-bold text-white/90">{value}</div>
      <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
      {delta && (
        <div className={[
          'text-[10px] font-medium mt-1 flex items-center gap-0.5',
          positive ? 'text-emerald-400' : 'text-rose-400',
        ].join(' ')}>
          <ArrowUpRight className="h-2.5 w-2.5" />
          {delta}
        </div>
      )}
    </div>
  )
}

export interface IndustryCaseCardProps {
  caseData: IndustryCase
  compact?: boolean
}

export function IndustryCaseCard({ caseData: c, compact = false }: IndustryCaseCardProps) {
  const catColor = CATEGORY_COLORS[c.category]

  if (compact) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-white/90 truncate">{c.title}</h3>
              <SellerLevelBadge level={c.sellerLevel} size="sm" showLabel={false} />
            </div>
            <p className="text-xs text-white/40 mt-0.5">{c.company}</p>
          </div>
          <span className={['shrink-0 rounded-full border text-[10px] font-medium px-2 py-0.5', catColor].join(' ')}>
            {CATEGORY_LABELS[c.category]}
          </span>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {c.metrics.slice(0, 2).map(m => (
            <div key={m.label} className="rounded-lg bg-white/5 px-2 py-1.5">
              <div className="text-xs font-semibold text-white/80">{m.value}</div>
              <div className="text-[10px] text-white/40">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer group space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={['rounded-full border text-[10px] font-medium px-2 py-0.5', catColor].join(' ')}>
              {CATEGORY_LABELS[c.category]}
            </span>
            <SellerLevelBadge level={c.sellerLevel} size="sm" />
          </div>
          <h3 className="text-sm font-semibold text-white/90 leading-snug">{c.title}</h3>
          <p className="text-xs text-white/40 mt-0.5">{c.company} · {c.agentType}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-white/30">Deployed</div>
          <div className="text-xs text-white/50">{c.deployedAt}</div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-white/60 leading-relaxed line-clamp-2">{c.summary}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {c.metrics.map(m => <MetricPill key={m.label} {...m} />)}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {c.tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
            <BarChart2 className="h-2.5 w-2.5 text-white/30" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export { MOCK_CASES }
