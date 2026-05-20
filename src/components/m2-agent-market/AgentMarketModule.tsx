'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import * as React from 'react'
import {
  Store, Search, X, Star, Zap, Eye, Heart, TrendingUp,
  ShoppingCart, Play, ArrowRight, Coins, Cpu,
  Filter, Image, Video, FileText, Bot, Server,
  ChevronRight, CheckCircle2, ExternalLink, MessageSquare
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'
import { HardwareVendorCard, MOCK_VENDORS } from './HardwareVendorCard'

// ─── Theme types ─────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark'

// ─── Tag filter type ─────────────────────────────────────────────────────────
type TagFilter = '全部' | '数字人' | '图像' | '视频' | '文案' | '算力'

const TAGS: TagFilter[] = ['全部', '数字人', '图像', '视频', '文案', '算力']

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Tool {
  id: string
  name: string
  description: string
  category: TagFilter
  thumbnail: string
  price: number
  originalPrice: number
  rating: number
  sales: number
  tags: string[]
  isHot: boolean
  isNew: boolean
  vendor: string
  features: string[]
}

interface Case {
  id: string
  title: string
  industry: string
  scenario: TagFilter
  thumbnail: string
  company: string
  effect: string
  product: string
  views: string
  likes: number
  description: string
  tags: string[]
  communityPostId: string
  createdAt: string
}

interface ComputePackage {
  id: string
  name: string
  thumbnail: string
  tokens: string
  models: string
  price: number
  originalPrice: number
  features: string[]
  badge: string
  isHot: boolean
}

// ─── Mock Data: 12 Tools ─────────────────────────────────────────────────────
const TOOLS: Tool[] = [
  {
    id: 'tool1',
    name: '智能客服数字人·小雅',
    description: '基于大模型的新一代智能客服，可接入网站、APP、微信等多渠道，平均响应时间<1秒',
    category: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    price: 2999,
    originalPrice: 4999,
    rating: 4.9,
    sales: 1247,
    tags: ['7×24在线', '多轮对话', '情绪识别'],
    isHot: true,
    isNew: false,
    vendor: '蔚蓝AI',
    features: ['多渠道接入', '情绪识别', '知识库管理', '7×24在线'],
  },
  {
    id: 'tool2',
    name: '直播带货数字人·小蓝',
    description: '支持抖音、快手、淘宝直播等多平台，AI实时生成话术，24小时不间断直播',
    category: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    price: 5999,
    originalPrice: 8999,
    rating: 4.8,
    sales: 834,
    tags: ['实时互动', '商品推荐', '弹幕回复'],
    isHot: false,
    isNew: true,
    vendor: '蔚蓝AI',
    features: ['多平台直播', '实时话术生成', '弹幕智能回复', '24小时不间断'],
  },
  {
    id: 'tool3',
    name: 'AI图像生成器·灵图',
    description: '输入文案即可生成精美图片，支持多种风格可选，画质高清细腻',
    category: '图像',
    thumbnail: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=400&q=80',
    price: 999,
    originalPrice: 1999,
    rating: 4.7,
    sales: 3421,
    tags: ['文生图', '多种风格', '高清画质'],
    isHot: true,
    isNew: false,
    vendor: '灵创科技',
    features: ['文生图', '风格迁移', '高清输出', '批量生成'],
  },
  {
    id: 'tool4',
    name: 'AI视频剪辑·快剪',
    description: '智能识别精彩片段，自动生成短视频，支持字幕、配乐、特效一键添加',
    category: '视频',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80',
    price: 1999,
    originalPrice: 2999,
    rating: 4.6,
    sales: 1893,
    tags: ['智能剪辑', '自动字幕', '特效添加'],
    isHot: false,
    isNew: false,
    vendor: '快影科技',
    features: ['自动剪辑', '智能字幕', '特效库', '多格式导出'],
  },
  {
    id: 'tool5',
    name: 'AI营销文案·妙笔',
    description: '输入产品信息即可生成高质量营销文案，支持多种文案风格',
    category: '文案',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
    price: 699,
    originalPrice: 1299,
    rating: 4.9,
    sales: 5621,
    tags: ['营销文案', '多风格', '批量生成'],
    isHot: true,
    isNew: false,
    vendor: '妙笔AI',
    features: ['多风格模板', '批量生成', 'SEO优化', '多语言支持'],
  },
  {
    id: 'tool6',
    name: 'AI算力调度·智算',
    description: '智能调度云端算力资源，按需分配，弹性计费，成本降低60%',
    category: '算力',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    sales: 432,
    tags: ['弹性算力', '按需计费', 'GPU调度'],
    isHot: false,
    isNew: true,
    vendor: '算力云',
    features: ['弹性调度', '按需计费', '多规格GPU', 'SLA保障'],
  },
  {
    id: 'tool7',
    name: '虚拟主播数字人·小晴',
    description: '2D真人驱动虚拟主播，表情动作自然流畅，适合电商直播',
    category: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    price: 3999,
    originalPrice: 5999,
    rating: 4.7,
    sales: 678,
    tags: ['2D驱动', '表情自然', '电商直播'],
    isHot: false,
    isNew: false,
    vendor: '虚拟工场',
    features: ['2D真人驱动', '表情动作自然', '多场景适配', '实时互动'],
  },
  {
    id: 'tool8',
    name: 'AI图片修复·超清',
    description: '模糊图片一键变高清，支持老照片修复、画质增强、细节增强',
    category: '图像',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    price: 599,
    originalPrice: 999,
    rating: 4.8,
    sales: 2156,
    tags: ['画质修复', '老照片修复', '细节增强'],
    isHot: false,
    isNew: false,
    vendor: '超清科技',
    features: ['一键超分', '老照片修复', '批量处理', '多种模式'],
  },
  {
    id: 'tool9',
    name: 'AI视频生成·创影',
    description: '输入文案或图片即可生成视频，支持数字人口播、动画演示多种形式',
    category: '视频',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80',
    price: 2999,
    originalPrice: 4999,
    rating: 4.6,
    sales: 1234,
    tags: ['文生视频', '数字人口播', '动画演示'],
    isHot: true,
    isNew: true,
    vendor: '创影AI',
    features: ['文生视频', '数字人口播', '模板丰富', '4K输出'],
  },
  {
    id: 'tool10',
    name: 'AI写作助手·妙文',
    description: '专业写作助手，支持文章创作、摘要生成、翻译润色等多种功能',
    category: '文案',
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80',
    price: 399,
    originalPrice: 799,
    rating: 4.7,
    sales: 7832,
    tags: ['文章创作', '摘要生成', '翻译润色'],
    isHot: false,
    isNew: false,
    vendor: '妙文科技',
    features: ['多文体支持', '智能润色', '查重检测', '一键导出'],
  },
  {
    id: 'tool11',
    name: 'AI算力推荐·配单',
    description: '根据业务场景智能推荐算力配置方案，支持成本优化分析',
    category: '算力',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    price: 0,
    originalPrice: 0,
    rating: 4.4,
    sales: 289,
    tags: ['配置推荐', '成本优化', '场景匹配'],
    isHot: false,
    isNew: false,
    vendor: '算力云',
    features: ['智能推荐', '成本分析', '多场景适配', '实时报价'],
  },
  {
    id: 'tool12',
    name: 'AI数字人定制·造人',
    description: '定制专属数字人形象，支持2D/3D多种风格，快速生成可商用数字人',
    category: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    price: 9999,
    originalPrice: 14999,
    rating: 4.9,
    sales: 456,
    tags: ['形象定制', '2D/3D', '商用授权'],
    isHot: false,
    isNew: true,
    vendor: '造人科技',
    features: ['形象定制', '2D/3D可选', '商用授权', '终身使用'],
  },
]

// ─── Mock Data: 8 Cases (Waterfall) ──────────────────────────────────────────
const CASES: Case[] = [
  {
    id: 'case1',
    title: '某头部电商平台智能客服升级案例',
    industry: '零售电商',
    scenario: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    company: '某头部电商',
    effect: '人工客服成本降低 67%，响应速度提升 300%',
    product: '智能客服数字人·小雅',
    views: '12.4k',
    likes: 342,
    description: '接入数字人客服后，实现7×24小时全天候服务，智能识别用户意图并精准回复',
    tags: ['电商', '智能客服', '成本降低'],
    communityPostId: 'post-1',
    createdAt: '2026-05-10',
  },
  {
    id: 'case2',
    title: '连锁餐饮品牌直播数字人落地案例',
    industry: '餐饮连锁',
    scenario: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    company: '某知名连锁餐饮',
    effect: '直播时长延长至24小时，GMV提升 45%',
    product: '直播带货数字人·小蓝',
    views: '8.7k',
    likes: 218,
    description: '数字人主播接管非黄金时段直播，保持品牌曝光持续性，大幅降低人力成本',
    tags: ['餐饮', '直播', 'GMV提升'],
    communityPostId: 'post-2',
    createdAt: '2026-05-08',
  },
  {
    id: 'case3',
    title: '品牌方AI图像营销工具应用案例',
    industry: '品牌营销',
    scenario: '图像',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    company: '某知名消费品牌',
    effect: '营销素材产出效率提升 500%，成本降低 80%',
    product: 'AI图像生成器·灵图',
    views: '6.2k',
    likes: 156,
    description: '使用AI图像生成工具后，营销团队可在分钟内生成高质量宣传素材',
    tags: ['品牌', '图像生成', '效率提升'],
    communityPostId: 'post-3',
    createdAt: '2026-05-06',
  },
  {
    id: 'case4',
    title: 'MCN机构AI视频剪辑提效案例',
    industry: '内容创作',
    scenario: '视频',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80',
    company: '某头部MCN',
    effect: '视频剪辑效率提升 400%，日均产出增加 3倍',
    product: 'AI视频剪辑·快剪',
    views: '9.1k',
    likes: 287,
    description: 'AI智能剪辑帮助内容创作者快速生成精彩片段，大幅提升内容产出效率',
    tags: ['MCN', '视频剪辑', '效率提升'],
    communityPostId: 'post-4',
    createdAt: '2026-05-04',
  },
  {
    id: 'case5',
    title: '电商平台AI营销文案应用案例',
    industry: '电商运营',
    scenario: '文案',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    company: '某大型电商平台',
    effect: '文案产出效率提升 600%，转化率提升 25%',
    product: 'AI营销文案·妙笔',
    views: '15.3k',
    likes: 421,
    description: 'AI营销文案工具帮助商家快速生成高质量商品描述和推广文案',
    tags: ['电商', '文案', '转化率提升'],
    communityPostId: 'post-5',
    createdAt: '2026-05-02',
  },
  {
    id: 'case6',
    title: 'AI算力调度平台成本优化案例',
    industry: '云计算',
    scenario: '算力',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    company: '某AI创业公司',
    effect: '算力成本降低 60%，模型训练效率提升 40%',
    product: 'AI算力调度·智算',
    views: '5.8k',
    likes: 134,
    description: '智能算力调度系统帮助AI企业实现算力资源的弹性调配和成本优化',
    tags: ['AI企业', '算力调度', '成本优化'],
    communityPostId: 'post-6',
    createdAt: '2026-04-28',
  },
  {
    id: 'case7',
    title: '本地生活平台数字人直播案例',
    industry: '本地生活',
    scenario: '数字人',
    thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
    company: '某本地生活平台',
    effect: '直播转化率提升 35%，用户停留时长增加 120%',
    product: '虚拟主播数字人·小晴',
    views: '7.4k',
    likes: 198,
    description: '数字人主播帮助本地生活商家实现标准化、高频次的直播内容产出',
    tags: ['本地生活', '直播', '转化率提升'],
    communityPostId: 'post-7',
    createdAt: '2026-04-25',
  },
  {
    id: 'case8',
    title: '媒体机构AI图片修复案例',
    industry: '新闻媒体',
    scenario: '图像',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    company: '某新闻媒体',
    effect: '老照片修复效率提升 800%，历史资料数字化完成 90%',
    product: 'AI图片修复·超清',
    views: '4.6k',
    likes: 112,
    description: 'AI图片修复技术帮助媒体机构快速处理大量历史照片和珍贵资料',
    tags: ['媒体', '图片修复', '数字化'],
    communityPostId: 'post-8',
    createdAt: '2026-04-20',
  },
]

// ─── Mock Data: Compute Packages ──────────────────────────────────────────────
const COMPUTE_PACKAGES: ComputePackage[] = [
  {
    id: 'comp1',
    name: '创业版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    tokens: '500万tokens/月',
    models: 'GPT-4o / Claude-3.5 / 国产主流模型',
    price: 299,
    originalPrice: 0,
    features: ['优先推理通道', '50GB存储', 'API调用'],
    badge: '推荐',
    isHot: true,
  },
  {
    id: 'comp2',
    name: '企业版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    tokens: '5000万tokens/月',
    models: 'GPT-4o / Claude-3.5 / 国产主流模型',
    price: 1999,
    originalPrice: 0,
    features: ['独享推理通道', '1TB存储', 'SLA保障', '专属客服'],
    badge: '',
    isHot: false,
  },
  {
    id: 'comp3',
    name: '旗舰版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
    tokens: '5亿tokens/月',
    models: '全模型接入 / 私有化部署',
    price: 9999,
    originalPrice: 0,
    features: ['无限推理', '10TB存储', '私有化部署', '7×24专属技术支持'],
    badge: '旗舰',
    isHot: false,
  },
]

// ─── Tag Icon Map ─────────────────────────────────────────────────────────────
const TAG_ICONS: Record<TagFilter, React.ReactNode> = {
  '全部': <Filter className="h-3.5 w-3.5" />,
  '数字人': <Bot className="h-3.5 w-3.5" />,
  '图像': <Image className="h-3.5 w-3.5" />,
  '视频': <Video className="h-3.5 w-3.5" />,
  '文案': <FileText className="h-3.5 w-3.5" />,
  '算力': <Server className="h-3.5 w-3.5" />,
}

// ─── Theme Context (use CSS variables) ──────────────────────────────────────
function useTheme(): { theme: Theme; isDark: boolean } {
  // In a real app, this would use next-themes or similar
  // For now, we detect from document class
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === 'class') {
          setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  return { theme, isDark: theme === 'dark' }
}

// ─── Debounce Hook ───────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// ─── ToolCard Component ──────────────────────────────────────────────────────
const ToolCard: React.FC<{ tool: Tool; onClick: () => void; isDark: boolean }> = ({ tool, onClick, isDark }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
        active:scale-[0.98]
        ${isDark 
          ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a] hover:border-[rgba(255,255,255,0.15)]' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: '120px' }}>
        <img
          src={tool.thumbnail}
          alt={tool.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0f172a]/80' : 'from-slate-900/40'} to-transparent`} />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex gap-1.5">
          {tool.isHot && (
            <span className="flex items-center gap-1 rounded-full bg-[#FF6B6B] px-2 py-0.5">
              <Zap className="h-2.5 w-2.5 text-white" />
              <span className="text-[9px] font-bold text-white">热门</span>
            </span>
          )}
          {tool.isNew && (
            <span className="rounded-full bg-[#14D1A0] px-2 py-0.5">
              <span className="text-[9px] font-bold text-black">新品</span>
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`rounded-full backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold ${
            isDark ? 'bg-[#2B59C3]/40 text-blue-300' : 'bg-blue-50/90 text-blue-600'
          }`}>
            {tool.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className={`mb-1 line-clamp-1 text-sm font-bold transition-colors group-hover:text-emerald-500 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {tool.name}
        </h3>
        <p className={`mb-2 line-clamp-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {tool.description}
        </p>

        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-1">
          {tool.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`rounded-full px-2 py-0.5 text-[9px] ${
              isDark ? 'border border-slate-700 bg-slate-800 text-slate-400' : 'border border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-auto flex items-center justify-between border-t pt-2 ${
          isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#FFD23F] text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500">{tool.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            {tool.price > 0 ? (
              <>
                <span className="text-sm font-bold text-emerald-500">¥{tool.price.toLocaleString()}</span>
                {tool.originalPrice > 0 && (
                  <span className={`text-[9px] line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    ¥{tool.originalPrice}
                  </span>
                )}
              </>
            ) : (
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                免费使用
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── CaseCard Component (Waterfall) ──────────────────────────────────────────
function CaseCard({ caseItem, onClick, isDark }: { caseItem: Case; onClick: () => void; isDark: boolean }) {
  // Waterfall height variation based on content
  const heights = [180, 200, 220, 190]
  const height = heights[parseInt(caseItem.id.replace('case', '')) % heights.length]

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
        active:scale-[0.98]
        ${isDark 
          ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a] hover:border-[rgba(255,255,255,0.15)]' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
        }
      `}
      style={{ height: `${height}px` }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: `${height * 0.55}px` }}>
        <img
          src={caseItem.thumbnail}
          alt={caseItem.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0f172a]/80' : 'from-slate-900/50'} to-transparent`} />
        
        {/* Scenario badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`rounded-full backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold ${
            isDark ? 'bg-[#2B59C3]/40 text-blue-300' : 'bg-blue-50/90 text-blue-600'
          }`}>
            {caseItem.industry} · {caseItem.scenario}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5">
        <h3 className={`mb-1 line-clamp-2 text-xs font-bold leading-snug transition-colors group-hover:text-emerald-500 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {caseItem.title}
        </h3>

        {/* Effect highlight */}
        <div className={`mt-auto flex items-start gap-1.5 rounded-lg p-2 ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
        }`}>
          <TrendingUp className={`h-3 w-3 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <p className={`line-clamp-2 text-[9px] leading-relaxed ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {caseItem.effect}
          </p>
        </div>

        {/* Stats */}
        <div className={`mt-2 flex items-center justify-between border-t pt-2 ${
          isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
        }`}>
          <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{caseItem.views}</span>
            <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{caseItem.likes}</span>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
            isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            查看方案
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── ToolDetailPanel Component ───────────────────────────────────────────────
function ToolDetailPanel({ tool, onClose, isDark }: { tool: Tool | null; onClose: () => void; isDark: boolean }) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { loading, error, execute: executePurchase } = useAction(
    async () => { return true },
    { onSuccess: () => setSuccessMsg(`购买成功！`), onError: (e) => console.error(e) }
  )

  const { execute: executeTrial } = useAction(
    async () => { return true },
    { onSuccess: () => setSuccessMsg(`试用申请已提交！`), onError: (e) => console.error(e) }
  )

  if (!tool) return null

  return (
    <div className={`
      absolute inset-y-0 right-0 z-20 flex flex-col border-l shadow-2xl w-[360px]
      ${isDark 
        ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a]' 
        : 'border-slate-200 bg-white'
      }
    `}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 py-4 ${
        isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
      }`}>
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'monospace' }}>
          工具详情
        </span>
        <button
          onClick={onClose}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
            isDark 
              ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Thumbnail */}
        <img src={tool.thumbnail} alt={tool.name} className="w-full h-44 object-cover rounded-2xl mb-4" />

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
            isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {tool.category}
          </span>
          {tool.isHot && <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500">热门</span>}
          {tool.isNew && <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">新品</span>}
        </div>

        {/* Title */}
        <h2 className={`mb-2 text-lg font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {tool.name}
        </h2>

        {/* Vendor */}
        <p className={`mb-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          供应商: {tool.vendor}
        </p>

        {/* Description */}
        <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-2.5 py-1 text-[10px] ${
              isDark ? 'border border-slate-700 bg-slate-800 text-slate-400' : 'border border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className={`mb-4 rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <h4 className={`mb-2 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>功能特点</h4>
          <div className="grid grid-cols-2 gap-2">
            {tool.features.map((feature) => (
              <div key={feature} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating & Sales */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
            <span className="text-sm font-bold text-amber-500">{tool.rating}</span>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>已售 {tool.sales.toLocaleString()} 件</span>
        </div>

        {/* Price */}
        {tool.price > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-500">¥{tool.price.toLocaleString()}</span>
            {tool.originalPrice > 0 && (
              <span className={`text-sm line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                ¥{tool.originalPrice}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`border-t p-4 space-y-2 ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'}`}>
        {tool.price > 0 ? (
          <>
            <button
              onClick={() => executePurchase()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4" /> 立即购买
            </button>
            <button
              onClick={() => executeTrial()}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
                isDark 
                  ? 'border-[rgba(255,255,255,0.08)] text-slate-400 hover:border-[rgba(255,255,255,0.15)]' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Play className="h-4 w-4" /> 免费试用3次
            </button>
          </>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90"
          >
            <ArrowRight className="h-4 w-4" /> 免费使用
          </button>
        )}
      </div>

      <ActionToast loading={loading} error={error} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── CaseDetailPanel Component ────────────────────────────────────────────────
function CaseDetailPanel({ caseItem, onClose, isDark }: { caseItem: Case | null; onClose: () => void; isDark: boolean }) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute: executeInterested } = useAction(
    async () => { return true },
    { onSuccess: () => setSuccessMsg(`感兴趣，稍后联系您！`), onError: (e) => console.error(e) }
  )

  const { execute: executeGoToCommunity } = useAction(
    async () => { return true },
    { onSuccess: () => setSuccessMsg(`正在跳转到社区讨论...`), onError: (e) => console.error(e) }
  )

  if (!caseItem) return null

  return (
    <div className={`
      absolute inset-y-0 right-0 z-20 flex flex-col border-l shadow-2xl w-[360px]
      ${isDark 
        ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a]' 
        : 'border-slate-200 bg-white'
      }
    `}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 py-4 ${
        isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
      }`}>
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'monospace' }}>
          案例详情
        </span>
        <button
          onClick={onClose}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
            isDark 
              ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Thumbnail */}
        <img src={caseItem.thumbnail} alt={caseItem.title} className="w-full h-44 object-cover rounded-2xl mb-4" />

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
            isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {caseItem.industry}
          </span>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
            isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
          }`}>
            {caseItem.scenario}
          </span>
        </div>

        {/* Title */}
        <h2 className={`mb-2 text-lg font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {caseItem.title}
        </h2>

        {/* Company */}
        <p className={`mb-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          合作企业: {caseItem.company}
        </p>

        {/* Description */}
        <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {caseItem.description}
        </p>

        {/* Product used */}
        <div className={`mb-4 rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <h4 className={`mb-2 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>使用产品</h4>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-emerald-500" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{caseItem.product}</span>
          </div>
        </div>

        {/* Effect */}
        <div className={`mb-4 flex items-start gap-3 rounded-xl p-4 ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
        }`}>
          <TrendingUp className={`h-5 w-5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <div>
            <h4 className={`mb-1 text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>案例效果</h4>
            <p className={`text-sm ${isDark ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{caseItem.effect}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseItem.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-2.5 py-1 text-[10px] ${
              isDark ? 'border border-slate-700 bg-slate-800 text-slate-400' : 'border border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-6 py-3 border-t ${
          isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-1.5">
            <Eye className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{caseItem.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{caseItem.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>咨询详情</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`border-t p-4 space-y-2 ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'}`}>
        <button
          onClick={() => executeInterested()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]"
        >
          <ChevronRight className="h-4 w-4" /> 咨询详情
        </button>
        <button className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
          isDark
            ? 'border-[rgba(255,255,255,0.08)] text-slate-400 hover:border-[rgba(255,255,255,0.15)]'
            : 'border-slate-200 text-slate-500 hover:border-slate-300'
        }`}>
          <ExternalLink className="h-4 w-4" /> 查看完整方案
        </button>
        <button
          onClick={() => executeGoToCommunity()}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
            isDark
              ? 'border-[rgba(255,255,255,0.08)] text-slate-400 hover:border-[rgba(255,255,255,0.15)]'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          <MessageSquare className="h-4 w-4" /> 去社区讨论 →
        </button>
      </div>

      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── ComputeSection Component ────────────────────────────────────────────────
function ComputeSection({ packages, isDark }: { packages: ComputePackage[]; isDark: boolean }) {
  return (
    <div className={`border-t ${isDark ? 'border-[rgba(255,255,255,0.06)] bg-[#0a1628]' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-2 px-6 py-3 border-b border-inherit">
        <Server className={`h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <h3 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          算力套餐
        </h3>
        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>弹性计费，按需扩容</span>
      </div>

      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`
              relative flex-shrink-0 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
              ${isDark 
                ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a] hover:border-[rgba(255,255,255,0.15)]' 
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
              }
            `}
            style={{ width: '280px' }}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ height: '80px' }}>
              <img src={pkg.thumbnail} alt={pkg.name} className="h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
              {pkg.badge && (
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#14D1A0] px-3 py-1">
                  <Zap className="h-3 w-3 text-black" />
                  <span className="text-[10px] font-bold text-black">{pkg.badge}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h4 className={`mb-1 text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
                {pkg.name}
              </h4>
              <p className={`mb-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {pkg.tokens} · {pkg.models.split('/')[0]}
              </p>

              {/* Features */}
              <div className="mb-3 flex flex-wrap gap-1">
                {pkg.features.map((f) => (
                  <span key={f} className={`rounded-full px-2 py-0.5 text-[9px] ${
                    isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {f}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="mt-auto flex items-center justify-between border-t pt-3 border-inherit">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-emerald-500">¥{pkg.price}</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/月</span>
                </div>
                <button className="rounded-full bg-[#14D1A0] px-3 py-1.5 text-[10px] font-bold text-black transition-all hover:bg-[#14D1A0]/90">
                  立即订阅
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main AgentMarketModule ───────────────────────────────────────────────────
export default function AgentMarketModule() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<TagFilter>('全部')
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [view, setView] = useState<'tools' | 'cases'>('tools')

  const debouncedSearch = useDebounce(searchQuery, 300)
  const { isDark } = useTheme()

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    const matchesTag = activeTag === '全部' || tool.category === activeTag
    const matchesSearch = !debouncedSearch || 
      tool.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchesTag && matchesSearch
  })

  // Filter cases
  const filteredCases = CASES.filter((c) => {
    const matchesTag = activeTag === '全部' || c.scenario === activeTag
    const matchesSearch = !debouncedSearch ||
      c.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchesTag && matchesSearch
  })

  const handleClosePanel = () => {
    setSelectedTool(null)
    setSelectedCase(null)
  }

  const handleTagClick = (tag: TagFilter) => {
    setActiveTag(tag)
    setSelectedTool(null)
    setSelectedCase(null)
  }

  return (
    <div className={`
      relative flex h-full flex-col overflow-hidden rounded-2xl border
      ${isDark 
        ? 'border-[rgba(255,255,255,0.08) bg-[#0f172a]' 
        : 'border-slate-200 bg-white'
      }
    `}>
      {/* ─── Header ─── */}
      <div className={`flex items-center justify-between shrink-0 px-6 py-4 border-b ${
        isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
      }`}>
        {/* Left: Title & Tabs */}
        <div className="flex items-center gap-4">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
            <Store className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h1 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
              AGENT 市场
            </h1>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontFamily: 'monospace' }}>
              数字人 · 图像 · 视频 · 文案 · 算力
            </p>
          </div>

          {/* View Tabs */}
          <div className={`ml-4 flex rounded-xl p-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <button
              onClick={() => { setView('tools'); handleClosePanel() }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'tools'
                  ? 'bg-[#14D1A0] text-black'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              工具
            </button>
            <button
              onClick={() => { setView('cases'); handleClosePanel() }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'cases'
                  ? 'bg-[#14D1A0] text-black'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              案例
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-sm font-bold tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'monospace' }}>
              2,847
            </p>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Agent</p>
          </div>
          <div className={`h-5 w-px ${isDark ? 'bg-[rgba(255,255,255,0.08)]' : 'bg-slate-200'}`} />
          <div className="text-center">
            <p className={`text-sm font-bold tabular-nums ${isDark ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontFamily: 'monospace' }}>
              1,204
            </p>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>数字人</p>
          </div>
          <div className={`h-5 w-px ${isDark ? 'bg-[rgba(255,255,255,0.08)]' : 'bg-slate-200'}`} />
          <div className="text-center">
            <p className={`text-sm font-bold tabular-nums ${isDark ? 'text-amber-400' : 'text-amber-500'}`} style={{ fontFamily: 'monospace' }}>
              156
            </p>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>算力商</p>
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className={`flex items-center gap-4 px-6 py-3 border-b shrink-0 ${
        isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
      }`}>
        {/* Search Bar */}
        <div className={`relative flex-1 max-w-md flex items-center rounded-xl border ${
          isDark 
            ? 'bg-slate-800/50 border-[rgba(255,255,255,0.08)]' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <Search className={`absolute left-3 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={view === 'tools' ? '搜索工具名称或描述...' : '搜索案例标题或企业...'}
            className={`
              flex-1 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[10px]
              ${isDark ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
            `}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 p-0.5 rounded ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`
                flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all
                ${activeTag === tag
                  ? 'bg-[#14D1A0] text-black'
                  : isDark
                    ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              {TAG_ICONS[tag]}
              <span>{tag}</span>
            </button>
          ))}
        </div>

        {/* Result count */}
        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontFamily: 'monospace' }}>
          {view === 'tools' ? `${filteredTools.length} 个工具` : `${filteredCases.length} 个案例`}
        </span>
      </div>

      {/* ─── Hot Case Carousel ─── */}
      {view === 'cases' && (
        <div className={`shrink-0 border-b px-6 py-4 ${
          isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-slate-100'
        }`}>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
            <h3 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
              热门案例
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
              HOT
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {CASES.slice(0, 3).map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCase(c); setSelectedTool(null) }}
                className={`
                  group relative flex-shrink-0 flex overflow-hidden rounded-2xl border transition-all duration-300
                  active:scale-[0.98]
                  ${isDark
                    ? 'border-[rgba(255,255,255,0.08)] bg-[#0f172a] hover:border-[rgba(255,255,255,0.15)]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                  }
                `}
                style={{ width: '320px', height: '120px' }}
              >
                <div className="relative h-full w-[120px] shrink-0 overflow-hidden">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r to-transparent ${
                    isDark ? 'from-[#0f172a]/60' : 'from-white/40'
                  }`} />
                </div>
                <div className="flex flex-1 flex-col justify-center p-3">
                  <span className={`mb-1 self-start rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {c.industry}
                  </span>
                  <h4 className={`mb-1 line-clamp-2 text-xs font-bold leading-snug transition-colors group-hover:text-emerald-500 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
                    {c.title}
                  </h4>
                  <div className={`flex items-center gap-3 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{c.views}</span>
                    <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{c.likes}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main Content Area ─── */}
      <div className="relative flex-1 overflow-auto">
        {/* Tools View - 3 Column Grid */}
        {view === 'tools' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isDark={isDark}
                  onClick={() => {
                    setSelectedTool(tool)
                    setSelectedCase(null)
                  }}
                />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className={`flex flex-col items-center justify-center py-16 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">未找到匹配的工具</p>
                <p className="text-[10px] mt-1">尝试调整搜索词或筛选条件</p>
              </div>
            )}
          </div>
        )}

        {/* Cases View - Waterfall */}
        {view === 'cases' && (
          <div className="p-6">
            <div className="flex flex-wrap gap-4" style={{ columns: '2', columnGap: '16px' }}>
              {filteredCases.map((c) => (
                <div key={c.id} className="break-inside-avoid">
                  <CaseCard
                    caseItem={c}
                    isDark={isDark}
                    onClick={() => {
                      setSelectedCase(c)
                      setSelectedTool(null)
                    }}
                  />
                </div>
              ))}
            </div>
            {filteredCases.length === 0 && (
              <div className={`flex flex-col items-center justify-center py-16 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">未找到匹配的案例</p>
                <p className="text-[10px] mt-1">尝试调整搜索词或筛选条件</p>
              </div>
            )}
          </div>
        )}

        {/* Tool Detail Panel */}
        <ToolDetailPanel
          tool={selectedTool}
          onClose={handleClosePanel}
          isDark={isDark}
        />

        {/* Case Detail Panel */}
        <CaseDetailPanel
          caseItem={selectedCase}
          onClose={handleClosePanel}
          isDark={isDark}
        />
      </div>

      {/* ─── Compute Section (Bottom) ─── */}
      <ComputeSection packages={COMPUTE_PACKAGES} isDark={isDark} />

      {/* ─── Hardware Vendors Section ─── */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3
            className="flex items-center gap-2 text-sm font-bold"
            style={{ fontFamily: 'Space Grotesk, monospace', color: isDark ? '#E2E8F0' : '#0F172A' }}
          >
            <Server className="h-4 w-4 text-blue-500" />
            硬件厂商推荐
          </h3>
          <button
            className="text-[10px] font-medium transition-all hover:opacity-80"
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
          >
            查看全部
            <ChevronRight className="ml-0.5 inline h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MOCK_VENDORS.slice(0, 3).map(vendor => (
            <HardwareVendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  )
}
