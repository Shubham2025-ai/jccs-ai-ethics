import { Link } from 'react-router-dom'
import { Shield, Upload, BarChart2, FileCheck, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react'

const stats = [
  { value: '6', label: 'Fairness Dimensions' },
  { value: '<60s', label: 'Analysis Time' },
  { value: '3', label: 'Compliance Standards' },
  { value: '100%', label: 'No-Code Required' },
]

const features = [
  { icon: BarChart2, title: 'Demographic Parity', desc: 'Are positive outcomes equally distributed across gender, age, race?' },
  { icon: Shield, title: 'Counterfactual Fairness', desc: 'Would the outcome change if only the demographic attribute were different?' },
  { icon: Zap, title: 'SHAP Explainability', desc: 'Visual feature attribution — understand exactly why each decision was made.' },
  { icon: FileCheck, title: 'Compliance Report', desc: 'Auto-mapped to EU AI Act 2026, India DPDP Act & ISO 42001.' },
  { icon: Globe, title: 'AI Plain Language', desc: 'Groq + Llama 3 converts complex bias metrics into executive-readable findings.' },
  { icon: Shield, title: 'Blockchain Audit Trail', desc: 'SHA-256 immutable hash ensures audit results cannot be altered post-hoc.' },
]

const useCases = ['Hiring AI', 'Loan Approval', 'Healthcare Triage', 'Recidivism Prediction', 'Credit Scoring', 'Insurance Pricing']

export default function HomePage() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero */}
      <div className="text-center space-y-6 max-w-4xl mx-auto relative">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #6C63FF, transparent)' }} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
          style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' }}>
          <Shield className="w-3 h-3" /> AI Ethics Auditing Platform — Star Wars Hackathon 2026
        </div>

        <h1 className="text-6xl font-black text-white leading-tight tracking-tight">
          The Crash-Test Dummy<br />
          <span style={{ background: 'linear-gradient(135deg, #6C63FF, #E94560)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            for AI Systems
          </span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
          Upload your AI model predictions. Get a certified ethics scorecard in under 60 seconds.
          Detect bias, explain decisions, ensure compliance — no coding required.
        </p>

        {/* Use cases ticker */}
        <div className="flex flex-wrap gap-2 justify-center">
          {useCases.map(u => (
            <span key={u} className="px-3 py-1 rounded-full text-xs text-gray-400 border border-white/10">
              {u}
            </span>
          ))}
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link to="/upload"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 30px rgba(108,99,255,0.3)' }}>
            Start Free Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/history"
            className="px-8 py-4 rounded-2xl font-bold text-gray-300 glass hover:text-white transition-all hover:scale-105">
            View History
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="glass rounded-2xl p-6 text-center hover:border-[#6C63FF]/30 transition-all border border-white/5">
            <div className="text-4xl font-black mb-1" style={{ color: '#6C63FF' }}>{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-3xl font-black text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Upload CSV', desc: 'Drag & drop your model predictions file. Auto-detects label, prediction, and sensitive attribute columns.' },
            { step: '02', title: 'Analyse', desc: '6 fairness dimensions run simultaneously using Fairlearn + AIF360 + SHAP. Takes under 60 seconds.' },
            { step: '03', title: 'Certify', desc: 'Get a compliance-ready report mapped to EU AI Act, DPDP Act, and ISO 42001 with blockchain audit trail.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="glass rounded-2xl p-6 border border-white/5 hover:border-[#6C63FF]/30 transition-all">
              <div className="text-5xl font-black mb-4 opacity-20" style={{ color: '#6C63FF' }}>{step}</div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-black text-white text-center mb-12">What We Audit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-5 hover:border-[#6C63FF]/40 transition-all border border-white/5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: 'rgba(108,99,255,0.15)' }}>
                <Icon className="w-5 h-5" style={{ color: '#6C63FF' }} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance badges */}
      <div className="glass rounded-2xl p-8 border border-[#6C63FF]/20">
        <h2 className="text-2xl font-black text-white text-center mb-6">Compliance Standards Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'EU AI Act 2026', desc: 'Articles 10, 13, 14, 15 — Mandatory for high-risk AI systems in Europe', color: '#3B82F6' },
            { name: 'India DPDP Act', desc: 'Sections 4, 11, 16 — Digital Personal Data Protection fairness requirements', color: '#10B981' },
            { name: 'ISO 42001', desc: 'Clauses 6.1.2, 8.4, 9.1 — International AI Management System standard', color: '#F59E0B' },
          ].map(({ name, desc, color }) => (
            <div key={name} className="rounded-xl p-4 flex items-start gap-3" style={{ background: color + '11', border: `1px solid ${color}33` }}>
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
              <div>
                <div className="font-bold text-white text-sm">{name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white">Ready to audit your AI?</h2>
        <p className="text-gray-400">Takes less than 60 seconds. No account required.</p>
        <Link to="/upload"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 40px rgba(108,99,255,0.3)' }}>
          Upload CSV Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
