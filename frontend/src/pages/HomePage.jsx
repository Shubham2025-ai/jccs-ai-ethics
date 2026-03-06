import { Link } from 'react-router-dom'
import { Shield, Upload, BarChart2, FileCheck, Zap, Lock, Eye, ArrowRight, AlertTriangle } from 'lucide-react'

const features = [
  { icon: BarChart2, title: 'Demographic Parity',     desc: 'Equal outcomes across gender, age, and race.',         color: '#6C63FF' },
  { icon: Shield,    title: 'Counterfactual Fairness', desc: 'Would outcomes change if demographics were different?', color: '#E94560' },
  { icon: Eye,       title: 'Equal Opportunity',       desc: 'Equal true positive rates across all groups.',          color: '#00B894' },
  { icon: Zap,       title: 'SHAP + LIME',             desc: 'Visual explanation for every individual decision.',     color: '#FDCB6E' },
  { icon: FileCheck, title: 'Compliance Report',       desc: 'EU AI Act · DPDP Act · ISO 42001 auto-mapped.',        color: '#3B82F6' },
  { icon: Lock,      title: 'Blockchain Proof',        desc: 'SHA-256 tamper-proof audit certificate.',              color: '#8B5CF6' },
]

const realCases = [
  { co: 'Amazon',    year: '2018', what: 'Hiring AI rejected 75% of women', impact: '4 years undetected', icon: '🏢' },
  { co: 'COMPAS',    year: '2016', what: 'Flagged Black defendants 2× more', impact: 'Used in US courts',  icon: '⚖️' },
  { co: 'Apple Card',year: '2019', what: 'Men received 20× higher limits',  impact: 'Federal probe',       icon: '💳' },
]

const ticker = ['Hiring AI', 'Loan Approval', 'Healthcare Triage', 'Recidivism', 'Credit Scoring', 'Insurance', 'Admissions', 'Predictive Policing', 'Hiring AI', 'Loan Approval', 'Healthcare Triage', 'Recidivism', 'Credit Scoring', 'Insurance', 'Admissions', 'Predictive Policing']

const stats = [
  { n: '6',    label: 'Fairness Dimensions' },
  { n: '<60s', label: 'Full Analysis' },
  { n: '3',    label: 'Compliance Frameworks' },
  { n: '0',    label: 'Code Required' },
]

