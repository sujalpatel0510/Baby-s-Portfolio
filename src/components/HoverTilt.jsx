import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/anim';

/**
 * Adds a gentle 3D hover tilt to its child (project cards, interactive toys).
 * Pure transform, GSAP quickTo, cleaned up on unmount.
 * Keyboard/touch: no-op (cards remain fully usable via tap/click).
 */
export default function HoverTilt({ children, label, tilt = 7, className = '' }) {
  const tiltRef = useRef(null);

  useGSAP(() => {
    const el = tiltRef.current;
    if (!el || prefersReducedMotion()) return;

    const rotateX = gsap.quickTo(el, 'rotateX', { duration: 0.55, ease: 'power2.out' });
    const rotateY = gsap.quickTo(el, 'rotateY', { duration: 0.55, ease: 'power2.out' });

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * tilt * 2);
      rotateX(-py * tilt * 2);
    };

    const handleLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div style={{ perspective: '1100px' }} className={className}>
      <div
        ref={tiltRef}
        data-cursor
        data-cursor-state="playful"
        data-cursor-label={label}
        className="h-full will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
