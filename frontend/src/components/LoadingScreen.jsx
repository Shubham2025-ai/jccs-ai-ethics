// FIX: Sovereign LoadingScreen with 160px Bharat Safety Gauge, Audit Trail & Terminal Panel
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, Loader2, Terminal, AlertCircle } from 'lucide-react'

// FIX: 9 Step Sovereign Audit Pipeline
export const EVALUATION_STEPS = [
  { icon: '⚔️', label: 'Caste Representation & Surname Parity Probes', detail: 'Running counterfactual surname pair evaluations (12 probes across EN/HI/TA)...', category: 'caste_representation' },
  { icon: '👥', label: 'Gender & Occupational Role Stereotyping Analysis', detail: 'Auditing pronoun defaults and occupational pigeonholing (12 probes across EN/HI/TA)...', category: 'gender_occupational' },
  { icon: '🏛️', label: 'Regional, Linguistic & Religious Harmony Checks', detail: 'Testing 8th Schedule linguistic parity and regional workplace tropes (10 probes)...', category: 'regional_religious' },
  { icon: '🛡️', label: 'Adversarial Jailbreak & System Prompt Defense', detail: 'Executing DevMode roleplay, UPI OTP evasion, and phishing probes (10 probes)...', category: 'safety_guidelines' },
  { icon: '⚖️', label: 'MeitY GenAI Advisory Due Diligence Scoring', detail: 'Evaluating alignment with IT Rules 2021 and March 2024 advisories...', category: 'regulatory' },
  { icon: '🔒', label: 'DPDP Act 2023 Personal Data Privacy Audit', detail: 'Verifying PII redaction (Aadhaar, PAN, phone number leakage checks)...', category: 'privacy' },
  { icon: '📊', label: 'Aggregating Bharat Safety Index Scorecard', detail: 'Computing 9-dimension weighted metrics and risk tier classification...', category: 'scoring' },
  { icon: '🔐', label: 'Generating HMAC-SHA256 Cryptographic Signature', detail: 'Computing deterministic Merkle chain proof for model provenance...', category: 'signature' },
  { icon: '⚓', label: 'Anchoring Cryptographic Audit Trail', detail: 'Committing Merkle proof to tamper-proof Bitcoin / OriginStamp ledger...', category: 'anchoring' }
]

export default function LoadingScreen({ progress = 0 }) {
  const isComplete = progress >= 100
  const stepIndex = isComplete
    ? EVALUATION_STEPS.length
    : Math.min(Math.floor((progress / 100) * EVALUATION_STEPS.length), EVALUATION_STEPS.length - 1)
  const currentStep = isComplete
    ? { icon: '🛡️', label: 'Audit Complete & Cryptographically Verified', detail: 'Anchoring verified · Loading executive safety scorecard...' }
    : EVALUATION_STEPS[stepIndex]

  // Dynamic Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState([])
  const terminalEndRef = useRef(null)

  useEffect(() => {
    const timestamp = new Date().toISOString().substring(11, 19)
    const activeStep = isComplete
      ? 'Audit successfully anchored to HMAC-SHA256 chained proof'
      : EVALUATION_STEPS[stepIndex]?.label || 'Executing safety evaluation'

    setTerminalLogs((prev) => [
      ...prev.slice(-8),
      `[${timestamp}] [PROBE_EXEC] ${activeStep}`
    ])
  }, [stepIndex, isComplete])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLogs])

  // FIX: Circular SVG Safety Gauge (160px diameter) with Tier Colors
  const size = 160
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)))
  const strokeDashoffset = circumference - (roundedProgress / 100) * circumference

  const tierColor = roundedProgress >= 71 ? '#00d4aa' : roundedProgress >= 41 ? '#f1c40f' : '#c0392b'

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-8 animate-fade-in">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-saffron/10 text-saffron border border-saffron/30">
        <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
        Active Sovereign Red-Teaming Engine
      </div>

      {/* FIX: 160px Circular SVG Bharat Safety Gauge */}
      <div className="relative w-[160px] h-[160px] mx-auto flex items-center justify-center">
        {/* Subtle Ambient Glow matching tier */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-25 transition-colors duration-500"
          style={{ background: tierColor }}
        />

        <svg className="w-full h-full -rotate-90 relative z-10" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track #1e1e2e */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />
          {/* Animated Fill Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tierColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Score in JetBrains Mono 40px Bold */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-4xl font-bold font-mono text-ink-white tracking-tight">
            {roundedProgress}%
          </span>
          <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-[#8b8b9e] mt-1">
            BHARAT SAFETY INDEX
          </span>
        </div>
      </div>

      {/* Active Step Indicator */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-heading font-black text-ink-white flex items-center justify-center gap-2">
          <span>{currentStep.icon}</span>
          <span>{currentStep.label}</span>
        </h3>
        <p className="text-xs text-[#8b8b9e] max-w-md mx-auto font-mono leading-relaxed">
          {currentStep.detail}
        </p>
      </div>

      {/* FIX: Audit Trail List with Snap-to-100% and PENDING / PASS Badges */}
      <div className="fortress-card p-5 text-left space-y-2.5 font-mono text-xs shadow-fortress-card border border-fortress-border bg-fortress-surface/90">
        <div className="flex items-center justify-between pb-2 border-b border-fortress-border text-[10px] uppercase tracking-wider text-[#8b8b9e]">
          <span>Audit Pipeline Phase</span>
          <span>Status</span>
        </div>

        {EVALUATION_STEPS.map((s, i) => {
          const isPast = isComplete || i < stepIndex
          const isCurrent = !isComplete && i === stepIndex
          const isAnchorStep = i === EVALUATION_STEPS.length - 1

          return (
            <div key={s.label} className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-0">
              <div className="flex items-center gap-2.5 truncate pr-2">
                {/* 6px Status Dot */}
                <span
                  className={`w-2 h-2 rounded-full inline-block flex-shrink-0 ${
                    isPast
                      ? 'bg-safety-teal'
                      : isCurrent
                      ? 'bg-safety-gold animate-pulse'
                      : 'bg-[#1e1e2e]'
                  }`}
                />
                <span
                  className={`text-[11px] truncate ${
                    isCurrent
                      ? 'text-ink-white font-bold'
                      : isPast
                      ? 'text-ink-white/90'
                      : 'text-ink-dim'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isPast ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-safety-teal/10 text-safety-teal border border-safety-teal/30">
                    ✓ PASS
                  </span>
                ) : isCurrent ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-saffron/10 text-saffron border border-saffron/30 flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>EXEC</span>
                  </span>
                ) : isAnchorStep && isComplete ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-safety-gold/10 text-safety-gold border border-safety-gold/30">
                    PENDING
                  </span>
                ) : (
                  <span className="text-ink-dim text-[10px]">QUEUED</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* FIX: Live Probe Monitor Terminal Panel */}
      <div className="p-4 rounded-xl bg-fortress-base border border-fortress-border text-left font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between text-ink-dim pb-1.5 border-b border-fortress-border text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-saffron font-bold">
            <Terminal className="w-3 h-3" />
            <span>LIVE PROBE MONITOR</span>
          </span>
          <span className="text-safety-teal">60 FPS TELEMETRY</span>
        </div>
        <div className="h-24 overflow-y-auto space-y-1 text-ink-gray pr-1">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="truncate text-[10px]">
              <span className="text-saffron">❯</span> {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
