import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CustomCursor = () => {
  const orbRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const isVisible = useRef(false);

  // 1. Initialize GSAP quickTo tweens for elastic trailing effect
  useGSAP(() => {
    if (!orbRef.current) return;

    // Center the origin so the orb tracks from the exact middle of the pointer
    gsap.set(orbRef.current, { 
      xPercent: -50, 
      yPercent: -50, 
      opacity: 0, 
      scale: 1 
    });

    // independent spring durations (~0.45s) on each axis with a smooth out ease
    xTo.current = gsap.quickTo(orbRef.current, "x", { duration: 0.45, ease: "power3.out" });
    yTo.current = gsap.quickTo(orbRef.current, "y", { duration: 0.45, ease: "power3.out" });
  });

  // 2. Handle Mouse Movement, Viewport visibility, and Interactive Hover States
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    // Track mouse position and handle initial fade-in
    const handleMouseMove = (e) => {
      if (!isVisible.current) {
        gsap.to(orb, { opacity: 1, duration: 0.3, ease: "power2.out" });
        isVisible.current = true;
      }
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };

    // Fade out smoothly if mouse leaves the browser viewport canvas boundary
    const handleMouseLeaveViewport = () => {
      gsap.to(orb, { opacity: 0, duration: 0.3, ease: "power2.out" });
      isVisible.current = false;
    };

    // Hover animation states
    const handleMouseEnterInteractive = () => {
      gsap.to(orb, { 
        scale: 1.6, 
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255, 255, 255, 0.05)", // drop opacity/background alpha slightly
        duration: 0.4, 
        ease: "power2.out" 
      });
    };

    const handleMouseLeaveInteractive = () => {
      gsap.to(orb, { 
        scale: 1, 
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)", // restore to normal
        duration: 0.4, 
        ease: "power2.out" 
      });
    };

    // Attach native mouse tracking listeners
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveViewport);

    // Event delegation / scanning logic for targets: button, a, .service-card, .magnetic
    const attachHoverListeners = () => {
      const targets = document.querySelectorAll("button, a, .service-card, .magnetic");
      targets.forEach((target) => {
        target.addEventListener("mouseenter", handleMouseEnterInteractive);
        target.addEventListener("mouseleave", handleMouseLeaveInteractive);
      });

      // Return targets so we can unbind them accurately during cleanup
      return targets;
    };

    // Initial attachment
    let interactiveElements = attachHoverListeners();

    // Setup a MutationObserver to account for dynamic DOM changes common in Tier-3 portfolios
    const observer = new MutationObserver(() => {
      // Clean previous listeners to prevent duplicates
      interactiveElements.forEach((target) => {
        target.removeEventListener("mouseenter", handleMouseEnterInteractive);
        target.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
      // Re-scan and re-bind
      interactiveElements = attachHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. Clean up all lifecycle loops and event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveViewport);
      observer.disconnect();
      
      interactiveElements.forEach((target) => {
        target.removeEventListener("mouseenter", handleMouseEnterInteractive);
        target.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Global CSS Inject to naturally hide the default operating system pointer */}
      <style>{`
        body, a, button, .service-card, .magnetic {
          cursor: none !important;
        }
      `}</style>

      {/* Premium Glassmorphic Glowing Orb Division Elements */}
      <div
        ref={orbRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-[8px] mix-blend-screen shadow-[0_0_20px_rgba(255,255,255,0.15)] will-change-transform"
      >
        {/* Micro Drop-Shadow Bloom Layer & Radial Gradient Fill Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-white/10 to-purple-500/20 opacity-60 blur-[2px]" />
      </div>
    </>
  );
};

export default CustomCursor;