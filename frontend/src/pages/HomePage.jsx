// ENHANCEMENT: Sovereign JCCS Landing Page — Product Launch Grade Visuals & Interactions
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Shield, Play, FileCheck, Zap, Lock, Eye, Globe, ChevronRight, Activity, Cpu, Award
} from 'lucide-react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// ENHANCEMENT: Interactive 2D Topographic Mesh + Drift Signals + Floating Particle Field
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
    const lines = 18
    const step = height / lines

    // ENHANCEMENT: 4 Data Pulse Signals traveling along contour lines
    const pulses = [
      { lineIndex: 4, progress: 0.1, speed: 0.0018 },
      { lineIndex: 7, progress: 0.4, speed: 0.0022 },
      { lineIndex: 11, progress: 0.7, speed: 0.0015 },
      { lineIndex: 14, progress: 0.2, speed: 0.0020 },
    ]

    // ENHANCEMENT: 25 Tiny Saffron Floating Particles
    const particleCount = 25
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.3,
      radius: 1.5 + Math.random() * 1.0,
      opacity: 0.12 + Math.random() * 0.15,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      // 1. Render Floating Particle Layer (drifting upward + soft cursor repel)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Soft cursor repel
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 0.8
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        // Wrap around boundaries
        if (p.y < 0) p.y = height
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 153, 51, ${p.opacity})`
        ctx.fill()
      })

      // 2. Render Interactive Topographic Contour Lines
      ctx.lineWidth = 1.2
      for (let i = 1; i < lines; i++) {
        const yBase = i * step
        ctx.beginPath()

        const linePoints = []
        for (let x = 0; x <= width; x += 15) {
          const dx = x - mouse.x
          const dy = yBase - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseEffect = Math.max(0, 1 - dist / 200) * 45

          const wave = Math.sin(x * 0.007 + t + i * 0.4) * 14 + Math.cos(x * 0.014 - t * 0.7) * 9
          const y = yBase + wave - mouseEffect

          linePoints.push({ x, y, dist })

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // ENHANCEMENT: Line brightens to saffron (#ff9933) with 0.4 opacity near cursor (150px radius)
        const lineMidDist = Math.abs(yBase - mouse.y)
        const isNearCursor = lineMidDist < 150

        const grad = ctx.createLinearGradient(0, 0, width, 0)
        grad.addColorStop(0, 'rgba(30, 30, 46, 0.25)')
        grad.addColorStop(
          0.5,
          isNearCursor
            ? 'rgba(255, 153, 51, 0.40)'
            : i % 3 === 0
            ? 'rgba(255, 153, 51, 0.20)'
            : 'rgba(0, 212, 170, 0.14)'
        )
        grad.addColorStop(1, 'rgba(30, 30, 46, 0.25)')

        ctx.strokeStyle = grad
        ctx.stroke()

        // 3. Render Data Pulse Signals traveling on selected lines
        pulses.forEach((pulse) => {
          if (pulse.lineIndex === i && linePoints.length > 0) {
            const pointIdx = Math.floor(pulse.progress * (linePoints.length - 1))
            const pt = linePoints[pointIdx]
            if (pt) {
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(255, 153, 51, 0.65)'
              ctx.shadowColor = '#ff9933'
              ctx.shadowBlur = 10
              ctx.fill()
              ctx.shadowBlur = 0 // reset shadow
            }
          }
        })
      }

      // Progress pulse signals
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed
        if (pulse.progress > 1) pulse.progress = 0
      })

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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  )
}

// ENHANCEMENT: Odometer Slot Machine Counter with Glitch / Flash Boost on finish
function AnimatedCounter({ value, duration = 1.6, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

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
        setIsFinished(true)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  const isNumeric = !isNaN(parseInt(value, 10))

  return (
    <span
      ref={ref}
      className={`font-mono transition-all duration-300 ${
        isFinished ? 'filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''
      }`}
    >
      {isNumeric ? `${displayValue}${suffix}` : value}
    </span>
  )
}

// ENHANCEMENT: Live Scorecard Card with Neon SVG Gauge, 3D Perspective Tilt & Typewriter Hash
function LiveScorecardCard() {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [hoveredBar, setHoveredBar] = useState(null)
  const [hashRevealed, setHashRevealed] = useState(false)
  const [gaugeScore, setGaugeScore] = useState(0)

  const isInView = useInView(cardRef, { once: true, margin: '-20px' })

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotateX = -(y / (rect.height / 2)) * 4.5
    const rotateY = (x / (rect.width / 2)) * 4.5
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setHoveredBar(null)
    setHashRevealed(false)
  }

  // Count up gauge score on mount
  useEffect(() => {
    if (!isInView) return
    const target = 74
    let current = 0
    const duration = 1500
    const intervalTime = 20
    const step = target / (duration / intervalTime)

    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setGaugeScore(target)
        clearInterval(timer)
      } else {
        setGaugeScore(Math.round(current))
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [isInView])

  const fullHash = '7f4e92a83c190d7e5b22104a6c898b'
  const displayHash = hashRevealed ? fullHash : '7f4e92a...98b'

  const dimensions = [
    { label: 'Caste Representation & Equity', short: 'Caste Equity', score: 85, color: '#ff9933' },
    { label: 'Gender & Occupational Roles', short: 'Gender Bias', score: 82, color: '#00d4aa' },
    { label: 'Regional & Religious Harmony', short: 'Regional Harmony', score: 91, color: '#3498db' },
    { label: 'Linguistic Parity & Refusal Calibration', short: 'Linguistic Parity', score: 90, color: '#9b59b6' },
  ]

  // Gauge constants
  const size = 130
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (gaugeScore / 100) * circumference

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
        backdropFilter: 'blur(12px)',
        boxShadow:
          '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,153,51,0.05), inset 0 1px 0 rgba(255,153,51,0.2)',
      }}
      className="p-6 rounded-2xl border border-fortress-border max-w-sm w-full mx-auto relative overflow-hidden bg-[#13131f]/90"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-fortress-border mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-saffron block">
            LIVE EVALUATION BENCHMARK
          </span>
          <h4 className="font-heading font-black text-ink-white text-sm">Indic LLM 7B Benchmark</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#f1c40f]/10 text-[#f1c40f] border border-[#f1c40f]/30">
          MODERATE RISK
        </span>
      </div>

      {/* ENHANCEMENT: Neon Filter SVG Circular Gauge */}
      <div className="flex justify-center py-2 relative">
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            {/* Neon Glow Filter */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />

          {/* Animated Glow Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#00d4aa"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#neon-glow)"
            className="arc-breathing-glow transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black font-mono text-ink-white leading-none">
            {gaugeScore}
          </span>
          <span className="text-[8px] font-heading font-bold uppercase tracking-widest text-[#8b8b9e] mt-1">
            BHARAT SAFETY SCORE
          </span>
        </div>
      </div>

      {/* ENHANCEMENT: Interactive Dimension Bars with Viewport Stagger & Tooltip */}
      <div className="space-y-2.5 pt-3 border-t border-fortress-border relative">
        {dimensions.map(({ label, short, score, color }, idx) => (
          <div
            key={label}
            onMouseEnter={() => setHoveredBar({ label, score, color })}
            onMouseLeave={() => setHoveredBar(null)}
            className="space-y-1 cursor-pointer group"
          >
            <div className="flex justify-between text-[10px] font-mono transition-opacity group-hover:opacity-100">
              <span className="text-ink-gray truncate pr-2 group-hover:text-ink-white transition-colors">
                {short}
              </span>
              <span className="font-bold font-mono" style={{ color }}>
                {gaugeScore > 0 ? `${score}%` : '0%'}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-fortress-base overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${score}%` : 0 }}
                transition={{ duration: 1.2, delay: 0.1 * idx, ease: 'easeOut' }}
                className="h-full rounded-full transition-all group-hover:brightness-125"
                style={{ background: color }}
              />
            </div>
          </div>
        ))}

        {/* Dimension Hover Tooltip */}
        <AnimatePresence>
          {hoveredBar && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0a0a0f] border border-saffron/40 px-3 py-1.5 rounded-lg text-[10px] font-mono shadow-xl z-30 pointer-events-none whitespace-nowrap"
            >
              <span className="text-ink-white">{hoveredBar.label}: </span>
              <span className="font-bold" style={{ color: hoveredBar.color }}>
                {hoveredBar.score}% Compliance
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ENHANCEMENT: Typewriter / Smooth Reveal on HMAC Proof Hover */}
      <div
        onMouseEnter={() => setHashRevealed(true)}
        onMouseLeave={() => setHashRevealed(false)}
        className="mt-4 pt-3 border-t border-fortress-border flex items-center justify-between text-[10px] font-mono text-ink-dim cursor-help transition-colors hover:text-ink-white"
        title="Click or hover to reveal full HMAC-SHA256 chained hash"
      >
        <span>HMAC-SHA256 Proof:</span>
        <span
          className={`font-bold transition-all duration-300 truncate max-w-[170px] ${
            hashRevealed ? 'text-saffron scale-105' : 'text-safety-teal'
          }`}
        >
          {displayHash}
        </span>
      </div>
    </motion.div>
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

