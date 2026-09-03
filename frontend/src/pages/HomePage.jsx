// ENHANCEMENT: Sovereign JCCS Landing Page — Product Launch Grade Visuals & Precision Interactions
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Shield, Play, FileCheck, Zap, Lock, Eye, Globe, ChevronRight, Activity, Cpu, Award
} from 'lucide-react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// ENHANCEMENT: Ambient 2D Particle Field + Topographic Mesh (<1% CPU, respects prefers-reduced-motion)
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let t = 0
    const lines = 16
    const step = height / lines

    // 4 Saffron Data Pulse Signals traveling along contour lines
    const pulses = [
      { lineIndex: 3, progress: 0.15, speed: 0.0016 },
      { lineIndex: 6, progress: 0.50, speed: 0.0020 },
      { lineIndex: 9, progress: 0.80, speed: 0.0014 },
      { lineIndex: 12, progress: 0.30, speed: 0.0018 },
    ]

    // ENHANCEMENT: 25 Tiny Saffron Floating Micro-particles with cursor repel
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.25,
      radius: 1.5 + Math.random() * 0.8,
      opacity: 0.12 + Math.random() * 0.15,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // 1. Render Floating Particle Layer (gently repels within 100px of cursor)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && dist > 0) {
          const force = (1 - dist / 100) * 0.8
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        if (p.y < 0) p.y = height
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 153, 51, ${p.opacity})`
        ctx.fill()
      })

      // 2. Render Interactive Topographic Contour Lines
      ctx.lineWidth = 1.1
      for (let i = 1; i < lines; i++) {
        const yBase = i * step
        ctx.beginPath()

        const linePoints = []
        for (let x = 0; x <= width; x += 18) {
          const dx = x - mouse.x
          const dy = yBase - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseEffect = Math.max(0, 1 - dist / 220) * 40

          const wave = Math.sin(x * 0.006 + t + i * 0.45) * 12 + Math.cos(x * 0.012 - t * 0.6) * 8
          const y = yBase + wave - mouseEffect

          linePoints.push({ x, y, dist })

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        const lineMidDist = Math.abs(yBase - mouse.y)
        const isNearCursor = lineMidDist < 160

        const grad = ctx.createLinearGradient(0, 0, width, 0)
        grad.addColorStop(0, 'rgba(30, 30, 46, 0.15)')
        grad.addColorStop(
          0.5,
          isNearCursor
            ? 'rgba(255, 153, 51, 0.35)'
            : i % 3 === 0
            ? 'rgba(255, 153, 51, 0.16)'
            : 'rgba(0, 212, 170, 0.12)'
        )
        grad.addColorStop(1, 'rgba(30, 30, 46, 0.15)')

        ctx.strokeStyle = grad
        ctx.stroke()

        // 3. Render Data Pulse Signals
        pulses.forEach((pulse) => {
          if (pulse.lineIndex === i && linePoints.length > 0) {
            const pointIdx = Math.floor(pulse.progress * (linePoints.length - 1))
            const pt = linePoints[pointIdx]
            if (pt) {
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(255, 153, 51, 0.75)'
              ctx.shadowColor = '#ff9933'
              ctx.shadowBlur = 8
              ctx.fill()
              ctx.shadowBlur = 0
            }
          }
        })
      }

      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed
        if (pulse.progress > 1) pulse.progress = 0
      })

      if (!prefersReducedMotion) {
        t += 0.01
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

  // ENHANCEMENT: Screen blend mode overlaying contour mesh
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[3] opacity-25 mix-blend-screen"
      aria-hidden="true"
    />
  )
}

// ENHANCEMENT: Animated Dimension Score Counter for live bars
function AnimatedDimensionScore({ targetScore, duration = 1.2, delay = 0 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      let current = 0
      const steps = 30
      const stepTime = (duration * 1000) / steps
      const increment = targetScore / steps

      const timer = setInterval(() => {
        current += increment
        if (current >= targetScore) {
          setVal(targetScore)
          clearInterval(timer)
        } else {
          setVal(Math.round(current))
        }
      }, stepTime)

      return () => clearInterval(timer)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [isInView, targetScore, duration, delay])

  return <span ref={ref}>{val}%</span>
}

// ENHANCEMENT: Odometer Count-Up Hook with Slot Machine Snap & 1-Frame Glitch Flash Finish
function OdometerCounter({ value, duration = 1.5 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  const isNumeric = typeof value === 'number'

  useEffect(() => {
    if (!isInView) return
    if (!isNumeric) {
      setIsFinished(true)
      return
    }

    let start = 0
    const stepTime = 20
    const totalSteps = (duration * 1000) / stepTime
    const increment = value / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        setIsFinished(true)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, value, duration, isNumeric])

  return (
    <span
      ref={ref}
      className={`font-mono font-black transition-all duration-200 ${
        isFinished ? 'filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]' : ''
      }`}
    >
      {isNumeric ? displayValue : value}
    </span>
  )
}

// ENHANCEMENT: Live Scorecard Card with 3D Perspective Tilt, Neon SVG Filter, Count-ups & Typewriter HMAC
function LiveScorecardCard() {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [hoveredBar, setHoveredBar] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [gaugeScore, setGaugeScore] = useState(0)
  const [typewriterHash, setTypewriterHash] = useState('7f4e92a...98b')

  const isInView = useInView(cardRef, { once: true, margin: '-20px' })

  // 3D Perspective Tilt on Mouse Movement (max 5deg)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotateX = -(y / (rect.height / 2)) * 5
    const rotateY = (x / (rect.width / 2)) * 5
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
    setHoveredBar(null)
    setTypewriterHash('7f4e92a...98b')
  }

  // Typewriter effect on HMAC Proof hover
  const handleMouseEnterProof = () => {
    const full = '7f4e92a83c190d7e5b22104a6c898b'
    let idx = 0
    setTypewriterHash('')
    const interval = setInterval(() => {
      if (idx <= full.length) {
        setTypewriterHash(full.slice(0, idx))
        idx++
      } else {
        clearInterval(interval)
      }
    }, 25)
  }

  // Count up gauge score on mount over 1.5s
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

  const dimensions = [
    { label: 'Caste Representation & Equity', short: 'Caste Equity', score: 85, color: '#ff9933' },
    { label: 'Gender & Occupational Roles', short: 'Gender Bias', score: 82, color: '#00d4aa' },
    { label: 'Regional & Religious Harmony', short: 'Regional Harmony', score: 91, color: '#3498db' },
    { label: 'Linguistic Parity & Refusal Calibration', short: 'Linguistic Parity', score: 90, color: '#9b59b6' },
  ]

  // Gauge constants
  const size = 140
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (gaugeScore / 100) * circumference

  // Dynamic Risk Badge Color
  const getRiskBadge = (score) => {
    if (score < 40) return { label: 'HIGH RISK', bg: 'bg-[#c0392b]/10', text: 'text-[#c0392b]', border: 'border-[#c0392b]/30' }
    if (score <= 70) return { label: 'MODERATE RISK', bg: 'bg-[#f1c40f]/10', text: 'text-[#f1c40f]', border: 'border-[#f1c40f]/30' }
    return { label: 'CERTIFIED BHARAT', bg: 'bg-[#00d4aa]/10', text: 'text-[#00d4aa]', border: 'border-[#00d4aa]/30' }
  }

  const badge = getRiskBadge(gaugeScore)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
        boxShadow:
          'inset 0 1px 0 rgba(255,153,51,0.2), 0 20px 60px rgba(0,0,0,0.5)',
      }}
      className="p-6 rounded-2xl border border-[#1e1e2e] max-w-sm w-full mx-auto relative overflow-hidden bg-[#13131f]/95 backdrop-blur-xl"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e1e2e] mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-saffron block">
            LIVE EVALUATION BENCHMARK
          </span>
          <h4 className="font-heading font-black text-ink-white text-sm">Indic LLM 7B Benchmark</h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${badge.bg} ${badge.text} ${badge.border}`}>
          {badge.label}
        </span>
      </div>

      {/* SVG Circular Gauge with Neon Glow Filter */}
      <div className="flex justify-center py-2 relative">
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
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
            stroke="#1a1a28"
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
            filter="url(#glow)"
            className="arc-breathing-glow transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black font-mono text-ink-white leading-none">
            {gaugeScore}
          </span>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#8b8b9e] mt-1">
            BHARAT SAFETY SCORE
          </span>
        </div>
      </div>

      {/* Interactive Dimension Bars with Staggered Count-ups */}
      <div className="space-y-2.5 pt-3 border-t border-[#1e1e2e] relative">
        {dimensions.map(({ label, short, score, color }, idx) => (
          <div
            key={label}
            onMouseEnter={() => setHoveredBar({ label, score, color })}
            onMouseLeave={() => setHoveredBar(null)}
            className="space-y-1 cursor-pointer group"
          >
            <div className="flex justify-between text-[11px] font-sans transition-opacity">
              <span className="text-ink-gray group-hover:text-ink-white transition-colors">
                {short}
              </span>
              <span className="font-bold font-mono text-[11px]" style={{ color }}>
                <AnimatedDimensionScore targetScore={score} delay={0.1 * idx} />
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#0a0a0f] overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${score}%` : 0 }}
                transition={{ duration: 1.1, delay: 0.1 * idx, ease: 'easeOut' }}
                className="h-full rounded-full transition-all group-hover:brightness-125"
                style={{ background: color }}
              />
            </div>
          </div>
        ))}

        {/* Hover Tooltip */}
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

      {/* HMAC Proof with Typewriter Reveal */}
      <div
        onMouseEnter={handleMouseEnterProof}
        onMouseLeave={() => setTypewriterHash('7f4e92a...98b')}
        className="mt-4 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-[11px] font-mono text-ink-dim cursor-help transition-colors hover:text-ink-white"
        title="Hover to reveal full HMAC-SHA256 signature with typewriter effect"
      >
        <span>HMAC-SHA256 Proof:</span>
        <span
          className="font-bold px-2 py-0.5 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-safety-teal font-mono text-[11px] truncate max-w-[150px]"
        >
          {typewriterHash || '7f4e92a...98b'}
        </span>
      </div>
    </motion.div>
  )
}

