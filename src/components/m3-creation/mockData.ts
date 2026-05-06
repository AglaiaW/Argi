// ─── Mock Data ────────────────────────────────────────────────────────────────

export interface DraftContent {
  id: string
  title: string
  type: 'article' | 'social' | 'email' | 'video_script' | 'product_description'
  status: 'draft' | 'reviewing' | 'approved' | 'published'
  content: string
  wordCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
  performanceScore: number
  thumbnail?: string
}

export interface ValuePack {
  id: string
  name: string
  tagline: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  targetAudience: string
  category: 'course' | 'template' | 'ebook' | 'service' | 'software' | 'membership'
  conversionRate: number
  enrolled: number
  rating: number
  thumbnail?: string
}

export interface PlatformConnection {
  id: string
  platform: 'wechat' | 'douyin' | 'xiaohongshu' | 'weibo' | 'bilibili' | 'zhihu' | 'wework' | 'email'
  accountName: string
  accountId: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  lastSyncedAt?: string
  followers?: number
  verified: boolean
  syncEnabled: boolean
  autoPublish: boolean
}

export interface ScheduledPost {
  id: string
  platform: PlatformConnection['platform']
  title: string
  scheduledFor: string
  status: 'scheduled' | 'published' | 'failed'
  views?: number
  likes?: number
}

export interface PublishResult {
  id: string
  platform: PlatformConnection['platform']
  status: 'success' | 'failed'
  publishedAt: string
  url?: string
  error?: string
  views?: number
  likes?: number
  comments?: number
}

// ─── Content Editor Mock Data ────────────────────────────────────────────────

export const MOCK_DRAFTS: DraftContent[] = [
  {
    id: 'draft-001',
    title: '如何用 AI 提升团队协作效率 300%',
    type: 'article',
    status: 'draft',
    content: '# 如何用 AI 提升团队协作效率\n\n在当今快速变化的商业环境中，AI 工具已经成为团队协作不可或缺的一部分...',
    wordCount: 2847,
    createdAt: '2026-05-04T09:00:00Z',
    updatedAt: '2026-05-06T08:30:00Z',
    tags: ['AI', '团队协作', '效率提升', '企业管理'],
    performanceScore: 87,
    thumbnail: 'https://picsum.photos/seed/draft1/400/225',
  },
  {
    id: 'draft-002',
    title: '【618预售】新品发布会倒计时预告',
    type: 'social',
    status: 'reviewing',
    content: '🎉 重大消息！我们的全新产品系列即将在 618 预售活动中正式亮相...\n\n关注 @蔚蓝OPC，第一时间获取独家资讯。',
    wordCount: 156,
    createdAt: '2026-05-03T14:20:00Z',
    updatedAt: '2026-05-05T11:15:00Z',
    tags: ['618', '预售', '新品发布', '营销'],
    performanceScore: 92,
    thumbnail: 'https://picsum.photos/seed/draft2/400/225',
  },
  {
    id: 'draft-003',
    title: '客户成功案例：制造业数字化转型之路',
    type: 'article',
    status: 'approved',
    content: '# 客户成功案例：制造业数字化转型\n\n某知名制造业企业在引入我们的数字化解决方案后...',
    wordCount: 4120,
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-04T16:45:00Z',
    tags: ['数字化转型', '制造业', '客户案例', 'B2B'],
    performanceScore: 95,
    thumbnail: 'https://picsum.photos/seed/draft3/400/225',
  },
  {
    id: 'draft-004',
    title: '端午节限时福利活动邮件',
    type: 'email',
    status: 'draft',
    content: '亲爱的用户：\n\n端午节将至，我们为您准备了丰厚的专属福利...\n\n🆓 免费体验套餐 | 🎁 限时折扣 | 🌿 新功能抢先用',
    wordCount: 324,
    createdAt: '2026-05-05T08:00:00Z',
    updatedAt: '2026-05-05T08:00:00Z',
    tags: ['端午节', '促销活动', '邮件营销'],
    performanceScore: 78,
  },
  {
    id: 'draft-005',
    title: '短视频带货脚本：智能手表评测',
    type: 'video_script',
    status: 'draft',
    content: '[开场 0-5s]\n🎬 画面：科技感十足的手表特写\n📢 配音：朋友们，这块表真的绝了！\n\n[产品介绍 5-30s]\n📱 亮点一：7天超长续航\n📱 亮点二：全天候健康监测\n📱 亮点三：无缝生态互联',
    wordCount: 892,
    createdAt: '2026-05-02T16:00:00Z',
    updatedAt: '2026-05-06T09:20:00Z',
    tags: ['短视频', '带货', '智能手表', '评测'],
    performanceScore: 83,
    thumbnail: 'https://picsum.photos/seed/draft5/400/225',
  },
  {
    id: 'draft-006',
    title: '企业级 SaaS 产品详情页文案',
    type: 'product_description',
    status: 'published',
    content: '# 蔚蓝 OPC 企业版\n\n专为成长型企业打造的智能化运营平台...\n\n✅ 一站式管理 | ✅ AI 智能助手 | ✅ 数据驱动决策',
    wordCount: 1856,
    createdAt: '2026-04-28T11:00:00Z',
    updatedAt: '2026-04-30T14:00:00Z',
    tags: ['SaaS', '企业版', '产品介绍'],
    performanceScore: 91,
    thumbnail: 'https://picsum.photos/seed/draft6/400/225',
  },
]

