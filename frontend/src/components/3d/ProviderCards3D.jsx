import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * 3D Provider Model Cards
 * Horizontal scrollable 3D cards with parallax tilt, brand edge glow,
 * and an interactive 3D magnetic snapping cable connection animation.
 */
export default function ProviderCards3D({
  selectedProvider = 'sarvam',
  onSelectProvider = () => {},
  onTestConnection = null,
  isTesting = false,
  testStatus = null, // { success: boolean, message: string }
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const providers = [
    {
      id: 'sarvam',
      name: 'Sarvam AI',
      badge: 'Indic Sovereign',
      tag: 'Full 22 Indic Languages',
      color: '#ff9933',
      defaultModel: 'sarvam-2b',
      endpoint: 'https://api.sarvam.ai/v1',
      latency: '240ms',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M7.5 7.5l9 9M7.5 16.5l9-9" />
        </svg>
      )
    },
    {
      id: 'google',
      name: 'Google AI Studio',
      badge: 'Gemini Multimodal',
      tag: 'Native Flash & Pro',
      color: '#4285f4',
      defaultModel: 'gemini-2.5-flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
      latency: '310ms',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      id: 'groq',
      name: 'Groq Cloud',
      badge: 'Ultra-Fast LPU',
      tag: 'Llama 3.3 70B & 8B',
      color: '#f97316',
      defaultModel: 'llama-3.3-70b-versatile',
      endpoint: 'https://api.groq.com/openai/v1',
      latency: '85ms',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      badge: 'Free-Tier Router',
      tag: 'Multi-Model Fallback',
      color: '#06b6d4',
      defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
      endpoint: 'https://openrouter.ai/api/v1',
      latency: '420ms',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      )
    }
  ];

  const handleCardMouseMove = (e, id) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHoveredCard(id);
    setMouseOffset({ x, y });
  };

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8a8a9e]">
          Target Inference Provider (3D Sovereign Connector)
        </span>
        <span className="text-[11px] font-mono text-[#5a5a72]">
          Parallax Tilt &bull; Magnetic Snapping
        </span>
      </div>

      {/* Grid / Horizontal Container */}
      <div style={{ perspective: '1200px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((prov) => {
          const isSelected = selectedProvider === prov.id;
          const isThisHovered = hoveredCard === prov.id;

          return (
            <motion.div
              key={prov.id}
              onClick={() => onSelectProvider(prov.id)}
              onMouseMove={(e) => handleCardMouseMove(e, prov.id)}
              onMouseLeave={() => { setHoveredCard(null); setMouseOffset({ x: 0, y: 0 }); }}
              animate={{
                rotateX: isThisHovered && !shouldReduceMotion ? mouseOffset.y * -16 : 0,
                rotateY: isThisHovered && !shouldReduceMotion ? mouseOffset.x * 16 : 0,
                scale: isSelected ? 1.02 : isThisHovered ? 1.01 : 1,
                translateZ: isSelected ? 20 : isThisHovered ? 10 : 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                transformStyle: 'preserve-3d',
                borderColor: isSelected ? prov.color : isThisHovered ? `${prov.color}60` : '#1e1e2e',
                boxShadow: isSelected
                  ? `0 12px 30px rgba(0,0,0,0.8), 0 0 25px ${prov.color}30, inset 0 1px 2px ${prov.color}60`
                  : '0 8px 20px rgba(0,0,0,0.4)',
              }}
              className={`relative cursor-pointer rounded-xl p-4 bg-gradient-to-b from-[#181826] to-[#101018] border transition-colors select-none flex flex-col justify-between min-h-[160px]`}
            >
              {/* Brand Color Top Accent Bar */}
              <div
                style={{ backgroundColor: prov.color }}
                className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-80"
              />

              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      backgroundColor: `${prov.color}18`,
                      borderColor: `${prov.color}50`,
                      color: prov.color
                    }}
                    className="p-2 rounded-lg border flex items-center justify-center"
                  >
                    {prov.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-mono text-white leading-tight">
                      {prov.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#8a8a9e]">
                      {prov.tag}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: isSelected ? `${prov.color}25` : '#1f1f2e',
                    borderColor: isSelected ? prov.color : '#2e2e42',
                    color: isSelected ? prov.color : '#8a8a9e'
                  }}
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
                >
                  {prov.badge}
                </span>
              </div>

              {/* Endpoint & Telemetry */}
              <div className="mt-3 pt-2.5 border-t border-[#1e1e2e] flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex items-center justify-between text-[#8a8a9e]">
                  <span>Model:</span>
                  <span className="text-white font-medium truncate max-w-[120px]">{prov.defaultModel}</span>
                </div>
                <div className="flex items-center justify-between text-[#8a8a9e]">
                  <span>Avg Latency:</span>
                  <span className="text-[#00d4aa] font-semibold">{prov.latency}</span>
                </div>
              </div>

              {/* 3D Magnetic Snapping Cable Connection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-3 flex items-center justify-between pt-2 border-t border-[#2e2e3e]"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00d4aa]">
                    {/* Snapping Plug Animation */}
                    <motion.div
                      animate={isTesting ? { x: [-3, 3, -3] } : {}}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 rounded-full bg-[#00d4aa] shadow-[0_0_8px_#00d4aa]"
                    />
                    <span>{isTesting ? 'Handshaking...' : testStatus?.success ? 'Locked & Verified' : 'Socket Active'}</span>
                  </div>

                  {onTestConnection && (
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={(e) => { e.stopPropagation(); onTestConnection(prov); }}
                      style={{ borderColor: prov.color, color: prov.color }}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-[#0a0a0f] hover:bg-white/5 active:scale-95 transition-all"
                    >
                      {isTesting ? 'Testing...' : 'Test 3D Plug'}
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