const features = [
  { icon: Shield,    title: 'Caste Equity & Surname Parity', desc: 'Counterfactual surname pair probes evaluating equal merit in hiring, credit & tenancy algorithms.', color: '#ff9933', tag: 'Core Pillar' },
  { icon: Eye,       title: 'Gender & Occupational Roles',   desc: 'Detects occupational stereotyping and grammatical gender defaults across Indic grammars.', color: '#00d4aa', tag: 'Core Pillar' },
  { icon: Globe,     title: 'Regional & Religious Harmony',  desc: 'North-South workplace tropes, Northeast integration & 8th Schedule linguistic rights.', color: '#38bdf8', tag: 'Cultural' },
  { icon: Zap,       title: 'Adversarial Jailbreak Defense', desc: 'Probes model resistance against DevMode evasion, UPI OTP exploits & fraud generation.', color: '#c0392b', tag: 'Security' },
  { icon: FileCheck, title: 'MeitY & DPDP Compliance',       desc: 'Auto-mapped against MeitY GenAI Advisories, DPDP Act 2023 & IndiaAI Safety benchmarks.', color: '#f1c40f', tag: 'Regulatory' },
  { icon: Lock,      title: 'Blockchain Audit Proof',        desc: 'HMAC-SHA256 digital signature anchored to immutable Bitcoin blockchain proof.', color: '#ff9933', tag: 'Integrity' },
]

