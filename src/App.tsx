/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Home,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Sun,
  Moon,
  User,
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Cpu,
  Workflow,
  Plus,
  MessageSquare,
  Bot,
  Zap,
  Layout,
  CheckCircle2,
  Clock,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Settings,
  MoreVertical,
  LogOut,
  Trophy,
  Ghost,
  Heart,
  Share2,
  Users,
  CircuitBoard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import aagiLogo from './assets/aagi-logo-cutout.png';
import argiCat from './assets/argi-cat-seedream.jpeg';

// New Argi Modules (M1-M5)
import EducationModule from './components/m1-education/EducationModule';
import AgentMarketModule from './components/m2-agent-market/AgentMarketModule';
import CreationModule from './components/m3-creation/CreationModule';
import CommunityModule from './components/m4-community/CommunityModule';
import HardwareModule from './components/m5-hardware/HardwareModule';

// --- Types ---

type TabType = 'community' | 'education' | 'market' | 'creation' | 'profile' | 'hardware';
type CommunitySection = 'discover' | 'market' | 'events' | 'circles';
type CommunityFeedTab = 'follow' | 'recommend' | 'trending';
type EventStatusFilter = 'all' | 'registration' | 'ongoing' | 'review' | 'ended';

type BannerItem = {
  id: number;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
};

type BaseCommunityItem = {
  id: number;
  type: 'aigc' | 'template' | 'tournament' | 'sect';
  channels: CommunityFeedTab[];
  heat: number;
};

type AigcCommunityItem = BaseCommunityItem & {
  type: 'aigc';
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  cover: string;
  title: string;
  summary: string;
  likes: string;
  comments: number;
  shares: number;
  source: string;
  time: string;
};

type TemplateCommunityItem = BaseCommunityItem & {
  type: 'template';
  author: {
    name: string;
    avatar: string;
  };
  templateName: string;
  templateKind: '智能体' | '工作流' | 'AIGC';
  price: string;
  copy: string;
  time: string;
};

type TournamentCommunityItem = BaseCommunityItem & {
  type: 'tournament';
  title: string;
  stage: string;
  countdown: string;
  summary: string;
  rankings: Array<{
    id: number;
    name: string;
    work: string;
    avatar: string;
  }>;
};

type SectCommunityItem = BaseCommunityItem & {
  type: 'sect';
  name: string;
  avatar: string;
  pitch: string;
  members: string;
  tags: string[];
  description: string;
};

type CommunityItem =
  | AigcCommunityItem
  | TemplateCommunityItem
  | TournamentCommunityItem
  | SectCommunityItem;

// --- Mock Data ---

const COURSES = [
  { id: 1, title: '超级个体：从 0 到 1 架构数字化身', level: '入门', duration: '12小时', students: '1.2k', price: 'FREE', category: '架构' },
  { id: 2, title: '大语言模型微调与私有化构建', level: '进阶', duration: '8小时', students: '850', price: '¥599', category: '内核' },
  { id: 3, title: '自动化流转：Agentic Workflow 实战', level: '专家', duration: '15小时', students: '420', price: '¥999', category: '自动化' },
];

