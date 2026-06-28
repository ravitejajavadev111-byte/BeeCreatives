import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

// EXACT IMPORTS AS REQUESTED
import cellbayLogo from '../assets/Our Clients/Cellbay.jpg';
import lifeInfraLogo from '../assets/Our Clients/Life-Infra.png';
import shubhaLogo from '../assets/Our Clients/shubha-fertility.webp';
import bizzBuzzLogo from '../assets/Our Clients/BizzBuzz News.png';
import hansIndiaLogo from '../assets/Our Clients/Hans India.png';
import kapilChitLogo from '../assets/Our Clients/Kapil ChitFund.png';
import lifeRealtyLogo from '../assets/Our Clients/Life-Reality.png';
import orchardsLogo from '../assets/Our Clients/Orchards.png';
import schoolLogo from '../assets/Our Clients/school_logo.svg';
import vernonLogo from '../assets/Our Clients/vernon.png';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TESTIMONIALS_DATA = [
  { id: "01", punchline: "A completely new trajectory.", quote: "Bee Creative didn't just run our ads; they fundamentally restructured our entire acquisition funnel. We saw a 300% increase in high-intent leads.", author: "Marcus Chen", role: "CMO", company: "Apex Global", logo: cellbayLogo, color: "#3b82f6" },
  { id: "02", punchline: "Unmatched digital authority.", quote: "They built our SEO and content architecture from the ground up, positioning us as the definitive regional authority. The results are spectacular.", author: "Dr. Elena Rostova", role: "Medical Director", company: "Aura Health", logo: lifeInfraLogo, color: "#10b981" },
  { id: "03", punchline: "They cracked the algorithm.", quote: "We were struggling to break through the noise. The team deployed an aggressive content strategy that scaled our community by 55k+ in 90 days.", author: "Jameson Lockhart", role: "VP of Media", company: "Daily Pulse", logo: shubhaLogo, color: "#a855f7" },
  { id: "04", punchline: "Precision execution.", quote: "Bee Creative built a bespoke automation ecosystem that filtered out the noise and delivered highly qualified, ready-to-buy investors.", author: "Sarah Sterling", role: "Director of Sales", company: "Sterling Infra", logo: bizzBuzzLogo, color: "#f59e0b" },
  { id: "05", punchline: "Data-driven mastery.", quote: "Their ability to dissect complex market data and turn it into highly converting creative assets is unmatched in the agency space.", author: "David Vance", role: "Founder", company: "Vance Logistics", logo: hansIndiaLogo, color: "#ef4444" },
  { id: "06", punchline: "Visual perfection.", quote: "The brand identity and web experience they delivered didn't just meet our expectations; it entirely redefined our corporate aesthetic.", author: "Sophia Lin", role: "Creative Director", company: "Lumina Studio", logo: kapilChitLogo, color: "#0ea5e9" },
  { id: "07", punchline: "Flawless scalability.", quote: "As we expanded internationally, their growth matrix adapted seamlessly. They aren't an agency; they are an extension of our core team.", author: "Arthur Pendelton", role: "CEO", company: "Pendelton Tech", logo: lifeRealtyLogo, color: "#8b5cf6" },
  { id: "08", punchline: "Maximum ROI.", quote: "We cut our customer acquisition costs in half while doubling our monthly recurring revenue. The math speaks for itself.", author: "Nina Patel", role: "Head of Growth", company: "FinEdge", logo: orchardsLogo, color: "#14b8a6" },
  { id: "09", punchline: "Global reach.", quote: "Crafted high-fidelity brand awareness campaigns targeting elite demographics, streamlining our complex enrollment funnel.", author: "John Davies", role: "Director", company: "ISH", logo: schoolLogo, color: "#d97706" },
  { id: "10", punchline: "Rapid velocity.", quote: "Built a visually stunning social ecosystem that leveraged high-ticket treatments into a predictable, fast-moving lead engine.", author: "Dr. Vernon", role: "Founder", company: "Vernon Clinic", logo: vernonLogo, color: "#0ea5e9" }
];

