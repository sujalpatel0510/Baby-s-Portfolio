import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/anim';

/**
 * Short, skippable page-load intro:
 * staggered typography + gentle character entrance.
 * Skipped entirely under prefers-reduced-motion; click anywhere to skip.
 */
export default function IntroOverlay({ onDone }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone?.();
    };

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 0 });
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.from(el.querySelectorAll('.intro-word'), {
      y: 26,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
    })
      .from(
        el.querySelector('.intro-cloud'),
        { scale: 0.4, opacity: 0, rotation: -14, duration: 0.85, ease: 'back.out(1.7)' },
        0.15,
      )
      .from(el.querySelector('.intro-hint'), { opacity: 0, duration: 0.4 }, 0.7)
      .to({}, { duration: 0.9 }) // gentle stillness
      .to(el, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' });

    const skip = () => {
      tl.kill();
      gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: 'power1.out', onComplete: finish });
    };
    el.addEventListener('click', skip);
    return () => el.removeEventListener('click', skip);
  }, []);

  return (
    <div ref={ref} className="intro-overlay" role="presentation">
      <div className="text-center px-6">
        <div className="intro-cloud text-6xl md:text-7xl mb-4 select-none" aria-hidden="true">
          ☁️
        </div>
        <p className="font-serif text-3xl md:text-4xl font-bold text-earth dark:text-cream-50 tracking-tight">
          <span className="intro-word inline-block">Nimbus</span>{' '}
          <span className="intro-word inline-block text-berry italic">.cloud</span>
        </p>
        <p className="font-bubbly text-sm text-stone-500 dark:text-stone-400 mt-2">
          <span className="intro-word inline-block">waking</span>{' '}
          <span className="intro-word inline-block">up</span>{' '}
          <span className="intro-word inline-block">the</span>{' '}
          <span className="intro-word inline-block">dreams…</span>
        </p>
        <p className="intro-hint font-mono text-[10px] text-stone-400 dark:text-stone-500 mt-8">
          (click anywhere to skip)
        </p>
      </div>
    </div>
  );
}