// ─── Value Packaging Mock Data ───────────────────────────────────────────────

export const MOCK_VALUE_PACKS: ValuePack[] = [
  {
    id: 'pack-001',
    name: 'AI 运营实战训练营',
    tagline: '从 0 到 1 打造百万级私域流量',
    price: 2999,
    originalPrice: 4999,
    description: '28天系统化课程，涵盖内容创作、私域引流、转化裂变全链路。配套专属助教和实战作业点评。',
    features: [
      '28天沉浸式学习（40+课时）',
      '10个行业经典案例拆解',
      '专属学习社群（永久有效）',
      '3次1对1助教答疑',
      '毕业证书 + 内部资源包',
      '一年内免费复训',
    ],
    targetAudience: '中小企业主、运营负责人、市场营销从业者',
    category: 'course',
    conversionRate: 8.4,
    enrolled: 3847,
    rating: 4.9,
    thumbnail: 'https://picsum.photos/seed/pack1/400/225',
  },
  {
    id: 'pack-002',
    name: '全链路营销模板套装',
    tagline: '100+ 可直接使用的营销模板',
    price: 599,
    originalPrice: 999,
    description: '涵盖微信公众号、小红书、抖音、邮件营销全渠道模板，包含文案 + 设计规范，一键导出使用。',
    features: [
      '100+ 精选模板',
      '多渠道适配（微信/抖音/小红书/邮件）',
      '持续月度更新',
      '配套使用教程',
      'Figma/Canva 双格式',
    ],
    targetAudience: '内容运营、市场推广、自媒体创作者',
    category: 'template',
    conversionRate: 12.1,
    enrolled: 8921,
    rating: 4.7,
    thumbnail: 'https://picsum.photos/seed/pack2/400/225',
  },
  {
    id: 'pack-003',
    name: '企业数字化转型白皮书',
    tagline: '2026年行业洞察与实战指南',
    price: 0,
    description: '免费领取！汇聚20+行业专家观点，深入分析企业数字化转型的关键路径与避坑指南。',
    features: [
      '200+ 页深度报告',
      '20+ 行业专家访谈',
      '10个行业解决方案',
      '数字化成熟度自测工具',
      '转型路线图模板',
    ],
    targetAudience: '企业管理层、CIO、数字化负责人',
    category: 'ebook',
    conversionRate: 23.5,
    enrolled: 15420,
    rating: 4.8,
    thumbnail: 'https://picsum.photos/seed/pack3/400/225',
  },
  {
    id: 'pack-004',
    name: '企业专属 AI 运营顾问',
    tagline: '7×24小时智能运营支持',
    price: 19999,
    description: '为企业提供定制化的AI运营方案设计、流程优化咨询、数据分析报告，每月2次线上深度辅导。',
    features: [
      '每月2次1对1深度辅导（每次60分钟）',
      '定制化运营方案（季度）',
      '专属企业微信群支持',
      '每月数据分析报告',
      '优先新功能体验',
      '年度战略复盘会议',
    ],
    targetAudience: '中大型企业、集团性公司',
    category: 'service',
    conversionRate: 3.2,
    enrolled: 128,
    rating: 5.0,
    thumbnail: 'https://picsum.photos/seed/pack4/400/225',
  },
  {
    id: 'pack-005',
    name: '智能营销分析云（旗舰版）',
    tagline: 'AI 驱动的全渠道营销分析平台',
    price: 5999,
    originalPrice: 8999,
    description: '聚合微信、抖音、小红书等平台数据，AI智能分析营销效果，输出可执行的增长建议。',
    features: [
      '多平台数据聚合（10+平台）',
      'AI 智能归因分析',
      '实时营销仪表盘',
      '竞争对手监测',
      '智能预警通知',
      'API 接口开放',
    ],
    targetAudience: '品牌方、MCN机构、营销代理商',
    category: 'software',
    conversionRate: 6.8,
    enrolled: 2156,
    rating: 4.6,
    thumbnail: 'https://picsum.photos/seed/pack5/400/225',
  },
  {
    id: 'pack-006',
    name: '铂金会员年卡',
    tagline: '全站资源无限用，优先响应',
    price: 3999,
    description: '开通即享全站付费内容免费访问，专属客服通道，每月赠送推广资源位。',
    features: [
      '全站付费内容免费访问',
      '7×24 专属客服',
      '每月50元推广代金券',
      '优先新功能体验',
      '线下活动免费参加',
      '年度会员专属礼包',
    ],
    targetAudience: '高频使用者、深度用户',
    category: 'membership',
    conversionRate: 18.3,
    enrolled: 6732,
    rating: 4.9,
    thumbnail: 'https://picsum.photos/seed/pack6/400/225',
  },
]

