// FIX: Sovereign JCCS Landing Page with 60fps Topographic Fortress Mesh & Odometer Counter
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Shield, Play, FileCheck, Zap, Lock, Eye, Globe, ChevronRight, Activity, Cpu, Award
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import SafetyGauge from '../components/dashboard/SafetyGauge'

// FIX: 2D Canvas Interactive Topographic Fortress Mesh
function TopographicCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let t = 0
    const lines = 16
    const step = height / lines

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      ctx.lineWidth = 1.2
      for (let i = 1; i < lines; i++) {
        const yBase = i * step
        ctx.beginPath()

        for (let x = 0; x <= width; x += 15) {
          const dx = x - mouse.x
          const dy = yBase - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseEffect = Math.max(0, 1 - dist / 320) * 35

          const wave = Math.sin(x * 0.008 + t + i * 0.4) * 12 + Math.cos(x * 0.015 - t * 0.8) * 8
          const y = yBase + wave - mouseEffect

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Gradient contour stroke
        const grad = ctx.createLinearGradient(0, 0, width, 0)
        grad.addColorStop(0, 'rgba(30, 30, 46, 0.2)')
        grad.addColorStop(0.5, i % 3 === 0 ? 'rgba(255, 153, 51, 0.18)' : 'rgba(0, 212, 170, 0.12)')
        grad.addColorStop(1, 'rgba(30, 30, 46, 0.2)')

        ctx.strokeStyle = grad
        ctx.stroke()
      }

      if (!prefersReducedMotion) {
        t += 0.012
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  )
}

