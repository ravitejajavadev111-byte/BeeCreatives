import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Base colour image — existing Vite asset import
import heroBaseImg from '../assets/hero-base.png';

// ─── NEW: Greyscale depth map ─────────────────────────────────────────────────
//  White (#fff, luminance 1.0) = foreground → max Z push toward camera
//  Black (#000, luminance 0.0) = background → stays at z = 0
//  Create in: Photoshop (Depth of Field map), Blender (Z-pass render),
//             or AI tools like MiDaS / ZoeDepth for photo-based generation
import heroDepthImg from '../assets/hero-base.png';

// Live-mutable config object — GSAP tweens or Leva GUI push here at runtime;
// useFrame reads it every tick without triggering any React re-renders
import { webglState } from './globalState';

// ─────────────────────────────────────────────────────────────────────────────
//  High-frequency mouse state kept outside React to avoid render scheduling
// ─────────────────────────────────────────────────────────────────────────────
const rawMouse    = { x: 0, y: 0 };   // NDC [-1, 1] — updated on every mousemove
const smoothMouse = { x: 0, y: 0 };   // exponential lerp target, fed to shader


// ─────────────────────────────────────────────────────────────────────────────
//  VERTEX SHADER
//  Three orthogonal displacement layers stacked on the Z axis:
//
//  Layer 1 – Static depth parallax
//    The depth map luminance directly drives how far each vertex pops
//    toward the camera. This is the foundation of the "3D diorama" feel.
//
//  Layer 2 – Temporal organic wave
//    A sine × cosine product field animated over time. Multiplied by the
//    depth sample so background vertices stay still (depth ≈ 0) while
//    foreground elements breathe. Driven by uTemporalAmp × uSpeed.
//
//  Layer 3 – Cursor pressure ripple
//    Concentric sinusoidal rings propagate outward from the UV-space cursor
//    position. A smoothstep falloff limits the field of effect; multiplying
//    by depth keeps ripples on foreground geometry only.
//
//  Vertex texture fetch (texture2D in vertex stage) requires WebGL 2, which
//  React Three Fiber enables by default in all modern browsers.
// ─────────────────────────────────────────────────────────────────────────────
const vertexShader = /* glsl */`
  uniform sampler2D uDepthMap;
  uniform vec2      uMouse;        // UV-space cursor [0, 1]
  uniform float     uTime;
  uniform float     uDisplacement; // webglState.distortion  — peak Z in world units
  uniform float     uTemporalAmp;  // webglState.temporalDistortion — wave amplitude
  uniform float     uSpeed;        // webglState.rotationSpeed — wave frequency

  varying vec2  vUv;
  varying float vDepth;  // forwarded to fragment for aberration & tinting

  void main() {
    vUv = uv;

    // ── 1. Sample depth map ──────────────────────────────────────────────────
    // .r is sufficient — depth maps are greyscale so r == g == b
    float depth = texture2D(uDepthMap, uv).r;
    vDepth = depth;

    // ── 2. Static depth parallax — the core 3D foundation ───────────────────
    float zBase = depth * uDisplacement;

    // ── 3. Ambient temporal wave ─────────────────────────────────────────────
    // Orthogonal sine × cosine product breaks symmetry so the surface
    // breathes naturally rather than pulsing in a grid pattern.
    // Scaling frequencies (10.0, 8.0) chosen to clear the aliasing
    // Nyquist limit on a 96-segment grid while staying subpixel-smooth.
    float zWave = sin(uv.x * 10.0 + uTime * uSpeed)
                * cos(uv.y *  8.0 + uTime * uSpeed * 0.65)
                * uTemporalAmp
                * depth;               // foreground-only; background stays flat

    // ── 4. Cursor pressure ripple ────────────────────────────────────────────
    float mDist    = distance(uv, uMouse);
    float mFalloff = smoothstep(0.38, 0.0, mDist);  // influence radius ≈ 38 % of screen
    // Ring wavefront: sin creates concentric bands; negative uTime makes
    // rings travel outward from the cursor rather than collapsing inward
    float zRipple  = sin(mDist * 22.0 - uTime * 5.0)
                   * 0.022
                   * mFalloff
                   * depth;            // only displaces foreground geometry

    // ── 5. Combine and output ────────────────────────────────────────────────
    vec3 displaced = position;
    displaced.z += zBase + zWave + zRipple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;


// ─────────────────────────────────────────────────────────────────────────────
//  FRAGMENT SHADER
//  Four stacked post-processing passes applied in order of spatial frequency:
//
//  Pass 1 – Chromatic aberration (RGB channel split)
//    Direction: radial from image centre — matches real lens barrel distortion.
//    Magnitude: sum of three independent drivers so it never feels static:
//      a) uRoughness         — base lens "quality" (webglState.roughness)
//      b) cursor proximity   — spreads under the cursor, snaps back on leave
//      c) vDepth             — foreground elements split more than background
//
//  Pass 2 – Depth attenuation tint
//    Deep (far) vertices absorb uAttenuationColor, simulating aerial perspective.
//    Blend strength is clamped to 0.35 so the base image colour is never lost.
//
//  Pass 3 – Master colour tint
//    webglState.color multiplied across all channels — a pure gain stage.
//    Default #ffffff is identity (no change); GSAP can animate to a cool or
//    warm shift as a scene transition.
//
//  Pass 4 – Radial vignette
//    Elliptical (16:9 ratio corrected) rather than circular so it doesn't
//    clip portrait content on tall viewports.
// ─────────────────────────────────────────────────────────────────────────────
const fragmentShader = /* glsl */`
  uniform sampler2D uTexture;
  uniform vec2      uMouse;
  uniform float     uTime;
  uniform float     uRoughness;        // webglState.roughness   — aberration base
  uniform float     uDisplacement;     // webglState.distortion  — scales depth aberration
  uniform vec3      uColor;            // webglState.color       — master tint
  uniform vec3      uAttenuationColor; // webglState.attenuationColor — depth fog

  varying vec2  vUv;
  varying float vDepth;

  void main() {

    // ── 1. Chromatic aberration magnitude ────────────────────────────────────
    float mDist = distance(vUv, uMouse);

    float aberBase  = uRoughness * 0.5;
    float aberMouse = smoothstep(0.45, 0.0, mDist) * 0.007;
    float aberDepth = vDepth * uDisplacement * 0.003;

    float aberration = aberBase + aberMouse + aberDepth;

    // Radial split direction — normalise from image centre
    // Add a tiny epsilon (1e-5) to avoid NaN at the exact centre pixel
    vec2 aberDir = normalize(vUv - vec2(0.5) + vec2(1e-5)) * aberration;

    // ── 2. RGB channel split ─────────────────────────────────────────────────
    float r = texture2D(uTexture, vUv + aberDir        ).r;
    float g = texture2D(uTexture, vUv                  ).g;
    float b = texture2D(uTexture, vUv - aberDir        ).b;

    vec3 col = vec3(r, g, b);

    // ── 3. Depth attenuation (aerial perspective) ────────────────────────────
    // Deep areas (depth → 0) receive more of the attenuation tint.
    // mix(a, b, t): t=0 → col, t=1 → attenuated.  Max blend 0.35 preserves colour.
    float attenuationFactor = (1.0 - vDepth) * 0.35;
    col = mix(col, col * uAttenuationColor, attenuationFactor);

    // ── 4. Master tint ───────────────────────────────────────────────────────
    col *= uColor;

    // ── 5. Elliptical vignette ───────────────────────────────────────────────
    // Stretch UV by (1.6, 1.0) to account for widescreen aspect ratio so the
    // vignette falls elliptically rather than cutting circular corners.
    float vigDist  = length((vUv - 0.5) * vec2(1.6, 1.0));
    float vignette = 1.0 - smoothstep(0.5, 1.0, vigDist);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;


// ─────────────────────────────────────────────────────────────────────────────
//  ImagePlane — the R3F scene object
// ─────────────────────────────────────────────────────────────────────────────
function ImagePlane() {
  const meshRef     = useRef();
  const materialRef = useRef();

  // ── Batch-load both textures in a single Suspense boundary ────────────────
  // useLoader deduplicates by URL — these are the same references every render
  const [baseTexture, depthTexture] = useLoader(THREE.TextureLoader, [
    heroBaseImg,
    heroDepthImg,
  ]);

  // ── Texture configuration ─────────────────────────────────────────────────
  // LinearFilter on both prevents blocky artefacts when the plane is magnified
  // during Z displacement. Mipmaps are wasteful on a fullscreen plane.
  useMemo(() => {
    [baseTexture, depthTexture].forEach((tex) => {
      tex.minFilter      = THREE.LinearFilter;
      tex.magFilter      = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate    = true;
    });
  }, [baseTexture, depthTexture]);

  // ── Build the uniform descriptor map once ─────────────────────────────────
  // THREE.Color / THREE.Vector2 objects are mutated in place inside useFrame
  // to avoid creating new heap objects every tick.
  const uniforms = useMemo(() => ({
    uTexture:         { value: baseTexture },
    uDepthMap:        { value: depthTexture },
    uMouse:           { value: new THREE.Vector2(0.5, 0.5) },
    uTime:            { value: 0 },
    // globalState initial values — live-updated each frame below
    uDisplacement:    { value: webglState.distortion },
    uTemporalAmp:     { value: webglState.temporalDistortion },
    uSpeed:           { value: webglState.rotationSpeed },
    uRoughness:       { value: webglState.roughness },
    uColor:           { value: new THREE.Color(webglState.color) },
    uAttenuationColor:{ value: new THREE.Color(webglState.attenuationColor) },
  }), [baseTexture, depthTexture]);

  // Viewport gives us the frustum-projected plane dimensions in world units
  const { viewport } = useThree();

  // ── Per-frame updates — zero allocations, no React state touched ──────────
  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;

    // Mouse smoothing — exponential decay, matches CustomCursor.jsx's 0.06 factor
    smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.06;
    smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.06;

    // Remap NDC [-1, 1] → UV [0, 1] for the GLSL distance() calls
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uMouse.value.set(
      (smoothMouse.x + 1) / 2,
      (smoothMouse.y + 1) / 2,
    );

    // Hot-sync globalState so GSAP tweens and Leva GUI updates are instant
    mat.uniforms.uDisplacement.value = webglState.distortion;
    mat.uniforms.uTemporalAmp.value  = webglState.temporalDistortion;
    mat.uniforms.uSpeed.value        = webglState.rotationSpeed;
    mat.uniforms.uRoughness.value    = webglState.roughness;
    // .set() mutates the existing THREE.Color in place — no GC pressure
    mat.uniforms.uColor.value.set(webglState.color);
    mat.uniforms.uAttenuationColor.value.set(webglState.attenuationColor);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/*
        96 × 96 segments = 9,216 vertices — sweet spot for depth displacement:
          • Enough density for smooth, sub-pixel-accurate Z curvature
          • Well under the ~18k vertex ceiling where mobile GPUs throttle
        Increase to 128 for ultra-quality desktop-only builds;
        decrease to 64 for guaranteed 60 fps across mid-tier mobile.
      */}
      <planeGeometry args={[viewport.width, viewport.height, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}  // fullscreen BG plane must not occlude scene depth buffer
      />
    </mesh>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
//  SceneCanvas — the exported root canvas component
// ─────────────────────────────────────────────────────────────────────────────
export default function SceneCanvas() {

  // Native mousemove outside React — no synthetic event overhead
  // Passive listener ensures Lenis scroll is never blocked
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      rawMouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 4], fov: 45 }}
      >
        <ambientLight intensity={1.5} />
        {/*
          Suspense is required because useLoader throws a Promise on first render.
          null fallback keeps the canvas black until textures are decoded —
          the Hero.jsx GSAP timeline's 0.2s delay provides cover for this.
        */}
        <Suspense fallback={null}>
          <ImagePlane />
        </Suspense>
      </Canvas>
    </div>
  );
}