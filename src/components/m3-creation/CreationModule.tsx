'use client'

import { useState } from 'react'
import {
  FileText,
  Gift,
  RefreshCw,
  Rocket,
  ChevronDown,
  ChevronUp,
  Wand2,
  Settings,
} from 'lucide-react'
import ContentEditor from './ContentEditor'
import ValuePackaging from './ValuePackaging'
import PlatformSync from './PlatformSync'
import OneClickPublish from './OneClickPublish'
import {
  MOCK_DRAFTS,
  MOCK_VALUE_PACKS,
  MOCK_PLATFORMS,
  MOCK_SCHEDULED,
  MOCK_PUBLISH_HISTORY,
} from './mockData'

type Tab = 'content' | 'value' | 'platform' | 'publish'

const TABS: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'content',
    label: '内容编辑',
    icon: <FileText className="h-4 w-4" />,
    description: '管理文章、社交媒体、邮件等各类内容创作',
  },
  {
    id: 'value',
    label: '价值包装',
    icon: <Gift className="h-4 w-4" />,
    description: '配置课程、模板、服务等数字产品包',
  },
  {
    id: 'platform',
    label: '平台同步',
    icon: <RefreshCw className="h-4 w-4" />,
    description: '连接和管理多平台账号，一键同步发布',
  },
  {
    id: 'publish',
    label: '一键发布',
    icon: <Rocket className="h-4 w-4" />,
    description: '快速将内容分发至所有已连接平台',
  },
]

interface CreationModuleProps {
  drafts?: typeof MOCK_DRAFTS
  valuePacks?: typeof MOCK_VALUE_PACKS
  platforms?: typeof MOCK_PLATFORMS
  scheduled?: typeof MOCK_SCHEDULED
  publishHistory?: typeof MOCK_PUBLISH_HISTORY
}

export default function CreationModule({
  drafts = MOCK_DRAFTS,
  valuePacks = MOCK_VALUE_PACKS,
  platforms = MOCK_PLATFORMS,
  scheduled = MOCK_SCHEDULED,
  publishHistory = MOCK_PUBLISH_HISTORY,
}: CreationModuleProps) {
  const [activeTab, setActiveTab] = useState<Tab>('content')
  const [collapsed, setCollapsed] = useState(false)

  const draftCount = drafts.filter((d) => d.status === 'draft').length
  const packCount = valuePacks.length
  const connectedCount = platforms.filter((p) => p.status === 'connected').length
  const pendingCount = scheduled.filter((s) => s.status === 'scheduled').length

  const TAB_COUNTS: Record<Tab, number> = {
    content: draftCount,
    value: packCount,
    platform: connectedCount,
    publish: pendingCount,
  }

  return (
    <div className="flex h-full flex-col gap-0 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)] backdrop-blur-xl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14D1A0]/15">
            <Wand2 className="h-5 w-5 text-[#14D1A0]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: 'monospace' }}>
              M3 · 创作中心
            </h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
              内容创作 · 价值包装 · 平台分发
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden items-center gap-4 xl:flex">
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>
                {draftCount}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>草稿</p>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
                {packCount}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>产品包</p>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#2B59C3]" style={{ fontFamily: 'monospace' }}>
                {connectedCount}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>已连接</p>
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
            {activeTab === 'content' && (
              <ContentEditor drafts={drafts} />
            )}
            {activeTab === 'value' && (
              <ValuePackaging packs={valuePacks} />
            )}
            {activeTab === 'platform' && (
              <PlatformSync platforms={platforms} scheduled={scheduled} />
            )}
            {activeTab === 'publish' && (
              <OneClickPublish
                history={publishHistory}
                platforms={platforms}
                scheduled={scheduled}
              />
            )}
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
