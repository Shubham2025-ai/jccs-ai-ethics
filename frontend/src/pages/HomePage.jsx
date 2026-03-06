import { Link } from 'react-router-dom'
import { Shield, BarChart2, FileCheck, Zap, Globe, ArrowRight, CheckCircle, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'

const features = [
  { icon: BarChart2, title: 'Demographic Parity', desc: 'Detects if positive outcomes are equally distributed across gender, age, race, and other protected attributes.', tag: 'Fairlearn' },
  { icon: Shield, title: 'Counterfactual Fairness', desc: 'Would the outcome change if only the demographic attribute were different? Causal analysis reveals hidden discrimination.', tag: 'Custom Engine' },
  { icon: Zap, title: 'SHAP + LIME Explainability', desc: 'Global feature attribution via SHAP TreeExplainer. Individual decision explanation via LIME perturbation analysis.', tag: 'XAI' },
  { icon: FileCheck, title: 'Compliance Mapping', desc: 'Auto-mapped to EU AI Act 2026 Articles 10–15, India DPDP Sections 4/11/16, and ISO/IEC 42001.', tag: 'Regulatory' },
  { icon: Globe, title: 'AI Plain Language', desc: 'Groq + Llama 3 converts complex bias metrics into executive-readable findings any stakeholder can understand.', tag: 'Groq API' },
  { icon: Lock, title: 'Blockchain Audit Trail', desc: 'SHA-256 immutable hash anchored via OriginStamp. Your audit certificate cannot be altered post-generation.', tag: 'Blockchain' },
]

const useCases = [
  { label: 'Hiring AI', icon: '👥' },
  { label: 'Loan Approval', icon: '🏦' },
  { label: 'Healthcare Triage', icon: '🏥' },
  { label: 'Recidivism Prediction', icon: '⚖️' },
  { label: 'Credit Scoring', icon: '💳' },
  { label: 'Insurance Pricing', icon: '📊' },
]

const realCases = [
  { org: 'Amazon', year: '2018', desc: 'Hiring AI systematically downgraded women applicants for 4 years before discovery', impact: '75% of rejected were women' },
  { org: 'COMPAS', year: '2016', desc: 'Recidivism tool flagged Black defendants as high-risk at 2× the rate of white defendants', impact: 'Used in US courts nationwide' },
  { org: 'Apple Card', year: '2019', desc: 'Credit algorithm offered men up to 20× higher limits than women with same financial profiles', impact: 'Federal investigation launched' },
]

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)
  const num = parseInt(target)
  useEffect(() => {
    if (isNaN(num)) return
    let start = 0
    const step = Math.max(1, Math.floor(num / 60))
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [num])
  return <span>{isNaN(num) ? target : count}</span>
}

