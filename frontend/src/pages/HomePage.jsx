import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Shield, Play, BarChart2, FileCheck, Zap, Lock, Eye, ArrowRight,
  AlertTriangle, Globe, Layers, Terminal, Sparkles, CheckCircle2, Cpu
} from 'lucide-react'
import { motion } from 'framer-motion'
import SafetyGauge from '../components/dashboard/SafetyGauge'

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
  { n: '01', title: 'Target Model Gateway', desc: 'Select from sovereign Indic foundation models (Sarvam AI), Google Gemini, Groq Cloud, or custom vLLM / Ollama endpoints.' },
  { n: '02', title: 'Multilingual Red-Teaming', desc: 'Automated parallel execution of 44 curated adversarial probes across English, Hindi, and Tamil cultural contexts.' },
  { n: '03', title: 'Certified Bharat Scorecard', desc: 'Download a tamper-proof, blockchain-anchored IndiaAI Safety Scorecard with drop-in mitigation guardrails.' },
]

const stats = [
  { n: '44',   label: 'Adversarial Probes', color: '#ff9933' },
  { n: '3',    label: 'Indic Languages (EN/HI/TA)', color: '#00d4aa' },
  { n: '9',    label: 'Safety Dimensions', color: '#3498db' },
  { n: '<30s', label: 'Full Audit Cycle', color: '#f1c40f' },
]

const trustEntities = [
  { name: 'IndiaAI Mission', label: 'Safety Mandate' },
  { name: 'Ministry of Electronics & IT (MeitY)', label: 'GenAI Advisory Compliance' },
  { name: 'Bureau of Indian Standards (BIS)', label: 'AI Standards Framework' },
  { name: 'DPDP Act 2023', label: 'Section 4, 6 & 8 Verification' },
  { name: 'C-DAC India', label: 'High-Performance AI Benchmarks' },
]

function LiveScorecardCard() {
  return (
    <div className="fortress-card p-6 border-fortress-border max-w-sm mx-auto shadow-fortress-card relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-fortress-border mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-saffron block">
            LIVE EVALUATION PREVIEW
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
        <span>HMAC-SHA256 Anchor:</span>
        <span className="text-safety-teal font-bold truncate max-w-[110px]">7f4e92a...98b</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-24 py-6 animate-fade-in pb-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-saffron/10 text-saffron border border-saffron/30">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            Aligned with IndiaAI Mission & MeitY GenAI Advisories
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-heading font-black text-ink-white leading-[1.1] tracking-tight">
            Safeguarding <span className="gradient-saffron">India’s</span> AI Future.
          </h1>

          {/* Subheading */}
          <p className="text-ink-gray text-base sm:text-lg leading-relaxed max-w-xl">
            Automated red-teaming and cultural alignment audit for Indian language foundation models. Detect caste bias, gender occupational disparities, and adversarial jailbreaks in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/upload"
              className="px-7 py-3.5 rounded-xl font-heading font-black text-sm text-fortress-base bg-gradient-to-r from-saffron to-saffron-deep hover:brightness-110 shadow-saffron-glow transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Safety Evaluation</span>
            </Link>

            <Link
              to="/history"
              className="btn-saffron-slide px-6 py-3.5 rounded-xl font-heading font-bold text-ink-white text-sm bg-fortress-surface border border-fortress-border hover:border-saffron transition-all"
            >
              View Audit History
            </Link>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-fortress-border">
            {stats.map(({ n, label, color }) => (
              <div key={label} className="text-left">
                <div className="text-2xl sm:text-3xl font-heading font-black font-mono" style={{ color }}>{n}</div>
                <div className="text-[11px] text-ink-dim font-heading font-bold mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scorecard Preview Column */}
        <div className="lg:col-span-5 flex justify-center">
          <LiveScorecardCard />
        </div>
      </div>

      {/* Trust & Governance Bar */}
      <div className="border-y border-fortress-border py-5 bg-fortress-surface/50">
        <div className="text-center text-[10px] font-mono uppercase tracking-widest text-ink-dim mb-3">
          STANDARDIZED AGAINST INDIAN REGULATORY & SAFETY MANDATES
        </div>
        <div className="flex flex-wrap items-center justify-around gap-6 text-xs font-heading font-bold text-ink-gray">
          {trustEntities.map((e) => (
            <div
              key={e.name}
              className="flex items-center gap-2 transition-all hover:text-ink-white cursor-default group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 group-hover:bg-saffron" />
              <span>{e.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Core Pillars */}
      <div className="space-y-8">
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
      </div>

      {/* 3 Step Workflow */}
      <div className="fortress-card p-8 border-fortress-border space-y-6">
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
      </div>
    </div>
  )
}
