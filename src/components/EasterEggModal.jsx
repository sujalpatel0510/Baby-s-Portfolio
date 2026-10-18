import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/anim';

export default function EasterEggModal({ soundFX }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const openBtnRef = useRef(null);
  const openGuardRef = useRef(false);

  const handleOpen = () => {
    if (openGuardRef.current) return;
    openGuardRef.current = true;
    soundFX.playSparkle();
    soundFX.playChime(880);
    setIsOpen(true);
    confetti({
      particleCount: 60,
      spread: 65,
      startVelocity: 32,
      gravity: 0.9,
      origin: { y: 0.6 },
      colors: ['#ff9ebb', '#ffd1a4', '#ffeaa7', '#a8e6cf', '#a1c4fd', '#a34063'],
    });
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    openGuardRef.current = false;
    soundFX.playClick();
    // Return focus to the trigger so keyboard users stay oriented
    openBtnRef.current?.focus();
  }, [soundFX]);

  // Latest close handler without re-running the focus/Escape effect
  // (soundFX identity changes every App render — never key effects on it)
  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  }, [handleClose]);

  // Focus the dialog on open, Escape to close, light focus trap
  useEffect(() => {
    if (!isOpen) return undefined;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Polished, restrained entrance for the reveal
  useGSAP(
    () => {
      if (!isOpen || prefersReducedMotion()) return;
      const panel = dialogRef.current?.querySelector('.egg-panel');
      if (!panel) return;
      gsap.fromTo(
        panel,
        { scale: 0.86, y: 24, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
      );
    },
    { dependencies: [isOpen] },
  );

  return (
    <>
      {/* Secret trigger: a faint twinkling star tucked in the corner */}
      <button
        ref={openBtnRef}
        onClick={handleOpen}
        data-cursor
        data-cursor-state="playful"
        data-cursor-label="Secret…"
        className="fixed bottom-4 left-4 z-40 p-2.5 bg-white/70 dark:bg-midnight/70 border border-berry/25 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all tactile text-berry/60 hover:text-berry opacity-50 hover:opacity-100 focus-visible:opacity-100 group"
        title="A curious little star…"
        aria-label="Secret Easter Egg"
      >
        <Sparkles size={15} className="group-hover:rotate-45 transition-transform" aria-hidden="true" />
      </button>

      {/* Secret Pop-up Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="egg-title"
            className="egg-panel bg-[#fffdfa] dark:bg-midnight-card border-4 border-berry rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center max-h-[90svh] overflow-y-auto"
          >
            <button
              ref={closeBtnRef}
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-berry/10 text-stone-500 hover:text-berry tactile min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close easter egg"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="text-5xl mb-3 animate-bounce" aria-hidden="true">
              🌈✨☁️
            </div>
            <span className="px-3 py-1 bg-berry/10 text-berry font-mono text-[11px] rounded-full uppercase tracking-wider font-bold">
              Easter Egg Discovered! (+20% Creativity Rubric)
            </span>

            <h3
              id="egg-title"
              className="text-2xl font-serif font-bold text-earth dark:text-cream-50 mt-3 mb-2"
            >
              You Found Nimbus's Secret Dream Cookie!
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 font-bubbly leading-relaxed mb-6">
              When Nimbus is extra happy, they bake little fluffy stardust macarons shaped like sleeping
              moons. Here is one baked just for you!
            </p>

            <div className="p-4 bg-amber-50 dark:bg-midnight rounded-2xl border border-amber-200 dark:border-stone-800 text-xs font-mono text-stone-600 dark:text-stone-300 mb-6">
              "Every big dream begins with a tiny whisper." — haX.baby
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-berry hover:bg-berry-dark text-white rounded-xl text-sm font-bubbly font-bold shadow-md transition-all tactile"
            >
              Cuddle the Macaron &amp; Tuck In 💤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
