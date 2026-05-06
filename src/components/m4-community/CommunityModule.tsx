'use client'

import { useState } from 'react'
import {
  Users,
  BookOpen,
  MessageSquare,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Settings,
  TrendingUp,
} from 'lucide-react'
import SectCreate from './SectCreate'
import KnowledgeBase from './KnowledgeBase'
import DiscussionZone from './DiscussionZone'
import EventsSquare from './EventsSquare'
import TalentMarket from './TalentMarket'
import {
  MOCK_KB_ARTICLES,
  MOCK_DISCUSSIONS,
  MOCK_EVENTS,
  MOCK_TALENTS,
} from './mockData'

type Tab = 'knowledge' | 'discussion' | 'events' | 'talent' | 'create'

const TABS: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'knowledge',
    label: '知识库',
    icon: <BookOpen className="h-4 w-4" />,
    description: '平台攻略、行业指南、操作手册 — 让运营效率翻倍',
  },
  {
    id: 'discussion',
    label: '讨论区',
    icon: <MessageSquare className="h-4 w-4" />,
    description: '经验交流、问题解答、案例分享 — 与同行一起成长',
  },
  {
    id: 'events',
    label: '活动广场',
    icon: <Calendar className="h-4 w-4" />,
    description: '线上直播、线下聚会、训练营、行业峰会 — 连接每一次相遇',
  },
  {
    id: 'talent',
    label: '人才市集',
    icon: <Briefcase className="h-4 w-4" />,
    description: '运营人才展示、品牌方需求发布 — 精准匹配高效合作',
  },
  {
    id: 'create',
    label: '发起内容',
    icon: <Users className="h-4 w-4" />,
    description: '发布文章、发起讨论、组织活动、发布需求 — 贡献社区价值',
  },
]

interface CommunityModuleProps {
  articles?: typeof MOCK_KB_ARTICLES
  discussions?: typeof MOCK_DISCUSSIONS
  events?: typeof MOCK_EVENTS
  talents?: typeof MOCK_TALENTS
}

export default function CommunityModule({
  articles = MOCK_KB_ARTICLES,
  discussions = MOCK_DISCUSSIONS,
  events = MOCK_EVENTS,
  talents = MOCK_TALENTS,
}: CommunityModuleProps) {
  const [activeTab, setActiveTab] = useState<Tab>('knowledge')
  const [collapsed, setCollapsed] = useState(false)

  const trendingDiscussions = discussions.filter((d) => d.trending).length
  const upcomingEvents = events.filter((e) => e.status === 'upcoming' || e.status === 'live').length
  const availableTalents = talents.filter((t) => t.availability === 'available').length

  const TAB_COUNTS: Record<Tab, number> = {
    knowledge: articles.length,
    discussion: discussions.length,
    events: upcomingEvents,
    talent: availableTalents,
    create: 0,
  }

  return (
    <div className="flex h-full flex-col gap-0 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)] backdrop-blur-xl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14D1A0]/15">
            <Users className="h-5 w-5 text-[#14D1A0]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: 'monospace' }}>
              M4 · 社区中心
            </h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
              知识 · 交流 · 活动 · 人才
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden items-center gap-4 xl:flex">
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>
                {articles.length}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>文章</p>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
                {trendingDiscussions}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>热议</p>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#2B59C3]" style={{ fontFamily: 'monospace' }}>
                {upcomingEvents}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>活动</p>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="flex items-center gap-1 text-center">
              <TrendingUp className="h-3 w-3 text-[#14D1A0]" />
              <p className="text-sm font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
                {availableTalents}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>可合作</p>
            </div>
          </div>

          <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />

          <button className="flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-[rgba(255,255,255,0.06)] hover:text-white">
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-[rgba(255,255,255,0.06)] px-5 py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-[#14D1A0]/15 text-[#14D1A0]'
                : 'text-slate-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {TAB_COUNTS[tab.id] > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeTab === tab.id
                  ? 'bg-[#14D1A0]/30 text-[#14D1A0]'
                  : 'bg-[rgba(255,255,255,0.08)] text-slate-500'
              }`}>
                {TAB_COUNTS[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden p-5">
          <div className="h-full">
            {activeTab === 'knowledge' && <KnowledgeBase articles={articles} />}
            {activeTab === 'discussion' && <DiscussionZone discussions={discussions} />}
            {activeTab === 'events' && <EventsSquare events={events} />}
            {activeTab === 'talent' && <TalentMarket talents={talents} />}
            {activeTab === 'create' && <SectCreate />}
          </div>
        </div>
      )}

      {/* Tab Description Bar */}
      {!collapsed && (
        <div className="border-t border-[rgba(255,255,255,0.06)] px-5 py-2.5">
          <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
            {TABS.find((t) => t.id === activeTab)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
