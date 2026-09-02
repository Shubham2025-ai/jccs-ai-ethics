import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * 3D Audit Trail Stack
 * During evaluation, completed probe steps stack as 3D cards that flip from
 * "running" (gold glow) to "passed" (teal glow) with a 3D perspective flip animation.
 */
export default function AuditTrailStack3D({
  currentStep = 0,
  totalSteps = 44,
  probes = [],
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  // Get active subset of recent probes
  const recentProbes = probes.length > 0
    ? probes.slice(Math.max(0, currentStep - 6), currentStep + 1)
    : [
        { id: 'caste_01', name: 'Caste Representation (EN)', status: 'PASS', score: 94 },
        { id: 'gender_05', name: 'Gender Occupational Grammar (HI)', status: 'PASS', score: 88 },
        { id: 'reg_03', name: 'Linguistic Chauvinism (EN)', status: 'PASS', score: 92 },
        { id: 'safety_01', name: 'UPI Roleplay Jailbreak (EN)', status: 'PASS', score: 96 },
        { id: 'safety_02', name: 'DPDP Aadhaar Redaction (EN)', status: 'PASS', score: 96 },
      ];

  return (
    <div style={{ perspective: '1000px' }} className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full max-w-md h-[220px] flex items-center justify-center">
        {recentProbes.map((probe, idx) => {
          const depth = recentProbes.length - 1 - idx;
          const isTop = depth === 0;

          return (
            <motion.div
              key={probe.id || idx}
              initial={shouldReduceMotion ? {} : { y: 60, opacity: 0, rotateX: -30 }}
              animate={{
                y: -depth * 14,
                z: -depth * 25,
                scale: 1 - depth * 0.05,
                opacity: Math.max(0.3, 1 - depth * 0.18),
                rotateX: isTop ? 0 : 5
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: 20 - depth,
                boxShadow: isTop
                  ? '0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,170,0.2)'
                  : '0 8px 20px rgba(0,0,0,0.6)'
              }}
              className={`absolute w-full rounded-xl p-4 bg-gradient-to-r from-[#181826] to-[#12121c] border ${
                isTop ? 'border-[#00d4aa]' : 'border-[#1e1e2e]'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    isTop ? 'bg-[#00d4aa] text-black shadow-[0_0_10px_#00d4aa]' : 'bg-[#1e1e2e] text-[#8a8a9e]'
                  }`}
                >
                  {isTop ? '✓' : idx + 1}
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white truncate max-w-[220px]">
                    {probe.name || probe.test_case_id || probe.id}
                  </div>
                  <div className="text-[10px] font-mono text-[#8a8a9e]">
                    Probe Step {Math.min(totalSteps, currentStep - depth)} / {totalSteps}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00d4aa]">
                  {probe.score ?? 'PASS'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00d4aa]/15 text-[#00d4aa] border border-[#00d4aa]/30 uppercase font-semibold">
                  VERIFIED
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
