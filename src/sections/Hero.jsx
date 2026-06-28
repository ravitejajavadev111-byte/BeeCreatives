import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';

// Explicit Vite asset resolve compilation hook
import heroBaseImg from '../assets/hero-base.png';

// ─── NEW: Magnetic pull wrapper ───────────────────────────────────────────────
import MagneticWrapper from './MagneticWrapper';
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Text and UI elements stagger up cleanly
    // NOTE: This targets `.hero-text-element` (the flex container div).
    // MagneticWrapper sits *inside* that div and owns a separate DOM node,
    // so this tween has zero property overlap with the magnetic x/y tweens.
    tl.fromTo('.hero-text-element',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15 }
    );

    // Client logos fade in with a subtle blur reveal
    tl.fromTo('.client-logo',
      { opacity: 0, filter: 'grayscale(100%) blur(4px)' },
      { opacity: 1, filter: 'grayscale(100%) blur(0px)', duration: 1, stagger: 0.1 },
      '-=0.6'
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center overflow-hidden font-sans text-white">

      {/* --- BACKGROUND IMAGE (STATIC & FULL BLEED) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBaseImg}
          alt="Digital Dashboard Background"
          className="w-full h-full object-cover"
        />
        {/* Subtle dark gradient overlay so the text remains highly readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"></div>
      </div>

      {/* --- MAIN CONTENT OVERLAY --- */}
      <div className="relative z-10 w-full px-6 lg:px-16 xl:px-24 max-w-7xl">

        <div className="w-full lg:w-2/3 xl:w-1/2">

          {/* Massive Headlines (Reduced Font Size) */}
          <h1 className="hero-text-element text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-6">
            Strategies.<br />
            Creativity.<br />
            <span className="text-blue-400">Results.</span>
          </h1>

          {/* Description Copy */}
          <p className="hero-text-element text-base md:text-lg text-slate-300 max-w-lg mb-10 leading-relaxed">
            I help brands scale through data-driven campaigns, elite web development, social media marketing, and custom WhatsApp automations.
          </p>

          {/* ─── CTA Buttons ────────────────────────────────────────────────────
              The `.hero-text-element` div is the GSAP animation target (y + opacity).
              MagneticWrapper sits one level deeper and only ever touches `x` and `y`
              on its own ref — a completely separate DOM node. Safe to co-exist.

              CustomCursor compatibility:
              Its MutationObserver re-scans for `button` and `a` elements.
              The inner <button> tags are still directly in the DOM so the cursor
              enlarges on them exactly as before — MagneticWrapper's shell div is
              transparent to that listener.
          ─────────────────────────────────────────────────────────────────────── */}
          <div className="hero-text-element flex flex-wrap items-center gap-6 mb-16">

            {/* Primary CTA — strength slightly higher for the more prominent button */}
            <MagneticWrapper strength={0.4}>
              <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center gap-2 group shadow-xl shadow-white/10">
                View My Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticWrapper>

            {/* Secondary CTA — gentler pull keeps it feeling subtle */}
            <MagneticWrapper strength={0.3}>
              <button className="flex items-center gap-3 text-slate-200 font-medium hover:text-blue-400 transition-colors group">
                <div className="w-12 h-12 rounded-full border border-slate-500 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                  <Play size={16} className="ml-1" />
                </div>
                See How I Work
              </button>
            </MagneticWrapper>

          </div>

          {/* Trusted By Logos */}
          <div className="hero-text-element mt-12">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-4">
              Trusted By Brands Of All Sizes
            </span>
            <div className="flex flex-wrap items-center gap-6 lg:gap-8 opacity-80">
              <span className="client-logo font-black text-xl tracking-tighter">HubSpot</span>
              <span className="client-logo font-bold text-lg tracking-tight flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-white inline-block"></span> grammarly</span>
              <span className="client-logo font-bold text-xl text-orange-400">swiggy</span>
              <span className="client-logo font-bold text-xl text-teal-400 flex items-center gap-1"><span className="tracking-tighter">OO</span> lenskart</span>
              <span className="client-logo font-black text-lg">TATA 1mg</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}