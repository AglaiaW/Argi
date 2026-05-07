'use client'

import { useState } from 'react'
import { Sparkles, ChevronRight, Settings2, Play } from 'lucide-react'
import { SellerLevelBadge } from './SellerLevelBadge'

export interface DigitalHumanConfig {
  id: string
  name: string
  avatar: string
  vendor: string
  vendorLevel: 'new' | 'verified' | 'pro' | 'elite'
  personality: string[]
  voiceId: string
  language: string
  pricePerMinute: number
  rating: number
  reviews: number
  tags: string[]
  description: string
}

const MOCK_HUMANS: DigitalHumanConfig[] = [
  {
    id: 'dh-001',
    name: 'Ava-Prime',
    avatar: '👩‍💼',
    vendor: 'SynthAI Labs',
    vendorLevel: 'elite',
    personality: ['Professional', 'Empathetic', 'Multilingual'],
    voiceId: 'en-US-Neural-Ava',
    language: 'EN / ZH / JA',
    pricePerMinute: 0.08,
    rating: 4.9,
    reviews: 1284,
    tags: ['Finance', 'Healthcare', 'Customer Support'],
    description: 'Ava-Prime excels in high-stakes customer interactions with natural emotional intelligence and sub-200ms response latency.',
  },
  {
    id: 'dh-002',
    name: 'Kai-Assistant',
    avatar: '👨‍🔬',
    vendor: 'NeuralTouch',
    vendorLevel: 'pro',
    personality: ['Analytical', 'Patient', 'Detail-oriented'],
    voiceId: 'en-US-Neural-Kai',
    language: 'EN / ZH',
    pricePerMinute: 0.05,
    rating: 4.7,
    reviews: 892,
    tags: ['Tech Support', 'Education', 'Legal'],
    description: 'Kai delivers precise, context-aware support ideal for technical troubleshooting and educational tutoring scenarios.',
  },
  {
    id: 'dh-003',
    name: 'Luna-Voice',
    avatar: '🧝‍♀️',
    vendor: 'EchoForms',
    vendorLevel: 'verified',
    personality: ['Warm', 'Creative', 'Adaptive'],
    voiceId: 'en-US-Neural-Luna',
    language: 'EN / ES / FR',
    pricePerMinute: 0.04,
    rating: 4.6,
    reviews: 543,
    tags: ['Retail', 'Hospitality', 'Wellness'],
    description: 'Luna brings warmth and creativity to every conversation, perfect for brand-facing digital human deployments.',
  },
  {
    id: 'dh-004',
    name: 'Rex-Business',
    avatar: '🤵',
    vendor: 'CorpBot AI',
    vendorLevel: 'pro',
    personality: ['Authoritative', 'Data-driven', 'Decisive'],
    voiceId: 'en-GB-Neural-Rex',
    language: 'EN / DE / FR',
    pricePerMinute: 0.07,
    rating: 4.8,
    reviews: 2103,
    tags: ['Executive', 'Finance', 'Consulting'],
    description: 'Built for enterprise, Rex-Business delivers boardroom-ready AI presence with executive-level communication skills.',
  },
]

interface PersonalityTagProps { label: string }
function PersonalityTag({ label }: PersonalityTagProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-900/60">
      {label}
    </span>
  )
}

interface ConfigSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}
function ConfigSlider({ label, value, min, max, step = 1, unit = '', onChange }: ConfigSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-900/50">{label}</span>
        <span className="text-emerald-400/80">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-emerald-400"
      />
    </div>
  )
}

export function DigitalHumanBuilder() {
  const [selected, setSelected] = useState<DigitalHumanConfig>(MOCK_HUMANS[0])
  const [warmth, setWarmth] = useState(65)
  const [formality, setFormality] = useState(50)
  const [energy, setEnergy] = useState(60)

  const human = selected

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900/90">Digital Human Builder</h2>
          <p className="text-xs text-slate-900/40 mt-0.5">Configure and deploy AI-powered digital humans</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs text-emerald-400">
          <Sparkles className="h-3 w-3" />
          4 Available
        </span>
      </div>

      {/* Human selector */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {MOCK_HUMANS.map(h => (
          <button
            key={h.id}
            onClick={() => setSelected(h)}
            className={[
              'shrink-0 flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 border',
              h.id === human.id
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
            ].join(' ')}
          >
            <span className="text-3xl">{h.avatar}</span>
            <div className="text-center">
              <p className="text-xs font-medium text-slate-900/80">{h.name}</p>
              <p className="text-[10px] text-slate-900/40">{h.vendor}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected human detail */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <span className="text-4xl">{human.avatar}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-slate-900/90">{human.name}</h3>
              <SellerLevelBadge level={human.vendorLevel} size="sm" />
            </div>
            <p className="text-xs text-slate-900/40 mt-0.5">{human.vendor}</p>
            <p className="text-xs text-slate-900/60 mt-2 leading-relaxed">{human.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-emerald-400">${human.pricePerMinute.toFixed(2)}</div>
            <div className="text-[10px] text-slate-900/40">/ minute</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Rating', value: `★ ${human.rating}` },
            { label: 'Reviews', value: human.reviews.toLocaleString() },
            { label: 'Voice', value: human.voiceId.split('-').pop() },
            { label: 'Languages', value: human.language.split(' / ').length.toString() },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center">
              <div className="text-xs font-semibold text-slate-900/80">{stat.value}</div>
              <div className="text-[10px] text-slate-900/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Personality tags */}
        <div className="flex flex-wrap gap-1.5">
          {human.personality.map(p => <PersonalityTag key={p} label={p} />)}
          {human.tags.map(t => <PersonalityTag key={t} label={t} />)}
        </div>

        {/* Config sliders */}
        <div className="space-y-3 pt-1 border-t border-white/10">
          <p className="text-xs font-medium text-slate-900/60 flex items-center gap-1.5">
            <Settings2 className="h-3 w-3" />
            Behavior Calibration
          </p>
          <ConfigSlider label="Warmth" value={warmth} min={0} max={100} unit="%" onChange={setWarmth} />
          <ConfigSlider label="Formality" value={formality} min={0} max={100} unit="%" onChange={setFormality} />
          <ConfigSlider label="Energy" value={energy} min={0} max={100} unit="%" onChange={setEnergy} />
        </div>

        {/* Action */}
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#010409] font-semibold text-sm py-2.5 transition-colors">
          <Play className="h-4 w-4" />
          Deploy {human.name}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </section>
  )
}
