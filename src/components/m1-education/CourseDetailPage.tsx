'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft, Star, Users, Clock, BookOpen, Award,
  CheckCircle2, Lock, Play, FileText, MessageSquare,
  ChevronDown, ChevronUp, X, Zap, Send, Download, Trophy
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Types ─────────────────────────────────────────────────────────────────────

type QuestionType = 'single' | 'multiple' | 'judge'

interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number | number[]
  explanation: string
}

interface Chapter {
  id: string
  title: string
  duration: string
  isFree: boolean
  hasQuiz: boolean
  quiz?: QuizQuestion[]
}

interface CourseDetail {
  id: string
  title: string
  subtitle: string
  thumbnail: string
  instructor: string
  instructorAvatar: string
  instructorTitle: string
  rating: number
  reviewCount: number
  studentCount: number
  duration: string
  level: string
  price: number
  originalPrice: number
  category: string
  tags: string[]
  chapters: Chapter[]
  isEnrolled: boolean
  progress: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const COURSE_DETAIL: CourseDetail = {
  id: 'c1',
  title: 'AI 运营实战训练营',
  subtitle: '从 0 到 1 打造百万级私域流量，28天系统化课程',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
  instructor: '张运营',
  instructorAvatar: 'https://i.pravatar.cc/150?img=32',
  instructorTitle: '前字节跳动运营总监',
  rating: 4.9,
  reviewCount: 1847,
  studentCount: 3847,
  duration: '42课时',
  level: '进阶',
  price: 2999,
  originalPrice: 4999,
  category: '运营增长',
  tags: ['私域运营', 'AI工具', '内容创作'],
  isEnrolled: true,
  progress: 35,
  chapters: [
    {
      id: 'ch1',
      title: '第一章：AI运营认知与工具选择',
      duration: '3课时 · 2.5小时',
      isFree: true,
      hasQuiz: true,
      quiz: [
        {
          id: 'q1',
          type: 'single',
          question: '以下哪个不是AI运营的核心场景？',
          options: ['私域流量获取', '内容自动生成', '财务核算自动化', '用户画像分析'],
          correctAnswer: 2,
          explanation: '财务核算是财务部门的职责，不属于AI运营的核心场景。',
        },
        {
          id: 'q2',
          type: 'multiple',
          question: 'AI运营工具可以应用在哪些场景？（多选）',
          options: ['自动生成朋友圈文案', '智能客服回复', '财务自动做账', '用户标签化管理', '竞品数据监控'],
          correctAnswer: [0, 1, 3, 4],
          explanation: 'AI运营工具主要用于内容生成、客服、用户管理和数据分析，财务不在此列。',
        },
        {
          id: 'q3',
          type: 'judge',
          question: 'AI生成的文案可以直接用于正式投放，无需人工审核。',
          options: ['正确', '错误'],
          correctAnswer: 1,
          explanation: 'AI文案必须经过人工审核，确保品牌调性和合规性后才能正式使用。',
        },
      ],
    },
    {
      id: 'ch2',
      title: '第二章：私域流量获取与承接',
      duration: '5课时 · 4小时',
      isFree: false,
      hasQuiz: true,
      quiz: [
        {
          id: 'q4',
          type: 'single',
          question: '私域流量的核心价值是什么？',
          options: ['免费获取', '反复触达', '数据可控', '以上全部'],
          correctAnswer: 3,
          explanation: '私域流量的三大核心价值：低成本/零成本反复触达用户、数据资产自主掌控、用户关系可深度运营。',
        },
      ],
    },
    {
      id: 'ch3',
      title: '第三章：内容创作方法论',
      duration: '4课时 · 3.5小时',
      isFree: false,
      hasQuiz: false,
    },
    {
      id: 'ch4',
      title: '第四章：转化链路设计与AB测试',
      duration: '6课时 · 5小时',
      isFree: false,
      hasQuiz: false,
    },
    {
      id: 'ch5',
      title: '第五章：数据分析与优化迭代',
      duration: '5课时 · 4小时',
      isFree: false,
      hasQuiz: false,
    },
    {
      id: 'ch6',
      title: '结业考试',
      duration: '3小时',
      isFree: false,
      hasQuiz: false,
    },
  ],
}

const RELATED_COMPETITIONS = [
  {
    id: 'comp-edu-1',
    title: '2026 AI 创新创业大赛',
    prize: '¥50,000',
    deadline: '2026-06-01',
    participants: 1247,
    status: '报名中',
    statusColor: '#14D1A0',
    description: '完成本课程即可解锁专属参赛资格',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80',
  },
  {
    id: 'comp-edu-2',
    title: '数字人直播 PK 赛',
    prize: '¥5,000',
    deadline: '2026-06-15',
    participants: 342,
    status: '进行中',
    statusColor: '#A855F7',
    description: '学完课程获得赛前练习资格',
    banner: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
  },
]

// ─── Quiz Component ─────────────────────────────────────────────────────────────

function QuizModal({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const questions = chapter.quiz || []
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const q = questions[currentQ]
  const totalScore = questions.length
  const earnedScore = questions.filter(qq => {
    const ans = answers[qq.id]
    if (ans === undefined) return false
    if (Array.isArray(qq.correctAnswer)) {
      return Array.isArray(ans) && qq.correctAnswer.length === ans.length && qq.correctAnswer.every((v: number) => ans.includes(v))
    }
    return ans === qq.correctAnswer
  }).length

  const isCorrect = (qq: QuizQuestion) => {
    const ans = answers[qq.id]
    if (ans === undefined) return false
    if (Array.isArray(qq.correctAnswer)) {
      return Array.isArray(ans) && qq.correctAnswer.length === ans.length && qq.correctAnswer.every((v: number) => ans.includes(v))
    }
    return ans === qq.correctAnswer
  }

  const handleSelect = (optionIdx: number) => {
    if (submitted) return
    const newAnswers = { ...answers }
    if (q.type === 'multiple') {
      const current: number[] = Array.isArray(newAnswers[q.id]) ? [...newAnswers[q.id]] : []
      if (current.includes(optionIdx)) {
        newAnswers[q.id] = current.filter(i => i !== optionIdx)
      } else {
        newAnswers[q.id] = [...current, optionIdx]
      }
    } else {
      newAnswers[q.id] = optionIdx
    }
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowResult(true)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[560px] max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>章节测验</p>
            <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{chapter.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>问题 {currentQ + 1} / {questions.length}</span>
            {submitted ? (
              <span className="font-bold text-emerald-600">{earnedScore}/{totalScore} 正确</span>
            ) : null}
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="px-6 py-5">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                q.type === 'single' ? 'bg-blue-50 text-blue-600' :
                q.type === 'multiple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : '判断题'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-relaxed">{q.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = Array.isArray(answers[q.id])
                ? answers[q.id].includes(i)
                : answers[q.id] === i
              const correct = submitted && (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(i) : q.correctAnswer === i)
              const wrong = submitted && selected && !correct
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                    submitted
                      ? correct
                        ? 'border-emerald-400 bg-emerald-50'
                        : wrong
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-200 bg-slate-50'
                      : selected
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    submitted
                      ? correct
                        ? 'bg-emerald-500 text-white'
                        : wrong
                          ? 'bg-red-400 text-white'
                          : 'bg-slate-200 text-slate-500'
                      : selected
                        ? 'bg-emerald-500 text-white'
                        : 'border border-slate-300 text-slate-400'
                  }`}>
                    {submitted && correct ? <CheckCircle2 className="h-4 w-4" /> :
                     submitted && wrong ? <X className="h-4 w-4" /> :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span className={`flex-1 ${submitted && (correct || wrong) ? 'font-medium' : ''} ${
                    submitted && correct ? 'text-emerald-700' :
                    submitted && wrong ? 'text-red-700' : 'text-slate-700'
                  }`}>{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {submitted && showResult && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-600">答案解析</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4">
          {submitted ? (
            currentQ < questions.length - 1 ? (
              <button
                onClick={() => { setCurrentQ(c => c + 1); setShowResult(false) }}
                className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600"
              >
                下一题
              </button>
            ) : (
              <div className="space-y-2">
                <div className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${
                  earnedScore >= totalScore * 0.6 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {earnedScore >= totalScore * 0.6 ? <CheckCircle2 className="h-5 w-5" /> : null}
                  测验完成：{earnedScore}/{totalScore} 正确
                  {earnedScore >= totalScore * 0.6 ? ' — 已解锁下一章' : ' — 继续加油！'}
                </div>
                <button
                  onClick={onClose}
                  className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  返回课程
                </button>
              </div>
            )
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers[q.id] === undefined}
              className={`w-full rounded-2xl py-3 text-sm font-bold transition-all ${
                answers[q.id] !== undefined
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              提交答案
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Exam Component ─────────────────────────────────────────────────────────────

function ExamModal({ course, onClose }: { course: CourseDetail; onClose: () => void }) {
  const questions: QuizQuestion[] = course.chapters
    .filter(c => c.hasQuiz && c.quiz)
    .flatMap(c => c.quiz!)
    .slice(0, 5) // 取前5题组成小考卷

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 min

  useEffect(() => {
    if (submitted) return
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setSubmitted(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [submitted])

  const totalScore = questions.length
  const earnedScore = questions.filter(q => {
    const ans = answers[q.id]
    if (ans === undefined) return false
    if (Array.isArray(q.correctAnswer)) {
      return Array.isArray(ans) && q.correctAnswer.length === ans.length && q.correctAnswer.every((v: number) => ans.includes(v))
    }
    return ans === q.correctAnswer
  }).length
  const percentage = Math.round((earnedScore / totalScore) * 100)
  const passed = percentage >= 60

  const handleSelect = (optionIdx: number) => {
    if (submitted) return
    const newAnswers = { ...answers }
    if (questions[currentQ].type === 'multiple') {
      const current: number[] = Array.isArray(newAnswers[questions[currentQ].id]) ? [...newAnswers[questions[currentQ].id]] : []
      if (current.includes(optionIdx)) {
        newAnswers[questions[currentQ].id] = current.filter(i => i !== optionIdx)
      } else {
        newAnswers[questions[currentQ].id] = [...current, optionIdx]
      }
    } else {
      newAnswers[questions[currentQ].id] = optionIdx
    }
    setAnswers(newAnswers)
  }

  const handleSubmit = () => setSubmitted(true)

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[560px] max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>结业考试</p>
            <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{course.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!submitted ? (
          <>
            {/* Timer */}
            <div className="px-6 pt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">剩余时间</span>
                <span className="font-mono text-sm font-bold text-amber-600">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-amber-500 transition-all" style={{ width: `${(timeLeft / (30 * 60)) * 100}%` }} />
              </div>
            </div>

            {/* Question count dots */}
            <div className="px-6 pt-3 flex gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-all ${
                  i === currentQ ? 'bg-emerald-500 w-4' :
                  answers[questions[i].id] !== undefined ? 'bg-emerald-300' : 'bg-slate-200'
                }`} />
              ))}
            </div>

            {/* Question */}
            {questions.length > 0 && (() => {
              const q = questions[currentQ]
              return (
                <div className="px-6 py-5">
                  <div className="mb-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                        {q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : '判断题'}
                      </span>
                      <span className="text-xs text-slate-400">第{currentQ + 1}题</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-relaxed">{q.question}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {q.options.map((opt, i) => {
                      const selected = Array.isArray(answers[q.id]) ? answers[q.id].includes(i) : answers[q.id] === i
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                            selected
                              ? 'border-emerald-400 bg-emerald-50'
                              : 'border-slate-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            selected ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className={selected ? 'font-medium text-emerald-700' : 'text-slate-700'}>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Footer nav */}
            <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQ(c => Math.max(0, c - 1))}
                  disabled={currentQ === 0}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  上一题
                </button>
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ(c => c + 1)}
                    className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600"
                  >
                    下一题
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < questions.length}
                    className={`flex-1 rounded-2xl py-3 text-sm font-bold transition-all ${
                      Object.keys(answers).length >= questions.length
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    提交考试
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Result screen */
          <div className="px-6 py-8">
            <div className="mb-6 text-center">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                passed ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                {passed ? (
                  <Award className="h-10 w-10 text-emerald-600" />
                ) : (
                  <FileText className="h-10 w-10 text-amber-600" />
                )}
              </div>
              <h3 className={`mb-1 text-2xl font-bold ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {passed ? '恭喜通过！' : '继续加油'}
              </h3>
              <p className="text-sm text-slate-500">{passed ? '你已获得本课程结业证书' : '60分及格，再接再厉'}</p>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{percentage}%</p>
                <p className="text-xs text-slate-500">得分率</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{earnedScore}</p>
                <p className="text-xs text-slate-500">正确题数</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{totalScore - earnedScore}</p>
                <p className="text-xs text-slate-500">错误题数</p>
              </div>
            </div>

            {passed && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-4">
                <Award className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">电子证书已生成，可下载</span>
                <button className="ml-2 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                  <Download className="h-3 w-3" />下载证书
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              返回课程
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CourseDetailPage Component ────────────────────────────────────────────────

export default function CourseDetailPage({
  course,
  onBack,
  onEnroll
}: {
  course: typeof COURSE_DETAIL
  onBack: () => void
  onEnroll?: (courseId: string) => void
}) {
  const [activeChapter, setActiveChapter] = useState<string | null>(course.chapters[0]?.id || null)
  const [showQuiz, setShowQuiz] = useState<Chapter | null>(null)
  const [showExam, setShowExam] = useState(false)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  const progress = course.progress
  const isEnrolled = course.isEnrolled

  const [toastSuccess, setToastSuccess] = useState<string | null>(null)
  const { loading: joinLoading, execute: executeJoin } = useAction(
    async (compTitle: string) => {
      await new Promise(r => setTimeout(r, 800))
      return compTitle
    },
    {
      onSuccess: (compTitle) => {
        setToastSuccess(`已报名「${compTitle}」，请关注赛事通知`)
        setTimeout(() => setToastSuccess(null), 3000)
      },
    }
  )

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>课程详情</p>
          <h1 className="text-base font-bold text-slate-900 truncate" style={{ fontFamily: 'Space Grotesk, monospace' }}>{course.title}</h1>
        </div>
        {!isEnrolled && (
          <button
            onClick={() => onEnroll?.(course.id)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            ¥{course.price.toLocaleString()} 立即购买
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: course info */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <div className="mb-6 overflow-hidden rounded-2xl">
            <img src={course.thumbnail} alt={course.title} className="h-48 w-full object-cover" />
          </div>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">{course.level}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{course.category}</span>
            {course.tags.map(t => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">#{t}</span>
            ))}
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{course.title}</h2>
          <p className="mb-4 text-sm text-slate-500 leading-relaxed">{course.subtitle}</p>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            {[
              { icon: Star, label: '评分', value: `${course.rating} (${course.reviewCount})`, color: 'text-amber-500' },
              { icon: Users, label: '学员', value: course.studentCount.toLocaleString(), color: 'text-emerald-600' },
              { icon: Clock, label: '时长', value: course.duration, color: 'text-blue-600' },
              { icon: BookOpen, label: '章节', value: `${course.chapters.length}章`, color: 'text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
                <p className="text-sm font-bold text-slate-900">{value}</p>
                <p className="text-[10px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-bold text-slate-400">讲师介绍</p>
            <div className="flex items-center gap-3">
              <img src={course.instructorAvatar} className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100" />
              <div>
                <p className="font-bold text-slate-900">{course.instructor}</p>
                <p className="text-xs text-slate-500">{course.instructorTitle}</p>
              </div>
              <button className="ml-auto rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                + 关注
              </button>
            </div>
          </div>

          {/* Chapter list */}
          <div>
            <p className="mb-3 text-xs font-bold text-slate-400">课程大纲</p>
            <div className="space-y-2">
              {course.chapters.map((ch, i) => {
                const isLast = i === course.chapters.length - 1
                const isExam = ch.title.includes('考试')
                const isUnlocked = isEnrolled && (i === 0 || course.progress >= (i / course.chapters.length) * 100 * 0.7)
                const isExpanded = expandedChapter === ch.id

                return (
                  <div key={ch.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <button
                      onClick={() => isUnlocked ? setExpandedChapter(isExpanded ? null : ch.id) : null}
                      className={`w-full flex items-center gap-3 p-4 text-left ${!isUnlocked ? 'opacity-60' : ''}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isExam ? 'bg-amber-100 text-amber-600' :
                        ch.isFree ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {isExam ? <Award className="h-4 w-4" /> :
                         isUnlocked ? (i + 1) : <Lock className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                          {ch.title}
                        </p>
                        <p className="text-xs text-slate-400">{ch.duration}</p>
                      </div>
                      {ch.hasQuiz && isUnlocked && (
                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">有测验</span>
                      )}
                      {ch.isFree && !isEnrolled && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">免费试看</span>
                      )}
                      {isUnlocked && !isExam && (ch.hasQuiz || isExpanded) && (
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Expanded content */}
                    {isExpanded && !isExam && (
                      <div className="border-t border-slate-100 p-4">
                        <div className="mb-3 flex gap-2">
                          <button
                            onClick={() => ch.quiz && setShowQuiz(ch)}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                          >
                            <FileText className="h-3.5 w-3.5" />章节测验
                          </button>
                          <button className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-100">
                            <Play className="h-3.5 w-3.5" />开始学习
                          </button>
                        </div>
                      </div>
                    )}

                    {isExam && isUnlocked && (
                      <div className="border-t border-slate-100 p-4">
                        <button
                          onClick={() => setShowExam(true)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600"
                        >
                          <Award className="h-4 w-4" />参加结业考试
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-slate-200 pt-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">用户评价</h3>
              <button className="text-xs text-[#14D1A0] font-medium hover:underline">写评价</button>
            </div>
            <div className="space-y-3">
              {[
                { avatar: 'https://i.pravatar.cc/150?img=11', name: '林学员', rating: 5, date: '2026-04-12', text: '张运营老师讲得非常系统！私域流量这块终于学明白了，3天就建了3个500人社群。', course: 'AI 运营实战训练营' },
                { avatar: 'https://i.pravatar.cc/150?img=22', name: '王营销', rating: 5, date: '2026-04-08', text: 'AI工具那章超实用，直接拿来用在工作里，领导还以为我加班到很晚 😂', course: 'AI 运营实战训练营' },
                { avatar: 'https://i.pravatar.cc/150?img=33', name: '陈小白', rating: 4, date: '2026-03-30', text: '入门友好！以前完全不懂私域，现在能独立做活动策划了，案例拆解特别清晰。', course: 'AI 运营实战训练营' },
              ].map((r, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <img src={r.avatar} className="h-8 w-8 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-slate-900">{r.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({length: r.rating}).map((_, si) => <span key={si} className="text-amber-400 text-xs">★</span>)}
                          {Array.from({length: 5 - r.rating}).map((_, si) => <span key={si} className="text-slate-200 text-xs">★</span>)}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">{r.date} · {r.course}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sticky enrollment panel */}
        <div className="w-72 shrink-0 border-l border-slate-200 bg-white p-5">
          {isEnrolled ? (
            <div className="sticky top-6 space-y-4">
              {/* Progress */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">学习进度</span>
                  <span className="font-bold text-emerald-600">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">继续学习第{Math.ceil((progress / 100) * course.chapters.length)}章</p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600">
                  <Play className="h-4 w-4" />继续学习
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  <MessageSquare className="h-4 w-4" />学习讨论区
                </button>
              </div>

              {/* Completion badge */}
              <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3">
                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-700">完成结业考试获得证书</p>
                  <p className="text-[10px] text-amber-600">考试通过率：78%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-6 space-y-4">
              <div className="text-center">
                <p className="mb-1 text-3xl font-bold text-emerald-600">¥{course.price.toLocaleString()}</p>
                {course.originalPrice > 0 && (
                  <p className="text-sm text-slate-400 line-through">原价 ¥{course.originalPrice.toLocaleString()}</p>
                )}
              </div>
              <button
                onClick={() => onEnroll?.(course.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600"
              >
                立即报名
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <Play className="h-4 w-4" />免费试看第一章
              </button>
              <div className="space-y-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />28天系统化学习</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />专属助教答疑</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />实战作业点评</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />结业证书</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Competitions Section */}
      <div className="mt-8 mb-8 px-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-800">相关竞赛</h2>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">完成课程解锁参赛资格</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RELATED_COMPETITIONS.map(comp => (
            <div key={comp.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-32 overflow-hidden">
                <img src={comp.banner} alt={comp.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-sm font-bold text-white">{comp.title}</h3>
                </div>
                <span className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: comp.statusColor }}>
                  {comp.status}
                </span>
              </div>
              <div className="p-3">
                <p className="mb-2 text-xs text-slate-500">{comp.description}</p>
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-bold text-amber-600">奖池 {comp.prize}</span>
                  <span>截止 {comp.deadline}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{comp.participants}人参赛</span>
                </div>
                <button
                  onClick={() => executeJoin(comp.title)}
                  disabled={joinLoading}
                  className="flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
                >
                  <Trophy className="h-3.5 w-3.5" />{joinLoading ? '报名中...' : '立即参赛'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Toast */}
      <ActionToast success={toastSuccess || undefined} onClose={() => setToastSuccess(null)} />

      {/* Modals */}
      {showQuiz && <QuizModal chapter={showQuiz} onClose={() => setShowQuiz(null)} />}
      {showExam && <ExamModal course={course} onClose={() => setShowExam(false)} />}
    </div>
  )
}
