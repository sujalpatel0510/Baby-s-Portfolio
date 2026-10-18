import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion, revealDefaults } from '../lib/anim';

/**
 * Reveals every [data-reveal] descendant of `ref` when it scrolls into view.
 * Staggered rise+fade, transform/opacity only, cleaned up on unmount via useGSAP.
 *
 * Uses ScrollTrigger.batch so each element gets its OWN trigger (self-positioned).
 * A single gsap.from([...], { stagger, toggleActions: 'play none none none' })
 * starts all targets when the scope's top crosses the threshold and strands any
 * segment still mid-flight when scrolling pauses — freezing it at opacity 0.
 * batch gives per-element triggers (so no element is another's passenger) and
 * independent toggleActions that complete even on a fast scroll past.
 */
export function useScrollReveal(ref, deps = []) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;
      const targets = el.querySelectorAll('[data-reveal]');
      if (!targets.length) return;

      const triggers = ScrollTrigger.batch(targets, {
        start: 'top 80%',
        // from() is created here, at enter-time, so the hidden start state is
        // only applied once the element actually scrolls into view — a
        // strayed/paused scroll can no longer strand it at opacity 0.
        onEnter: (batch) =>
          gsap.from(batch, { ...revealDefaults, stagger: 0.09, overwrite: 'auto' }),
      });

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref, dependencies: deps },
  );
}
