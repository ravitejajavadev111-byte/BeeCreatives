import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

// STRICT IMPORTS AS REQUESTED
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

const PROJECTS_DATA = [
  { id: "01", client: "Cellbay", sector: "Retail Expansion", title: "Scaling Retail Revenue to ₹4.5Cr+.", challenge: "Cellbay possessed a massive physical footprint but zero digital revenue. We engineered a customized growth framework to drive explosive footfall and integrated online sales.", metrics: [{ label: "Revenue", value: "₹4.5Cr" }, { label: "Avg. ROAS", value: "7X" }, { label: "Community", value: "55k+" }], tags: ["Meta Ads", "Performance", "Omnichannel"], logo: cellbayLogo, themeColor: "#3b82f6" },
  { id: "02", client: "Life Infra", sector: "Real Estate", title: "High-Intent Acquisition Ecosystems.", challenge: "In a fiercely competitive market, acquiring cheap leads wasn't enough. We built a hyper-targeted ecosystem to capture intent-based buyers ready to convert.", metrics: [{ label: "ROAS", value: "10X" }, { label: "Acquisition", value: "-40%" }, { label: "Quality", value: "Premium" }], tags: ["Google Search", "CRO", "Data Segments"], logo: lifeInfraLogo, themeColor: "#10b981" },
  { id: "03", client: "Shubha", sector: "Healthcare", title: "Establishing Medical Authority.", challenge: "Positioned a specialized IVF clinic as the premier regional authority, driving confidential, high-trust patient inquiries at scale through technical SEO.", metrics: [{ label: "Inquiries", value: "300%+" }, { label: "Search Rank", value: "Top 3" }, { label: "Trust", value: "Verified" }], tags: ["Local SEO", "Trust Ads", "Health Matrix"], logo: shubhaLogo, themeColor: "#a855f7" },
  { id: "04", client: "BizzBuzz", sector: "Digital Media", title: "Accelerating Publishing Growth.", challenge: "Transformed a traditional news outlet into a high-velocity digital publisher, scaling content syndication and reader retention through algorithmic distribution.", metrics: [{ label: "Traffic", value: "5M+" }, { label: "Retention", value: "+120%" }, { label: "Ad Revenue", value: "Scaled" }], tags: ["Algorithms", "Audience Growth", "SEO"], logo: bizzBuzzLogo, themeColor: "#2563eb" },
  { id: "05", client: "The Hans India", sector: "Legacy Media", title: "Digital Transformation at Scale.", challenge: "Spearheaded the digital transition for a legacy English daily, modernizing their web architecture and deploying aggressive readership acquisition loops.", metrics: [{ label: "Readership", value: "2M+" }, { label: "Page Speed", value: "-60%" }, { label: "Engagement", value: "High" }], tags: ["Architecture", "Pipelines", "UI/UX"], logo: hansIndiaLogo, themeColor: "#1e3a8a" },
  { id: "06", client: "Kapil Chits", sector: "Financial Services", title: "Trust-Driven Lead Generation.", challenge: "Navigated complex financial compliance to build a highly optimized lead generation funnel, drastically lowering customer acquisition costs while building brand trust.", metrics: [{ label: "Lead Gen", value: "+200%" }, { label: "CPA", value: "-45%" }, { label: "Conversion", value: "Optimal" }], tags: ["Performance", "Compliance", "CRO"], logo: kapilChitLogo, themeColor: "#eab308" },
  { id: "07", client: "Life Realty", sector: "Property Management", title: "Automated Tenant Pipelines.", challenge: "Engineered a seamless digital experience for property management services, automating tenant inquiries and establishing long-term organic search dominance.", metrics: [{ label: "Inquiries", value: "Automated" }, { label: "Search Rank", value: "Page 1" }, { label: "Efficiency", value: "+80%" }], tags: ["Automation", "SEO", "B2B"], logo: lifeRealtyLogo, themeColor: "#06b6d4" },
  { id: "08", client: "Orchards", sector: "Health & Wellness", title: "Hyper-Local Patient Acquisition.", challenge: "Captured high-intent localized search traffic to drive consistent patient bookings, transforming their digital presence into a primary revenue channel.", metrics: [{ label: "Bookings", value: "+150%" }, { label: "Local SEO", value: "Dominant" }, { label: "ROI", value: "5X" }], tags: ["Google Maps", "Paid Search", "Conversion"], logo: orchardsLogo, themeColor: "#22c55e" },
  { id: "09", client: "ISH", sector: "Premium Education", title: "Global Enrollment Campaigns.", challenge: "Crafted high-fidelity brand awareness campaigns targeting international and elite domestic demographics, streamlining the complex student enrollment funnel.", metrics: [{ label: "Awareness", value: "Global" }, { label: "Enrollment", value: "Scaled" }, { label: "Brand Equity", value: "Premium" }], tags: ["Amplification", "Social Media", "Targeting"], logo: schoolLogo, themeColor: "#d97706" },
  { id: "10", client: "Vernon Clinic", sector: "Cosmetic Aesthetics", title: "Visual Dominance & Lead Velocity.", challenge: "Built a visually stunning, highly-converting social ecosystem that leveraged high-ticket cosmetic treatments into a predictable, fast-moving lead engine.", metrics: [{ label: "Lead Velocity", value: "Rapid" }, { label: "Social Reach", value: "1M+" }, { label: "Consults", value: "Booked" }], tags: ["Visual Production", "Meta Ads", "Aesthetic UI"], logo: vernonLogo, themeColor: "#0ea5e9" }
];

