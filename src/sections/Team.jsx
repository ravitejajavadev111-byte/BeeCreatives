import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hexagon } from "lucide-react";

import founderImg from '../assets/founder.png';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// 1. STORYBOARD DATA
// ─────────────────────────────────────────────────────────────
const TEAM_TEXTS = [
  {
    id: "global",
    title: "Meet the Hive.",
    subtitle: "Architecture & Execution",
    desc: "Behind every successful campaign is a hive of specialists working together with one absolute purpose—to help your business grow. At Bee Creative, every bee has a unique responsibility, combining creativity, strategy, technology, and performance to build brands that stand out and deliver measurable results.",
    tags: []
  },
  {
    id: "yashaswi",
    title: "Yashaswi Surya",
    subtitle: "The Social Bee • Head of Social Media",
    desc: "With over 6 years of experience, Yashaswi has transformed businesses into recognizable brands through powerful storytelling, creative content, and strategic marketing. Having worked with leading brands including Apple and Redmi, he understands exactly what it takes to build engaged communities, create viral campaigns, and turn followers into loyal customers.",
    tags: ["Brand Building", "Content Strategy", "Viral Campaigns", "Influencer Marketing"]
  },
  {
    id: "saiteja",
    title: "Sai Teja Bajjuri",
    subtitle: "The Performance Bee • Head of Performance",
    desc: "Every click should create value, and every campaign must generate measurable growth. Sai Teja specializes in performance-driven digital advertising. His data-first approach has generated over ₹3.5 Crores in revenue within a single month. Success isn't measured by impressions—it's measured by business growth.",
    tags: ["Google & Meta Ads", "Lead Generation", "Conversion Optimization", "ROAS Scaling"]
  },
  {
    id: "operations",
    title: "Administration",
    subtitle: "The Operations Bee • Workflows",
    desc: "The strength of every hive lies in its organization. With 8+ years of operational experience, our Operations Bee ensures every project, campaign, client interaction, and internal workflow runs seamlessly from start to finish. Every moving part works together flawlessly under expert operational management.",
    tags: ["Operations Management", "Project Coordination", "Client Success", "Process Optimization"]
  },
  {
    id: "raviteja",
    title: "Ravi Teja",
    subtitle: "The Developer Bee • Head of Design & Dev",
    desc: "Every great digital experience starts with exceptional development. Bringing 3 years of battle-tested expertise in Java development and robust backend architecture, Ravi creates scalable websites and mobile solutions. He specializes in transforming ideas from concept to fully functional, high-performance digital products.",
    tags: ["Java Architecture", "Full-Stack Development", "UI/UX Implementation", "Enterprise Solutions"]
  }
];

// ─────────────────────────────────────────────────────────────
// 2. MATHEMATICAL GRID GEOMETRY (Pointy-Top Hexagon)
// ─────────────────────────────────────────────────────────────
const R  = 95;
const W  = R * Math.sqrt(3); // ~164.54
const H  = R * 2;            // 190
const dx = W / 2;
const dy = R * 1.5;

const HIVE_CELLS = [
  { id: 0, type: "member", x: 0,         y: 0   },
  { id: 1, type: "member", x: dx,        y: -dy },
  { id: 2, type: "member", x: dx,        y:  dy },
  { id: 3, type: "member", x: -dx,       y:  dy },
  { id: 4, type: "member",  x: -dx,       y: -dy },
];

