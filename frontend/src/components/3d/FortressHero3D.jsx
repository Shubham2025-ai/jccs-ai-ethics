import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * 3D Fortress Hero Scene
 * Landing page hero background: a slowly rotating abstract digital fortress mesh
 * in deep charcoal #0a0a0f with saffron #ff9933 and teal #00d4aa edge accent lighting.
 * Interactive camera tilt on mouse move with 60fps lightweight Canvas rendering.
 */
export default function FortressHero3D({ className = '' }) {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animFrameId = useRef(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (shouldReduceMotion) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate 3D Fortress Vertices (Concentric defensive polygonal battlements)
    const layers = 5;
    const verticesPerLayer = 8; // Octagonal sovereign fortress towers
    const vertices = [];
    const edges = [];

    for (let l = 0; l < layers; l++) {
      const radius = 120 + l * 45;
      const height = (l - 2) * 50;
      const layerOffset = vertices.length;

      for (let v = 0; v < verticesPerLayer; v++) {
        const theta = (v / verticesPerLayer) * Math.PI * 2 + (l % 2 ? Math.PI / 8 : 0);
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const y = height + (v % 2 === 0 ? 15 : -15);
        vertices.push({ x, y, z, layer: l });

        // Edge around polygon perimeter
        const nextV = (v + 1) % verticesPerLayer;
        edges.push([layerOffset + v, layerOffset + nextV, l]);

        // Vertical defensive pillars connecting layers
        if (l > 0) {
          const prevLayerOffset = layerOffset - verticesPerLayer;
          edges.push([layerOffset + v, prevLayerOffset + v, l]);
        }
      }
    }

    let angleY = 0;
    let angleX = 0.4;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth auto-rotation + mouse parallax shift
      if (!shouldReduceMotion) {
        angleY += 0.003;
      }
      const targetAngleX = 0.35 + mousePos.y * -0.15;
      const targetAngleY = angleY + mousePos.x * 0.25;

      const cosY = Math.cos(targetAngleY);
      const sinY = Math.sin(targetAngleY);
      const cosX = Math.cos(targetAngleX);
      const sinX = Math.sin(targetAngleX);

      const cx = width / 2;
      const cy = height / 2 + 20;
      const fov = 500;

      // Project vertices to 2D
      const projected = vertices.map(v => {
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        const y1 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 400);
        return {
          px: cx + x1 * scale,
          py: cy + y1 * scale,
          scale,
          depth: z2,
          layer: v.layer
        };
      });

      // Draw Fortress Floor Grid
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 400;
      const gridSteps = 12;
      for (let g = -gridSteps; g <= gridSteps; g += 2) {
        const gx1 = (g / gridSteps) * gridSize;
        const gz1 = -gridSize;
        const gx2 = (g / gridSteps) * gridSize;
        const gz2 = gridSize;

        const x1 = gx1 * cosY + gz1 * sinY;
        const z1 = -gx1 * sinY + gz1 * cosY;
        const y1 = 120 * cosX - z1 * sinX;
        const p1x = cx + x1 * (fov / (fov + z1 * cosX + 400));
        const p1y = cy + y1 * (fov / (fov + z1 * cosX + 400));

        const x2 = gx2 * cosY + gz2 * sinY;
        const z2 = -gx2 * sinY + gz2 * cosY;
        const y2 = 120 * cosX - z2 * sinX;
        const p2x = cx + x2 * (fov / (fov + z2 * cosX + 400));
        const p2y = cy + y2 * (fov / (fov + z2 * cosX + 400));

        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // Draw Edges (Fortress Wireframe Mesh)
      edges.forEach(([i, j, layer]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const isOuter = layer === layers - 1;
        const isCore = layer === 0;

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);

        if (isCore) {
          ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)'; // Saffron core
          ctx.lineWidth = 1.5;
        } else if (isOuter) {
          ctx.strokeStyle = 'rgba(0, 212, 170, 0.35)'; // Teal outer battlements
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = 'rgba(255, 153, 51, 0.15)'; // Charcoal-gold transition
          ctx.lineWidth = 0.8;
        }

        ctx.stroke();
      });

      // Draw Vertex Sentinel Nodes
      projected.forEach(p => {
        const nodeSize = (p.layer === 0 ? 3 : 2) * p.scale;
        ctx.fillStyle = p.layer === 0 ? '#ff9933' : '#00d4aa';
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(1, nodeSize), 0, Math.PI * 2);
        ctx.fill();
      });

      if (!shouldReduceMotion) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [mousePos, shouldReduceMotion]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ff9933]/5 via-[#00d4aa]/5 to-transparent blur-3xl pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
    </div>
  );
}