export default function HomePage() {
  return (
    <div>

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">

        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-float"
            style={{ background: 'radial-gradient(ellipse, #6C63FF, #E94560)' }} />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
            style={{ background: '#E94560', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[60px] animate-float"
            style={{ background: '#00B894', animationDelay: '1s' }} />
          {/* Spinning ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#6C63FF]/5 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#E94560]/5 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto stagger">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
            style={{ background: 'rgba(108,99,255,0.1)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.2)' }}>
            <span className="live-dot w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            Live · Star Wars Hackathon 2026 · PS9 · AI Ethics
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.95] tracking-tight mb-8 text-white">
            Audit Your AI<br />
            <span className="gradient-text">Before It Harms</span><br />
            <span className="text-[clamp(1.5rem,4vw,3rem)] text-gray-400 font-semibold">Someone</span>
          </h1>

          {/* Sub */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Upload any CSV. Detect bias across{' '}
            <span className="text-white font-semibold">6 fairness dimensions</span>.
            Get a blockchain-certified compliance report in{' '}
            <span className="text-white font-semibold">under 60 seconds</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/upload"
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 btn-shimmer glow-purple"
              style={{ letterSpacing: '-0.02em' }}>
              <Upload className="w-5 h-5" />
              Start Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/history"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-gray-300 glass-strong hover:text-white transition-all hover:scale-105 text-base">
              View Audit History
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {stats.map(({ n, label }) => (
              <div key={label} className="glass rounded-2xl py-4 px-3 text-center card-hover border border-white/5">
                <div className="text-3xl font-black text-white mb-0.5"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {n}
                </div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="text-xs text-gray-400 tracking-widest uppercase">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TICKER
      ════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/5 py-4 overflow-hidden"
        style={{ background: 'rgba(108,99,255,0.03)' }}>
        <div className="marquee-track">
          {ticker.map((t, i) => (
            <span key={i} className="mx-8 text-sm font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">
              {t}
              <span className="ml-8 text-[#6C63FF]/40">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          REAL CASES
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-400 uppercase tracking-widest">Real AI Bias Incidents</div>
              <div className="text-xs text-gray-600">These could have been caught in 60 seconds with JCCS</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {realCases.map(({ co, year, what, impact, icon }) => (
              <div key={co} className="relative rounded-2xl p-5 overflow-hidden card-hover"
                style={{ background: 'rgba(233,69,96,0.05)', border: '1px solid rgba(233,69,96,0.12)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl"
                  style={{ background: '#E94560' }} />
                <div className="text-3xl mb-4">{icon}</div>
                <div className="flex items-end justify-between mb-2">
                  <span className="font-black text-white text-xl">{co}</span>
                  <span className="text-xs text-gray-600">{year}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{what}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(233,69,96,0.15)', color: '#f87171' }}>
                  ⚠ {impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Simple as 1-2-3</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)' }} />
            {[
              { n: '01', emoji: '📁', title: 'Upload CSV',  desc: 'Drop any model predictions file. Auto-detects columns across any domain — no setup needed.' },
              { n: '02', emoji: '🔬', title: 'Analyse',     desc: '6 fairness dimensions run in parallel with SHAP + LIME + Groq AI explanations in plain English.' },
              { n: '03', emoji: '🏅', title: 'Get Certified', desc: 'Download a blockchain-anchored PDF mapped to EU AI Act, DPDP Act, and ISO 42001.' },
            ].map(({ n, emoji, title, desc }) => (
              <div key={n} className="glass rounded-2xl p-7 border border-white/5 card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 font-display text-8xl font-black opacity-[0.03] leading-none select-none">{n}</div>
                <div className="text-4xl mb-5">{emoji}</div>
                <div className="text-xs font-black text-gray-600 tracking-widest uppercase mb-2">{n}</div>
                <h3 className="font-black text-white text-xl mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Full Coverage</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">What We Audit</h2>
            <p className="text-gray-500 mt-3">6 dimensions of algorithmic fairness — all automated</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass rounded-2xl p-6 border border-white/5 card-hover group relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top left, ${color}08, transparent 60%)` }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: color + '18', boxShadow: `0 0 20px ${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-black text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COMPLIANCE
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-10 border border-[#6C63FF]/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top right, rgba(108,99,255,0.06), transparent 60%)' }} />
            <div className="text-center mb-10">
              <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">Regulatory Ready</div>
              <h2 className="text-3xl md:text-4xl font-black text-white">3 Frameworks. 1 Upload.</h2>
              <p className="text-gray-500 text-sm mt-3">Every audit is automatically mapped to all three standards</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { flag: '🇪🇺', name: 'EU AI Act 2026',  articles: 'Articles 10, 13, 14, 15', desc: 'Mandatory for high-risk AI in Europe',          color: '#3B82F6' },
                { flag: '🇮🇳', name: 'India DPDP Act',  articles: 'Sections 4, 11, 16',      desc: 'Digital Personal Data Protection fairness',    color: '#10B981' },
                { flag: '🌐', name: 'ISO/IEC 42001',    articles: 'Clauses 6.1.2, 8.4, 9.1', desc: 'International AI Management System standard', color: '#F59E0B' },
              ].map(({ flag, name, articles, desc, color }) => (
                <div key={name} className="rounded-2xl p-5 card-hover"
                  style={{ background: color + '08', border: `1px solid ${color}20` }}>
                  <div className="text-2xl mb-3">{flag}</div>
                  <div className="font-black text-white text-base mb-1">{name}</div>
                  <div className="text-xs font-bold mb-2" style={{ color }}>{articles}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Is your AI<br /><span className="gradient-text">actually fair?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Find out in 60 seconds. Free. No code. No signup.</p>
          <Link to="/upload"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-white text-xl transition-all hover:scale-105 btn-shimmer glow-purple"
            style={{ letterSpacing: '-0.02em' }}>
            <Upload className="w-6 h-6" />
            Audit Your AI Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  )
}