import React, { useEffect, useRef } from 'react';

export default function SparkleTrail({ active = true }) {
  const canvasRef = useRef(null);

  const disabled =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!active) return;
    // No trail on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX_PARTICLES = 160;
    let animationFrame;
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const colors = ['#ff9ebb', '#ffd1a4', '#ffeaa7', '#a8e6cf', '#a1c4fd', '#c2b6f7', '#a34063'];

    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastSpawn < 40) return;
      lastSpawn = now;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          size: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02,
          speedY: Math.random() * 0.5 + 0.3,
          rotation: Math.random() * Math.PI,
        });
      }
      // Hard cap: never grow unbounded
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        p.y += p.speedY;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Draw 4-point star sparkle
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }
      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [active]);

  if (!active || disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity"
      aria-hidden="true"
    />
  );
}
