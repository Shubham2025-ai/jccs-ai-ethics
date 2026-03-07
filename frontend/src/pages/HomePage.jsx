import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Shield, Upload, BarChart2, FileCheck, Zap, Lock, Eye, ArrowRight, AlertTriangle, ChevronRight } from 'lucide-react'

const features = [
  { icon: BarChart2, title: 'Demographic Parity',     desc: 'Equal prediction rates across gender, age, and race.',              color: '#6C63FF', tag: 'Core' },
  { icon: Eye,       title: 'Equal Opportunity',       desc: 'Equal true positive rates — no group is denied what they deserve.', color: '#00B894', tag: 'Core' },
  { icon: Shield,    title: 'Counterfactual Fairness', desc: 'Would outcomes change if only demographics were different?',        color: '#E94560', tag: 'Advanced' },
  { icon: Zap,       title: 'SHAP + LIME',             desc: 'Global & local XAI explanations for every single prediction.',      color: '#FDCB6E', tag: 'XAI' },
  { icon: FileCheck, title: 'Regulatory Compliance',   desc: 'EU AI Act · India DPDP Act · ISO 42001 auto-mapped.',              color: '#3B82F6', tag: 'Legal' },
  { icon: Lock,      title: 'Blockchain Certificate',  desc: 'SHA-256 tamper-proof audit trail anchored to Bitcoin.',            color: '#8B5CF6', tag: 'Trust' },
]

const realCases = [
  { co: 'Amazon',     year: '2018', what: 'Hiring AI penalised resumes containing the word "women"', impact: '4 years undetected',  color: '#E94560', icon: '🏢' },
  { co: 'COMPAS',     year: '2016', what: 'Flagged Black defendants as high-risk 2× more than white', impact: 'Still used in courts', color: '#E17055', icon: '⚖️' },
  { co: 'Apple Card', year: '2019', what: 'Men received credit limits up to 20× higher than women',  impact: 'Federal probe opened', color: '#FDCB6E', icon: '💳' },
]

const steps = [
  { n: '01', emoji: '📁', title: 'Upload CSV',    desc: 'Drop any AI model predictions file. Zero setup — columns auto-detected across any domain.' },
  { n: '02', emoji: '🔬', title: 'Deep Analysis', desc: '6 fairness dimensions + SHAP + LIME + Groq AI explanations — all run in parallel under 60s.' },
  { n: '03', emoji: '🏅', title: 'Get Certified', desc: 'Download a blockchain-anchored PDF audit mapped to EU AI Act, DPDP Act, and ISO 42001.' },
]

const stats = [
  { n: '6',    label: 'Fairness Dimensions', color: '#6C63FF' },
  { n: '<60s', label: 'Full Analysis',       color: '#00B894' },
  { n: '3',    label: 'Legal Frameworks',    color: '#3B82F6' },
  { n: '0',    label: 'Code Required',       color: '#E94560' },
]

const ticker = [
  'Hiring AI','Loan Approval','Healthcare Triage','Recidivism Scoring',
  'Credit Risk','Insurance Pricing','University Admissions','Predictive Policing',
  'Facial Recognition','Resume Screening','Bail Decisions','Medical Diagnosis',
]

