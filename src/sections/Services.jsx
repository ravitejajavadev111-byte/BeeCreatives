import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonitorSmartphone, Target, MessageCircle, Share2, Search, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The Bee Creative Editorial Palette (5 Core Vectors)
const SERVICES_DATA = [
  {
    id: "01",
    tag: "Experiences",
    title: "Web & UI/UX Design",
    description: "Your website is your digital storefront. We design intuitive, conversion-focused digital experiences that improve user engagement and drive business growth.",
    icon: <MonitorSmartphone className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />,
    features: ["Corporate & E-Commerce", "User Research & UX", "Mobile-First Design"],
    bg: "bg-[#0A3BFF]", // Premium Royal Blue
    tabBg: "bg-[#0526B3]",
    pillBg: "bg-black/20 hover:bg-black/30",
    textColor: "text-white",
  },
  {
    id: "02",
    tag: "Acquisition",
    title: "Paid Advertising",
    description: "Reach the right audience at the right time. Our performance experts create highly targeted campaigns designed to maximize ROI, not just clicks.",
    icon: <Target className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />,
    features: ["Google & Meta Ads", "LinkedIn B2B Ads", "Revenue Growth"],
    bg: "bg-[#E60023]", // Deep Editorial Red
    tabBg: "bg-[#B3001B]",
    pillBg: "bg-black/20 hover:bg-black/30",
    textColor: "text-white",
  },
  {
    id: "03",
    tag: "Automation",
    title: "WhatsApp Solutions",
    description: "Connect with customers where they are most active. Streamline communication, automate support, and nurture leads directly through WhatsApp API.",
    icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />,
    features: ["Bulk Marketing", "Automated Messaging", "API Integrations"],
    bg: "bg-[#7B00FF]", // Royal Purple
    tabBg: "bg-[#5D00C4]",
    pillBg: "bg-black/20 hover:bg-black/30",
    textColor: "text-white",
  },
  {
    id: "04",
    tag: "Presence",
    title: "Social Media",
    description: "Build a strong online presence with content that connects. We create meaningful relationships through strategic storytelling and performance-driven campaigns.",
    icon: <Share2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />,
    features: ["Instagram & Facebook", "LinkedIn & X", "Community Management"],
    bg: "bg-[#FF5E00]", // High-Vis Orange
    tabBg: "bg-[#CC4B00]",
    pillBg: "bg-black/20 hover:bg-black/30",
    textColor: "text-white",
  },
  {
    id: "05",
    tag: "Authority",
    title: "Search Engine Optimization",
    description: "Get discovered by customers actively searching for you. We implement proven technical and content strategies to strengthen your online authority and rankings.",
    icon: <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />,
    features: ["Technical & On-Page SEO", "Local SEO Strategies", "Organic Traffic"],
    bg: "bg-[#050505]", // Jet Black
    tabBg: "bg-[#000000]",
    pillBg: "bg-white/10 hover:bg-white/20",
    textColor: "text-white",
  }
];

