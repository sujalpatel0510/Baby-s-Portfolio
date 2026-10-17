import React, { useState, useEffect, useRef } from 'react';

export default function NimbusAvatar({ onPoke, isRaining, isNight }) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isWinking, setIsWinking] = useState(false);
  const [isBlushing, setIsBlushing] = useState(false);
  const cloudRef = useRef(null);

  // Eye-tracking mechanics
  useEffect(() => {
    const handleMove = (e) => {
      if (!cloudRef.current) return;
      const rect = cloudRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(6, Math.hypot(deltaX, deltaY) / 35);

      setPupilOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleClick = (e) => {
    setIsWinking(true);
    setIsBlushing(true);
    setTimeout(() => setIsWinking(false), 900);
    setTimeout(() => setIsBlushing(false), 2000);
    if (onPoke) onPoke(e);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Floating Sparkle / Star Orbiters */}
      <div className="absolute -top-6 -left-6 text-2xl animate-float-slow">✨</div>
      <div className="absolute top-2 -right-8 text-2xl animate-float-reverse">⭐</div>
      <div className="absolute -bottom-4 right-2 text-xl animate-bounce">🌙</div>

      {/* Main Interactive Cloud Body */}
      <div
        ref={cloudRef}
        onClick={handleClick}
        className={`cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 relative w-72 h-48 md:w-80 md:h-52 filter drop-shadow-2xl ${
          isNight ? 'brightness-95' : ''
        }`}
        title="Poke Nimbus to make rainbow rain!"
      >
        {/* Cloud Puff SVGs with Soft Marshmallow Glow */}
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isNight ? '#e2ecff' : '#ffffff'} />
              <stop offset="60%" stopColor={isNight ? '#cbd9f8' : '#f0f4ff'} />
              <stop offset="100%" stopColor={isNight ? '#98b3f1' : '#dbe8ff'} />
            </linearGradient>
            <filter id="cozyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={isNight ? "#607db8" : "#d0e0ff"} floodOpacity="0.6"/>
            </filter>
          </defs>

          {/* Cloud Bumps */}
          <g filter="url(#cozyGlow)">
            {/* Base fluff */}
            <circle cx="100" cy="120" r="55" fill="url(#cloudGrad)" />
            <circle cx="160" cy="125" r="58" fill="url(#cloudGrad)" />
            <circle cx="220" cy="120" r="55" fill="url(#cloudGrad)" />
            {/* Top crown fluff */}
            <circle cx="120" cy="85" r="50" fill="url(#cloudGrad)" />
            <circle cx="190" cy="80" r="54" fill="url(#cloudGrad)" />
            {/* Extra cheek fluff */}
            <circle cx="70" cy="130" r="38" fill="url(#cloudGrad)" />
            <circle cx="250" cy="130" r="38" fill="url(#cloudGrad)" />
          </g>

          {/* Little Nightcap Hat */}
          <g transform="translate(195, 25) rotate(18)">
            <path d="M 0,40 Q 25,-10 70,5 Q 40,40 0,40 Z" fill="#a34063" />
            {/* Star pattern on cap */}
            <circle cx="25" cy="22" r="3" fill="#ffeaa7" />
            <circle cx="45" cy="18" r="2.5" fill="#ffeaa7" />
            {/* Pom-pom puff */}
            <circle cx="72" cy="6" r="10" fill="#fffdfa" />
            {/* Hat brim cuff */}
            <rect x="-4" y="36" width="38" height="10" rx="5" fill="#f8edf1" />
          </g>

          {/* Cheeks - Rosy Blush */}
          <ellipse
            cx="100"
            cy="132"
            rx="12"
            ry="7"
            fill="#ff8aa8"
            opacity={isBlushing ? 0.9 : 0.4}
            className="transition-opacity duration-300"
          />
          <ellipse
            cx="220"
            cy="132"
            rx="12"
            ry="7"
            fill="#ff8aa8"
            opacity={isBlushing ? 0.9 : 0.4}
            className="transition-opacity duration-300"
          />

          {/* Eyes with interactive tracking */}
          {/* Left Eye */}
          <g transform="translate(118, 110)">
            <circle cx="0" cy="0" r="10" fill="#2a1e24" />
            <circle
              cx={pupilOffset.x}
              cy={pupilOffset.y}
              r="4.5"
              fill="#ffeaa7"
              className="transition-transform duration-75"
            />
            {/* Catchlight */}
            <circle cx={pupilOffset.x + 2} cy={pupilOffset.y - 2} r="1.5" fill="#ffffff" />
          </g>

          {/* Right Eye (winks when clicked!) */}
          {isWinking ? (
            <path
              d="M 190,113 Q 202,105 214,113"
              stroke="#2a1e24"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <g transform="translate(202, 110)">
              <circle cx="0" cy="0" r="10" fill="#2a1e24" />
              <circle
                cx={pupilOffset.x}
                cy={pupilOffset.y}
                r="4.5"
                fill="#ffeaa7"
                className="transition-transform duration-75"
              />
              {/* Catchlight */}
              <circle cx={pupilOffset.x + 2} cy={pupilOffset.y - 2} r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Cute Little Smile */}
          <path
            d="M 152,130 Q 160,138 168,130"
            stroke="#5c4033"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Raindrop particles dripping from Nimbus */}
        <div className="absolute inset-x-8 bottom-0 h-10 pointer-events-none flex justify-around">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-4 rounded-full transition-all duration-700 ${
                isRaining ? 'opacity-100 translate-y-8 animate-bounce' : 'opacity-25 translate-y-1'
              }`}
              style={{
                backgroundColor: ['#ff9ebb', '#ffd1a4', '#ffeaa7', '#a8e6cf', '#a1c4fd'][i - 1],
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Touch-Friendly Badge */}
      <span className="mt-3 px-3 py-1 bg-berry/10 dark:bg-berry/20 text-berry border border-berry/20 rounded-full text-xs font-mono tracking-wide flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Tap Nimbus to Sprinkle Dream Rain!
      </span>
    </div>
  );
}