export default function HomePage() {
  return (
    <div style={{ '--accent': '#6C63FF', '--accent2': '#E94560' }} className="space-y-24 py-8">

      {/* Hero */}
      <div className="relative text-center space-y-8 max-w-5xl mx-auto">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(108,99,255,0.07)' }} />
          <div className="absolute top-10 right-1/4 w-60 h-60 rounded-full blur-3xl" style={{ background: 'rgba(233,69,96,0.05)' }} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(108,99,255,0.12)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse 2s infinite' }} />
          Live · Star Wars Hackathon 2026 · PS9
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tight">
            The Crash-Test Dummy
          </h1>
          <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight"
            style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #a78bfa 40%, #E94560 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            for AI Systems
          </h1>
        </div>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
          Upload AI model predictions. Get a certified ethics scorecard in under 60 seconds.
          Detect bias, explain every decision, ensure full regulatory compliance — zero coding required.
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {useCases.map(({ label, icon }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {icon} {label}
            </span>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/upload"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 40px rgba(108,99,255,0.35)' }}>
            Start Free Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/history" className="px-8 py-4 rounded-2xl font-bold text-gray-300 glass hover:text-white transition-all hover:scale-105">
            View History
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '6', label: 'Fairness Dimensions', icon: '⚖️' },
          { value: '60', label: 'Seconds to Results', icon: '⚡', prefix: '<' },
          { value: '3', label: 'Compliance Standards', icon: '📋' },
          { value: '0', label: 'Lines of Code Needed', icon: '✨' },
        ].map(({ value, label, icon, prefix }) => (
          <div key={label} className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-[#6C63FF]/30 transition-all group cursor-default">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-4xl font-black mb-1 transition-transform group-hover:scale-110" style={{ color: '#6C63FF' }}>
              {prefix && <span className="text-2xl">{prefix}</span>}
              <AnimatedCounter target={value} />
            </div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Real Incidents */}
      <div className="rounded-2xl p-6 border" style={{ background: 'rgba(233,69,96,0.04)', borderColor: 'rgba(233,69,96,0.18)' }}>
        <p className="text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: '#f87171' }}>
          <span>⚠️</span> Real AI bias incidents JCCS would have caught
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {realCases.map(({ org, year, desc, impact }) => (
            <div key={org} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-white">{org}</span>
                <span className="text-xs text-gray-600">{year}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{desc}</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(233,69,96,0.15)', color: '#f87171' }}>
                {impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-2">How It Works</h2>
          <p className="text-gray-500 text-sm">From raw predictions to certified compliance report in three steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Upload CSV', desc: 'Drag & drop your AI model predictions. Auto-detects label, prediction, and sensitive attribute columns from any domain — hiring, loans, healthcare, criminal justice.', color: '#6C63FF' },
            { step: '02', title: 'Analyse', desc: '6 fairness dimensions run simultaneously using Fairlearn + AIF360 + SHAP + LIME. Groq AI writes plain-English findings. Takes under 60 seconds.', color: '#8B5CF6' },
            { step: '03', title: 'Certify', desc: 'Download a PDF compliance report mapped to EU AI Act, India DPDP Act, and ISO 42001. Blockchain-anchored certificate that cannot be tampered.', color: '#E94560' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="glass rounded-2xl p-7 border border-white/5 hover:border-[#6C63FF]/25 transition-all">
              <div className="text-7xl font-black leading-none mb-5 select-none" style={{ color, opacity: 0.2 }}>{step}</div>
              <h3 className="font-black text-white text-xl mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-2">What We Audit</h2>
          <p className="text-gray-500 text-sm">6 dimensions covering every angle of algorithmic fairness</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="glass rounded-2xl p-5 border border-white/5 hover:border-[#6C63FF]/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(108,99,255,0.15)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#6C63FF' }} />
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(108,99,255,0.1)', color: '#a78bfa' }}>{tag}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="glass rounded-2xl p-8 border border-[#6C63FF]/15">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Compliance Standards Covered</h2>
          <p className="text-gray-500 text-sm">Every audit auto-generates a report certified against all three frameworks</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'EU AI Act 2026', articles: 'Articles 10, 13, 14, 15', desc: 'Mandatory for high-risk AI in Europe. Non-compliance = up to €30M fine or 6% of global turnover.', color: '#3B82F6', flag: '🇪🇺' },
            { name: 'India DPDP Act', articles: 'Sections 4, 11, 16', desc: 'Digital Personal Data Protection fairness requirements. India-specific standard for AI fairness.', color: '#10B981', flag: '🇮🇳' },
            { name: 'ISO/IEC 42001', articles: 'Clauses 6.1.2, 8.4, 9.1', desc: 'International AI Management System standard. The global benchmark for responsible AI governance.', color: '#F59E0B', flag: '🌐' },
          ].map(({ name, articles, desc, color, flag }) => (
            <div key={name} className="rounded-2xl p-5" style={{ background: color + '0D', border: `1px solid ${color}28` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{flag}</span>
                <div>
                  <div className="font-black text-white text-sm">{name}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color }}>{articles}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{desc}</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color }} />
                <span className="text-xs" style={{ color }}>Auto-mapped in every report</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative text-center space-y-4 py-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-96 h-32 rounded-full blur-3xl" style={{ background: 'rgba(108,99,255,0.08)' }} />
        </div>
        <h2 className="text-4xl font-black text-white relative">Ready to audit your AI?</h2>
        <p className="text-gray-400 relative">Under 60 seconds. No account required. No coding needed.</p>
        <div className="relative">
          <Link to="/upload"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 50px rgba(108,99,255,0.35)' }}>
            Upload CSV Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}