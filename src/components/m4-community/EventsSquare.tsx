'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Star,
  ChevronRight,
  Radio,
  CheckCircle,
  Ticket,
  ExternalLink,
} from 'lucide-react'
import type { CommunityEvent } from './mockData'

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  webinar: { label: '直播', color: '#6366f1', bg: 'bg-[#6366f1]/15', icon: <Video className="h-3.5 w-3.5" /> },
  workshop: { label: '工作坊', color: '#14D1A0', bg: 'bg-emerald-50', icon: <Users className="h-3.5 w-3.5" /> },
  meetup: { label: '聚会', color: '#f59e0b', bg: 'bg-[#f59e0b]/15', icon: <MapPin className="h-3.5 w-3.5" /> },
  conference: { label: '峰会', color: '#ec4899', bg: 'bg-[#ec4899]/15', icon: <Calendar className="h-3.5 w-3.5" /> },
  hackathon: { label: 'Hackathon', color: '#f97316', bg: 'bg-[#f97316]/15', icon: <Star className="h-3.5 w-3.5" /> },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: '即将开始', color: '#6366f1', bg: 'bg-[#6366f1]/20' },
  live: { label: '正在进行', color: '#ef4444', bg: 'bg-[#ef4444]/20' },
  ended: { label: '已结束', color: '#64748b', bg: 'bg-[#64748b]/20' },
  open: { label: '报名中', color: '#14D1A0', bg: 'bg-[#14D1A0]/20' },
}

interface EventsSquareProps {
  events: CommunityEvent[]
}

export default function EventsSquare({ events }: EventsSquareProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'open'>('all')
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null)

  const filtered = events.filter((e) => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return e.status === 'upcoming'
    if (filter === 'live') return e.status === 'live'
    if (filter === 'open') return e.status === 'open'
    return true
  })

  const upcoming = events.filter((e) => e.status === 'upcoming' || e.status === 'live' || e.status === 'open')
  const featured = events.filter((e) => e.featured)

  if (selectedEvent) {
    const typeCfg = EVENT_TYPE_CONFIG[selectedEvent.type]
    const statusCfg = STATUS_CONFIG[selectedEvent.status]
    const isEnded = selectedEvent.status === 'ended'
    const isLive = selectedEvent.status === 'live'
    const spotsLeft = selectedEvent.maxAttendees ? selectedEvent.maxAttendees - selectedEvent.attendees : null

    return (
      <div className="flex h-full flex-col gap-5">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-slate-900"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeCfg.bg}`} style={{ color: typeCfg.color, fontFamily: 'monospace' }}>
              {typeCfg.icon}
              {typeCfg.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCfg.bg}`} style={{ color: statusCfg.color, fontFamily: 'monospace' }}>
              {isLive && <Radio className="mr-1 h-2.5 w-2.5 animate-pulse" />}
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Event detail */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-start gap-2 mb-2">
            {selectedEvent.featured && (
              <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-400" style={{ fontFamily: 'monospace' }}>
                <Star className="h-3 w-3" />
                精选活动
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-tight" style={{ fontFamily: 'monospace' }}>
            {selectedEvent.title}
          </h2>

          {/* Meta info */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>{selectedEvent.date}</p>
                <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>{selectedEvent.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>{selectedEvent.duration}</p>
                <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>活动时长</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3">
              <Users className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>
                  {selectedEvent.maxAttendees ? `${selectedEvent.attendees}/${selectedEvent.maxAttendees}` : selectedEvent.attendees}
                </p>
                <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>报名人数</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>{selectedEvent.platform}</p>
                <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>活动形式</p>
              </div>
            </div>
          </div>

          {/* Host */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3">
            <img src={selectedEvent.hostAvatar} alt={selectedEvent.host} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>{selectedEvent.host}</p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>活动主讲/主办</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <p className="text-sm leading-relaxed text-slate-700" style={{ fontFamily: 'monospace' }}>
              {selectedEvent.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedEvent.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[rgba(255,255,255,0.1)] bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400" style={{ fontFamily: 'monospace' }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-5">
            <div>
              {spotsLeft !== null && spotsLeft > 0 && (
                <p className="text-xs text-emerald-600" style={{ fontFamily: 'monospace' }}>
                  仅剩 {spotsLeft} 个名额
                </p>
              )}
              {isEnded && (
                <p className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                  查看回放
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {isEnded ? (
                <button onClick={() => alert('即将跳转到回放页面（需接入路由）')} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900">
                  <ExternalLink className="h-4 w-4" />
                  查看回放
                </button>
              ) : isLive ? (
                <button onClick={() => alert('即将加入直播（需接入直播SDK）')} className="flex items-center gap-2 rounded-xl bg-[#ef4440] px-5 py-2.5 text-sm font-bold text-white">
                  <Radio className="h-4 w-4 animate-pulse" />
                  立即加入
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert(`报名成功！您已报名参加「${selectedEvent.title}」（需接入报名API）`)
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#14D1A0] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#14D1A0]/90"
                >
                  <Ticket className="h-4 w-4" />
                  立即报名
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
          <p className="text-xl font-bold text-slate-900 tabular-nums" style={{ fontFamily: 'monospace' }}>
            {upcoming.length}
          </p>
          <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>近期活动</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
          <p className="text-xl font-bold text-emerald-600 tabular-nums" style={{ fontFamily: 'monospace' }}>
            {featured.length}
          </p>
          <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>精选活动</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
          <p className="text-xl font-bold text-blue-600 tabular-nums" style={{ fontFamily: 'monospace' }}>
            {events.filter((e) => e.status === 'live').length}
          </p>
          <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>正在进行</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, label: '全部' },
          { id: 'upcoming' as const, label: '即将开始' },
          { id: 'live' as const, label: '正在进行' },
          { id: 'open' as const, label: '报名中' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition ${
              filter === f.id
                ? 'bg-[#14D1A0]/20 text-emerald-600'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {filtered.map((event) => {
            const typeCfg = EVENT_TYPE_CONFIG[event.type]
            const statusCfg = STATUS_CONFIG[event.status]
            const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees : null

            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-slate-100 p-4 transition hover:border-[rgba(255,255,255,0.12)] hover:bg-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {event.featured && <Star className="h-3 w-3 shrink-0 text-amber-400" />}
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeCfg.bg}`} style={{ color: typeCfg.color, fontFamily: 'monospace' }}>
                        {typeCfg.icon}
                        {typeCfg.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCfg.bg}`} style={{ color: statusCfg.color, fontFamily: 'monospace' }}>
                        {event.status === 'live' && <Radio className="mr-0.5 h-2 w-2 animate-pulse" />}
                        {statusCfg.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 leading-snug" style={{ fontFamily: 'monospace' }}>
                      {event.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                        <Users className="h-3 w-3" />
                        {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </div>
                {spotsLeft !== null && spotsLeft <= 10 && (
                  <div className="mt-2">
                    <span className="text-[10px] text-[#ef4444]" style={{ fontFamily: 'monospace' }}>
                      仅剩 {spotsLeft} 名额
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Calendar className="h-12 w-12 text-slate-700" />
            <p className="mt-3 text-sm text-slate-500" style={{ fontFamily: 'monospace' }}>
              暂无相关活动
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
