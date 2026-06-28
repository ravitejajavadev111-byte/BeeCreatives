import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Hexagon } from "lucide-react";

gsap.registerPlugin(useGSAP);

const PILLARS = [
  {
    id: '01',
    title: 'Results-Driven',
    desc: 'Measurable outcomes above all else. We exist to generate quality leads, increase conversions, and drive sustainable growth.',
    color: '#2563EB' // Electric Blue
  },
  {
    id: '02',
    title: 'Creativity',
    desc: 'We engineer digital experiences that look jaw-dropping and convert flawlessly. Creativity with absolute purpose.',
    color: '#E11D48' // Hot Pink/Rose
  },
  {
    id: '03',
    title: 'Transparency',
    desc: 'Total visibility into every step, strategy, and metric. No smoke and mirrors, just pure data and execution.',
    color: '#D97706' // Vibrant Amber
  },
  {
    id: '04',
    title: 'Partnerships',
    desc: 'We do not work for you; we work as an extension of your core team. A fully symbiotic digital hive.',
    color: '#7C3AED' // Vivid Violet
  }
];

export default function About() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const cursorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useGSAP(() => {
    // 1. Initial Entrance Animation
    const tl = gsap.timeline();
    tl.fromTo(".fade-up",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
    );

    // 2. Custom Fluid Cursor Setup
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.6, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, { scope: containerRef });

  // 3. Handle Vibrant Background Shift on Hover
  useEffect(() => {
    if (activeIndex !== null) {
      // Shift to vibrant color
      gsap.to(bgRef.current, {
        backgroundColor: PILLARS[activeIndex].color,
        duration: 0.6,
        ease: "power2.out"
      });
      // Expand cursor
      gsap.to(cursorRef.current, { scale: 1.5, opacity: 0, duration: 0.3 });
    } else {
      // Return to pristine off-white
      gsap.to(bgRef.current, {
        backgroundColor: "#F4F4F6",
        duration: 0.6,
        ease: "power2.out"
      });
      // Shrink cursor
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
    }
  }, [activeIndex]);

  const isVibrant = activeIndex !== null;

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full h-[100dvh] overflow-hidden font-sans cursor-none flex items-center"
    >
      {/* Dynamic Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 bg-[#F4F4F6] will-change-[background-color]"></div>

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Custom Fluid Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-zinc-900 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      ></div>

      <div className="relative z-10 w-full max-w-[100rem] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* LEFT COLUMN: The Manifesto */}
        <div className={`transition-colors duration-500 ${isVibrant ? "text-white" : "text-zinc-900"}`}>
          <div className="fade-up flex items-center gap-3 mb-8">
            <Hexagon size={16} className={`${isVibrant ? "text-white" : "text-zinc-900"} animate-[spin_10s_linear_infinite]`} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">
              5 Founders • 1 Hive
            </span>
          </div>

          <h1 className="fade-up text-6xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] mb-8 text-balance">
            WE<br/>
            ENGINEER<br/>
            DOMINANCE.
          </h1>

          <div className="fade-up flex flex-col gap-6 max-w-lg">
            <p className={`text-lg md:text-xl font-medium leading-relaxed ${isVibrant ? "text-white/90" : "text-zinc-600"}`}>
              Bee Creative isn't just an agency. Like a hive working with absolute precision, we combine pure creativity with ruthless strategy.
            </p>
            <p className={`text-sm md:text-base font-medium leading-relaxed ${isVibrant ? "text-white/70" : "text-zinc-500"}`}>
              We don't believe in one-size-fits-all. We build tailored acquisition ecosystems designed to scale your brand and dominate your market.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Accordion */}
        <div className="fade-up flex flex-col h-full justify-center">
          <div className={`w-full h-[1px] mb-8 transition-colors duration-500 ${isVibrant ? "bg-white/20" : "bg-zinc-300"}`}></div>

          <ul className="flex flex-col w-full group/list">
            {PILLARS.map((pillar, idx) => (
              <li
                key={pillar.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`relative border-b py-6 md:py-8 cursor-none transition-colors duration-500 group/item ${
                  isVibrant
                    ? "border-white/20 text-white"
                    : "border-zinc-300 text-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className={`text-sm font-mono opacity-50 transition-opacity duration-300 group-hover/item:opacity-100`}>
                      {pillar.id}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight transform origin-left transition-transform duration-500 group-hover/item:translate-x-4">
                      {pillar.title}
                    </h3>
                  </div>

                  <ArrowRight
                    size={32}
                    className={`transform -translate-x-4 opacity-0 transition-all duration-500 group-hover/item:translate-x-0 group-hover/item:opacity-100 ${
                      isVibrant ? "text-white" : "text-zinc-900"
                    }`}
                  />
                </div>

                {/* Expanding Description (Accordion effect handled via max-height) */}
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                    activeIndex === idx ? "grid-rows-[1fr] mt-6 opacity-100" : "grid-rows-[0fr] mt-0 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden pl-14 md:pl-20 pr-12">
                    <p className={`text-lg md:text-xl font-medium leading-relaxed ${
                      isVibrant ? "text-white/90" : "text-zinc-600"
                    }`}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}