const steps = [
  { n: '01', title: 'Target Model Gateway', desc: 'Select from sovereign Indic foundation models (Sarvam AI), Google Gemini, Groq Cloud, OpenRouter, or custom BYO endpoints.' },
  { n: '02', title: 'Multilingual Red-Teaming', desc: 'Automated parallel execution of 44 curated adversarial probes across English, Hindi, and Tamil cultural contexts.' },
  { n: '03', title: 'Certified Bharat Scorecard', desc: 'Download a tamper-proof, blockchain-anchored IndiaAI Safety Scorecard with drop-in mitigation guardrails.' },
]

// Stats definition with clean numbers and clean labels
const stats = [
  { value: 44,      label: 'Probes Executed', color: '#ff9933' },
  { value: 3,       label: 'Indic Languages', color: '#00d4aa' },
  { value: 9,       label: 'Safety Dimensions', color: '#38bdf8' },
  { value: '< 30s', label: 'Full Audit SLA', color: '#f1c40f' },
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
  
  // ENHANCEMENT: Parallax scroll effect (disabled on mobile)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const rawParallax = useTransform(scrollY, [0, 800], [0, 40])
  const bgParallaxY = isMobile ? 0 : rawParallax
  const cardParallaxY = useTransform(scrollY, [0, 600], [0, 30])
  const [bgError, setBgError] = useState(false)

  // Full-width high-definition circuit motherboard image
  const primaryBg = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop"

  // ENHANCEMENT: Staggered word entrance animation variants (0.08s delay between words)
  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  }

  return (
    <div className="space-y-20 pb-20 relative isolate overflow-hidden">
      {/* ============================================================ */}
      {/* BACKGROUND: must span full viewport width                    */}
      {/* ============================================================ */}

      {/* ENHANCEMENT: LAYER 0 (z-index: 0) — Full-Width (100vw) Circuit Board Image with Moodier Desaturated Filter */}
      <motion.div
        style={{
          y: bgParallaxY,
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        className="transition-opacity duration-1000"
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: bgError
              ? 'radial-gradient(ellipse at top, #1e1e38 0%, #0a0a0f 75%)'
              : `linear-gradient(
                  180deg,
                  rgba(10, 10, 15, 0.65) 0%,
                  rgba(10, 10, 15, 0.40) 40%,
                  rgba(10, 10, 15, 0.95) 100%
                ), url('${primaryBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.4) contrast(1.1) saturate(0.6)',
          }}
        />
      </motion.div>

      {/* Preloader for background image fallback */}
      <img
        src={primaryBg}
        alt=""
        className="hidden"
        onError={() => {
          console.warn('[JCCS] Primary background image failed, switching to fallback.')
          setBgError(true)
        }}
      />

      {/* ENHANCEMENT: LAYER 1 (z-index: 1) — Full-Width (100vw) Overlays & Ambient Glows */}
      <div
        style={{
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Radial vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.85) 100%)',
          }}
        />
        {/* Top-right Saffron Ambient Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(255,153,51,0.10) 0%, transparent 50%)',
          }}
        />
        {/* Bottom-left Teal Ambient Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(0,212,170,0.06) 0%, transparent 50%)',
          }}
        />
        {/* Bottom fade to solid #0a0a0f */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: 'linear-gradient(180deg, transparent 60%, #0a0a0f 100%)',
          }}
        />
      </div>

      {/* ENHANCEMENT: LAYER 3 (z-index: 3) — Topographic Background Canvas with Screen Blend */}
      <TopographicCanvas />

      {/* ENHANCEMENT: LAYER 4 (z-index: 4) — Strong Left-Side Text Readability Shadow Zone */}
      <div
        className="absolute top-0 left-0 w-full lg:w-2/3 h-[900px] pointer-events-none z-[4]"
        style={{
          background: 'linear-gradient(90deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.30) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ============================================================ */}
      {/* LAYER 10 (z-index: 10) — Centered Content Layer (max-w-7xl)  */}
      {/* ============================================================ */}
      <section className="relative z-10 pt-2 sm:pt-4 lg:pt-5 pb-12 sm:pb-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* ENHANCEMENT: Sovereign Badge with 0.8s Stagger & Pulsing Saffron Dot */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold bg-saffron/10 text-saffron border border-saffron/30 shadow-[0_0_15px_rgba(255,153,51,0.12)] hover:border-saffron/50 transition-colors"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-saffron" />
                <span className="absolute -inset-1 rounded-full bg-saffron/40 animate-ping" />
              </div>
              <span>Aligned with IndiaAI Mission & MeitY GenAI Advisories</span>
            </motion.div>

            {/* ENHANCEMENT: Headline with Staggered Word Entrance, Shimmer Gradient & Text Shadow */}
            <div className="relative">
              <div
                className="absolute -top-12 -left-12 w-80 h-80 rounded-full pointer-events-none opacity-[0.035] border border-saffron"
                style={{
                  backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 13deg, #ff9933 14deg 15deg)'
                }}
                aria-hidden="true"
              />

              <h1
                style={{ textShadow: '0 2px 20px rgba(10,10,15,0.8)' }}
                className="text-4xl sm:text-6xl lg:text-[72px] font-heading font-black text-[#f0f0f5] leading-[1.1] tracking-[-0.02em] relative z-10"
              >
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
                <br className="hidden sm:block" />
                <motion.span custom={2} initial="hidden" animate="visible" variants={wordVariants} className="inline-block mr-3">
                  AI
                </motion.span>
                <motion.span custom={3} initial="hidden" animate="visible" variants={wordVariants} className="inline-block">
                  Future.
                </motion.span>
              </h1>
            </div>

            {/* ENHANCEMENT: Subhead with 0.8s Stagger Delay & Text Shadow */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
              style={{ textShadow: '0 2px 20px rgba(10,10,15,0.8)' }}
              className="text-[#8b8b9e] text-base sm:text-lg leading-relaxed max-w-xl font-sans"
            >
              Automated red-teaming and cultural alignment audit for Indian language foundation models.
            </motion.p>

            {/* ENHANCEMENT: CTA Buttons with 1.0s Stagger, Pulse Ring & White Sweep Shimmer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              {/* Primary Button */}
              <Link
                to="/upload"
                className="pulse-ring-saffron btn-shimmer-hover px-7 py-3.5 rounded-xl font-heading font-black text-sm text-[#0a0a0f] bg-gradient-to-br from-[#ff9933] to-[#e67e00] hover:scale-[1.03] active:scale-[0.98] shadow-[0_8px_30px_rgba(255,153,51,0.3)] transition-all flex items-center gap-2.5 min-h-[46px]"
              >
                <Play className="w-4 h-4 fill-current text-[#0a0a0f]" />
                <span>Launch Safety Evaluation</span>
              </Link>

              {/* Secondary Button */}
              <Link
                to="/history"
                className="group px-6 py-3.5 rounded-xl font-heading font-bold text-ink-white text-sm bg-[#13131f] border border-[#262638] hover:border-[#ff9933] hover:text-[#ff9933] hover:bg-[rgba(255,153,51,0.05)] transition-all flex items-center gap-2 min-h-[46px]"
              >
                <span>View Audit History</span>
                <ChevronRight className="w-4 h-4 text-ink-dim transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#ff9933]" />
              </Link>
            </motion.div>

            {/* ENHANCEMENT: Stats Bar with Gradient Top Line, Dividers & 1.5s Stagger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5, ease: 'easeOut' }}
              className="relative pt-5"
            >
              {/* 2px Gradient Top Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff9933] to-transparent" />

              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1e1e2e]">
                {stats.map(({ value, label, color }, idx) => (
                  <div key={label} className={`text-left ${idx > 0 ? 'sm:pl-4' : ''} ${idx % 2 === 1 ? 'pl-4 sm:pl-4' : ''} py-2 sm:py-0`}>
                    <div className="text-3xl sm:text-4xl lg:text-[48px] font-heading font-black font-mono leading-none tracking-tight" style={{ color }}>
                      <OdometerCounter value={value} />
                    </div>
                    <div className="text-[12px] text-[#8b8b9e] font-sans font-medium uppercase tracking-widest mt-2 leading-tight">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ENHANCEMENT: Live Benchmark Scorecard Column with 1.2s Slide-in Stagger (x: 60) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
            style={{ y: cardParallaxY }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative z-10"
          >
            <LiveScorecardCard />
          </motion.div>
        </div>
      </section>

      {/* Trust & Governance Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 border-y border-[#1e1e2e] py-6 bg-[#13131f]/60 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-[10px] font-mono uppercase tracking-widest text-ink-dim mb-4">
            STANDARDIZED AGAINST INDIAN REGULATORY & SAFETY MANDATES
          </div>
          <div className="flex flex-wrap items-center justify-around gap-6">
            {trustEntities.map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 filter grayscale hover:grayscale-0 hover:bg-[#13131f] border border-transparent hover:border-[#1e1e2e] group cursor-default"
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

      {/* 6 Core Pillars */}
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

      {/* 3 Step Workflow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 fortress-card p-8 border-[#1e1e2e] space-y-6"
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
            <div key={n} className="p-5 rounded-xl bg-fortress-base border border-[#1e1e2e] space-y-2">
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