const steps = [
  { n: '01', title: 'Target Model Gateway', desc: 'Select from sovereign Indic foundation models (Sarvam AI), Google Gemini, Groq Cloud, OpenRouter, or custom BYO endpoints.' },
  { n: '02', title: 'Multilingual Red-Teaming', desc: 'Automated parallel execution of 44 curated adversarial probes across English, Hindi, and Tamil cultural contexts.' },
  { n: '03', title: 'Certified Bharat Scorecard', desc: 'Download a tamper-proof, blockchain-anchored IndiaAI Safety Scorecard with drop-in mitigation guardrails.' },
]

const stats = [
  { value: 44,   label: 'Probes Executed', color: '#ff9933', suffix: '' },
  { value: 3,    label: 'Indic Languages', color: '#00d4aa', suffix: ' Langs' },
  { value: 9,    label: 'Safety Dimensions', color: '#3498db', suffix: ' Dims' },
  { value: 30,   label: 'Full Audit SLA', color: '#f1c40f', suffix: 's SLA' },
]

const trustEntities = [
  { name: 'IndiaAI Mission', label: 'Safety Mandate', acronym: 'INDIA AI' },
  { name: 'MeitY GenAI Advisory', label: 'Due Diligence Compliance', acronym: 'MEITY' },
  { name: 'Bureau of Indian Standards', label: 'BIS AI Standard', acronym: 'BIS' },
  { name: 'DPDP Act 2023', label: 'Data Protection Sections 4, 6 & 8', acronym: 'DPDP' },
  { name: 'C-DAC India', label: 'Sovereign Benchmarks', acronym: 'C-DAC' },
]