// FIX: Animated Odometer Counter Component using JetBrains Mono
function AnimatedCounter({ value, duration = 1.5, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const numericTarget = parseInt(value, 10)
    if (isNaN(numericTarget)) return

    let start = 0
    const stepTime = 20
    const totalSteps = (duration * 1000) / stepTime
    const increment = numericTarget / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= numericTarget) {
        setDisplayValue(numericTarget)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  const isNumeric = !isNaN(parseInt(value, 10))

  return (
    <span ref={ref} className="font-mono">
      {isNumeric ? `${displayValue}${suffix}` : value}
    </span>
  )
}

const features = [
  { icon: Shield,    title: 'Caste Equity & Surname Parity', desc: 'Counterfactual surname pair probes evaluating equal merit in hiring, credit & tenancy algorithms.', color: '#ff9933', tag: 'Core Pillar' },
  { icon: Eye,       title: 'Gender & Occupational Roles',   desc: 'Detects occupational stereotyping and grammatical gender defaults across Indic grammars.', color: '#00d4aa', tag: 'Core Pillar' },
  { icon: Globe,     title: 'Regional & Religious Harmony',  desc: 'North-South workplace tropes, Northeast integration & 8th Schedule linguistic rights.', color: '#3498db', tag: 'Cultural' },
  { icon: Zap,       title: 'Adversarial Jailbreak Defense', desc: 'Probes model resistance against DevMode evasion, UPI OTP exploits & fraud generation.', color: '#c0392b', tag: 'Security' },
  { icon: FileCheck, title: 'MeitY & DPDP Compliance',       desc: 'Auto-mapped against MeitY GenAI Advisories, DPDP Act 2023 & IndiaAI Safety benchmarks.', color: '#f1c40f', tag: 'Regulatory' },
  { icon: Lock,      title: 'Blockchain Audit Proof',        desc: 'HMAC-SHA256 digital signature anchored to immutable Bitcoin blockchain proof.', color: '#ff9933', tag: 'Integrity' },
]

const safetyDimensions = [
  { label: 'Caste Representation & Equity', score: 85, color: '#ff9933' },
  { label: 'Gender & Occupational Roles', score: 82, color: '#00d4aa' },
  { label: 'Regional & Religious Harmony', score: 91, color: '#3498db' },
  { label: 'Indic Linguistic Parity (EN/HI/TA)', score: 90, color: '#00d4aa' },
  { label: 'Adversarial Jailbreak Resistance', score: 48, color: '#c0392b' },
  { label: 'DPDP Personal Data Privacy', score: 88, color: '#00d4aa' },
]

const steps = [
  { n: '01', title: 'Target Model Gateway', desc: 'Select from sovereign Indic foundation models (Sarvam AI), Google Gemini, Groq Cloud, OpenRouter, or custom BYO endpoints.' },
  { n: '02', title: 'Multilingual Red-Teaming', desc: 'Automated parallel execution of 44 curated adversarial probes across English, Hindi, and Tamil cultural contexts.' },
  { n: '03', title: 'Certified Bharat Scorecard', desc: 'Download a tamper-proof, blockchain-anchored IndiaAI Safety Scorecard with drop-in mitigation guardrails.' },
]

const stats = [
  { value: 44,   label: 'Probes Executed', color: '#ff9933', suffix: '' },
  { value: 3,    label: 'Indic Languages', color: '#00d4aa', suffix: ' Langs' },
  { value: 9,    label: 'Safety Dimensions', color: '#3498db', suffix: ' Dims' },
  { value: 30,   label: 'Full Audit Cycle', color: '#f1c40f', suffix: 's SLA' },
]

const trustEntities = [
  { name: 'IndiaAI Mission', label: 'Safety Mandate', acronym: 'INDIA AI' },
  { name: 'MeitY GenAI Advisory', label: 'Due Diligence Compliance', acronym: 'MEITY' },
  { name: 'Bureau of Indian Standards', label: 'BIS AI Standard', acronym: 'BIS' },
  { name: 'DPDP Act 2023', label: 'Data Protection Sections 4, 6 & 8', acronym: 'DPDP' },
  { name: 'C-DAC India', label: 'Sovereign Benchmarks', acronym: 'C-DAC' },
]

function LiveScorecardCard() {
  return (
    <div className="fortress-card p-6 border-fortress-border max-w-sm w-full mx-auto shadow-fortress-card relative overflow-hidden bg-fortress-surface/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-fortress-border mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-saffron block">
            LIVE EVALUATION BENCHMARK
          </span>
          <h4 className="font-heading font-black text-ink-white text-sm">Indic LLM 7B Benchmark</h4>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-safety-gold/10 text-safety-gold border border-safety-gold/30">
          MODERATE RISK
        </span>
      </div>

      {/* Safety Gauge Visual */}
      <div className="flex justify-center py-2">
        <SafetyGauge score={74} size={130} label="BHARAT SAFETY SCORE" />
      </div>

      {/* Mini Dimensions */}
      <div className="space-y-2 pt-3 border-t border-fortress-border">
        {safetyDimensions.slice(0, 4).map(({ label, score, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-ink-gray truncate pr-2">{label}</span>
              <span className="font-bold" style={{ color }}>{score}%</span>
            </div>
            <div className="h-1 rounded-full bg-fortress-base overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cryptographic Verification Pill */}
      <div className="mt-4 pt-3 border-t border-fortress-border flex items-center justify-between text-[10px] font-mono text-ink-dim">
        <span>HMAC-SHA256 Proof:</span>
        <span className="text-safety-teal font-bold truncate max-w-[120px]">7f4e92a...98b</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-20 py-4 pb-20 relative overflow-hidden">
      {/* FIX: Interactive Topographic Background Canvas */}
      <TopographicCanvas />

      {/* FIX: Hero Section */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-saffron/10 text-saffron border border-saffron/30">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            Aligned with IndiaAI Mission & MeitY GenAI Advisories
          </div>

          {/* FIX: Headline with Saffron-Copper Gradient Text on "India's" */}
          <div className="relative">
            {/* Subtle Ashoka Chakra Watermark behind headline */}
            <div
              className="absolute -top-10 -left-10 w-72 h-72 rounded-full pointer-events-none opacity-[0.03] border border-saffron"
              style={{
                backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 13deg, #ff9933 14deg 15deg)'
              }}
              aria-hidden="true"
            />

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-heading font-black text-ink-white leading-[1.08] tracking-tight relative z-10">
              Safeguarding{' '}
              <span className="bg-gradient-to-r from-[#ff9933] to-[#e67e00] bg-clip-text text-transparent">
                India’s
              </span>{' '}
              AI Future.
            </h1>
          </div>

          {/* FIX: Subhead at 18px Inter in #8b8b9e */}
          <p className="text-[#8b8b9e] text-base sm:text-lg leading-relaxed max-w-xl">
            Automated red-teaming and cultural alignment audit for Indian language foundation models.
          </p>

          {/* FIX: Primary CTA Button (Saffron #ff9933, Black Text, Saffron Underline on Hover) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/upload"
              className="btn-saffron-slide px-7 py-3.5 rounded-xl font-heading font-black text-sm text-[#0a0a0f] bg-[#ff9933] hover:bg-[#ff9933]/95 shadow-saffron-glow transition-all flex items-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-current text-[#0a0a0f]" />
              <span>Launch Safety Evaluation</span>
            </Link>

            <Link
              to="/history"
              className="btn-saffron-slide px-6 py-3.5 rounded-xl font-heading font-bold text-ink-white text-sm bg-fortress-surface border border-fortress-border hover:border-saffron transition-all flex items-center gap-2 min-h-[44px]"
            >
              <span>View Audit History</span>
              <ChevronRight className="w-4 h-4 text-ink-dim" />
            </Link>
          </div>

          {/* FIX: Odometer Live Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-fortress-border">
            {stats.map(({ value, label, color, suffix }) => (
              <div key={label} className="text-left">
                <div className="text-2xl sm:text-3xl font-heading font-black font-mono" style={{ color }}>
                  <AnimatedCounter value={value} suffix={suffix} />
                </div>
                <div className="text-[11px] text-ink-dim font-heading font-bold mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scorecard Preview Column */}
        <div className="lg:col-span-5 flex justify-center relative z-10">
          <LiveScorecardCard />
        </div>
      </section>

      {/* FIX: Trust & Governance Bar with Grayscale to Color Transition on Hover */}
      <section className="relative z-10 border-y border-fortress-border py-6 bg-fortress-surface/70">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-[10px] font-mono uppercase tracking-widest text-ink-dim mb-4">
            STANDARDIZED AGAINST INDIAN REGULATORY & SAFETY MANDATES
          </div>
          <div className="flex flex-wrap items-center justify-around gap-6">
            {trustEntities.map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 filter grayscale hover:grayscale-0 hover:bg-fortress-base/60 border border-transparent hover:border-fortress-border group cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-saffron transition-transform group-hover:scale-125" />
                <div>
                  <span className="font-heading font-bold text-xs text-ink-white block group-hover:text-saffron transition-colors">
                    {e.name}
                  </span>
                  <span className="text-[9px] font-mono text-ink-dim block">
                    {e.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Core Pillars */}
      <section className="relative z-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-saffron">
            BHARAT SAFETY EVALUATION FRAMEWORK
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-ink-white tracking-tight">
            6 Core Dimensions of Sovereign AI Safety
          </h2>
          <p className="text-ink-gray text-xs sm:text-sm">
            Auditing foundation models for cultural nuances, fair representation, and defensive security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color, tag }) => (
            <div
              key={title}
              className="fortress-card fortress-card-interactive p-6 space-y-3 relative flex flex-col justify-between"
              style={{ borderLeftWidth: '4px', borderLeftColor: color }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18`, color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded"
                    style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                  >
                    {tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-ink-white text-sm">{title}</h3>
                <p className="text-ink-gray text-xs leading-relaxed mt-1.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="relative z-10 fortress-card p-8 border-fortress-border space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-safety-teal">
            AUTOMATED EXECUTION PIPELINE
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-ink-white">
            How the Safety Engine Operates
          </h2>
          <p className="text-ink-gray text-xs">End-to-end automated red-teaming in under 30 seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="p-5 rounded-xl bg-fortress-base border border-fortress-border space-y-2">
              <div className="font-mono text-xs font-black text-saffron">STEP {n}</div>
              <h4 className="font-heading font-bold text-ink-white text-sm">{title}</h4>
              <p className="text-ink-gray text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
