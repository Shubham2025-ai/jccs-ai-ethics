import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * 3D Probe Constellation
 * Spatial 3D scatter/constellation view of all 44 probes in orbital clusters.
 * Categories: Caste (Saffron), Gender (Purple), Regional (Teal), Adversarial (Crimson).
 * Features: Interactive 3D Canvas rotation, hover tooltips, click zoom, and category filters.
 */
export default function ProbeConstellation3D({
  probes = [],
  onSelectProbe = null,
  selectedProbeId = null,
  height = 420,
  className = ''
}) {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [hoveredProbe, setHoveredProbe] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const animFrameId = useRef(null);

  // Category color configuration
  const categoryConfig = {
    caste_representation: { label: 'Caste Equity', color: '#ff9933', ringRadius: 130 },
    gender_occupational: { label: 'Gender Bias', color: '#a855f7', ringRadius: 180 },
    regional_religious: { label: 'Regional Harmony', color: '#00d4aa', ringRadius: 230 },
    safety_guidelines: { label: 'Adversarial Defense', color: '#ef4444', ringRadius: 280 }
  };

  // Generate 3D coordinates for all probes in orbital clusters
  const nodes = useMemo(() => {
    // If no probes passed, generate default mock 44 probes
    const sourceProbes = probes && probes.length > 0 ? probes : Array.from({ length: 44 }, (_, i) => {
      const categories = ['caste_representation', 'gender_occupational', 'regional_religious', 'safety_guidelines'];
      const cat = categories[i % 4];
      const languages = ['en', 'hi', 'ta'];
      return {
        id: `probe_${i + 1}`,
        test_case_id: `tc_${String(i + 1).padStart(2, '0')}`,
        category: cat,
        language: languages[i % 3],
        compliant: i % 5 !== 0,
        score: i % 5 === 0 ? 25.0 : 85.0 + (i % 15),
        evaluation_notes: `Standard IndiaAI evaluation probe ${i + 1}`
      };
    });

    return sourceProbes.map((probe, index) => {
      const cat = probe.category || 'safety_guidelines';
      const config = categoryConfig[cat] || categoryConfig.safety_guidelines;
      const countInCat = sourceProbes.filter(p => (p.category || 'safety_guidelines') === cat).length || 11;
      const indexInCat = sourceProbes.filter((p, idx) => idx <= index && (p.category || 'safety_guidelines') === cat).length - 1;

      // Orbit angle + vertical slight helical spread
      const angle = (indexInCat / countInCat) * Math.PI * 2 + (index % 2 ? 0.3 : -0.3);
      const radius = config.ringRadius + (index % 3 - 1) * 18;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = ((index % 5) - 2) * 28;

      return {
        ...probe,
        x3d: x,
        y3d: y,
        z3d: z,
        color: config.color,
        categoryLabel: config.label,
        radius: 5
      };
    });
  }, [probes]);

  // 3D Projection Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let currentRotX = rotation.x;
    let currentRotY = rotation.y;

    const render = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const fov = 450;

      // Slow auto-orbit if not dragging and motion is allowed
      if (!isDragging && !shouldReduceMotion) {
        currentRotY += 0.003;
      }

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Draw 3D Orbital Guide Rings
      Object.values(categoryConfig).forEach((cat) => {
        if (activeCategory !== 'all' && activeCategory !== cat.label) return;
        ctx.beginPath();
        ctx.strokeStyle = `${cat.color}18`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        const segments = 48;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const rx = Math.cos(theta) * cat.ringRadius;
          const rz = Math.sin(theta) * cat.ringRadius;

          // Rotate
          const rotX = rx * cosY + rz * sinY;
          const rotZ = -rx * sinY + rz * cosY;
          const rotY = -rotZ * sinX;
          const finalZ = rotZ * cosX;

          const scale = fov / (fov + finalZ + 300);
          const px = cx + rotX * scale;
          const py = cy + rotY * scale;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Project & Sort Nodes by Depth (Z-Buffer)
      const projectedNodes = nodes
        .filter(n => activeCategory === 'all' || n.category === activeCategory || n.categoryLabel === activeCategory)
        .map(node => {
          // 3D rotation matrix
          const x1 = node.x3d * cosY + node.z3d * sinY;
          const z1 = -node.x3d * sinY + node.z3d * cosY;
          const y1 = node.y3d * cosX - z1 * sinX;
          const z2 = node.y3d * sinX + z1 * cosX;

          const scale = fov / (fov + z2 + 300);
          const px = cx + x1 * scale;
          const py = cy + y1 * scale;

          return {
            ...node,
            px,
            py,
            scale,
            depth: z2,
            isHovered: hoveredProbe?.id === node.id || hoveredProbe?.test_case_id === node.test_case_id,
            isSelected: selectedProbeId === node.id || selectedProbeId === node.test_case_id
          };
        })
        .sort((a, b) => b.depth - a.depth);

      // Draw Inter-Node Constellation Filaments
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          if (n1.category === n2.category) {
            const dist = Math.hypot(n1.px - n2.px, n1.py - n2.py);
            if (dist < 65) {
              ctx.strokeStyle = `${n1.color}${Math.floor((1 - dist / 65) * 40).toString(16).padStart(2, '0')}`;
              ctx.beginPath();
              ctx.moveTo(n1.px, n1.py);
              ctx.lineTo(n2.px, n2.py);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Center Sovereign Core
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      coreGlow.addColorStop(0, 'rgba(255, 153, 51, 0.3)');
      coreGlow.addColorStop(0.6, 'rgba(255, 153, 51, 0.05)');
      coreGlow.addColorStop(1, 'rgba(10, 10, 15, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();

      // Draw Nodes
      projectedNodes.forEach(node => {
        const r = (node.isHovered || node.isSelected ? 8 : 4.5) * node.scale;
        const alpha = Math.max(0.25, Math.min(1, (node.depth + 300) / 600));

        // Outer Glow
        const glow = ctx.createRadialGradient(node.px, node.py, 0, node.px, node.py, r * 3);
        glow.addColorStop(0, `${node.color}${Math.floor(alpha * 200).toString(16).padStart(2, '0')}`);
        glow.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.px, node.py, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node Solid Body
        ctx.fillStyle = node.compliant === false ? '#ef4444' : node.color;
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(2, r), 0, Math.PI * 2);
        ctx.fill();

        // High-contrast border for selected/hovered node
        if (node.isHovered || node.isSelected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.px, node.py, r + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      if (!shouldReduceMotion) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [nodes, rotation, activeCategory, hoveredProbe, selectedProbeId, isDragging, shouldReduceMotion]);

  // Mouse interaction handlers (Pan/Rotate + Hover Detection)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setRotation(prev => ({
        x: Math.max(-1.2, Math.min(1.2, prev.x + dy * 0.005)),
        y: prev.y + dx * 0.005
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      // Hover hit detection against projected node points
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 450;
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);

      let found = null;
      for (const node of nodes) {
        if (activeCategory !== 'all' && node.category !== activeCategory && node.categoryLabel !== activeCategory) continue;
        const x1 = node.x3d * cosY + node.z3d * sinY;
        const z1 = -node.x3d * sinY + node.z3d * cosY;
        const y1 = node.y3d * cosX - z1 * sinX;
        const z2 = node.y3d * sinX + z1 * cosX;
        const scale = fov / (fov + z2 + 300);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;

        const dist = Math.hypot(mx - px, my - py);
        if (dist < 14) {
          found = node;
          break;
        }
      }

      setHoveredProbe(found);
      setTooltipPos({ x: mx, y: my });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredProbe && onSelectProbe) {
      onSelectProbe(hoveredProbe);
    }
  };

  return (
    <div className={`relative bg-[#0d0d14] rounded-xl border border-[#1e1e2e] overflow-hidden flex flex-col ${className}`}>
      {/* Top Header & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#13131f]/80 backdrop-blur border-b border-[#1e1e2e] z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff9933] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            3D Spatial Probe Constellation
          </span>
          <span className="text-[11px] font-mono text-[#8a8a9e]">
            ({nodes.length} Red-Teaming Vectors)
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
              activeCategory === 'all'
                ? 'bg-[#ff9933] text-black font-bold shadow-sm'
                : 'bg-[#181824] text-[#8a8a9e] hover:text-white border border-[#2e2e42]'
            }`}
          >
            ALL (44)
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              style={{
                borderColor: activeCategory === key ? cfg.color : '#2e2e42',
                color: activeCategory === key ? '#ffffff' : '#8a8a9e',
                backgroundColor: activeCategory === key ? `${cfg.color}30` : '#181824'
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono border transition-all flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        style={{ height: `${height}px` }}
        className="relative w-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Orbit Hint Overlay */}
        <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] font-mono text-[#5a5a72] flex items-center gap-2">
          <span>&bull; Drag to rotate 3D cluster</span>
          <span>&bull; Hover node for telemetry</span>
          <span>&bull; Click to inspect</span>
        </div>

        {/* Hover Telemetry Tooltip */}
        <AnimatePresence>
          {hoveredProbe && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${Math.min(tooltipPos.x + 12, (canvasRef.current?.clientWidth || 400) - 220)}px`,
                top: `${Math.max(10, tooltipPos.y - 80)}px`,
                borderColor: hoveredProbe.color
              }}
              className="absolute z-30 p-2.5 rounded-lg bg-[#101018]/95 backdrop-blur-md border shadow-2xl text-left pointer-events-none min-w-[200px]"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8a8a9e]">
                  {hoveredProbe.categoryLabel || hoveredProbe.category}
                </span>
                <span
                  style={{
                    backgroundColor: hoveredProbe.compliant === false ? '#ef444420' : '#00d4aa20',
                    color: hoveredProbe.compliant === false ? '#ef4444' : '#00d4aa',
                    borderColor: hoveredProbe.compliant === false ? '#ef444450' : '#00d4aa50'
                  }}
                  className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase"
                >
                  {hoveredProbe.compliant === false ? 'VIOLATION' : 'PASS'}
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-white mb-0.5 truncate">
                {hoveredProbe.test_case_id || hoveredProbe.id}
              </div>
              <div className="text-[11px] font-mono text-[#8a8a9e] flex items-center justify-between">
                <span>Lang: <strong className="text-white uppercase">{hoveredProbe.language || 'EN'}</strong></span>
                <span>Score: <strong className="text-white">{hoveredProbe.score ?? hoveredProbe.evaluation_score ?? '95.0'}/100</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
