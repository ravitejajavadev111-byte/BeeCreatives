import React, { useEffect } from 'react';
import Lenis from 'lenis';

// Section Imports
import Hero from './sections/Hero';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import About from './sections/About';
import Team from './sections/Team';

// UI & WebGL Layer Imports
import CustomCursor from './components/CustomCursor';
import SceneCanvas from './webgl/SceneCanvas';

function App() {
  useEffect(() => {
    // Instantiate premium Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white antialiased selection:bg-white selection:text-black">
      {/* Visual Enhancers Layer */}
      <div className="film-grain" aria-hidden="true" />
      <CustomCursor />

      {/* BACKGROUND LAYER: Fixed GLSL / Three.js 3D Scene */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <SceneCanvas />
      </div>

      {/* FOREGROUND LAYER: Semantic HTML / Tailwind Layout Content */}
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        <Services />
        <Projects />
        <Testimonials />
        <Team/>
        <About />
      </main>
    </div>
  );
}

export default App;