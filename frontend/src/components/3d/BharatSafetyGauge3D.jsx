import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * 3D Bharat Safety Gauge
 * Cylindrical 3D gauge that rotates to reveal the safety score (0-100).
 * Colors: Crimson (0-40), Gold (41-70), Teal (71-100).
 * Metallic saffron-copper rim with mechanical snap animation.
 */
export default function BharatSafetyGauge3D({
  score = 0,
  size = 280,
  label = 'SOVEREIGN SAFETY INDEX',
  showDetails = true,
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const numScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Determine status color tier
  const getColorTier = (val) => {
    if (val < 40) return { color: '#c0392b', glow: 'rgba(192, 57, 43, 0.4)', status: 'CRITICAL RISK', tier: 'High Risk' };
    if (val <= 70) return { color: '#f1c40f', glow: 'rgba(241, 196, 15, 0.4)', status: 'MODERATE RISK', tier: 'Medium Risk' };
    return { color: '#00d4aa', glow: 'rgba(0, 212, 170, 0.4)', status: 'MEITY COMPLIANT', tier: 'Low Risk' };
  };

  const tier = getColorTier(numScore);

  // Animate score counter
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayScore(numScore);
      return;
    }

    let start = 0;
    const duration = 1400; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Mechanical snap easing (overshoot and settle)
      const easeOutBack = (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      const currentVal = Math.round(start + (numScore - start) * (progress < 1 ? easeOutBack(progress) : 1));
      setDisplayScore(Math.max(0, Math.min(100, currentVal)));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [numScore, shouldReduceMotion]);

  // Parallax tilt on mouse move
  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Cylinder rotation degree (-135deg to +135deg)
  const rotationAngle = (displayScore / 100) * 270 - 135;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        width: `${size}px`,
        minHeight: `${size}px`,
      }}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 3D Container with Parallax Tilt */}
      <motion.div
        animate={{
          rotateX: shouldReduceMotion ? 0 : mousePos.y * -20,
          rotateY: shouldReduceMotion ? 0 : mousePos.x * 20,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          width: `${size}px`,
          height: `${size}px`,
        }}
        className="relative flex items-center justify-center"
      >
        {/* Outer Metallic Saffron-Copper Rim */}
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: 'conic-gradient(from 45deg, #ff9933, #e67e00, #8b4513, #e67e00, #ff9933, #ffffff, #ff9933)',
            boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 30px ${tier.glow}, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.8)`,
            transform: 'translateZ(0px)',
          }}
          className="absolute inset-0 p-[5px]"
        >
          {/* Inner Bezel Trench */}
          <div className="w-full h-full rounded-full bg-[#0a0a0f] p-[8px] flex items-center justify-center relative shadow-inner">
            {/* Tick Marks Ring */}
            <div className="absolute inset-[10px] rounded-full border border-[#1e1e2e] pointer-events-none opacity-60">
              {[...Array(36)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    transform: `rotate(${i * 10}deg) translateY(-50%)`,
                    transformOrigin: '50% 50%',
                    height: i % 3 === 0 ? '8px' : '4px',
                    width: '1.5px',
                    backgroundColor: i * 10 <= (displayScore / 100) * 360 ? tier.color : '#2e2e42',
                  }}
                  className="absolute top-1 left-1/2 -translate-x-1/2 transition-colors duration-300"
                />
              ))}
            </div>

            {/* 3D Cylindrical Core Drum */}
            <motion.div
              style={{
                transform: `translateZ(25px)`,
                boxShadow: `0 10px 25px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.95)`,
              }}
              className="w-[82%] h-[82%] rounded-full bg-gradient-to-b from-[#181824] via-[#101018] to-[#0a0a0f] border border-[#2e2e42] relative flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Radial Arc Progress Track */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#161622"
                  strokeWidth="6"
                  strokeDasharray="264"
                  strokeDashoffset="66" // 270 deg arc
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={tier.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (displayScore / 100) * 198}
                  style={{
                    filter: `drop-shadow(0 0 8px ${tier.color})`,
                    transition: shouldReduceMotion ? 'none' : 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </svg>

              {/* 3D Rotating Dial Mechanical Indicator */}
              <div
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: shouldReduceMotion ? 'none' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  style={{
                    backgroundColor: tier.color,
                    boxShadow: `0 0 12px ${tier.color}`,
                  }}
                  className="w-1.5 h-7 rounded-full absolute -top-1"
                />
              </div>

              {/* Central Metallic Score Hub */}
              <div
                style={{ transform: 'translateZ(35px)' }}
                className="flex flex-col items-center justify-center z-10 text-center px-2"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8a8a9e] mb-0.5">
                  BHARAT INDEX
                </span>
                <div className="flex items-baseline justify-center">
                  <span
                    style={{
                      color: '#ffffff',
                      textShadow: `0 0 20px ${tier.color}80, 0 2px 4px rgba(0,0,0,0.8)`,
                    }}
                    className="font-mono font-extrabold text-4xl sm:text-5xl tracking-tight leading-none"
                  >
                    {displayScore}
                  </span>
                  <span className="text-xs font-mono text-[#8a8a9e] ml-1 font-semibold">/100</span>
                </div>
                <div
                  style={{
                    backgroundColor: `${tier.color}15`,
                    borderColor: `${tier.color}40`,
                    color: tier.color,
                  }}
                  className="mt-2 text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase shadow-sm"
                >
                  {tier.status}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Label and Tier Subtext */}
      {showDetails && (
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8a8a9e]">
            {label}
          </span>
          <span className="text-[11px] font-mono text-[#5a5a72] mt-0.5">
            Cryptographically Grounded &bull; {tier.tier}
          </span>
        </div>
      )}
    </div>
  );
}