export default function Services() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".service-accordion-card");
    // Shrunk tab widths slightly to accommodate 5 cards beautifully on all screens
    const getTabWidth = () => window.innerWidth < 768 ? 56 : 90;

    // Start all cards 100% off-screen to reveal the Intro base layer
    gsap.set(cards, { x: "100%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (cards.length + 1.5)}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      }
    });

    // Animate cards sliding in sequentially
    cards.forEach((card, i) => {
      tl.to(card, {
        x: () => i * getTabWidth(),
        ease: "none",
        duration: 1,
      });
    });

    // Buffer hold to let user read the final card
    tl.to({}, { duration: 1.2 });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, { scope: sectionRef });

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Section Background: Stark near-black */}
      <section ref={sectionRef} id="services" className="relative w-full h-screen bg-[#0A0A0C] overflow-hidden text-white flex z-10 font-sans">

        {/* ========================================= */}
        {/* BASE LAYER: Bee Creative Intro Sequence */}
        {/* ========================================= */}
        <div className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-0">
          <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[3px] bg-white"></div>
              <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-white uppercase">
                We Are Bee Creative
              </span>
            </div>

            <h2 className="text-[12vw] md:text-[7.5rem] font-black tracking-tighter text-white leading-[0.95]">
              Understand. Create.
            </h2>
            <h2 className="text-[12vw] md:text-[7.5rem] font-black tracking-tighter text-[#0A3BFF] leading-[0.95] mt-2">
              Optimize. Convert.
            </h2>

            <p className="mt-8 text-base md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
              Founded by five digital specialists, we blend innovation, marketing science, and data. We don't just generate leads—we build digital experiences that command attention and drive sustainable business growth.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* DYNAMIC LAYER: The Sliding 5-Card Accordion */}
        {/* ========================================= */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {SERVICES_DATA.map((service, i) => {
            const tabsCoveringThisCard = SERVICES_DATA.length - 1 - i;

            return (
              <div
                key={service.id}
                className={`service-accordion-card absolute top-0 left-0 w-full h-full flex will-change-transform shadow-[-30px_0_60px_rgba(0,0,0,0.6)] pointer-events-auto ${service.bg} border-l border-white/10`}
                style={{
                  zIndex: i * 10,
                  "--tab-w-mobile": "56px",
                  "--tab-w-desktop": "90px",
                  "--pad-r-mobile": `calc(${tabsCoveringThisCard} * var(--tab-w-mobile) + 1.5rem)`,
                  "--pad-r-desktop": `calc(${tabsCoveringThisCard} * var(--tab-w-desktop) + 4rem)`,
                }}
              >

                {/* Micro-texture for premium editorial print feel */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                {/* 1. THE FOLDED TAB */}
                <div className={`h-full flex flex-col items-center justify-between py-10 md:py-16 shrink-0 w-[56px] md:w-[90px] relative z-10 ${service.tabBg} border-r border-black/20`}>
                  <span className={`font-mono text-sm md:text-xl font-bold tracking-tighter ${service.textColor} opacity-90`}>
                    {service.id}
                  </span>

                  <div className="flex-1 flex items-center justify-center relative w-full">
                    <span className={`-rotate-90 absolute whitespace-nowrap tracking-[0.4em] font-mono text-[10px] md:text-xs uppercase font-bold ${service.textColor} opacity-80`}>
                      {service.tag}
                    </span>
                  </div>

                  <div className={`${service.textColor} opacity-90`}>{service.icon}</div>
                </div>

                {/* 2. THE EXPANDED CONTENT AREA */}
                <div className="flex-1 h-full flex flex-col justify-center pt-24 pb-16 pl-6 md:pl-16 overflow-y-auto hide-scrollbar relative z-10 pr-[var(--pad-r-mobile)] md:pr-[var(--pad-r-desktop)]">

                  <div className="flex flex-col justify-center h-full max-w-4xl my-auto">

                    <h3 className={`text-4xl md:text-6xl lg:text-[5rem] font-black ${service.textColor} mb-6 md:mb-8 tracking-tighter leading-[1.05]`}>
                      {service.title}
                    </h3>

                    <p className={`text-base md:text-2xl ${service.textColor} opacity-90 leading-relaxed font-medium mb-10 md:mb-12 max-w-2xl`}>
                      {service.description}
                    </p>

                    {/* Features/Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-12">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className={`${service.pillBg} backdrop-blur-sm p-3 md:p-4 rounded-xl flex items-center gap-3 transition-colors duration-300`}>
                          <span className={`w-2 h-2 rounded-full bg-white opacity-80 shrink-0`} />
                          <span className={`text-sm md:text-base ${service.textColor} font-semibold tracking-wide leading-tight`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto md:mt-2">
                      <button className={`flex items-center gap-4 text-xs md:text-sm font-bold tracking-[0.2em] uppercase group transition-all duration-300 ${service.textColor}`}>
                        <span className="border-b-2 border-transparent group-hover:border-current pb-1 transition-all duration-300">
                          Deploy Strategy
                        </span>
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-current flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black`}>
                          <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </div>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}