// Structural Data Splitting for Infinite Loop
const ROW_1_SOURCE = TESTIMONIALS_DATA.slice(0, 5);
const ROW_2_SOURCE = TESTIMONIALS_DATA.slice(5, 10);
const ROW_1 = [...ROW_1_SOURCE, ...ROW_1_SOURCE, ...ROW_1_SOURCE, ...ROW_1_SOURCE];
const ROW_2 = [...ROW_2_SOURCE, ...ROW_2_SOURCE, ...ROW_2_SOURCE, ...ROW_2_SOURCE];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  useGSAP(() => {
    // 1. Hardware Accelerated Marquee Timelines
    const tl1 = gsap.to(track1Ref.current, { xPercent: -50, ease: "none", duration: 55, repeat: -1 });
    const tl2 = gsap.fromTo(track2Ref.current, { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 55, repeat: -1 });

    // 2. Interactive UX: Pause on Hover
    const pauseMarquee = (tl) => gsap.to(tl, { timeScale: 0, duration: 0.8, ease: "power2.out" });
    const resumeMarquee = (tl) => gsap.to(tl, { timeScale: 1, duration: 1.2, ease: "power2.inOut" });

    track1Ref.current.addEventListener('mouseenter', () => pauseMarquee(tl1));
    track1Ref.current.addEventListener('mouseleave', () => resumeMarquee(tl1));
    track2Ref.current.addEventListener('mouseenter', () => pauseMarquee(tl2));
    track2Ref.current.addEventListener('mouseleave', () => resumeMarquee(tl2));

    // 3. Ultra-Refined Velocity Skew Engine
    let proxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(".orbital-card", "skewX", "deg");
    let clamp = gsap.utils.clamp(-4, 4); // Tight clamp for premium weight

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        let skew = clamp(velocity / -250); // Smoother, less aggressive division

        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;

          // Smooth recovery back to 0 degrees
          gsap.to(proxy, {
            skew: 0,
            duration: 1.5,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });

          // Subtle kinetic boost to the track speed
          const speedMultiplier = 1 + Math.abs(velocity / 1200);
          gsap.to([tl1, tl2], {
            timeScale: speedMultiplier,
            duration: 0.2,
            overwrite: true,
            onComplete: () => gsap.to([tl1, tl2], { timeScale: 1, duration: 1.5, ease: "power2.out" })
          });
        }
      }
    });

    return () => {
      if (track1Ref.current) {
        track1Ref.current.removeEventListener('mouseenter', () => pauseMarquee(tl1));
        track1Ref.current.removeEventListener('mouseleave', () => resumeMarquee(tl1));
      }
      if (track2Ref.current) {
        track2Ref.current.removeEventListener('mouseenter', () => pauseMarquee(tl2));
        track2Ref.current.removeEventListener('mouseleave', () => resumeMarquee(tl2));
      }
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="testimonials" className="relative w-full py-20 md:py-24 bg-[#020202] text-white overflow-hidden font-sans">

      {/* AMBIENT TEXTURE: High-End Architectural Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25] mix-blend-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020202] to-[#020202] z-0 pointer-events-none"></div>

      {/* EDITORIAL HEADER: Structured Layout */}
      <div className="relative z-20 max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">

        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-zinc-600"></div>
            <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase font-bold text-zinc-400">
              Client Perspectives
            </span>
          </div>
          {/* Tighter tracking and leading for massive, authoritative typography */}
          <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-white leading-[0.85] text-balance">
            Voices of<br />Authority.
          </h2>
        </div>

        <div className="max-w-sm pb-1">
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-medium text-balance">
            We don't just execute campaigns; we engineer ecosystems. Discover how we have fundamentally shifted the growth trajectory for industry leaders.
          </p>
        </div>
      </div>

      {/* ========================================= */}
      {/* THE INFINITE MARQUEE TRACKS               */}
      {/* ========================================= */}
      {/* CRITICAL UX FIX: Instead of blocking divs, we use a CSS mask-image on the parent.
        This perfectly fades out the left/right edges while keeping 100% of the cards clickable.
      */}
      <div className="relative w-full flex flex-col gap-5 z-0 group [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">

        {/* ROW 1 */}
        <div className="flex items-center gap-5 w-max pl-5 will-change-transform" ref={track1Ref}>
          {ROW_1.map((testimonial, idx) => (
            <TestimonialCard key={`r1-${idx}`} data={testimonial} />
          ))}
        </div>

        {/* ROW 2 */}
        <div className="flex items-center gap-5 w-max pl-5 will-change-transform" ref={track2Ref}>
          {ROW_2.map((testimonial, idx) => (
            <TestimonialCard key={`r2-${idx}`} data={testimonial} />
          ))}
        </div>

      </div>

    </section>
  );
}

// Sub-Component: Precision Milled Card Anatomy
function TestimonialCard({ data }) {
  return (
    <div
      className="orbital-card relative w-[320px] md:w-[420px] shrink-0 flex flex-col bg-[#0a0a0c]/80 hover:bg-[#111115] backdrop-blur-2xl rounded-2xl p-7 border border-white/[0.04] hover:border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-500 cursor-grab active:cursor-grabbing group/card"
    >
      {/* Dynamic Hover Glow based on Client Brand Color */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-[0.04] transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${data.color}, transparent 75%)` }}
      ></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        {/* UX POLISH: The Grayscale-to-Color Reveal.
          Unifies the layout, then rewards the user's hover state with full brand color.
        */}
        <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center p-2.5 shadow-inner shrink-0 group-hover/card:shadow-md transition-shadow duration-500">
          <img
            src={data.logo}
            alt={`${data.company} Logo`}
            className="w-full h-full object-contain filter grayscale opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500"
          />
        </div>
        <Quote size={24} className="text-zinc-700 opacity-40 shrink-0 transform group-hover/card:rotate-6 transition-transform duration-500" />
      </div>

      <div className="flex-1 mb-6 relative z-10">
        <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3" style={{ color: data.color }}>
          "{data.punchline}"
        </h3>
        <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
          {data.quote}
        </p>
      </div>

      {/* Tighter Author Block */}
      <div className="flex items-center gap-3 pt-5 border-t border-white/[0.03] relative z-10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5" style={{ backgroundColor: `${data.color}20` }}>
          <span className="text-xs font-black text-white" style={{ color: data.color }}>
            {data.author.charAt(0)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm md:text-base font-bold text-zinc-100 tracking-tight leading-none mb-1">
            {data.author}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">
            {data.company}
          </span>
        </div>
      </div>

    </div>
  );
}