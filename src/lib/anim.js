import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire resize on toolbar show/hide — refreshing there
// would flicker reveal animations mid-scroll, so ignore those resizes.
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

/** Shared reveal defaults: gentle rise + fade, transform/opacity only. */
export const revealDefaults = {
  y: 40,
  opacity: 0,
  duration: 0.75,
  ease: 'power2.out',
  stagger: 0.09,
};

export { gsap, ScrollTrigger };