export default function Team() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // A. INITIAL SETUP: Place all cells strictly in their mathematical slots
    HIVE_CELLS.forEach((cell, i) => {
      gsap.set(`.cell-wrapper-${i}`, {
        x: cell.x,
        y: cell.y,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        zIndex: 1,
        transformPerspective: 1200,
      });
    });

    gsap.set(".team-text", { autoAlpha: 0, y: 30 });
    gsap.set(".team-text-0", { autoAlpha: 1, y: 0 });

    // B. RESPONSIVE ANIMATION ENGINE
    const mm = gsap.matchMedia();
    mm.add("(min-width: 320px)", () => {
      const isDesktop = window.innerWidth > 1024;

      // Extraction spotlight coordinates (nudges slightly left on desktop to balance the text)
      const spotX = isDesktop ? -80 : 0;
      const spotY = 0;
      const spotScale = isDesktop ? 1.7 : 1.35;

      // Master Timeline linked strictly to the physical CSS height (800vh)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: true,
        }
      });

      // Opening Buffer Hold (Allows user to absorb the initial scene)
      tl.to({}, { duration: 0.5 });

      // C. THE SEQUENTIAL EXTRACTION LOOP
      for (let i = 1; i <= 4; i++) {
        const step = `step_${i}`;
        tl.addLabel(step);

        const currentId = i - 1;
        const prevId = i - 2;

        const currentCell = `.cell-wrapper-${currentId}`;
        const prevCell = prevId >= 0 ? `.cell-wrapper-${prevId}` : null;

        // 1. Crossfade Typography
        tl.to(`.team-text-${i - 1}`, { autoAlpha: 0, y: -20, duration: 0.6, ease: "power2.inOut" }, step)
          .to(`.team-text-${i}`, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, step + "+=0.2");

        // 2. Manage the Background Cluster & Previous Cell
        if (i === 1) {
          // Push empty structural cells back into the shadows on first scroll
          tl.to(".empty-cell", { opacity: 0.15, filter: "blur(3px)", duration: 0.8 }, step);
        } else if (prevCell) {
          // Seamlessly return previous cell to its exact mathematical slot and send it to the background
          const prevData = HIVE_CELLS[prevId];
          tl.to(prevCell, {
            x: prevData.x,
            y: prevData.y,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            zIndex: 1,
            filter: "brightness(0.4) blur(3px)",
            duration: 1,
            ease: "power3.inOut"
          }, step);
        }

        // Dim any other waiting members
        const otherMembers = [0, 1, 2, 3].filter(id => id !== currentId && id !== prevId).map(id => `.cell-wrapper-${id}`).join(',');
        if (otherMembers) {
          tl.to(otherMembers, { filter: "brightness(0.4) blur(3px)", duration: 0.8 }, step);
        }

        // 3. Extract Target Member (Premium 3D Cinematic Peel)
        tl.to(currentCell, {
          x: spotX,
          y: spotY,
          scale: spotScale,
          rotationY: -10, // Sophisticated architectural tilt
          rotationX: 5,
          zIndex: 50,
          filter: "brightness(1.05) drop-shadow(0 25px 40px rgba(245,158,11,0.15)) blur(0px)",
          duration: 1.2,
          ease: "power3.inOut"
        }, step);

        // 4. THE HOLD (Crucial UX logic - physically guarantees reading time during scroll)
        tl.to({}, { duration: 2.0 });
      }

      // D. THE GRAND FINALE (Resolves the scene before unpinning)
      const finale = "finale";
      tl.addLabel(finale);

      // Fade out final text
      tl.to(`.team-text-4`, { autoAlpha: 0, y: -20, duration: 0.6 }, finale);

      // Return final member to the grid
      tl.to(`.cell-wrapper-3`, {
        x: HIVE_CELLS[3].x,
        y: HIVE_CELLS[3].y,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        zIndex: 1,
        filter: "brightness(1) blur(0px)",
        duration: 1,
        ease: "power3.inOut"
      }, finale);

      // Restore the entire hive's lighting
      tl.to(".empty-cell, .member-cell", {
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        duration: 1,
        ease: "power2.out"
      }, finale);

      // Final Buffer before allowing scroll into the next section
      tl.to({}, { duration: 1.0 });

    });

  }, { scope: containerRef });

  return (
    // THE 800vh GUARANTEE: Physically blocks the next section from appearing until the animation is 100% complete.
    <section ref={containerRef} id="team" className="relative w-full bg-[#030303] text-white font-sans" style={{ height: "800vh" }}>

      {/* NATIVE STICKY STAGE: Operates flawlessly at 120fps without GSAP pin bugs */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Premium Architectural Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_800px_800px_at_50%_50%,#d9770608,transparent)]"></div>

        <div className="flex flex-col-reverse lg:flex-row w-full h-full max-w-[100rem] mx-auto relative z-10 items-center justify-center">

          {/* ─── LEFT: Editorial Typography Canvas ──────────────── */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative flex items-center justify-center px-6 md:px-12 lg:px-24 pointer-events-none z-20">
            {TEAM_TEXTS.map((text, i) => (
              <div key={text.id} className={`team-text team-text-${i} absolute w-full max-w-lg px-6 flex flex-col`}>
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <Hexagon size={16} className="text-amber-500 animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-amber-500">
                    {text.subtitle}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-white mb-4 md:mb-6 text-balance drop-shadow-md">
                  {text.title}
                </h2>

                <p className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed mb-6 md:mb-8 text-balance">
                  {text.desc}
                </p>

                {text.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 md:gap-3 pt-4 md:pt-6 border-t border-white/5">
                    {text.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-zinc-300 bg-white/[0.03] border border-white/10 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ─── RIGHT: The Kinetic Hive ────────────────────────── */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative flex items-center justify-center z-10">

            {/* Mathematical Anchor Point */}
            <div className="hive-cluster absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:translate-x-12 w-0 h-0 flex items-center justify-center">

              {HIVE_CELLS.map((cell, i) => (
                <div
                  key={i}
                  className={`cell-wrapper-${i} ${cell.type === 'empty' ? 'empty-cell' : 'member-cell'} absolute flex items-center justify-center will-change-transform`}
                  style={{
                    width: `${W}px`,
                    height: `${H}px`,
                    marginLeft: `${-W / 2}px`,
                    marginTop: `${-H / 2}px`,
                  }}
                >
                  <HexagonNode isEmpty={cell.type === "empty"} image={founderImg} />
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PREMIUM SVG HEXAGON (Clean Luxury Aesthetics)
// ─────────────────────────────────────────────────────────────
function HexagonNode({ isEmpty, image }) {
  const hexId = Math.random().toString(36).substr(2, 9);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 173.2 200"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`honeyGrad-${hexId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <clipPath id={`hexClip-${hexId}`}>
            <polygon points="86.6 0, 173.2 50, 173.2 150, 86.6 200, 0 150, 0 50" />
          </clipPath>
        </defs>

        {/* Pristine Black Base */}
        <polygon
          points="86.6 0, 173.2 50, 173.2 150, 86.6 200, 0 150, 0 50"
          fill={isEmpty ? "transparent" : "#0a0a0a"}
        />

        {/* Member Image Layer */}
        {!isEmpty && (
          <image
            href={image}
            width="173.2"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#hexClip-${hexId})`}
            className="filter contrast-110 object-cover"
          />
        )}

        {/* Razor-Sharp Gradient Stroke */}
        <polygon
          points="86.6 0, 173.2 50, 173.2 150, 86.6 200, 0 150, 0 50"
          fill="none"
          stroke={`url(#honeyGrad-${hexId})`}
          strokeWidth={isEmpty ? "1" : "3"}
          className={isEmpty ? "opacity-30" : "opacity-100"}
        />
      </svg>
    </div>
  );
}