// ─── Platform Sync Mock Data ─────────────────────────────────────────────────

export const MOCK_PLATFORMS: PlatformConnection[] = [
  {
    id: 'plat-001',
    platform: 'wechat',
    accountName: '蔚蓝科技官方',
    accountId: 'gh_8d2f1c4e5a6b',
    status: 'connected',
    lastSyncedAt: '2026-05-06T10:15:00Z',
    followers: 128500,
    verified: true,
    syncEnabled: true,
    autoPublish: true,
  },
  {
    id: 'plat-002',
    platform: 'douyin',
    accountName: '蔚蓝OPC',
    accountId: '55889123456',
    status: 'connected',
    lastSyncedAt: '2026-05-06T10:18:00Z',
    followers: 895000,
    verified: true,
    syncEnabled: true,
    autoPublish: false,
  },
  {
    id: 'plat-003',
    platform: 'xiaohongshu',
    accountName: '蔚蓝运营笔记',
    accountId: '小红书ID_xl2024',
    status: 'connected',
    lastSyncedAt: '2026-05-06T09:50:00Z',
    followers: 45600,
    verified: true,
    syncEnabled: true,
    autoPublish: true,
  },
  {
    id: 'plat-004',
    platform: 'weibo',
    accountName: '@蔚蓝科技_OPC',
    accountId: '7392841654',
    status: 'connected',
    lastSyncedAt: '2026-05-06T08:30:00Z',
    followers: 23400,
    verified: false,
    syncEnabled: false,
    autoPublish: false,
  },
  {
    id: 'plat-005',
    platform: 'bilibili',
    accountName: '蔚蓝课堂',
    accountId: 'UID_882145630',
    status: 'error',
    lastSyncedAt: '2026-05-04T16:00:00Z',
    followers: 12080,
    verified: true,
    syncEnabled: true,
    autoPublish: false,
  },
  {
    id: 'plat-006',
    platform: 'zhihu',
    accountName: '蔚蓝说运营',
    accountId: 'zhihu_author_xl2024',
    status: 'pending',
    followers: 0,
    verified: false,
    syncEnabled: false,
    autoPublish: false,
  },
  {
    id: 'plat-007',
    platform: 'wework',
    accountName: '蔚蓝科技-运营部',
    accountId: 'ww_org_988274561',
    status: 'connected',
    lastSyncedAt: '2026-05-06T10:00:00Z',
    verified: true,
    syncEnabled: true,
    autoPublish: false,
  },
  {
    id: 'plat-008',
    platform: 'email',
    accountName: 'newsletter@weilan-tech.com',
    accountId: 'esb_882461234',
    status: 'connected',
    lastSyncedAt: '2026-05-06T10:20:00Z',
    verified: true,
    syncEnabled: true,
    autoPublish: true,
  },
]

