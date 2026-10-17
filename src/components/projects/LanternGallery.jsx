import React, { useState } from 'react';
import { Lamp, Sun, Moon, Sparkles, Check } from 'lucide-react';

export default function LanternGallery({ soundFX }) {
  const [selectedAura, setSelectedAura] = useState('starlight');

  const lanterns = [
    {
      id: 'starlight',
      name: 'Starlight Dream-Gleam',
      color: '#ffeaa7',
      glowClass: 'shadow-[0_0_35px_rgba(255,234,167,0.7)]',
      bgGrad: 'from-amber-100 to-amber-200 dark:from-amber-950/60 dark:to-amber-900/40',
      desc: 'Woven with gentle golden constellations for babies scared of dark corners.',
    },
    {
      id: 'aurora',
      name: 'Aurora Slumber-Mist',
      color: '#a8e6cf',
      glowClass: 'shadow-[0_0_35px_rgba(168,230,207,0.7)]',
      bgGrad: 'from-emerald-100 to-teal-200 dark:from-emerald-950/60 dark:to-teal-900/40',
      desc: 'Infused with pastel northern lights to bring peaceful deep REM sleep.',
    },
    {
      id: 'lavender',
      name: 'Lavender Dusk-Bloom',
      color: '#c2b6f7',
      glowClass: 'shadow-[0_0_35px_rgba(194,182,247,0.7)]',
      bgGrad: 'from-purple-100 to-indigo-200 dark:from-purple-950/60 dark:to-indigo-900/40',
      desc: 'Scented with dream lavender clouds to slow down racing little minds.',
    },
    {
      id: 'cotton',
      name: 'Cotton Candy Sunset',
      color: '#ff9ebb',
      glowClass: 'shadow-[0_0_35px_rgba(255,158,187,0.7)]',
      bgGrad: 'from-rose-100 to-pink-200 dark:from-rose-950/60 dark:to-pink-900/40',
      desc: 'Warm sunset hues that cradle newborn dreams like a cozy blanket.',
    },
  ];

  const currentLantern = lanterns.find(l => l.id === selectedAura) || lanterns[0];

  const handleSelect = (id) => {
    setSelectedAura(id);
    soundFX.playClick();
    soundFX.playSparkle();
  };

  return (
    <div className="bg-white/90 dark:bg-midnight-card/90 border-2 border-berry/20 dark:border-midnight-border rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:border-berry/40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Lamp size={14} /> Project 02 · Inventions
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Interactive Lighting</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-earth dark:text-cream-50 mb-2">
          Bioluminescent Nightlights
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
          Nimbus crafts portable glass cloud jars that trap friendly ambient twilight. Click below to inspect each lantern's bedtime mood aura!
        </p>

        {/* Selected Lantern Display Stage */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentLantern.bgGrad} border border-black/5 dark:border-white/5 mb-6 text-center transition-all duration-500`}>
          <div className="relative inline-block mb-3">
            <div
              className={`w-20 h-24 mx-auto rounded-3xl border-4 border-white/80 dark:border-white/20 transition-all duration-500 flex items-center justify-center ${currentLantern.glowClass}`}
              style={{ backgroundColor: currentLantern.color }}
            >
              <span className="text-3xl animate-bounce">💡</span>
            </div>
          </div>
          <h4 className="font-serif font-bold text-base text-earth dark:text-cream-100">
            {currentLantern.name}
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-xs mx-auto">
            {currentLantern.desc}
          </p>
        </div>

        {/* Lantern Selector Tabs */}
        <div className="grid grid-cols-2 gap-2">
          {lanterns.map((l) => (
            <button
              key={l.id}
              onClick={() => handleSelect(l.id)}
              className={`p-2.5 rounded-xl text-xs font-bubbly font-medium flex items-center justify-between border transition-all ${
                selectedAura === l.id
                  ? 'border-berry bg-berry/10 dark:bg-berry/20 text-berry font-bold shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-berry/40 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: l.color }}
                />
                <span className="truncate">{l.name.split(' ')[0]}</span>
              </div>
              {selectedAura === l.id && <Check size={14} className="text-berry shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