export default function Projects() {
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);

  useGSAP(() => {
    const total = PROJECTS_DATA.length;
    const wheelItems = gsap.utils.toArray('.wheel-item');
    const contentPanes = gsap.utils.toArray('.content-pane');

    const ySpacing = window.innerWidth < 768 ? 60 : 100;
    const angleSpacing = window.innerWidth < 768 ? 15 : 12;

    // 1. Initial State Setup
    wheelItems.forEach((item, i) => {
      gsap.set(item, {
        y: i * ySpacing,
        rotation: i * angleSpacing,
        scale: i === 0 ? 1 : 0.6,
        autoAlpha: i === 0 ? 1 : 0.15,
        color: i === 0 ? PROJECTS_DATA[i].themeColor : "#3f3f46",
        x: Math.abs(i) * -15,
        transformOrigin: "left center",
        zIndex: 20 - i
      });
    });

    contentPanes.forEach((pane, i) => {
      gsap.set(pane, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50 });
    });

    // 2. The Master Scroll Timeline
    // CRITICAL: We pin the inner container instead of the section to prevent React/Lenis layout thrashing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: pinContainerRef.current,
        start: "top top",
        end: `+=${total * 120}%`,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // 3. Exact Sequence from the working debug log
    for (let step = 0; step < total - 1; step++) {
      const stepLabel = `step${step}`;
      tl.addLabel(stepLabel);

      wheelItems.forEach((item, index) => {
        const diff = index - (step + 1);
        tl.to(item, {
          y: diff * ySpacing,
          rotation: diff * angleSpacing,
          scale: diff === 0 ? 1 : 0.6,
          autoAlpha: diff === 0 ? 1 : 0.15,
          color: diff === 0 ? PROJECTS_DATA[index].themeColor : "#3f3f46",
          x: Math.abs(diff) * -15,
          zIndex: 20 - Math.abs(diff),
          duration: 1,
          ease: "none"
        }, stepLabel);
      });

      tl.to(contentPanes[step], { autoAlpha: 0, y: -50, duration: 0.5, ease: "power2.in" }, stepLabel);
      tl.to(contentPanes[step + 1], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, `${stepLabel}+=0.5`);
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="work" className="relative w-full bg-[#050507] text-white overflow-hidden z-20">

      {/* PIN TARGET CONTAINER: Prevents GSAP from altering the outer section layout */}
      <div ref={pinContainerRef} className="relative w-full h-screen flex font-sans">

        {/* AMBIENT BACKGROUND */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-zinc-900/30 via-[#050507] to-[#050507] z-0 pointer-events-none"></div>

        {/* HEADER */}
        <div className="absolute top-6 right-6 md:top-10 md:right-12 z-50 flex items-center gap-4 pointer-events-none">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase font-bold text-zinc-500">
            Selected Work
          </span>
          <div className="w-8 md:w-12 h-[1px] bg-zinc-500"></div>
        </div>

        {/* ========================================= */}
        {/* LEFT: The Mechanical Drum Curve */}
        {/* ========================================= */}
        <div className="relative w-[40%] md:w-[45%] h-full flex items-center z-20 pointer-events-none">
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-full h-0 flex items-center justify-start">
            {PROJECTS_DATA.map((project) => (
              <div
                key={project.id}
                className="wheel-item absolute left-0 flex items-center origin-left will-change-transform"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-black uppercase tracking-tighter whitespace-nowrap cursor-default">
                  {project.client}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT: Rigid Architectural Pane */}
        {/* ========================================= */}
        <div className="relative w-[60%] md:w-[55%] h-full flex items-center justify-end pr-4 md:pr-12 lg:pr-16 z-10">

          {/* CRITICAL: STRICT HEIGHT CONTAINER. NO `h-auto`. NO MAX-HEIGHT DYNAMICS. */}
          <div className="relative w-full max-w-4xl h-[75vh] lg:h-[80vh] flex items-center pointer-events-none">
            {PROJECTS_DATA.map((project) => (
              <div
                key={project.id}
                className="content-pane absolute inset-0 flex flex-col justify-center will-change-transform"
              >

                {/* STRICT WHITE CARD CONTAINER: Enforces absolute 100% height of parent */}
                <div
                  className="w-full h-full flex flex-col md:flex-row bg-white rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                  style={{ borderColor: `${project.themeColor}50` }}
                >

                  {/* --- COLUMN 1: Logo & Metrics (35% Width) --- */}
                  <div className="w-full md:w-[35%] h-full flex flex-col bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 p-6 md:p-8 shrink-0">

                    {/* Dedicated Logo Arena */}
                    <div className="w-full h-24 md:h-36 flex items-center justify-center bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm mb-6 shrink-0">
                      <img
                        src={project.logo}
                        alt={`${project.client} Logo`}
                        className="w-full h-full object-contain max-h-[100px] drop-shadow-sm"
                      />
                    </div>

                    {/* Vertical Metrics Stack */}
                    <div className="w-full flex-1 flex flex-col justify-end gap-3 md:gap-5">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="flex flex-col pt-3 border-t border-zinc-200">
                          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">
                            {metric.label}
                          </span>
                          <span className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 tracking-tighter">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* --- COLUMN 2: Typography & Action (65% Width) --- */}
                  <div className="w-full md:w-[65%] h-full flex flex-col p-6 md:p-10 justify-center bg-white relative">

                    {/* Background Number Watermark */}
                    <div className="absolute right-6 top-6 opacity-5 select-none pointer-events-none">
                       <span className="text-8xl font-black text-zinc-900">{project.id}</span>
                    </div>

                    {/* Top Label */}
                    <div className="flex items-center gap-3 mb-6 shrink-0 relative z-10">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: project.themeColor }}></div>
                      <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase font-bold">
                        {project.id} // {project.sector}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 flex flex-col justify-center relative z-10">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-zinc-900 leading-[1.05] mb-4 md:mb-6">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg text-zinc-600 leading-relaxed font-medium line-clamp-4">
                        {project.challenge}
                      </p>
                    </div>

                    {/* Bottom: Tags & Button */}
                    <div className="pt-6 border-t border-zinc-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shrink-0 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest text-zinc-700 bg-zinc-50"
                            style={{ borderColor: `${project.themeColor}30` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CRITICAL FIX: Only the button captures clicks */}
                      <button
                        className="pointer-events-auto flex items-center gap-3 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 group shrink-0"
                        style={{ color: project.themeColor }}
                      >
                        <span className="border-b-2 border-transparent group-hover:border-current pb-1 transition-all duration-300">
                          View Case
                        </span>
                        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center transition-all duration-300 group-hover:bg-current group-hover:text-white shadow-sm">
                          <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </div>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}