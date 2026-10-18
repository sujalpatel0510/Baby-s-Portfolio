import React, { useMemo } from 'react';

export default function StarField({ count = 60, seed = 1, className = '', maxSize = 2.4, layer = 'stars' }) {
  const stars = useMemo(() => {
    const r = (i, n) => {
      const v = Math.sin((i + 1) * (seed * 12.9898 + n * 78.233 + n * 0.37)) * 43758.5453;
      return v - Math.floor(v);
    };
    return Array.from({ length: count }, (_, i) => ({
      left: `${(r(i, 1) * 100).toFixed(3)}%`,
      top: `${(r(i, 2) * 100).toFixed(3)}%`,
      size: +(maxSize * (0.3 + r(i, 3) * 0.7)).toFixed(2),
      delay: +(r(i, 4) * 5).toFixed(2),
      dur: +(2.4 + r(i, 5) * 3.4).toFixed(2),
      opacity: +(0.25 + r(i, 6) * 0.65).toFixed(2),
      gold: r(i, 7) > 0.76,
    }));
  }, [count, seed, maxSize]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      data-star-layer={layer}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.gold ? 'var(--nimbus-gold)' : '#ffffff',
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: s.gold ? '0 0 6px rgba(232,182,76,0.8)' : '0 0 5px rgba(255,255,255,0.55)',
          }}
        />
      ))}
    </div>
  );
}
