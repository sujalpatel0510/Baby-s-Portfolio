import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion, revealDefaults } from '../lib/anim';

/**
 * Reveals every [data-reveal] descendant of `ref` when it scrolls into view.
 * Staggered rise+fade, transform/opacity only, cleaned up on unmount via useGSAP.
 */
export function useScrollReveal(ref, deps = []) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;
      const targets = el.querySelectorAll('[data-reveal]');
      if (!targets.length) return;
      gsap.from(targets, {
        ...revealDefaults,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: ref, dependencies: deps },
  );
}