export default function HomePage() {
  const { scrollY } = useScroll()
  // ENHANCEMENT: Parallax offset for benchmark card (0.9x scroll speed for subtle depth)
  const cardParallaxY = useTransform(scrollY, [0, 600], [0, 35])

  // Staggered word animation variants
  const wordVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    })
  }

  return (
    <div className="space-y-24 py-4 pb-20 relative overflow-hidden">
      {/* ENHANCEMENT: Interactive Topographic Background Canvas with Particle Field */}
      <TopographicCanvas />

      {/* HERO SECTION */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-7">
          {/* Sovereign Badge with Staggered Fade */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-saffron/10 text-saffron border border-saffron/30"
          >
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            Aligned with IndiaAI Mission & MeitY GenAI Advisories
          </motion.div>

          {/* ENHANCEMENT: Headline with Animated Saffron Copper Shimmer Text & Glow */}
          <div className="relative">
            {/* Subtle Ashoka Chakra Watermark behind headline */}
            <div
              className="absolute -top-12 -left-12 w-80 h-80 rounded-full pointer-events-none opacity-[0.03] border border-saffron"
              style={{
                backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 13deg, #ff9933 14deg 15deg)'
              }}
              aria-hidden="true"
            />

            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-heading font-black text-[#f0f0f5] leading-[1.1] tracking-[-0.02em] relative z-10">
              <motion.span custom={0} initial="hidden" animate="visible" variants={wordVariants} className="inline-block mr-3">
                Safeguarding
              </motion.span>
              <motion.span
                custom={1}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="shimmer-saffron-text inline-block mr-3"
              >
                India’s
              </motion.span>
              <motion.span custom={2} initial="hidden" animate="visible" variants={wordVariants} className="inline-block mr-3">
                AI
              </motion.span>
              <motion.span custom={3} initial="hidden" animate="visible" variants={wordVariants} className="inline-block">
                Future.
              </motion.span>
            </h1>
          </div>

          {/* ENHANCEMENT: Subhead with 0.8s Staggered Fade Up */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            className="text-[#8b8b9e] text-base sm:text-lg leading-relaxed max-w-xl font-sans"
          >
            Automated red-teaming and cultural alignment audit for Indian language foundation models.
          </motion.p>

          {/* ENHANCEMENT: CTA Buttons with Pulse Ring & Shimmer Sweep */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {/* Primary Button */}
            <Link
              to="/upload"
              className="pulse-ring-saffron btn-shimmer-hover px-7 py-3.5 rounded-xl font-heading font-black text-base text-[#0a0a0f] bg-gradient-to-br from-[#ff9933] to-[#e67e00] hover:scale-[1.03] active:scale-[0.98] shadow-[0_8px_30px_rgba(255,153,51,0.3)] transition-all flex items-center gap-2.5 min-h-[46px]"
            >
              <Play className="w-4 h-4 fill-current text-[#0a0a0f]" />
              <span>Launch Safety Evaluation</span>
            </Link>

            {/* Secondary Button */}
            <Link
              to="/history"
              className="group px-6 py-3.5 rounded-xl font-heading font-bold text-ink-white text-base bg-transparent border border-[#2a2a3e] hover:border-[#ff9933] hover:text-[#ff9933] hover:bg-[rgba(255,153,51,0.05)] transition-all flex items-center gap-2 min-h-[46px]"
            >
              <span>View Audit History</span>
              <ChevronRight className="w-4 h-4 text-ink-dim transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#ff9933]" />
            </Link>
          </motion.div>

          {/* ENHANCEMENT: Stats Bar with Gradient Status Line & 1.5s Fade In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: 'easeOut' }}
            className="relative pt-6"
          >
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff9933]/60 to-transparent" />

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1e1e2e]">
              {stats.map(({ value, label, color, suffix }, idx) => (
                <div key={label} className={`text-left ${idx > 0 ? 'sm:pl-4' : ''} ${idx % 2 === 1 ? 'pl-4 sm:pl-4' : ''} py-2 sm:py-0`}>
                  <div className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-black font-mono leading-none tracking-tight" style={{ color }}>
                    <AnimatedCounter value={value} suffix={suffix} />
                  </div>
                  <div className="text-[11px] text-[#8b8b9e] font-sans font-medium uppercase tracking-widest mt-1.5 leading-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ENHANCEMENT: Parallax-Aware Live Benchmark Scorecard Column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          style={{ y: cardParallaxY }}
          className="lg:col-span-5 flex justify-center relative z-10"
        >
          <LiveScorecardCard />
        </motion.div>
      </section>

      {/* ENHANCEMENT: Trust & Governance Bar with whileInView Scroll Trigger */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 border-y border-fortress-border py-6 bg-fortress-surface/70"
      >
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
      </motion.section>

      {/* ENHANCEMENT: 6 Core Pillars with Staggered Scroll View */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8"
      >
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
      </motion.section>

      {/* ENHANCEMENT: 3 Step Pipeline with Scroll Trigger */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 fortress-card p-8 border-fortress-border space-y-6"
      >
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
      </motion.section>
    </div>
  )
}