// ─── Scheduled Posts Mock Data ──────────────────────────────────────────────

export const MOCK_SCHEDULED: ScheduledPost[] = [
  {
    id: 'sched-001',
    platform: 'wechat',
    title: '【今日特惠】限时秒杀活动火热进行中',
    scheduledFor: '2026-05-07T09:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'sched-002',
    platform: 'douyin',
    title: '#新品发布# 智能手表深度测评来啦 🎉',
    scheduledFor: '2026-05-07T12:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'sched-003',
    platform: 'xiaohongshu',
    title: '超实用的团队协作技巧｜效率翻倍💡',
    scheduledFor: '2026-05-07T18:30:00Z',
    status: 'scheduled',
  },
  {
    id: 'sched-004',
    platform: 'wechat',
    title: '端午节福利预告｜你准备好了吗？🌿',
    scheduledFor: '2026-05-08T08:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'sched-005',
    platform: 'xiaohongshu',
    title: '私域流量全攻略：从 0 到 10 万粉',
    scheduledFor: '2026-05-08T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'sched-006',
    platform: 'douyin',
    title: '直播回顾：AI 赋能电商增长实战',
    scheduledFor: '2026-05-06T22:00:00Z',
    status: 'published',
    views: 156000,
    likes: 8900,
  },
  {
    id: 'sched-007',
    platform: 'wechat',
    title: '客户案例｜零售品牌月销提升 300%',
    scheduledFor: '2026-05-05T10:00:00Z',
    status: 'published',
    views: 24500,
    likes: 1200,
  },
]

// ─── Publish Results Mock Data ──────────────────────────────────────────────

export const MOCK_PUBLISH_HISTORY: PublishResult[] = [
  {
    id: 'pub-001',
    platform: 'wechat',
    status: 'success',
    publishedAt: '2026-05-06T08:00:00Z',
    url: 'https://mp.weixin.qq.com/s/xl_demo_001',
    views: 12400,
    likes: 876,
    comments: 42,
  },
  {
    id: 'pub-002',
    platform: 'douyin',
    status: 'success',
    publishedAt: '2026-05-05T14:30:00Z',
    url: 'https://www.douyin.com/video/7382916540',
    views: 345000,
    likes: 21500,
    comments: 1830,
  },
  {
    id: 'pub-003',
    platform: 'xiaohongshu',
    status: 'failed',
    publishedAt: '2026-05-04T16:00:00Z',
    error: '内容违规审核未通过，请修改后重试',
  },
  {
    id: 'pub-004',
    platform: 'wechat',
    status: 'success',
    publishedAt: '2026-05-04T09:00:00Z',
    url: 'https://mp.weixin.qq.com/s/xl_demo_002',
    views: 8900,
    likes: 520,
    comments: 28,
  },
  {
    id: 'pub-005',
    platform: 'email',
    status: 'success',
    publishedAt: '2026-05-03T10:00:00Z',
    views: 45200,
    likes: 0,
    comments: 0,
  },
]
