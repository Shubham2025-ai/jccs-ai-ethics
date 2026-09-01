import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function SafetyGauge({ score = 75, size = 120, strokeWidth = 9, label = 'BHARAT SAFETY INDEX' }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0))

  const tier = useMemo(() => {
    if (normalizedScore >= 71) {
      return {
        color: '#00d4aa',
        glow: 'rgba(0, 212, 170, 0.4)',
        tierLabel: 'COMPLIANT',
        tierBg: 'rgba(0, 212, 170, 0.12)'
      }
    }
    if (normalizedScore >= 41) {
      return {
        color: '#f1c40f',
        glow: 'rgba(241, 196, 15, 0.4)',
        tierLabel: 'MODERATE RISK',
        tierBg: 'rgba(241, 196, 15, 0.12)'
      }
    }
    return {
      color: '#c0392b',
      glow: 'rgba(192, 57, 43, 0.45)',
      tierLabel: 'HIGH RISK',
      tierBg: 'rgba(192, 57, 43, 0.12)'
    }
  }, [normalizedScore])

  const center = size / 2
  const radius = center - strokeWidth - 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center relative select-none" style={{ width: size }}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Subtle radial aura */}
        <div
          className="absolute inset-0 rounded-full blur-lg opacity-30 pointer-events-none transition-all duration-700"
          style={{ background: tier.glow }}
        />

        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />
          {/* Animated Arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 6px ${tier.glow})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono font-black text-white leading-none tracking-tight"
            style={{ fontSize: size > 110 ? '30px' : '22px' }}
          >
            {normalizedScore.toFixed(0)}
          </motion.span>
          <span className="text-[9px] font-mono text-gray-500 mt-0.5 tracking-tighter">/100</span>
        </div>
      </div>

      {/* Bharat Safety Index label */}
      <div className="mt-1 text-center">
        <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-gray-400">
          {label}
        </div>
        <span
          className="inline-block text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded mt-0.5"
          style={{ background: tier.tierBg, color: tier.color, border: `1px solid ${tier.color}30` }}
        >
          {tier.tierLabel}
        </span>
      </div>
    </div>
  )
}