/* ── Live bias preview card ─────────────────────────────────────── */
function LiveBiasPreview() {
  const dims = [
    { label: 'Demographic Parity',  score: 19, color: '#E94560' },
    { label: 'Equal Opportunity',   score: 10, color: '#E94560' },
    { label: 'Calibration',         score: 27, color: '#E17055' },
    { label: 'Individual Fairness', score: 50, color: '#FDCB6E' },
    { label: 'Counterfactual',      score: 47, color: '#FDCB6E' },
    { label: 'Transparency',        score: 70, color: '#00B894' },
  ]
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 500); return () => clearTimeout(t) }, [])

  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: "280px" }}
      style={{ filter: 'drop-shadow(0 32px 80px rgba(108,99,255,0.3))' }}>
      <div className="rounded-3xl overflow-hidden border border-white/10"
        style={{ background: 'linear-gradient(145deg, #0d0d1a, #12121f)' }}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Live Audit Preview</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: '#E9456022', color: '#E94560' }}>CRITICAL RISK</span>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black" style={{ color: '#E94560' }}>33</span>
            <span className="text-gray-500 text-lg mb-1">/100</span>
          </div>
          <p className="text-xs text-gray-600">adult_income.csv · 1,000 rows · 7 March 2026</p>
        </div>
        {/* Dimensions */}
        <div className="px-4 py-2 space-y-1.5">
          {dims.map(({ label, score, color }, i) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5">
                <div className="h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: visible ? `${score}%` : '0%', background: color, transitionDelay: `${i * 100 + 600}ms` }} />
              </div>
            </div>
          ))}
        </div>
        {/* SHA footer */}
        <div className="px-4 pb-4">
          <div className="rounded-xl px-3 py-2 text-xs font-mono text-gray-600"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            SHA-256: 9cac7cd7aa37b740f65e...
          </div>
        </div>
      </div>
      {/* Floating badges */}
      <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-black text-white whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg,#6C63FF,#8B5CF6)', boxShadow: '0 6px 18px rgba(108,99,255,0.5)', fontSize: '10px' }}>
        ✓ Blockchain Certified
      </div>
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div>

      {/* ══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-4 pb-6 overflow-hidden" style={{ minHeight: "calc(100vh - 72px)" }}>

        {/* BG */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] rounded-full opacity-[0.08] blur-[140px] animate-float"
            style={{ background: 'radial-gradient(ellipse, #6C63FF 0%, #E94560 60%, transparent 80%)' }} />
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-[0.05] blur-[80px]" style={{ background: '#6C63FF' }} />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-[0.04] blur-[80px]" style={{ background: '#E94560' }} />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        </div>

        {/* Two-column layout */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

            {/* Left */}
            <div className="text-center lg:text-left stagger">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
                style={{ background: 'rgba(108,99,255,0.1)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.2)' }}>
                <span className="live-dot w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                Star Wars Hackathon 2026 · PS9 · AI Ethics
              </div>

              <h1 className="font-black leading-[0.95] tracking-tight mb-2 text-white"
                style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)' }}>
                Audit Your AI<br />
                <span className="gradient-text">Before It Harms</span><br />
                <span style={{ fontSize: 'clamp(1.4rem,3.5vw,2.8rem)', color: '#6b7280', fontWeight: 600 }}>Someone</span>
              </h1>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xl mx-auto lg:mx-0">
                Upload any AI model's predictions as a CSV.
                Detect bias across <span className="text-white font-semibold">6 fairness dimensions</span>.
                Get a blockchain-certified report in{' '}
                <span className="text-white font-semibold">under 60 seconds</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link to="/upload"
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 btn-shimmer glow-purple">
                  <Upload className="w-5 h-5" />
                  Start Free Audit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/history"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-gray-300 glass-strong hover:text-white transition-all hover:scale-105">
                  View Audit History
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto lg:mx-0">
                {stats.map(({ n, label, color }) => (
                  <div key={label} className="glass rounded-xl py-3 px-2 text-center border border-white/5">
                    <div className="text-lg font-black mb-0.5" style={{ color }}>{n}</div>
                    <div className="text-[9px] text-gray-500 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — preview card */}
            <div className="flex justify-center lg:justify-end">
              <LiveBiasPreview />
            </div>
          </div>
        </div>


      </section>

      {/* ══ TICKER ═════════════════════════════════════════════════ */}
      <div className="border-y border-white/5 py-3 overflow-hidden" style={{ background: 'rgba(233,69,96,0.02)' }}>
        <div className="marquee-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="mx-6 text-xs font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 inline-block flex-shrink-0" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══ REAL CASES ═════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-5"
              style={{ background: 'rgba(233,69,96,0.1)', color: '#f87171', border: '1px solid rgba(233,69,96,0.2)' }}>
              <AlertTriangle className="w-3 h-3" /> Real World Failures
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Unaudited AI Already<br />
              <span style={{ color: '#E94560' }}>Caused Real Harm</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              These weren't hypothetical. They happened at scale, undetected for years. JCCS would have caught every one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {realCases.map(({ co, year, what, impact, color, icon }) => (
              <div key={co} className="relative rounded-3xl p-6 overflow-hidden group card-hover"
                style={{ background: `${color}06`, border: `1px solid ${color}20` }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"
                  style={{ background: color }} />
                <div className="flex items-start justify-between mb-5">
                  <span className="text-4xl">{icon}</span>
                  <span className="text-xs font-black px-2 py-1 rounded-lg" style={{ background: color + '18', color }}>{year}</span>
                </div>
                <h3 className="font-black text-white text-lg mb-2">{co}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{what}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4"
                  style={{ background: color + '15', color }}>
                  ⚠ {impact}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1.5 pt-3 border-t border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  JCCS detects this in &lt;60 seconds
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════ */}
      <section className="py-24 px-4" style={{ background: 'rgba(108,99,255,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Simple as 1-2-3</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">How JCCS Works</h2>
            <p className="text-gray-500 mt-3 text-sm">No ML expertise. No code. No configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)' }} />
            {steps.map(({ n, emoji, title, desc }) => (
              <div key={n} className="glass rounded-3xl p-7 border border-white/5 card-hover relative overflow-hidden group">
                <div className="absolute top-0 right-0 font-black opacity-[0.04] text-[120px] leading-none select-none pointer-events-none">{n}</div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: 'radial-gradient(circle at top left, rgba(108,99,255,0.07), transparent 60%)' }} />
                <div className="relative">
                  <div className="text-4xl mb-5">{emoji}</div>
                  <div className="text-xs font-black text-[#6C63FF] tracking-widest uppercase mb-2">{n}</div>
                  <h3 className="font-black text-white text-xl mb-3">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6 DIMENSIONS ═══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Full Coverage</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">6 Dimensions of Fairness</h2>
            <p className="text-gray-500 mt-3 text-sm">Every audit checks all six — automatically, in parallel</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, color, tag }) => (
              <div key={title} className="glass rounded-2xl p-6 border border-white/5 card-hover group relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top left, ${color}0a, transparent 60%)` }} />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: color + '18', boxShadow: `0 0 20px ${color}22` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide"
                    style={{ background: color + '15', color }}>{tag}</span>
                </div>
                <h3 className="font-black text-white text-base mb-2">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPLIANCE ═════════════════════════════════════════════ */}
      <section className="py-24 px-4" style={{ background: 'rgba(108,99,255,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-10 border border-[#6C63FF]/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top right, rgba(108,99,255,0.07), transparent 60%)' }} />
            <div className="relative">
              <div className="text-center mb-10">
                <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Regulatory Ready</div>
                <h2 className="text-3xl md:text-4xl font-black text-white">3 Frameworks. 1 Upload.</h2>
                <p className="text-gray-500 text-sm mt-3">Every audit auto-mapped to all three standards simultaneously</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { flag: '🇪🇺', name: 'EU AI Act 2026',  sub: 'Articles 10, 13, 14, 15',    desc: 'Mandatory for all high-risk AI in Europe',           color: '#3B82F6', badge: 'In force 2026' },
                  { flag: '🇮🇳', name: 'India DPDP Act',  sub: 'Sections 4, 11, 16',          desc: 'Digital Personal Data Protection — India specific',  color: '#10B981', badge: 'Active 2025–26' },
                  { flag: '🌐', name: 'ISO/IEC 42001',     sub: 'Clauses 6.1.2, 8.4, 9.1',    desc: 'International AI Management System standard',        color: '#F59E0B', badge: 'Global' },
                ].map(({ flag, name, sub, desc, color, badge }) => (
                  <div key={name} className="rounded-2xl p-5 card-hover"
                    style={{ background: color + '08', border: `1px solid ${color}25` }}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{flag}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: color + '18', color }}>{badge}</span>
                    </div>
                    <div className="font-black text-white text-base mb-1">{name}</div>
                    <div className="text-xs font-bold mb-2 font-mono" style={{ color }}>{sub}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════════ */}
      <section className="py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.08] blur-[100px]"
            style={{ background: 'radial-gradient(ellipse, #6C63FF, #E94560)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{ background: 'rgba(0,184,148,0.1)', color: '#00B894', border: '1px solid rgba(0,184,148,0.2)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Free · No Signup · No Code Required
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Is Your AI<br /><span className="gradient-text">Actually Fair?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Find out in 60 seconds. Upload your model predictions<br className="hidden md:block" />
            and get a court-ready bias audit report instantly.
          </p>
          <Link to="/upload"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-white text-xl transition-all hover:scale-105 btn-shimmer glow-purple"
            style={{ letterSpacing: '-0.02em' }}>
            <Upload className="w-6 h-6" />
            Audit Your AI Now
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-gray-600 text-xs mt-8">
            JCCS · Jedi Code Compliance System · Star Wars Hackathon 2026 · PS9
          </p>
        </div>
      </section>

    </div>
  )
}