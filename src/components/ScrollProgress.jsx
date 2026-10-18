import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/anim';

/** Thin dreamy scroll-progress ribbon pinned to the very top of the viewport. */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        transformOrigin: '0% 50%',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
        },
      },
    );
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[75] pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-full scale-x-0"
        style={{
          background: 'linear-gradient(90deg, #a34063, #d46a8c, #ffeaa7, #a8e6cf, #a1c4fd)',
        }}
      />
    </div>
  );
}
