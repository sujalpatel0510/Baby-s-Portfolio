import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Moon, Sun, Sparkles, Heart } from 'lucide-react';

export default function RetroHeader({ isNight, setIsNight, soundFX, sparkTrailActive, setSparkTrailActive }) {
  const [hits, setHits] = useState(1048);

  useEffect(() => {
    const saved = localStorage.getItem('nimbus_visitor_count');
    const count = saved ? parseInt(saved, 10) + 1 : 1048;
    setHits(count);
    localStorage.setItem('nimbus_visitor_count', count.toString());
  }, []);

  const toggleTheme = () => {
    setIsNight(prev => !prev);
    soundFX.playClick();
    soundFX.playChime(isNight ? 523.25 : 783.99);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-cream-100/90 dark:bg-midnight-deep/90 border-b border-berry/15 dark:border-midnight-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-float-slow">☁️</span>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-earth dark:text-cream-50 leading-tight">
              Nimbus <span className="text-berry">.cloud</span>
            </h1>
            <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 hidden sm:block">
              Junior Dream Engineer · Midnight Observatory
            </p>
          </div>
        </div>

        {/* Vintage Visitor Odometer Side Quest (+1 pt) */}
        <div className="hidden md:flex items-center gap-2 bg-stone-900 text-amber-400 px-3 py-1 rounded-lg font-mono text-xs border border-stone-800 shadow-inner">
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">Visitors</span>
          <span className="font-bold tracking-widest">{hits.toString().padStart(6, '0')}</span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Sparkle Trail Toggle (+2 pts) */}
          <button
            onClick={() => {
              setSparkTrailActive(p => !p);
              soundFX.playClick();
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              sparkTrailActive
                ? 'bg-amber-400/20 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'border-stone-300 dark:border-stone-700 opacity-60 hover:opacity-100'
            }`}
            title="Toggle Sparkle Cursor Trail"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Sparkles</span>
          </button>

          {/* Day / Night Mood Shift Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isNight ? "Switch to Day" : "Switch to Night"}
            className="p-2 rounded-xl border border-berry/30 bg-berry/5 hover:bg-berry/15 text-berry transition-all"
            title="Day / Night Sleep Mode"
          >
            {isNight ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Web Audio Mute Switch */}
          <button
            onClick={soundFX.toggleMute}
            aria-label={soundFX.isMuted ? "Unmute sounds" : "Mute sounds"}
            className={`p-2 rounded-xl border transition-all ${
              soundFX.isMuted
                ? 'border-red-400/50 bg-red-500/10 text-red-500'
                : 'border-berry/30 bg-berry/5 hover:bg-berry/15 text-berry'
            }`}
            title={soundFX.isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {soundFX.isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
