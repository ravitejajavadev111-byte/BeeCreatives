import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * MagneticWrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * Elastically pulls the wrapped element toward the user's cursor on hover,
 * then springs back to rest on leave. Designed to compose cleanly with:
 *   • CustomCursor.jsx  — no class or event conflicts; cursor enlarges on the
 *                         inner <button> / <a> as normal via its own listeners.
 *   • Lenis smooth scroll — getBoundingClientRect() is re-called on every
 *                           mousemove so centroid stays accurate while Lenis
 *                           is translating the page via CSS transforms.
 *   • Hero.jsx GSAP timeline — that timeline mutates `.hero-text-element`
 *                              (a grandparent), never this wrapper div, so
 *                              there is zero property-collision risk.
 *
 * Props
 * ─────
 *  strength  {number}  0–1  how far the element pulls (0.35 = subtle & premium)
 *  duration  {number}  GSAP spring duration in seconds              (default 0.6)
 *  ease      {string}  GSAP ease — power3 gives the elastic quality (default)
 *  className {string}  extra Tailwind / CSS classes on the shell div
 */
const MagneticWrapper = ({
  children,
  strength = 0.35,
  duration = 0.6,
  ease = 'power3.out',
  className = '',
}) => {
  const wrapperRef = useRef(null);

  // Store quickTo instances in refs — created once, zero GC overhead per move
  const xTo = useRef(null);
  const yTo = useRef(null);

  // ─── 1. Initialise quickTo tweens ────────────────────────────────────────
  // Scoped to wrapperRef so this context is safely nested inside any parent
  // useGSAP scope (e.g. Hero's sectionRef) without triggering a context conflict.
  useGSAP(() => {
    if (!wrapperRef.current) return;

    // Pin the element at its natural position before any magnetic movement
    gsap.set(wrapperRef.current, { x: 0, y: 0 });

    xTo.current = gsap.quickTo(wrapperRef.current, 'x', { duration, ease });
    yTo.current = gsap.quickTo(wrapperRef.current, 'y', { duration, ease });
  }, { scope: wrapperRef });

  // ─── 2. Per-frame magnetic pull ──────────────────────────────────────────
  // getBoundingClientRect() is intentionally called on every mousemove rather
  // than cached on mouseenter. Lenis drives scroll via CSS transforms, so the
  // element's visual rect drifts continuously during scroll; caching would
  // produce a broken centroid the moment the user scrolls while hovering.
  const handleMouseMove = useCallback((e) => {
    const el = wrapperRef.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const deltaX = (e.clientX - (left + width  / 2)) * strength;
    const deltaY = (e.clientY - (top  + height / 2)) * strength;

    xTo.current?.(deltaX);
    yTo.current?.(deltaY);
  }, [strength]);

// ─── 3. Spring back to natural origin ────────────────────────────────────
  // Uses the same ease so the return arc feels organic — not a jarring snap.
  const handleMouseLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  return (
    <div
      ref={wrapperRef}
      // inline-flex: shell collapses to exact child dimensions → accurate centroid
      // will-change-transform: promotes to its own GPU compositing layer,
      //   eliminating paint on every frame during the animation
      className={`inline-flex will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;