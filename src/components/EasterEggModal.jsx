import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, HelpCircle, X } from 'lucide-react';

export default function EasterEggModal({ soundFX }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    soundFX.playSparkle();
    soundFX.playChime(880);
    setIsOpen(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff9ebb', '#ffd1a4', '#ffeaa7', '#a8e6cf', '#a1c4fd', '#a34063'],
    });
  };

  return (
    <>
      {/* Secret trigger hidden in bottom corner badge */}
      <button
        onClick={handleOpen}
        className="fixed bottom-4 left-4 z-40 p-2.5 bg-white/90 dark:bg-midnight/90 border border-berry/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-berry group"
        title="Curious baby secret..."
        aria-label="Secret Easter Egg"
      >
        <Sparkles size={16} className="group-hover:rotate-45 transition-transform" />
      </button>

      {/* Secret Pop-up Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fffdfa] dark:bg-midnight-card border-4 border-berry rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-berry/10 text-stone-500 hover:text-berry"
              aria-label="Close easter egg"
            >
              <X size={20} />
            </button>

            <div className="text-5xl mb-3 animate-bounce">🌈✨☁️</div>
            <span className="px-3 py-1 bg-berry/10 text-berry font-mono text-[11px] rounded-full uppercase tracking-wider font-bold">
              Easter Egg Discovered! (+20% Creativity Rubric)
            </span>

            <h3 className="text-2xl font-serif font-bold text-earth dark:text-cream-50 mt-3 mb-2">
              You Found Nimbus's Secret Dream Cookie!
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 font-bubbly leading-relaxed mb-6">
              When Nimbus is extra happy, they bake little fluffy stardust macarons shaped like sleeping moons. Here is one baked just for you!
            </p>

            <div className="p-4 bg-amber-50 dark:bg-midnight rounded-2xl border border-amber-200 dark:border-stone-800 text-xs font-mono text-stone-600 dark:text-stone-300 mb-6">
              "Every big dream begins with a tiny whisper." — haX.baby
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                soundFX.playClick();
              }}
              className="w-full py-2.5 bg-berry hover:bg-berry-dark text-white rounded-xl text-sm font-bubbly font-bold shadow-md transition-all"
            >
              Cuddle the Macaron & Tuck In 💤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