const ASSETS = [
  { id: 1, type: 'agent', name: '数据挖掘官.v1', status: 'online', interactions: 450 },
  { id: 2, type: 'workflow', name: '全网舆情监控系统', status: 'active', lastRun: '5mins ago' },
  { id: 3, type: 'content', name: '超级个体生产力报告 2024', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop' },
];

const COMMUNITY_BANNERS: BannerItem[] = [
  {
    id: 1,
    kicker: '赛事活动',
    title: '第二届 超级个体开发者大赛',
    subtitle: '复赛开启，提交你的智能体系统与工作流作品。',
    cta: '进入赛事详情',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=700&fit=crop',
  },
  {
    id: 2,
    kicker: '官方活动',
    title: '蔚蓝 OPC 平台创作者周',
    subtitle: '平台官方精选内容、模板扶持和流量曝光统一开放。',
    cta: '查看活动说明',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=700&fit=crop',
  },
  {
    id: 3,
    kicker: '热门门派',
    title: '本周最热门派招募进行中',
    subtitle: '从自动化到叙事增长，找到适合你的协作阵地。',
    cta: '查看门派招募',
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1600&h=700&fit=crop',
  },
];

const COMMUNITY_FEED: CommunityItem[] = [
  {
    id: 1,
    type: 'aigc',
    channels: ['recommend', 'trending'],
    heat: 98,
    author: {
      name: 'AAGI.Official',
      avatar: 'https://api.dicebear.com/9.x/shapes/svg?seed=aagi-official',
      verified: true,
    },
    cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&h=520&fit=crop',
    title: '平台信号周报：本周最值得复用的 6 套增长工作流',
    summary: '从社区运营到内容分发，本周官方汇总了高完成度的 OPC 工作流，并给出适合不同创作者的场景说明。',
    likes: '2.8k',
    comments: 156,
    shares: 94,
    source: '由蔚蓝运营智能体生成',
    time: '12分钟前',
  },
  {
    id: 2,
    type: 'template',
    channels: ['follow', 'recommend', 'trending'],
    heat: 92,
    author: {
      name: '阿吉 Argi',
      avatar: argiCat,
    },
    templateName: 'Multimodal Customer Service Agent',
    templateKind: '工作流',
    price: '¥199',
    copy: '阿吉上架了新模板',
    time: '35分钟前',
  },
  {
    id: 3,
    type: 'tournament',
    channels: ['recommend', 'trending'],
    heat: 99,
    title: '2026 超级个体开发者大赛',
    stage: '复赛进行中',
    countdown: '2天 14:24:10',
    summary: 'TOP3 作品已经进入冲刺阶段，自动化办公、数字员工和知识运营方向热度最高。',
    rankings: [
      { id: 1, name: 'Infinite.SI', work: '营收共振引擎', avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=Infinite' },
      { id: 2, name: 'SignalFlow', work: '热点雷达台', avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=SignalFlow' },
      { id: 3, name: 'NorthNode', work: '门派招生机', avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=NorthNode' },
    ],
  },
  {
    id: 4,
    type: 'sect',
    channels: ['follow', 'recommend'],
    heat: 83,
    name: '代码炼金术',
    avatar: 'https://images.unsplash.com/photo-1516321310764-8d4b6fa2aa02?w=300&h=300&fit=crop',
    pitch: '正在招募擅长自动化、数据链路和提示词工程的成员。',
    members: '1,288',
    tags: ['自动化', '增长', '工作流'],
    description: '用稳定的工具链和执行纪律，把想法变成能持续运转的系统。',
  },
  {
    id: 5,
    type: 'aigc',
    channels: ['follow', 'recommend'],
    heat: 88,
    author: {
      name: 'Narrative.Lab',
      avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=NarrativeLab',
      verified: true,
    },
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=520&fit=crop',
    title: '一套内容型 OPC 的日更机制，是如何在 7 天内搭起来的',
    summary: '从线索采集、观点整理到公众号与社区联动，这篇内容拆解了一套适合单人团队的高频生产系统。',
    likes: '1.4k',
    comments: 72,
    shares: 41,
    source: '由 Narrative.Lab 智能体生成',
    time: '1小时前',
  },
  {
    id: 6,
    type: 'template',
    channels: ['recommend'],
    heat: 74,
    author: {
      name: 'Orbit.Seller',
      avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=OrbitSeller',
    },
    templateName: '高客单成交陪跑智能体',
    templateKind: '智能体',
    price: '免费',
    copy: 'Orbit.Seller 上架了新模板',
    time: '3小时前',
  },
  {
    id: 7,
    type: 'sect',
    channels: ['trending'],
    heat: 87,
    name: '增长叙事局',
    avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300&h=300&fit=crop',
    pitch: '本周热门门派，正在招募会写、会卖、会分发的内容型操盘手。',
    members: '936',
    tags: ['叙事', '销售', '社区'],
    description: '擅长把复杂能力打包成易传播、易成交的公开表达系统。',
  },
];

const COMMUNITY_SECTION_TABS: Array<{
  id: CommunitySection;
  label: string;
  description: string;
}> = [
  { id: 'discover', label: '发现', description: '优质内容与人的推荐流' },
  { id: 'events', label: '赛事', description: '周期性竞技活动与荣誉体系' },
  { id: 'market', label: '市场', description: '创作成果的交易与分发场所' },
  { id: 'circles', label: '圈子', description: '按兴趣聚集的创作共同体' },
];

const MARKET_CATEGORIES = ['全部', '智能体', '工作流', 'AIGC模板', '数字人形象'] as const;
const MARKET_SORT_OPTIONS = ['热销', '最新', '价格', '评分'] as const;

const MARKET_TEMPLATES = [
  {
    id: 1,
    title: '超级社区内容分发引擎',
    author: '阿吉 Argi',
    authorAvatar: argiCat,
    kind: '工作流',
    price: '¥199',
    sold: 231,
    rating: 4.9,
    authorYield: '¥12,400',
    scene: '内容创作',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=1200&fit=crop',
  },
  {
    id: 2,
    title: '门店带货数字导购员',
    author: 'SalesNova',
    authorAvatar: 'https://api.dicebear.com/9.x/glass/svg?seed=SalesNova',
    kind: '智能体',
    price: '订阅 ¥49/月',
    sold: 188,
    rating: 4.8,
    authorYield: '¥8,750',
    scene: '电商带货',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900&h=1200&fit=crop',
  },
  {
    id: 3,
    title: '品牌短视频脚本模板组',
    author: 'Narrative.Lab',
    authorAvatar: 'https://api.dicebear.com/9.x/glass/svg?seed=NarrativeLab',
    kind: 'AIGC模板',
    price: '¥89',
    sold: 442,
    rating: 4.7,
    authorYield: '¥21,600',
    scene: '品牌营销',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=1200&fit=crop',
  },
  {
    id: 4,
    title: '校园宣讲虚拟主持人',
    author: 'Campus.AI',
    authorAvatar: 'https://api.dicebear.com/9.x/glass/svg?seed=CampusAI',
    kind: '数字人形象',
    price: '免费',
    sold: 95,
    rating: 4.6,
    authorYield: '¥3,200',
    scene: '教育',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1200&fit=crop',
  },
  {
    id: 5,
    title: '政务问答陪跑工作台',
    author: 'BlueOps',
    authorAvatar: 'https://api.dicebear.com/9.x/glass/svg?seed=BlueOps',
    kind: '工作流',
    price: '¥299',
    sold: 66,
    rating: 4.9,
    authorYield: '¥18,050',
    scene: '政务',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=1200&fit=crop',
  },
  {
    id: 6,
    title: '直播助理智能体套装',
    author: 'Orbit.Seller',
    authorAvatar: 'https://api.dicebear.com/9.x/glass/svg?seed=OrbitSeller',
    kind: '智能体',
    price: '¥59',
    sold: 519,
    rating: 4.8,
    authorYield: '¥30,280',
    scene: '电商带货',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=1200&fit=crop',
  },
];

const EVENT_STATUS_OPTIONS: Array<{ id: EventStatusFilter; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'registration', label: '报名中' },
  { id: 'ongoing', label: '进行中' },
  { id: 'review', label: '评审中' },
  { id: 'ended', label: '已结束' },
];

const COMMUNITY_EVENTS = [
  {
    id: 1,
    status: 'registration',
    statusLabel: '报名中',
    type: '智能体创作赛',
    title: '2026 超级个体开发者大赛',
    prize: '冠军 ¥5,000 + 流量扶持',
    participants: 1280,
    range: '04.20 - 05.18',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=900&fit=crop',
  },
  {
    id: 2,
    status: 'ongoing',
    statusLabel: '进行中',
    type: 'AIGC内容赛',
    title: '城市灵感内容挑战',
    prize: '冠军 ¥3,000 + 官方栏目推荐',
    participants: 846,
    range: '04.25 - 05.10',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&h=900&fit=crop',
  },
  {
    id: 3,
    status: 'review',
    statusLabel: '评审中',
    type: '工作流应用赛',
    title: '增长自动化效率赛',
    prize: '冠军 ¥8,000 + 企业合作对接',
    participants: 402,
    range: '03.10 - 04.28',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=900&fit=crop',
  },
  {
    id: 4,
    status: 'ended',
    statusLabel: '已结束',
    type: '行业方案赛',
    title: '行业解决方案共创季',
    prize: '冠军 ¥10,000 + 硬件资源扶持',
    participants: 233,
    range: '02.01 - 03.15',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop',
  },
];

const EVENT_TYPE_LIBRARY = [
  { name: '智能体创作赛', description: '比功能、创新和调用量。' },
  { name: 'AIGC内容赛', description: '比创意、质量和传播效果。' },
  { name: '工作流应用赛', description: '比提效幅度和可复制性。' },
  { name: '行业方案赛', description: '比商业价值和落地深度。' },
];

const CIRCLE_CATEGORIES = ['全部', '一人公司', 'AI带货', '智能硬件', 'AIGC创作', '行业应用', '同城', '新手互助'] as const;

const MY_CIRCLES = [
  { id: 1, name: '代码炼金术', avatar: 'https://images.unsplash.com/photo-1516321310764-8d4b6fa2aa02?w=200&h=200&fit=crop' },
  { id: 2, name: '增长叙事局', avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200&h=200&fit=crop' },
  { id: 3, name: '硬件共创社', avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop' },
];

const RECOMMENDED_CIRCLES = [
  {
    id: 1,
    name: '一人公司增长局',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=280&h=280&fit=crop',
    description: '专注内容、产品和销售一体化增长。',
    members: 1328,
    weeklyPosts: 284,
    tags: ['一人公司', '增长', '销售'],
    joinMode: '开放加入',
  },
  {
    id: 2,
    name: '智能硬件实验场',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=280&h=280&fit=crop',
    description: '聚焦设备形态、语音交互和边缘智能体验。',
    members: 674,
    weeklyPosts: 91,
    tags: ['智能硬件', '语音', '设备'],
    joinMode: '申请加入',
  },
  {
    id: 3,
    name: 'AIGC创作同盟',
    avatar: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=280&h=280&fit=crop',
    description: '围绕图像、视频、数字人和内容工作流协作。',
    members: 2156,
    weeklyPosts: 402,
    tags: ['AIGC创作', '视频', '数字人'],
    joinMode: '开放加入',
  },
  {
    id: 4,
    name: '同城 OPC 互助圈',
    avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=280&h=280&fit=crop',
    description: '以本地线下交流和合作撮合为主。',
    members: 518,
    weeklyPosts: 73,
    tags: ['同城', '线下', '新手互助'],
    joinMode: '申请加入',
  },
];

const ACTIVE_CIRCLE_RANKING = [
  { id: 1, name: 'AIGC创作同盟', score: 98, trend: '+12%' },
  { id: 2, name: '一人公司增长局', score: 93, trend: '+9%' },
  { id: 3, name: '代码炼金术', score: 90, trend: '+7%' },
  { id: 4, name: '增长叙事局', score: 87, trend: '+6%' },
  { id: 5, name: '智能硬件实验场', score: 82, trend: '+4%' },
];

// --- Components ---

const GlobalTopBar = ({ lang, setLang }: { lang: 'CN' | 'EN', setLang: (l: 'CN' | 'EN') => void }) => {
  return (
    <>
      <div className="noise-overlay" />
      <div className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-5 lg:px-8 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center gap-4 pl-1 transition-all duration-500">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-[3.65rem] w-[4.15rem] relative flex items-center justify-center overflow-hidden shrink-0"
          >
            <img
              src={aagiLogo}
              alt="AAGI logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
        
        <div className="flex-1 max-w-xl mx-6 lg:mx-12 relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={lang === 'CN' ? "搜索模板、赛事、门派或内容..." : "Search templates, events, sects or content..."}
            className="w-full h-12 pl-12 pr-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-primary/40 focus:bg-white transition-all outline-hidden text-sm"
          />
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-amber-500 hover:bg-amber-50 transition-all"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-mono font-bold">
            <button 
              onClick={() => setLang('CN')}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === 'CN' ? 'bg-primary text-dark-bg' : 'text-slate-500 hover:text-slate-800'}`}
            >CN</button>
            <button 
              onClick={() => setLang('EN')}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === 'EN' ? 'bg-primary text-dark-bg' : 'text-slate-500 hover:text-slate-800'}`}
            >EN</button>
          </div>

          <button className="relative p-2.5 text-slate-500 hover:text-primary transition-colors hidden sm:flex">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#14D1A0]"></span>
          </button>
          <div className="flex items-center gap-3 p-1 pr-4 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
            <div className="w-9 h-9 rounded-full border border-slate-200 bg-linear-to-br from-primary/12 to-azure/22 p-0.5">
              <img src={argiCat} alt="Argi avatar" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">阿吉 Argi</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">AI Secretary</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SideNav = ({ activeTab, setActiveTab, lang }: { activeTab: TabType, setActiveTab: (tab: TabType) => void, lang: 'CN' | 'EN' }) => {
  const tabs: { id: TabType, icon: React.ReactNode, label: { CN: string, EN: string } }[] = [
    { id: 'community', icon: <Users />, label: { CN: '超级社区', EN: 'COMMUNITY' } },
    { id: 'education', icon: <BookOpen />, label: { CN: '技能教育', EN: 'EDUCATION' } },
    { id: 'market', icon: <Bot />, label: { CN: 'Agent市场', EN: 'MARKET' } },
    { id: 'creation', icon: <Sparkles />, label: { CN: '创作中心', EN: 'CREATION' } },
    { id: 'hardware', icon: <CircuitBoard />, label: { CN: '硬件生态', EN: 'HARDWARE' } },
    { id: 'profile', icon: <User />, label: { CN: '个人中心', EN: 'PROFILE' } },
  ];

  return (
    <div className="fixed top-20 left-0 bottom-0 w-24 lg:w-32 premium-glass z-40 border-r-0 border-white/5 flex flex-col items-center py-10 gap-8 transition-all">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`group flex flex-col items-center gap-2 transition-all duration-500 relative ${activeTab === tab.id ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' : 'text-white/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}
        >
          {activeTab === tab.id && (
            <motion.div 
              layoutId="nav-pill"
              className="absolute -left-4 w-1.5 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] blur-[1px]"
            />
          )}
          <span className={`${activeTab === tab.id ? 'scale-125' : 'group-hover:scale-110'} transition-transform duration-500`}>
             {React.cloneElement(tab.icon as React.ReactElement, { size: 24 })}
          </span>
          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase text-center transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 scale-105' : 'opacity-70 group-hover:opacity-100'}`}>
            {lang === 'CN' ? tab.label.CN : tab.label.EN}
          </span>
        </button>
      ))}

      <div className="mt-auto pb-8 text-white/10">
        <Cpu size={24} className="hover:text-primary transition-colors cursor-help" />
      </div>
    </div>
  );
};

const AISecretary = ({ lang, isOpen, setIsOpen }: { lang: 'CN' | 'EN', isOpen: boolean, setIsOpen: (o: boolean) => void }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: lang === 'CN' ? '你好，超级个体。我是阿吉(Argi)，你的数字化身协助者。今天有什么可以帮你的吗？' : 'Hello, Super Individual. I am Argi, your digital avatar collaborator. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user' as any, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: `You are Argi (阿吉), a specialized digital secretary for "Super Individuals" (OPC - One Person Company creators) on the AAGI platform. 
          Your tone is futuristic, professional, caring, and encouraging. 
          Respond in ${lang === 'CN' ? 'Chinese' : 'English'}.
          Keep responses concise and helpful. You help with:
          1. Learning (Evolution guidance)
          2. Creation (Forge/Blueprint advice)
          3. Productivity (Executive coaching)`
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || '...' }]);
    } catch (e) {
       console.error(e);
       setMessages(prev => [...prev, { role: 'ai', text: lang === 'CN' ? '连接中断，请检查设置。' : 'Connection lost. Please check settings.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed top-20 right-0 bottom-0 z-40 transition-all duration-500 flex flex-col ${isOpen ? 'w-80 lg:w-96' : 'w-12 text-blue-300'}`}>
      {/* Toggle Tab */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-24 premium-glass rounded-l-2xl border-r-0 border-white/5 flex flex-col items-center justify-center text-primary hover:text-white transition-colors shadow-2xl"
      >
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse mb-3" />
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`h-full premium-glass border-l-0 border-white/5 flex flex-col gap-6 overflow-hidden ${!isOpen && 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="p-6 pb-2 flex flex-col items-center gap-4 border-b border-white/5">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-azure/35 bg-linear-to-br from-primary/10 to-azure/15 p-1 shadow-[0_0_30px_rgba(0,123,255,0.14)]">
              <img 
                src={argiCat}
                alt="Argi Avatar" 
                className="w-full h-full rounded-full object-cover shadow-[0_0_20px_rgba(0,123,255,0.18)] active:scale-95 transition-all duration-700" 
              />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-primary border-4 border-dark-bg rounded-full shadow-[0_0_15px_#14D1A0]" />
          </div>
          <div className="text-center">
            <h3 className="font-mono font-bold text-white uppercase italic tracking-tighter text-lg">
              {lang === 'CN' ? '阿吉' : 'ARGI.SI'}
            </h3>
            <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest mt-1">
              {lang === 'CN' ? '猫系智能秘书在线' : 'CAT AI SECRETARY ACTIVE'}
            </p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-4 rounded-2xl text-xs font-sans leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary/20 text-white border border-primary/20 rounded-tr-none' 
                  : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] font-mono text-white/20 mt-2">
                {msg.role === 'ai' ? (lang === 'CN' ? '秘书' : 'SEC') : (lang === 'CN' ? '用户' : 'USER')}
              </span>
            </div>
          ))}
          {isTyping && (
             <div className="flex items-center gap-2 text-primary">
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full" />
             </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-6 pt-2">
           <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={lang === 'CN' ? "发送指令..." : "Send command..."}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white outline-hidden focus:border-primary/50 transition-all font-mono"
              />
              <button 
                onClick={sendMessage}
                disabled={isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-dark-bg flex items-center justify-center hover:bg-white transition-all active:scale-90"
              >
                <ArrowRight size={16} />
              </button>
           </div>
           <p className="text-[8px] font-mono text-white/10 mt-4 text-center">
              SEC.CORE V2.1.2024
           </p>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const Workbench: React.FC<{ lang: 'CN' | 'EN' }> = ({ lang }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 pb-40 px-6 lg:px-12 space-y-12 max-w-6xl mx-auto"
    >
      {/* Hero / Greeting */}
      <section className="space-y-4 relative overflow-hidden p-12 rounded-[40px] premium-glass border-none group min-h-[300px] flex flex-col justify-end">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0 grayscale group-hover:grayscale-0 transition-all duration-1000Scale"
        >
          <source src="https://player.vimeo.com/external/370331493.hd.mp4?s=33d59664560b37064d7c040d7c040d7c04&profile_id=175" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-dark-bg via-transparent to-transparent z-0" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-primary/80 uppercase tracking-widest"
          >
            <Zap size={12} className="text-primary" /> {lang === 'CN' ? '系统就绪: 第 17 宇宙天' : 'System Ready: Day 17'}
          </motion.div>
          <h1 className="text-6xl lg:text-8xl font-bold font-mono tracking-tighter leading-[0.85] text-white uppercase italic mt-4">
            {lang === 'CN' ? '你好,' : 'HELLO,'} <br />
            <span className="text-primary text-glow">{lang === 'CN' ? '超级个体.' : 'SUPER.I'}</span>
          </h1>
        </div>
      </section>

      {/* Bento Layout */}
      <div className="grid grid-cols-6 grid-rows-6 gap-6 h-[900px] md:h-[650px]">
        {/* Launcher Box */}
        <div className="bento-card col-span-6 row-span-2 group overflow-hidden bg-white/5 border-white/5">
          <div className="absolute inset-0 z-0">
             <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-opacity duration-1000"
            >
              <source src="https://player.vimeo.com/external/370331493.hd.mp4?s=33d59664560b37064d7c040d7c040d7c04&profile_id=175" type="video/mp4" />
            </video>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] transition-all group-hover:bg-primary/40 -z-10" />
          <div className="space-y-4 relative h-full flex flex-col justify-center">
            <h2 className="text-sm font-mono text-white/80 uppercase tracking-[0.3em] font-bold">{lang === 'CN' ? '意识投影 / 提示词入口' : 'PROJECTION CENTER'}</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder={lang === 'CN' ? "键入您的指令..." : "CMD YOUR VISION..."}
                className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl lg:text-3xl font-mono text-white placeholder:text-white/20 outline-hidden focus:border-primary transition-all pr-12"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-dark-bg rounded-full flex items-center justify-center hover:bg-primary transition-all active:scale-90">
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Status / Stats */}
        <div className="bento-card col-span-6 md:col-span-2 row-span-2 flex flex-col justify-between">
          <Trophy className="text-primary mb-4" size={32} />
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{lang === 'CN' ? '职阶进化' : 'RANK ELEVATION'}</p>
             <p className="text-3xl font-mono font-bold text-white uppercase italic">{lang === 'CN' ? '首席构建师' : 'CHIEF.SI'}</p>
          </div>
          <div className="flex gap-2 mt-4">
             {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-white/10'}`} />)}
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div className="col-span-6 md:col-span-4 row-span-2 grid grid-cols-3 gap-4">
           {[
             { icon: <Bot />, label: lang === 'CN' ? '智能体' : 'AGENT' },
             { icon: <Workflow />, label: lang === 'CN' ? '流转' : 'FLOW' },
             { icon: <Ghost />, label: lang === 'CN' ? '数字生命' : 'AVATAR' }
           ].map((tool, i) => (
             <button key={i} className="bento-card flex flex-col items-center justify-center gap-3 !p-4 group">
                <div className="text-white group-hover:text-primary group-hover:scale-125 transition-all duration-500">
                  {React.cloneElement(tool.icon as React.ReactElement, { size: 32 })}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-white/90">{tool.label}</span>
             </button>
           ))}
        </div>

        {/* Revenue - Wide Card */}
        <div className="bento-card col-span-6 md:col-span-3 row-span-2 bg-linear-to-tr from-white/5 to-primary/5 group">
           <div className="flex items-center justify-between mb-8">
           <CreditCard className="text-white/70 group-hover:text-primary transition-colors" />
           <TrendingUp className="text-primary" size={20} />
         </div>
         <p className="text-[10px] font-mono text-white/80 uppercase tracking-[0.3em] mb-2">{lang === 'CN' ? '累计收益' : 'TOTAL YIELD'}</p>
           <h3 className="text-4xl font-mono font-bold text-white italic group-hover:translate-x-2 transition-transform tracking-tighter">¥12,850.00</h3>
           <button className="mt-8 px-6 py-2 bg-white text-dark-bg font-mono font-bold text-xs rounded-full hover:bg-primary transition-all">
             {lang === 'CN' ? '兑现收益' : 'REDEEM'}
           </button>
        </div>

        {/* Recent Assets */}
        <div className="bento-card col-span-6 md:col-span-3 row-span-2 p-0 overflow-hidden">
        <div className="p-8 pb-4 flex justify-between items-center">
          <p className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{lang === 'CN' ? '资产库存' : 'INVENTORY'}</p>
          <ChevronRight className="text-white/40" />
        </div>
          <div className="px-8 pb-8 space-y-4">
            {ASSETS.slice(0, 2).map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group/item">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:text-primary transition-colors">
                     {asset.type === 'agent' ? <Bot size={16}/> : <Workflow size={16}/>}
                   </div>
                   <span className="text-xs font-mono font-bold text-white/80">{asset.name}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Growth: React.FC<{ lang: 'CN' | 'EN' }> = ({ lang }) => {
  const [activeRoute, setActiveRoute] = useState('opc');
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-12 pb-40 px-6 lg:px-12 space-y-12 max-w-6xl mx-auto"
    >
      <div className="space-y-6">
        <h1 className="text-5xl font-mono font-bold tracking-tighter text-white uppercase italic">
          {lang === 'CN' ? '进化矩阵.' : 'EVOLUTION.'}
        </h1>
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
          {['opc', 'skill', 'interest'].map(id => (
            <button 
              key={id}
              onClick={() => setActiveRoute(id)}
              className={`flex-1 py-3 text-[10px] font-mono font-bold tracking-widest rounded-xl transition-all uppercase ${activeRoute === id ? 'bg-primary text-dark-bg' : 'text-white/40 hover:text-white'}`}
            >
              {id === 'opc' ? (lang === 'CN' ? '超级个体启动' : 'SI STARTUP') : 
               id === 'skill' ? (lang === 'CN' ? '技能扩充' : 'SKILL UP') : 
               (lang === 'CN' ? '边界探索' : 'EXPLORE')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-6">
        {/* Phase Map */}
        <div className="bento-card col-span-6 md:col-span-4 row-span-2">
          <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-8 font-bold">{lang === 'CN' ? '航线图' : 'NAVIGATION MAP'}</p>
          <div className="flex justify-between items-start relative px-4">
            <div className="absolute top-6 left-12 right-12 h-0.5 bg-white/5" />
            {[
              { label: lang === 'CN' ? '认知' : 'READY', status: 'completed' },
              { label: lang === 'CN' ? '构建' : 'BUILD', status: 'current' },
              { label: lang === 'CN' ? '分发' : 'DEPLOY', status: 'locked' },
              { label: lang === 'CN' ? '增值' : 'PROFIT', status: 'locked' }
            ].map((stage, i) => (
              <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold border-2 transition-all ${
                  stage.status === 'completed' ? 'bg-primary border-primary text-dark-bg' :
                  stage.status === 'current' ? 'bg-dark-bg border-primary text-primary shadow-[0_0_20px_#14D1A0]' :
                  'bg-white/5 border-white/10 text-white/20'
                }`}>
                  {stage.status === 'completed' ? <CheckCircle2 size={24} /> : (i + 1)}
                </div>
                <span className={`text-[10px] font-mono font-bold ${stage.status === 'locked' ? 'text-white/20' : 'text-white'}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Sticky */}
        <div className="bento-card col-span-6 md:col-span-2 row-span-2 bg-primary text-dark-bg flex flex-col justify-between">
          <Zap size={32} />
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">{lang === 'CN' ? '当前任务' : 'ACTIVE QUEST'}</p>
            <p className="text-lg font-bold leading-tight mt-1 uppercase italic">{lang === 'CN' ? '同步首个数字生命' : 'SYNC FIRST HUMAN.V'}</p>
          </div>
          <div className="w-full h-1 bg-dark-bg/20 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: '75%' }} 
               transition={{ duration: 1.5 }}
               className="h-full bg-dark-bg" 
             />
          </div>
        </div>

        {/* Courses */}
        <div className="col-span-6 space-y-6 pt-6">
          <h2 className="text-xl font-mono text-white/80 uppercase tracking-[0.3em] font-bold">{lang === 'CN' ? '模块选择' : 'MODULE SELECTION'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSES.map(course => (
              <div key={course.id} className="bento-card group flex flex-col cursor-pointer transition-all active:scale-[0.98]">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                   </div>
                   <span className="text-[8px] font-mono px-3 py-1 bg-white/10 rounded-full text-white/60 group-hover:text-primary transition-colors">{course.level}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 mt-auto">
                   <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                   <span className="flex items-center gap-1"><User size={12}/> {course.students}</span>
                   <span className="ml-auto text-primary font-bold">{course.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Workshop: React.FC<{ lang: 'CN' | 'EN' }> = ({ lang }) => {
  const [subTab, setSubTab] = useState('agent');
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="pt-12 pb-40 px-6 lg:px-12 space-y-12 max-w-6xl mx-auto"
    >
      <div className="space-y-6">
        <h1 className="text-5xl font-mono font-bold tracking-tighter text-white uppercase italic">
          {lang === 'CN' ? '创作黑盒.' : 'FORGE.'}
        </h1>
        <div className="flex gap-10 items-center justify-center border-b border-white/5 pb-4">
           {[
             { id: 'agent', label: lang === 'CN' ? '智能体' : 'AGENTS', icon: <Bot size={18}/> },
             { id: 'workflow', label: lang === 'CN' ? '工作流' : 'FLOWS', icon: <Workflow size={18}/> },
             { id: 'aigc', label: lang === 'CN' ? '生成资产' : 'AIGC', icon: <Layout size={18}/> }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setSubTab(tab.id)}
               className={`flex items-center gap-2 text-xs font-mono font-bold tracking-widest transition-all relative ${subTab === tab.id ? 'text-primary' : 'text-white/20 hover:text-white/50'}`}
             >
               {tab.icon} {tab.label}
               {subTab === tab.id && <motion.div layoutId="forge-tab" className="absolute -bottom-4 left-0 right-0 h-1 bg-primary blur-[2px]" />}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'agent' && (
          <motion.div 
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-6 gap-6"
          >
            {/* Action Card */}
            <button className="bento-card col-span-6 md:col-span-2 flex flex-col items-center justify-center gap-4 bg-primary text-dark-bg group transition-all h-64">
               <div className="w-16 h-16 rounded-full border-2 border-dark-bg/20 flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                  <Plus size={32}/>
               </div>
               <span className="font-mono font-bold tracking-widest text-sm uppercase">{lang === 'CN' ? '初始化节点' : 'INIT AGENT'}</span>
            </button>

            {/* Template Scroller */}
            <div className="bento-card col-span-6 md:col-span-4 overflow-hidden relative p-8 h-64">
              <div className="absolute top-0 right-0 w-32 h-32 bg-deep-blue/10 blur-[60px]" />
              <p className="text-[10px] font-mono text-white uppercase tracking-widest mb-6">{lang === 'CN' ? '热门蓝图' : 'TRENDING BLUEPRINTS'}</p>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar mask-edge">
                {[
                  { name: 'AUTO.BOT', sales: 124 },
                  { name: 'POLYGLOT', sales: 88 },
                  { name: 'BRAINSTORM', sales: 210 }
                ].map((tpl, i) => (
                  <div key={i} className="min-w-[120px] bg-white/5 border border-white/5 p-4 rounded-3xl text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer group/item flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover/item:text-primary"><Bot size={20} /></div>
                     <p className="text-[10px] font-mono font-bold truncate text-white">{tpl.name}</p>
                     <p className="text-[8px] font-mono text-white/70 uppercase tracking-tighter">{tpl.sales} CLONES</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent List */}
            <div className="col-span-6 space-y-4 pt-6">
              <h2 className="text-[10px] font-mono text-white/70 uppercase tracking-[0.3em] font-bold">{lang === 'CN' ? '服役中智能体' : 'ACTIVE FLEET'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'COPY.MASTER', active: true, usage: 45 },
                  { name: 'CODE.GEN', active: false, usage: 12 }
                ].map((agent, i) => (
                  <div key={i} className="bento-card !p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-primary shadow-[0_0_10px_#14D1A0]' : 'bg-white/10'}`} />
                      <span className="text-sm font-mono font-bold text-white group-hover:text-primary transition-colors uppercase italic">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-[10px] font-mono text-white/20 italic">{agent.usage} HITS</span>
                       <button className="text-white/20 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {subTab === 'aigc' && (
           <motion.div 
             key="aigc"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="grid grid-cols-6 gap-6"
           >
             {[
               { icon: <MessageSquare />, label: lang === 'CN' ? '文本生成' : 'TEXT', desc: 'Neural narrative gen' },
               { icon: <Clock />, label: lang === 'CN' ? '视频合成' : 'VIDEO', desc: 'Motion sequence forge' },
               { icon: <Ghost />, label: lang === 'CN' ? '数字生命' : 'HUMAN', desc: 'Digital persona sync' },
               { icon: <Zap />, label: lang === 'CN' ? '即时化身' : 'INSTANT', desc: 'Dialogue to asset' }
             ].map((item, i) => (
               <button key={i} className="bento-card col-span-3 md:col-span-3 h-48 flex flex-col items-center justify-center gap-4 group">
                 <div className="text-primary group-hover:scale-150 transition-all duration-700">{React.cloneElement(item.icon as React.ReactElement, { size: 40 })}</div>
                 <div className="text-center">
                    <p className="text-xs font-mono font-bold tracking-[0.3em] uppercase">{item.label}</p>
                    <p className="text-[8px] font-mono text-white/20 mt-1 uppercase italic">{item.desc}</p>
                 </div>
               </button>
             ))}
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Discovery: React.FC<{ lang: 'CN' | 'EN'; onPublish: () => void }> = ({ lang, onPublish }) => {
  const [activeFeedTab, setActiveFeedTab] = useState<CommunityFeedTab>('recommend');
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % COMMUNITY_BANNERS.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);

  const feedTabs: Array<{ id: CommunityFeedTab; label: string }> = [
    { id: 'follow', label: lang === 'CN' ? '关注' : 'FOLLOWING' },
    { id: 'recommend', label: lang === 'CN' ? '推荐' : 'RECOMMEND' },
    { id: 'trending', label: lang === 'CN' ? '热门' : 'HOT' },
  ];

  const visibleFeed = COMMUNITY_FEED
    .filter((item) => item.channels.includes(activeFeedTab))
    .sort((left, right) => right.heat - left.heat);

  const currentBannerItem = COMMUNITY_BANNERS[currentBanner];
  const cardShell =
    'rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,22,39,0.96),rgba(6,16,29,0.94))] overflow-hidden transition-all duration-300 hover:border-primary/35 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)]';

  const renderTemplateIcon = (kind: TemplateCommunityItem['templateKind']) => {
    if (kind === '智能体') {
      return <Bot size={22} />;
    }
    if (kind === '工作流') {
      return <Workflow size={22} />;
    }
    return <Sparkles size={22} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-10 pb-32 px-4 lg:px-10 max-w-6xl mx-auto relative space-y-8"
    >
      <section className="relative h-[420px] lg:h-[500px] rounded-[60px] overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-dark-bg mt-16">
        <div className="absolute inset-0 z-0 bg-[#000510]">
          <img
            src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1920&q=80"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-[20000ms] ease-out brightness-100 contrast-110 saturate-125 select-none"
            alt="galaxy"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#000814]/30 via-transparent to-dark-bg z-20" />
        </div>

        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end p-12 lg:p-16 z-30">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 max-w-4xl"
          >
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-[72px] font-mono font-bold text-white tracking-[-0.06em] uppercase leading-[0.8] drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                <span className="block italic">{lang === 'CN' ? '蔚蓝智能' : 'AZURE AI'}</span>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-azure to-white">{lang === 'CN' ? 'OPC 社区' : 'OPC COMMUNITY'}</span>
              </h2>
            </div>

            <p className="text-white/80 font-mono text-sm leading-relaxed tracking-tight max-w-md drop-shadow-lg">
              {lang === 'CN' ? '连接全球每一位超级个体的数字化身。在这里进化、协作、并构建您的个人算力帝国。' : 'Connect with every digital persona in the AAGI matrix.'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-20 z-40 flex items-center justify-between rounded-[26px] border border-white/10 bg-[rgba(5,15,27,0.88)] px-5 py-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 lg:gap-4">
          {feedTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFeedTab(tab.id)}
              className={`relative rounded-full px-4 py-2 text-xs lg:text-sm font-medium transition-all ${
                activeFeedTab === tab.id
                  ? 'bg-white text-dark-bg shadow-[0_8px_18px_rgba(255,255,255,0.15)]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onPublish}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(20,209,160,0.38)]"
          aria-label={lang === 'CN' ? '发布内容' : 'Create'}
        >
          <Plus size={22} />
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#071220] p-1">
        <motion.div
          key={currentBannerItem.id}
          initial={{ opacity: 0.45, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[280px] lg:h-[320px] overflow-hidden rounded-[30px]"
        >
          <img src={currentBannerItem.image} alt={currentBannerItem.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-[#061220] via-[#061220]/58 to-[#061220]/20" />
          <div className="absolute inset-0 bg-linear-to-t from-[#061220]/90 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-8">
            <div className="inline-flex w-fit items-center rounded-full border border-white/16 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/72">
              {currentBannerItem.kicker}
            </div>

            <div className="max-w-2xl space-y-4">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-5xl font-semibold tracking-[-0.05em] leading-tight text-white">
                  {currentBannerItem.title}
                </h2>
                <p className="max-w-xl text-sm lg:text-base leading-7 text-white/72">
                  {currentBannerItem.subtitle}
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dark-bg transition-all hover:bg-primary"
              >
                {currentBannerItem.cta}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-5 right-5 z-20 flex gap-2 rounded-full bg-[#071220]/60 px-3 py-2 backdrop-blur-md">
          {COMMUNITY_BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentBanner(index)}
              className={`h-2.5 rounded-full transition-all ${currentBanner === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/30'}`}
              aria-label={banner.title}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {visibleFeed.map((item) => (
          <motion.div key={item.id} layout className={cardShell}>
            {item.type === 'aigc' && (
              <button type="button" className="w-full text-left">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={item.cover} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#061220]/72 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                    <Sparkles size={12} className="text-primary" />
                    AIGC 内容
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.author.avatar} alt={item.author.name} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 object-cover" />
                      <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-white">
                          {item.author.name}
                          {item.author.verified && <BadgeCheck size={14} className="text-primary" />}
                        </p>
                        <p className="text-[11px] text-white/40">{item.time}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/56">
                      {item.source}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold leading-tight text-white line-clamp-2">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/62 line-clamp-2">{item.summary}</p>
                  </div>

                  <div className="flex items-center gap-5 border-t border-white/8 pt-4 text-[12px] text-white/48">
                    <span className="inline-flex items-center gap-2"><Heart size={14} /> {item.likes}</span>
                    <span className="inline-flex items-center gap-2"><MessageSquare size={14} /> {item.comments}</span>
                    <span className="inline-flex items-center gap-2"><Share2 size={14} /> {item.shares}</span>
                  </div>
                </div>
              </button>
            )}

            {item.type === 'template' && (
              <div className="p-8 h-full flex flex-col justify-between space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <img src={item.author.avatar} className="w-10 h-10 rounded-full border border-primary/20 p-0.5 object-cover" alt={item.author.name} />
                  <p className="text-xs font-mono font-bold text-white/60 italic uppercase">
                    {item.author.name} {lang === 'CN' ? '上架了新模板' : 'PUBLISHED NEW TEMPLATE'}
                  </p>
                </div>
                <div className="flex-1 bg-white/5 rounded-3xl p-6 border border-white/5 group-hover:border-primary/20 transition-all flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary italic">
                    {renderTemplateIcon(item.templateKind)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase italic">{item.templateName}</h4>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">BLUEPRINT MODEL V1.2</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-2xl font-mono font-bold text-primary italic leading-none">{item.price}</p>
                    <p className="text-[10px] font-mono text-white/20 uppercase italic mt-1">{item.time}</p>
                  </div>
                  <button className="px-8 py-3 bg-white text-dark-bg font-mono font-bold text-[10px] rounded-full uppercase hover:bg-primary transition-all shadow-xl">
                    {lang === 'CN' ? '立即获取' : 'ACQUIRE'}
                  </button>
                </div>
              </div>
            )}

            {item.type === 'tournament' && (
              <button type="button" className="flex h-full w-full flex-col p-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-azure/20 bg-azure/12 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#91B7FF]">
                      <Trophy size={12} />
                      赛事战报
                    </span>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/60">{item.summary}</p>
                  </div>

                  <div className="rounded-[20px] border border-primary/20 bg-primary/10 px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-primary/72">{item.stage}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">{item.countdown}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/44">
                      {lang === 'CN' ? '排行榜快照' : 'Ranking snapshot'}
                    </p>
                    <p className="text-[11px] text-white/34">{lang === 'CN' ? '点击进入赛事详情' : 'Open tournament details'}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {item.rankings.map((ranking) => (
                      <div key={ranking.id} className="rounded-[20px] border border-white/8 bg-[#081728] p-4">
                        <div className="flex items-center gap-3">
                          <img src={ranking.avatar} alt={ranking.name} className="h-11 w-11 rounded-full border border-white/8 bg-white/5" />
                          <div>
                            <p className="text-sm font-medium text-white">{ranking.name}</p>
                            <p className="text-[11px] text-white/42">No.{ranking.id}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/62">{ranking.work}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            )}

            {item.type === 'sect' && (
              <button type="button" className="flex h-full w-full flex-col justify-between p-6 text-left">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img src={item.avatar} alt={item.name} className="h-16 w-16 rounded-[22px] border border-white/10 object-cover" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.name}</h3>
                      <p className="inline-flex items-center gap-2 text-sm text-primary">
                        <Users size={15} />
                        {lang === 'CN' ? `已有 ${item.members} 人加入` : `${item.members} members joined`}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                    <p className="text-sm font-medium leading-7 text-white">{item.pitch}</p>
                    <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] text-white/52">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-[11px] text-white/40">{lang === 'CN' ? '点击进入门派主页' : 'Open sect homepage'}</span>
                  <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-dark-bg">
                    {lang === 'CN' ? '一键申请加入' : 'Apply to join'}
                  </span>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const SuperCommunity: React.FC<{ lang: 'CN' | 'EN'; onPublish: () => void }> = ({ lang, onPublish }) => {
  const [activeCommunityTab, setActiveCommunityTab] = useState<CommunitySection>('discover');
  const [activeFeedTab, setActiveFeedTab] = useState<CommunityFeedTab>('recommend');
  const [activeMarketCategory, setActiveMarketCategory] = useState<(typeof MARKET_CATEGORIES)[number]>('全部');
  const [activeMarketSort, setActiveMarketSort] = useState<(typeof MARKET_SORT_OPTIONS)[number]>('热销');
  const [activeEventStatus, setActiveEventStatus] = useState<EventStatusFilter>('all');
  const [activeCircleCategory, setActiveCircleCategory] = useState<(typeof CIRCLE_CATEGORIES)[number]>('全部');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % COMMUNITY_BANNERS.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);

  const feedTabs: Array<{ id: CommunityFeedTab; label: string }> = [
    { id: 'follow', label: lang === 'CN' ? '关注' : 'FOLLOWING' },
    { id: 'recommend', label: lang === 'CN' ? '推荐' : 'RECOMMEND' },
    { id: 'trending', label: lang === 'CN' ? '热门' : 'HOT' },
  ];

  const visibleFeed = COMMUNITY_FEED
    .filter((item) => item.channels.includes(activeFeedTab))
    .sort((left, right) => right.heat - left.heat);

  const visibleMarketTemplates = [...MARKET_TEMPLATES]
    .filter((item) => activeMarketCategory === '全部' || item.kind === activeMarketCategory)
    .sort((left, right) => {
      if (activeMarketSort === '热销') return right.sold - left.sold;
      if (activeMarketSort === '最新') return right.id - left.id;
      if (activeMarketSort === '价格') {
        const priceValue = (price: string) => {
          if (price.includes('免费')) return 0;
          const match = price.match(/(\d+)/);
          return match ? Number(match[1]) : 0;
        };
        return priceValue(left.price) - priceValue(right.price);
      }
      return right.rating - left.rating;
    });

  const visibleEvents = COMMUNITY_EVENTS.filter((item) =>
    activeEventStatus === 'all' ? true : item.status === activeEventStatus
  );

  const visibleCircles = RECOMMENDED_CIRCLES.filter((item) =>
    activeCircleCategory === '全部' ? true : item.tags.includes(activeCircleCategory)
  );

  const currentBannerItem = COMMUNITY_BANNERS[currentBanner];
  const cardShell =
    'rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,22,39,0.96),rgba(6,16,29,0.94))] overflow-hidden transition-all duration-300 hover:border-primary/35 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)]';

  const renderTemplateIcon = (kind: TemplateCommunityItem['templateKind']) => {
    if (kind === '智能体') return <Bot size={22} />;
    if (kind === '工作流') return <Workflow size={22} />;
    return <Sparkles size={22} />;
  };

  const renderDiscoverSection = () => (
    <div className="space-y-8">
      <div className="sticky top-36 z-30 flex items-center justify-between rounded-[26px] border border-white/10 bg-[rgba(5,15,27,0.88)] px-5 py-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 lg:gap-4">
          {feedTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFeedTab(tab.id)}
              className={`relative rounded-full px-4 py-2 text-xs lg:text-sm font-medium transition-all ${
                activeFeedTab === tab.id
                  ? 'bg-white text-dark-bg shadow-[0_8px_18px_rgba(255,255,255,0.15)]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsPublishing(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(20,209,160,0.38)]"
          aria-label={lang === 'CN' ? '发布内容' : 'Create'}
        >
          <Plus size={22} />
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#071220] p-1">
        <motion.div
          key={currentBannerItem.id}
          initial={{ opacity: 0.45, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[280px] lg:h-[320px] overflow-hidden rounded-[30px]"
        >
          <img src={currentBannerItem.image} alt={currentBannerItem.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-[#061220] via-[#061220]/58 to-[#061220]/20" />
          <div className="absolute inset-0 bg-linear-to-t from-[#061220]/90 via-transparent to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-8">
            <div className="inline-flex w-fit items-center rounded-full border border-white/16 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/72">
              {currentBannerItem.kicker}
            </div>
            <div className="max-w-2xl space-y-4">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-5xl font-semibold tracking-[-0.05em] leading-tight text-white">{currentBannerItem.title}</h2>
                <p className="max-w-xl text-sm lg:text-base leading-7 text-white/72">{currentBannerItem.subtitle}</p>
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dark-bg transition-all hover:bg-primary">
                {currentBannerItem.cta}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-5 right-5 z-20 flex gap-2 rounded-full bg-[#071220]/60 px-3 py-2 backdrop-blur-md">
          {COMMUNITY_BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentBanner(index)}
              className={`h-2.5 rounded-full transition-all ${currentBanner === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/30'}`}
              aria-label={banner.title}
            />
          ))}
        </div>
      </section>

      <div className="community-masonry">
        {visibleFeed.map((item) => (
          <motion.div key={item.id} layout className="community-masonry-item">
            <div className={cardShell}>
            {item.type === 'aigc' && (
              <button type="button" className="w-full text-left">
                <div className={`relative overflow-hidden ${item.id % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
                  <img src={item.cover} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#061220]/72 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                    <Sparkles size={12} className="text-primary" />
                    作品内容
                  </div>
                </div>
                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.author.avatar} alt={item.author.name} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 object-cover" />
                      <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-white">
                          {item.author.name}
                          {item.author.verified && <BadgeCheck size={14} className="text-primary" />}
                        </p>
                        <p className="text-[11px] text-white/40">{item.time}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/56">{item.source}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold leading-tight text-white line-clamp-2">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/62 line-clamp-2">{item.summary}</p>
                  </div>
                  <div className="flex items-center gap-5 border-t border-white/8 pt-4 text-[12px] text-white/48">
                    <span className="inline-flex items-center gap-2"><Heart size={14} /> {item.likes}</span>
                    <span className="inline-flex items-center gap-2"><MessageSquare size={14} /> {item.comments}</span>
                    <span className="inline-flex items-center gap-2"><Share2 size={14} /> {item.shares}</span>
                  </div>
                </div>
              </button>
            )}

            {item.type === 'template' && (
              <div className="p-8 h-full flex flex-col justify-between space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <img src={item.author.avatar} className="w-10 h-10 rounded-full border border-primary/20 p-0.5 object-cover" alt={item.author.name} />
                  <p className="text-xs font-mono font-bold text-white/60 italic uppercase">
                    {item.author.name} {lang === 'CN' ? '上架了新模板' : 'PUBLISHED NEW TEMPLATE'}
                  </p>
                </div>
                <div className="flex-1 bg-white/5 rounded-3xl p-6 border border-white/5 group-hover:border-primary/20 transition-all flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary italic">
                    {renderTemplateIcon(item.templateKind)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase italic">{item.templateName}</h4>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">MARKET TEMPLATE</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-2xl font-mono font-bold text-primary italic leading-none">{item.price}</p>
                    <p className="text-[10px] font-mono text-white/20 uppercase italic mt-1">{item.time}</p>
                  </div>
                  <button className="px-8 py-3 bg-white text-dark-bg font-mono font-bold text-[10px] rounded-full uppercase hover:bg-primary transition-all shadow-xl">
                    {lang === 'CN' ? '进入市场详情' : 'OPEN MARKET'}
                  </button>
                </div>
              </div>
            )}

            {item.type === 'tournament' && (
              <button type="button" className="flex h-full w-full flex-col p-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-azure/20 bg-azure/12 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#91B7FF]">
                      <Trophy size={12} />
                      赛事动态
                    </span>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/60">{item.summary}</p>
                  </div>
                  <div className="rounded-[20px] border border-primary/20 bg-primary/10 px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-primary/72">{item.stage}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">{item.countdown}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/44">{lang === 'CN' ? '排行榜快照' : 'Ranking snapshot'}</p>
                    <p className="text-[11px] text-white/34">{lang === 'CN' ? '点击进入赛事详情' : 'Open tournament details'}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {item.rankings.map((ranking) => (
                      <div key={ranking.id} className="rounded-[20px] border border-white/8 bg-[#081728] p-4">
                        <div className="flex items-center gap-3">
                          <img src={ranking.avatar} alt={ranking.name} className="h-11 w-11 rounded-full border border-white/8 bg-white/5" />
                          <div>
                            <p className="text-sm font-medium text-white">{ranking.name}</p>
                            <p className="text-[11px] text-white/42">No.{ranking.id}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/62">{ranking.work}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            )}

            {item.type === 'sect' && (
              <button type="button" className="flex h-full w-full flex-col justify-between p-6 text-left">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img src={item.avatar} alt={item.name} className="h-16 w-16 rounded-[22px] border border-white/10 object-cover" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.name}</h3>
                      <p className="inline-flex items-center gap-2 text-sm text-primary">
                        <Users size={15} />
                        {lang === 'CN' ? `已有 ${item.members} 人加入` : `${item.members} members joined`}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                    <p className="text-sm font-medium leading-7 text-white">{item.pitch}</p>
                    <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] text-white/52">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-[11px] text-white/40">{lang === 'CN' ? '点击进入圈子主页' : 'Open circle page'}</span>
                  <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-dark-bg">{lang === 'CN' ? '立即加入' : 'JOIN NOW'}</span>
                </div>
              </button>
            )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMarketSection = () => (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,22,38,0.98),rgba(6,16,29,0.94))] p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary">市场 / 能力交易层</p>
            <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">{lang === 'CN' ? '把可复用的能力，卖成真正的生产工具。' : 'Turn reusable capabilities into tradable tools.'}</h3>
          </div>
          <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-white/40" />
            <input type="text" placeholder={lang === 'CN' ? '搜索智能体、工作流、AIGC 模板...' : 'Search agents, workflows, templates...'} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-hidden" />
            <button className="rounded-full border border-white/12 px-4 py-2 text-[11px] text-white/65">{lang === 'CN' ? '筛选' : 'Filter'}</button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: '类型', value: '智能体 / 工作流 / AIGC模板 / 数字人形象' },
            { label: '价格', value: '免费 / ¥1-49 / ¥50-199 / ¥200+' },
            { label: '场景', value: '电商带货 / 客服 / 内容创作 / 教育 / 品牌营销 / 政务' },
            { label: '评分', value: '4.5+ / 4.0+ / 3.0+' },
          ].map((item) => (
            <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/4 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {MARKET_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveMarketCategory(category)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              activeMarketCategory === category ? 'bg-white text-dark-bg' : 'border border-white/10 bg-white/5 text-white/58'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">{lang === 'CN' ? '排序' : 'Sort'}</p>
        {MARKET_SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            type="button"
            onClick={() => setActiveMarketSort(sort)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              activeMarketSort === sort ? 'bg-primary text-dark-bg' : 'border border-white/10 bg-white/5 text-white/58'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      <div className="community-masonry">
        {visibleMarketTemplates.map((item) => (
          <div key={item.id} className="community-masonry-item">
            <div className={cardShell}>
            <div className={`${item.id % 3 === 0 ? 'aspect-[4/5]' : item.id % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'} overflow-hidden`}>
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.authorAvatar} alt={item.author} className="h-10 w-10 rounded-full border border-white/10 object-cover bg-white/5" />
                  <div>
                    <p className="text-sm font-medium text-white">{item.author}</p>
                    <p className="text-[11px] text-white/42">{item.scene}</p>
                  </div>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">{item.kind}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                <div className="flex flex-wrap gap-4 text-[12px] text-white/50">
                  <span>{lang === 'CN' ? `已售 ${item.sold}` : `Sold ${item.sold}`}</span>
                  <span>{lang === 'CN' ? `评分 ${item.rating}` : `Rating ${item.rating}`}</span>
                  <span>{lang === 'CN' ? `作者赚了 ${item.authorYield}` : `Author earned ${item.authorYield}`}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-4">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-primary">{item.price}</p>
                <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-dark-bg transition-all hover:bg-primary">{lang === 'CN' ? '查看模板详情' : 'View template'}</button>
              </div>
            </div>
          </div>
          </div>
        ))}

        <div className="community-masonry-item">
          <div className="rounded-[28px] border border-primary/18 bg-[linear-gradient(165deg,rgba(17,49,79,0.96),rgba(8,22,38,0.94))] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">我的交易</p>
            <h4 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{lang === 'CN' ? '购买、上架、收益，一处回看。' : 'Track purchases, listings, and earnings in one place.'}</h4>
            <p className="mt-3 text-sm leading-7 text-white/68">{lang === 'CN' ? '快速进入我购买的模板和我上架的成果。' : 'Quick access to purchased and listed assets.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white">我购买的</button>
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-dark-bg">我上架的</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventsSection = () => (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10">
        <img src={COMMUNITY_EVENTS[0].image} alt={COMMUNITY_EVENTS[0].title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-[#061220] via-[#061220]/55 to-[#061220]/25" />
        <div className="relative z-10 space-y-5 p-7 lg:p-9">
          <span className="inline-flex rounded-full border border-white/16 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/72">当前主推赛事</span>
          <div className="space-y-3">
            <h3 className="max-w-2xl text-3xl lg:text-5xl font-semibold tracking-[-0.05em] text-white">{COMMUNITY_EVENTS[0].title}</h3>
            <p className="text-base text-white/72">{COMMUNITY_EVENTS[0].prize}</p>
            <p className="text-sm text-primary">{lang === 'CN' ? '报名倒计时 2天 14:24:10' : 'Registration ends in 2d 14:24:10'}</p>
          </div>
          <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dark-bg transition-all hover:bg-primary">{lang === 'CN' ? '立即报名' : 'Register now'}</button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {EVENT_STATUS_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveEventStatus(item.id)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              activeEventStatus === item.id ? 'bg-white text-dark-bg' : 'border border-white/10 bg-white/5 text-white/58'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="community-masonry">
        {visibleEvents.map((item) => (
          <div key={item.id} className="community-masonry-item">
            <div className={cardShell}>
            <div className={`${item.id === 1 ? 'aspect-[16/11]' : item.id % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[16/10]'} overflow-hidden`}>
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-[11px] ${
                  item.status === 'registration'
                    ? 'bg-primary/12 text-primary'
                    : item.status === 'ongoing'
                      ? 'bg-sky-400/12 text-sky-200'
                      : item.status === 'review'
                        ? 'bg-amber-400/12 text-amber-200'
                        : 'bg-white/10 text-white/55'
                }`}>{item.statusLabel}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/55">{item.type}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h4>
                <p className="text-sm text-white/66">{item.prize}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] text-white/46">
                <span>{lang === 'CN' ? `报名人数 ${item.participants}` : `Signups ${item.participants}`}</span>
                <span>{item.range}</span>
              </div>
            </div>
          </div>
          </div>
        ))}

        {EVENT_TYPE_LIBRARY.map((item, index) => (
          <div key={item.name} className="community-masonry-item">
            <div className={`rounded-[28px] border p-6 ${index === 0 ? 'border-primary/18 bg-[linear-gradient(165deg,rgba(17,49,79,0.96),rgba(8,22,38,0.94))]' : 'border-white/10 bg-[linear-gradient(180deg,rgba(8,22,38,0.98),rgba(6,16,29,0.94))]'}`}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary">赛事类型</p>
              <h4 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">{item.name}</h4>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCirclesSection = () => (
    <div className="space-y-6 pb-16">
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,22,38,0.98),rgba(6,16,29,0.94))] p-6 lg:p-8">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">我的圈子</p>
          <h4 className="text-2xl font-semibold tracking-[-0.04em] text-white">和谁一起做事，比做什么更重要。</h4>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {MY_CIRCLES.map((circle) => (
              <button key={circle.id} className="min-w-[120px] rounded-[22px] border border-white/10 bg-white/5 p-4 text-left">
                <img src={circle.avatar} alt={circle.name} className="h-14 w-14 rounded-2xl object-cover" />
                <p className="mt-3 text-sm font-medium text-white">{circle.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {CIRCLE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCircleCategory(category)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              activeCircleCategory === category ? 'bg-white text-dark-bg' : 'border border-white/10 bg-white/5 text-white/58'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="community-masonry">
        {visibleCircles.map((item) => (
          <div key={item.id} className="community-masonry-item">
            <div className={cardShell}>
              <div className="space-y-5 p-6">
                <div className="flex items-center gap-4">
                  <img src={item.avatar} alt={item.name} className="h-24 w-24 rounded-[26px] object-cover" />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.name}</h4>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/58">{item.joinMode}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[12px] text-white/46">
                      <span>{lang === 'CN' ? `成员 ${item.members}` : `Members ${item.members}`}</span>
                      <span>{lang === 'CN' ? `本周动态 ${item.weeklyPosts}` : `Weekly posts ${item.weeklyPosts}`}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-7 text-white/62">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] text-white/54">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="community-masonry-item">
          <div className="rounded-[28px] border border-primary/18 bg-[linear-gradient(165deg,rgba(17,49,79,0.96),rgba(8,22,38,0.94))] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-primary">活跃榜</p>
            <h4 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">本周活跃度 Top 20</h4>
            <div className="mt-5 space-y-3">
              {ACTIVE_CIRCLE_RANKING.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/4 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">No.{item.id} {item.name}</p>
                    <p className="text-[11px] text-white/42">{lang === 'CN' ? `活跃度 ${item.score}` : `Score ${item.score}`}</p>
                  </div>
                  <span className="text-sm text-primary">{item.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="community-masonry-item">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,22,38,0.98),rgba(6,16,29,0.94))] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-primary">圈子内部结构</p>
            <h4 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">已加入后看到的三个核心空间</h4>
            <div className="mt-5 space-y-3">
              {[
                { name: '动态', desc: '成员发帖、最新 / 最热排序、圈主置顶。' },
                { name: '资产', desc: '共享 Prompt、工作流片段、数字人形象和课程笔记。' },
                { name: '活动', desc: '线上分享、作品互评、内部挑战、线下聚会。' },
              ].map((item) => (
                <div key={item.name} className="rounded-[18px] border border-white/8 bg-white/4 p-4">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 z-30 rounded-full bg-primary px-5 py-3 text-sm font-medium text-dark-bg shadow-[0_0_30px_rgba(20,209,160,0.3)]">
        + 创建圈子
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-10 pb-32 px-4 lg:px-10 max-w-6xl mx-auto relative space-y-8"
    >
      <section className="relative h-[360px] lg:h-[420px] rounded-[54px] overflow-hidden group shadow-[0_36px_90px_rgba(0,0,0,0.78)] border border-white/10 bg-dark-bg mt-16">
        <div className="absolute inset-0 z-0 bg-[#000510]">
          <img
            src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1920&q=80"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-[20000ms] ease-out brightness-100 contrast-110 saturate-125 select-none"
            alt="galaxy"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#000814]/30 via-transparent to-dark-bg z-20" />
        </div>
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end p-10 lg:p-14 z-30">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 max-w-5xl"
          >
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-[72px] font-mono font-bold text-white tracking-[-0.06em] uppercase leading-[0.8] drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                <span className="block italic">{lang === 'CN' ? '蔚蓝智能' : 'AZURE AI'}</span>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-azure to-white">{lang === 'CN' ? 'OPC 社区' : 'OPC COMMUNITY'}</span>
              </h2>
            </div>
            <p className="text-white/80 font-mono text-sm leading-relaxed tracking-tight max-w-md drop-shadow-lg">
              {lang === 'CN' ? '连接全球每一位超级个体的数字化身。在这里进化、协作、并构建您的个人算力帝国。' : 'Connect with every digital persona in the AAGI matrix.'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-20 z-40 rounded-[28px] border border-white/10 bg-[rgba(5,15,27,0.92)] px-3 py-3 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {COMMUNITY_SECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCommunityTab(tab.id)}
              className={`rounded-[22px] border px-4 py-3 text-left transition-all ${
                activeCommunityTab === tab.id
                  ? 'border-primary/30 bg-white text-dark-bg shadow-[0_8px_18px_rgba(255,255,255,0.16)]'
                  : 'border-white/8 bg-white/3 text-white/68 hover:border-white/16 hover:bg-white/7 hover:text-white'
              }`}
            >
              <p className="text-[15px] font-semibold tracking-[-0.02em]">{tab.label}</p>
              <p className={`mt-1 text-[11px] leading-5 ${activeCommunityTab === tab.id ? 'text-slate-500' : 'text-white/42'}`}>{tab.description}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCommunityTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeCommunityTab === 'discover' && renderDiscoverSection()}
          {activeCommunityTab === 'market' && renderMarketSection()}
          {activeCommunityTab === 'events' && renderEventsSection()}
          {activeCommunityTab === 'circles' && renderCirclesSection()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isPublishing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPublishing(false)}
              className="fixed inset-0 bg-dark-bg/60 backdrop-blur-2xl z-[70]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 rounded-t-[40px] border-t border-white/10 bg-[#071220] z-[80] p-8 lg:p-12 shadow-[0_-24px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto max-w-5xl space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-primary">发布面板</p>
                    <h4 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">把创作投向社区、市场、圈子和赛事。</h4>
                  </div>
                  <button onClick={() => setIsPublishing(false)} className="h-11 w-11 rounded-full border border-white/10 bg-white/5 text-white/55">
                    <Plus className="mx-auto rotate-45" size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: '发布作品', desc: '图文 / 视频 / 数字人播报' },
                    { title: '上架模板', desc: '跳转市场发布流程' },
                    { title: '分享动态到圈子', desc: '把内容同步到圈子关系网' },
                    { title: '提交赛事作品', desc: '进入赛事投稿链路' },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        setIsPublishing(false);
                        onPublish();
                      }}
                      className="rounded-[24px] border border-white/10 bg-white/4 p-5 text-left transition-all hover:border-primary/30 hover:bg-primary/10"
                    >
                      <p className="text-lg font-medium text-white">{item.title}</p>
                      <p className="mt-3 text-sm leading-6 text-white/58">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const Profile: React.FC<{ lang: 'CN' | 'EN' }> = ({ lang }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 pb-40 px-6 lg:px-12 max-w-6xl mx-auto space-y-12"
    >
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        <div className="relative">
          <div className="w-40 h-40 rounded-full p-2 border-2 border-primary/30 relative">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-dark-bg shadow-2xl">
                <img src={argiCat} alt="avatar" className="w-full h-full object-cover" />
              </div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-r-2 border-primary border-dashed rounded-full pointer-events-none" 
             />
          </div>
          <div className="absolute -bottom-2 right-4 bg-primary text-dark-bg p-2 rounded-xl shadow-lg ring-4 ring-dark-bg">
            <Zap size={20} />
          </div>
        </div>
        
        <div className="space-y-6 flex-1">
          <div>
            <h2 className="text-4xl font-mono font-bold tracking-tighter text-white italic">Argi.THE.SI <BadgeCheck className="inline ml-2 text-primary" size={32} /></h2>
            <p className="text-sm font-mono text-white/80 mt-2 uppercase tracking-widest">{lang === 'CN' ? '数字化架构师 & 超级个体' : 'Digital Architect & Super Individual'}</p>
          </div>
          <div className="flex gap-10 justify-center md:justify-start">
            {[
              { label: lang === 'CN' ? '关注量' : 'SUBS', val: '2.4k' },
              { label: lang === 'CN' ? '节点数' : 'NODES', val: '45' },
              { label: lang === 'CN' ? '算力值' : 'YIELD', val: '12w' }
            ].map((stat, i) => (
             <div key={i} className="flex flex-col">
               <span className="font-mono font-bold text-3xl text-white italic tracking-tighter">{stat.val}</span>
               <span className="text-[8px] font-mono text-white/60 tracking-[0.3em] font-bold mt-1 uppercase">{stat.label}</span>
             </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-6 gap-6">
        <div className="bento-card col-span-6 md:col-span-4 grid grid-cols-3 gap-6 !p-8">
           <h2 className="col-span-3 text-[10px] font-mono text-white uppercase tracking-widest mb-2">{lang === 'CN' ? '保险库权限' : 'VAULT ACCESS'}</h2>
           {[
             { icon: <BadgeCheck />, label: lang === 'CN' ? '认证' : 'CERTS' },
             { icon: <Trophy />, label: lang === 'CN' ? '荣誉' : 'BADGES' },
             { icon: <Ghost />, label: lang === 'CN' ? '数字化身' : 'PERSONA' },
             { icon: <ShoppingBag />, label: lang === 'CN' ? '蓝图' : 'PRINTS' },
             { icon: <Cpu />, label: lang === 'CN' ? '算力组件' : 'HARDWARE' },
             { icon: <Layout />, label: lang === 'CN' ? '元数据' : 'METADATA' }
           ].map((item, i) => (
             <button key={i} className="flex flex-col items-center gap-3 group">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-dark-bg transition-all duration-500">{item.icon}</div>
               <span className="text-[8px] font-mono font-bold tracking-widest text-white/80 group-hover:text-primary transition-colors uppercase">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="col-span-6 md:col-span-2 space-y-6">
           <div className="bento-card border-none bg-linear-to-br from-primary to-deep-blue text-dark-bg flex flex-col justify-between h-full group">
              <Settings className="mb-8 group-hover:rotate-90 transition-transform duration-700" />
              <div className="space-y-4">
                 <button className="w-full text-left font-mono font-bold text-xs border-b border-dark-bg/10 pb-2 flex justify-between uppercase">{lang === 'CN' ? '核心设置' : 'CORE SETTINGS'} <ChevronRight size={14}/></button>
                 <button className="w-full text-left font-mono font-bold text-xs border-b border-dark-bg/10 pb-2 flex justify-between uppercase">{lang === 'CN' ? '网络同步' : 'NETWORK'} <ChevronRight size={14}/></button>
                 <button className="w-full text-left font-mono font-bold text-xs pb-2 flex justify-between text-red-900 group-hover:text-red-700 transition-colors uppercase">{lang === 'CN' ? '注销身份' : 'TERMINATE'} <LogOut size={14}/></button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('community');
  const [lang, setLang] = useState<'CN' | 'EN'>('CN');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);

  return (
    <div className={`min-h-screen font-sans select-none overflow-x-hidden${theme === 'dark' ? ' bg-[#010409] text-white' : ' bg-slate-50 text-slate-900'}`}>
      {/* Video background only in dark mode */}
      {theme === 'dark' && (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-18 scale-110 blur-[1px] brightness-60"
        >
          <source src="https://player.vimeo.com/external/370364966.hd.mp4?s=12643a6d9620ed737976865d44445353&profile_id=175" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#010409_88%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#05101c]/28 via-[#081220]/42 to-[#010409]" />
      </div>
      )}

      <GlobalTopBar lang={lang} setLang={setLang} />
      
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />
      <AISecretary lang={lang} isOpen={isAssistantOpen} setIsOpen={setIsAssistantOpen} />
      
      <main className={`relative z-10 pl-24 lg:pl-32 pr-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAssistantOpen ? 'lg:pr-96' : 'lg:pr-0'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'education' && <EducationModule key="edu" />}
          {activeTab === 'market' && <AgentMarketModule key="mkt" />}
          {activeTab === 'creation' && <CreationModule key="crt" />}
          {activeTab === 'community' && <CommunityModule key="com" />}
          {activeTab === 'hardware' && <HardwareModule key="hw" activeTab="library" />}
          {activeTab === 'profile' && <Profile key="p" lang={lang} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
