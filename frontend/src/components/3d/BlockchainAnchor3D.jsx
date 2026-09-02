import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * 3D Blockchain Anchor Visual
 * Assembling 3D chain link visual representing cryptographic proof commitment.
 * Amber glow if Bitcoin anchor pending, teal glow + padlock snap when anchored.
 */
export default function BlockchainAnchor3D({
  isAnchored = true,
  merkleRoot = 'e45213228e9e6f99b2447957b42023577d332da1bf5a85ef980590821d54d2b8',
  transactionId = 'btc_00094_f103910efc58d424',
  timestamp = new Date().toISOString(),
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(merkleRoot);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ perspective: '1200px' }}
      className={`relative rounded-xl border border-[#1e1e2e] bg-gradient-to-b from-[#13131f] to-[#0a0a0f] p-5 overflow-hidden ${className}`}
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d4aa15_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: isAnchored ? '#00d4aa' : '#f1c40f',
              boxShadow: `0 0 10px ${isAnchored ? '#00d4aa' : '#f1c40f'}`
            }}
            className="w-2.5 h-2.5 rounded-full animate-pulse"
          />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
            Cryptographic Audit Trail (HMAC-SHA256 Merkle Anchor)
          </h3>
        </div>

        <span
          style={{
            backgroundColor: isAnchored ? '#00d4aa20' : '#f1c40f20',
            borderColor: isAnchored ? '#00d4aa60' : '#f1c40f60',
            color: isAnchored ? '#00d4aa' : '#f1c40f'
          }}
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase"
        >
          {isAnchored ? 'IMMUTABLE ANCHOR LOCKED' : 'ANCHOR PENDING COMMIT'}
        </span>
      </div>

      {/* 3D Assembling Chain Link Visualization */}
      <div className="relative z-10 py-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {/* Chain Link 1 */}
          <motion.div
            animate={shouldReduceMotion ? {} : { rotateY: [0, 360], rotateX: [15, -15, 15] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-12 h-16 rounded-2xl border-4 border-[#00d4aa] shadow-[0_0_15px_#00d4aa40] flex items-center justify-center bg-[#13131f]/80"
          >
            <div className="w-4 h-8 rounded-lg bg-[#0a0a0f] border border-[#00d4aa]/40" />
          </motion.div>

          {/* Interlocking Middle Connector */}
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-8 h-2 rounded-full bg-gradient-to-r from-[#00d4aa] via-[#ff9933] to-[#00d4aa] shadow-[0_0_12px_#ff993380]"
          />

          {/* Chain Link 2 (Padlock Hub) */}
          <motion.div
            animate={shouldReduceMotion ? {} : { rotateY: [360, 0], rotateX: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-12 h-16 rounded-2xl border-4 border-[#ff9933] shadow-[0_0_15px_#ff993340] flex items-center justify-center bg-[#13131f]/80"
          >
            {/* Padlock Icon */}
            <svg className="w-6 h-6 text-[#ff9933]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Cryptographic Hash Stream Display */}
      <div className="relative z-10 bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2e] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-[#8a8a9e]">Merkle Root Hash (Deterministic)</span>
          <button
            onClick={handleCopy}
            className="text-[10px] font-mono text-[#ff9933] hover:underline"
          >
            {copied ? 'Copied!' : 'Copy Hash'}
          </button>
        </div>
        <div className="font-mono text-xs text-[#00d4aa] break-all select-all">
          {merkleRoot}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#5a5a72] pt-2 border-t border-[#1e1e2e]">
          <span>Proof ID: <strong className="text-white">{transactionId}</strong></span>
          <span>Anchored At: <strong className="text-white">{timestamp.replace('T', ' ').slice(0, 19)} UTC</strong></span>
        </div>
      </div>
    </div>
  );
}
