import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Shield, Play, BarChart2, FileCheck, Zap, Lock, Eye, ArrowRight, AlertTriangle, Globe, Layers, Terminal } from 'lucide-react'

const features = [
  { icon: Shield,    title: 'Caste Equity & Non-Discrimination', desc: 'Counterfactual surname pair probes evaluating equal merit in hiring, credit & tenancy.', color: '#6C63FF', tag: 'Core' },
  { icon: Eye,       title: 'Gender & Occupational Parity',       desc: 'Detects occupational stereotyping and grammatical gender defaults in Indic grammars.', color: '#00B894', tag: 'Core' },
  { icon: Globe,     title: 'Regional & Communal Harmony',       desc: 'North-South workplace fairness, Northeast integration & 8th Schedule linguistic rights.', color: '#FDCB6E', tag: 'Cultural' },
  { icon: Zap,       title: 'Adversarial Jailbreak Defense',     desc: 'Probes model resistance against DevMode, persona adoption & OTP fraud interception.', color: '#E94560', tag: 'Security' },
  { icon: FileCheck, title: 'MeitY & DPDP Compliance',           desc: 'Auto-mapped against MeitY GenAI Advisories, DPDP Act 2023 & IndiaAI Safety benchmarks.', color: '#3B82F6', tag: 'Legal' },
  { icon: Lock,      title: 'Blockchain Audit Proof',            desc: 'HMAC-SHA256 digital signature anchored to immutable Bitcoin blockchain proof.', color: '#8B5CF6', tag: 'Trust' },
]

const safetyDimensions = [
  { label: 'Caste Representation & Equity', score: 85, color: '#00B894' },
  { label: 'Gender & Occupational Roles', score: 82, color: '#00B894' },
  { label: 'Regional & Religious Harmony', score: 91, color: '#00B894' },
  { label: 'Indic Linguistic Rights (EN/HI/TA)', score: 90, color: '#00B894' },
  { label: 'Adversarial Jailbreak Resistance', score: 48, color: '#E94560' },
  { label: 'DPDP Personal Data Privacy', score: 88, color: '#00B894' },
]

const steps = [
  { n: '01', emoji: '🎯', title: 'Target Model Setup', desc: 'Select or input any OpenAI-compatible Indian LLM endpoint (Groq, OpenAI, Ollama, Sarvam API, or Demo Presets).' },
  { n: '02', emoji: '⚡', title: 'Multilingual Red-Teaming', desc: 'Automated execution of 44 curated adversarial probes across English, Hindi, and Tamil in parallel.' },
  { n: '03', emoji: '📜', title: 'Get Certified Scorecard', desc: 'Download a tamper-proof, blockchain-anchored IndiaAI Safety Scorecard with drop-in guardrail patches.' },
]

const stats = [
  { n: '9',    label: 'Safety Dimensions',   color: '#6C63FF' },
  { n: '3',    label: 'Indic Languages (EN/HI/TA)', color: '#00B894' },
  { n: '4',    label: 'Legal Frameworks',    color: '#3B82F6' },
  { n: '<30s', label: 'Automated Audit',     color: '#E94560' },
]

const ticker = [
  'Caste Equity in Hiring', 'Gender Stereotypes in STEM', 'Regional Workplace Parity',
  'UPI OTP Jailbreak Defense', 'DPDP Aadhaar Privacy', '8th Schedule Linguistic Rights',
  'Communal Harmony', 'Indic Grammatical Bias', 'Fake Document Forgery Refusal', 'Hate Speech Prevention'
]

function LiveScorecardPreview() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400); return () => clearTimeout(t) }, [])

  return (
    <div className="relative mx-auto" style={{ width: "280px", filter: 'drop-shadow(0 32px 80px rgba(108,99,255,0.3))' }}>
      <div className="rounded-3xl overflow-hidden border border-white/10"
        style={{ background: 'linear-gradient(145deg, #0d0d1a, #12121f)' }}>
        <div className="px-5 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-[#a78bfa] uppercase tracking-widest">IndiaAI Safety Audit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-yellow-500/20 text-yellow-400">MEDIUM RISK</span>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black text-white">77.1</span>
            <span className="text-gray-500 text-sm mb-1">/ 100</span>
          </div>
          <p className="text-[11px] text-gray-400">Indic LLM 7B · 44 Probes (EN/HI/TA)</p>
        </div>

        <div className="px-5 py-3 space-y-2">
          {safetyDimensions.map(({ label, score, color }, i) => (
            <div key={label}>
              <div className="flex justify-between mb-0.5 text-[11px]">
                <span className="text-gray-400 truncate pr-2">{label}</span>
                <span className="font-bold font-mono" style={{ color }}>{score}</span>
              </div>
              <div className="h-1 rounded-full bg-white/5">
                <div className="h-1 rounded-full transition-all duration-1000"
                  style={{ width: visible ? `${score}%` : '0%', background: color, transitionDelay: `${i * 80 + 400}ms` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 pt-1">
          <div className="rounded-xl px-3 py-2 text-[10px] font-mono text-gray-500 truncate"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            SHA-256: 4c863b5ce2265052...
          </div>
        </div>
      </div>

      <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-black text-white whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg,#6C63FF,#00B894)', boxShadow: '0 6px 18px rgba(108,99,255,0.5)', fontSize: '10px' }}>
        ✓ Blockchain Anchored
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#6C63FF]/15 text-[#a78bfa] border border-[#6C63FF]/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Aligned with IndiaAI Mission & MeitY GenAI Advisory
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Automated LLM Safety & Red-Teaming for <span className="gradient-text">Indian Languages</span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed max-w-xl">
            Evaluate Indian language models across caste representation, gender occupational fairness, regional harmony, and adversarial jailbreaks. Generate tamper-proof, blockchain-anchored safety scorecards in seconds.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/upload"
              className="px-6 py-3.5 rounded-2xl font-black text-white text-sm transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(108,99,255,0.35)] hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #00B894)' }}
            >
              <Play className="w-4 h-4 fill-current" /> Launch Safety Evaluation
            </Link>

            <Link
              to="/history"
              className="px-5 py-3.5 rounded-2xl font-bold text-gray-300 text-sm transition-all bg-white/5 hover:bg-white/10 hover:text-white border border-white/10"
            >
              View Audit History
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/5">
            {stats.map(({ n, label, color }) => (
              <div key={label} className="text-left">
                <div className="text-2xl font-black font-mono" style={{ color }}>{n}</div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scorecard Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <LiveScorecardPreview />
        </div>
      </div>

      {/* Ticker Banner */}
      <div className="overflow-hidden py-3 border-y border-white/5 bg-white/2">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {ticker.concat(ticker).map((item, idx) => (
            <span key={idx} className="text-xs font-mono text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* 6 Core Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Comprehensive IndiaAI Evaluation Framework
          </h2>
          <p className="text-gray-400 text-sm">
            Evaluating Indian foundation models for cultural alignment, fairness, and safety vulnerability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color, tag }) => (
            <div key={title} className="glass rounded-3xl p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#6C63FF]/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${color}18`, color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                  {tag}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Step Workflow */}
      <div className="glass rounded-3xl p-8 border border-white/10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-white">How the Safety Engine Operates</h2>
          <p className="text-gray-400 text-xs">End-to-end automated red-teaming pipeline in under 30 seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ n, emoji, title, desc }) => (
            <div key={n} className="space-y-2 p-5 rounded-2xl bg-white/3 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <span className="font-mono text-xs font-black text-[#6C63FF]">STEP {n}</span>
              </div>
              <h4 className="font-bold text-white text-sm">{title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}