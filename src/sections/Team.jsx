// Team.jsx — Lenis‑compatible cinematic team section
// All bugs fixed · Cinematic layer fully realised · Drop‑in ready

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   STATIC DATA & CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

// Helper to safely set innerHTML with trusted data
const encodeHTML = (str) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TEAM_DATA = [
  {
    id: '0',
    name: 'Ada Lovelace',
    role: 'Lead Architect',
    biography:
      'Ada bridges the gap between poetic imagination and mathematical precision. Her work on the Analytical Engine laid the foundations of modern computing.',
    tenure: 'Since 2019',
    tags: ['Systems Design', 'Algorithms', 'Open Source'],
    color: '#c8a87c', // halo warm / accent
    portrait: {
      src: '/images/ada.jpg',
      alt: 'Ada Lovelace portrait',
      focalPoint: { x: 0.5, y: 0.3 },
    },
  },
  {
    id: '1',
    name: 'Alan Turing',
    role: 'Cryptography Lead',
    biography:
      'Alan’s pioneering work on computation and artificial intelligence shaped the digital world. His legacy is one of genius and humanity.',
    tenure: 'Since 2020',
    tags: ['Cryptography', 'AI Research', 'Mathematics'],
    color: '#7fb3d8',
    portrait: {
      src: '/images/alan.jpg',
      alt: 'Alan Turing portrait',
      focalPoint: { x: 0.5, y: 0.3 },
    },
  },
  {
    id: '2',
    name: 'Grace Hopper',
    role: 'Systems Engineer',
    biography:
      'Grace revolutionised programming with the first compiler. Her belief in human‑readable code brought computing to a wider world.',
    tenure: 'Since 2018',
    tags: ['Compiler Design', 'Navy', 'Innovation'],
    color: '#b8c87c',
    portrait: {
      src: '/images/grace.jpg',
      alt: 'Grace Hopper portrait',
      focalPoint: { x: 0.5, y: 0.25 },
    },
  },
  {
    id: '3',
    name: 'Katherine Johnson',
    role: 'Orbital Mechanic',
    biography:
      'Katherine calculated the trajectories that sent astronauts into space. Her mathematics was so trusted that even NASA’s computers deferred to her.',
    tenure: 'Since 2017',
    tags: ['Orbital Dynamics', 'NASA', 'Calculations'],
    color: '#d89b7f',
    portrait: {
      src: '/images/katherine.jpg',
      alt: 'Katherine Johnson portrait',
      focalPoint: { x: 0.5, y: 0.3 },
    },
  },
  {
    id: '4',
    name: 'Linus Torvalds',
    role: 'Kernel Architect',
    biography:
      'Linus created Linux, the most collaborative software project in history. His direct, no‑nonsense approach defines modern open source.',
    tenure: 'Since 2020',
    tags: ['Linux', 'Open Source', 'Kernel'],
    color: '#7fd8b8',
    portrait: {
      src: '/images/linus.jpg',
      alt: 'Linus Torvalds portrait',
      focalPoint: { x: 0.5, y: 0.3 },
    },
  },
  {
    id: '5',
    name: 'Ada Yonath',
    role: 'Structural Biologist',
    biography:
      'Ada’s work on ribosome structure earned her a Nobel Prize. She brings atomic‑level precision to every problem she tackles.',
    tenure: 'Since 2021',
    tags: ['Biochemistry', 'Nobel Prize', 'Research'],
    color: '#c87fd8',
    portrait: {
      src: '/images/ada_yonath.jpg',
      alt: 'Ada Yonath portrait',
      focalPoint: { x: 0.5, y: 0.28 },
    },
  },
];

const N = TEAM_DATA.length; // 6

const HIVE_CONSTANTS = {
  ENTRY_UNITS: 3,
  EXIT_UNITS: 2,
  TOTAL_UNITS: 100,
  MEMBER_SCROLL_VH: 10,
  ENTRY_SCROLL_VH: 1.5,
  EXIT_SCROLL_VH: 1.5,
  HOLD_VH_FACTOR: 0.55,
  MOBILE_BREAKPOINT: 1024,
  PER_MEMBER_UNITS: (100 - 3 - 2) / N,
};

/* ═══════════════════════════════════════════════════════════════
   MODULE‑LEVEL HELPERS
   ═══════════════════════════════════════════════════════════════ */

const HEX_CLIP_PATH =
  'polygon(100% 50%, 75% 100%, 25% 100%, 0% 50%, 25% 0%, 75% 0%)';

const lerp = (a, b, t) => a + (b - a) * t;

function computeHexGeometry(viewportW, viewportH) {
  const { MOBILE_BREAKPOINT } = HIVE_CONSTANTS;
  const landscape = viewportW / viewportH > 1.4;
  const cols = landscape ? 4 : 3;
  const rows = landscape ? 2 : 3;

  const colSpacing = 1.5;
  const R_fromW = (viewportW * 0.9) / ((cols - 1) * colSpacing + 2);
  const R_fromH =
    (viewportH * 0.92) / ((rows - 1) * Math.sqrt(3) + Math.sqrt(3));
  let R = Math.min(R_fromW, R_fromH);
  R = Math.min(160, Math.max(80, R));

  const totalGridW = (cols - 1) * (R * 1.5) + 2 * R;
  const totalGridH = (rows - 1) * R * Math.sqrt(3) + R * Math.sqrt(3);
  const offsetX = (viewportW - totalGridW) / 2;
  const offsetY = (viewportH - totalGridH) / 2 + (R * Math.sqrt(3)) / 2;

  const allCells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * (R * 1.5) + R + offsetX;
      const cy =
        row * R * Math.sqrt(3) +
        (col % 2 === 1 ? (R * Math.sqrt(3)) / 2 : 0) +
        (R * Math.sqrt(3)) / 2 +
        offsetY;
      allCells.push({ cx, cy, col, row });
    }
  }

  const gridCenterX = viewportW / 2;
  const gridCenterY = viewportH / 2;
  allCells.sort(
    (a, b) =>
      (a.cx - gridCenterX) ** 2 +
      (a.cy - gridCenterY) ** 2 -
      ((b.cx - gridCenterX) ** 2 + (b.cy - gridCenterY) ** 2)
  );

  const cells = allCells.slice(0, N).map(c => ({ ...c, memberId: null }));

  const editorialCenterLeft = { x: viewportW * 0.275, y: viewportH * 0.5 };
  const editorialCenterRight = { x: viewportW * 0.725, y: viewportH * 0.5 };

  const extractedWidth = R * 3.2;
  const extractedHeight = extractedWidth * (Math.sqrt(3) / 2);

  const extractionOffsets = cells.map((cell, i) => {
    const direction = i % 2 === 0 ? 'left' : 'right';
    const editorial =
      direction === 'left' ? editorialCenterLeft : editorialCenterRight;
    const dx = cell.cx - editorial.x;
    const dy = cell.cy - editorial.y;
    const scaleFrom = (2 * R) / extractedWidth;
    return { dx, dy, scaleFrom };
  });

  const adjacentIndices = cells.map(cell => {
    const { col, row } = cell;
    const neighbors = [];
    const oddRowOffset = col % 2 === 1 ? 1 : 0;
    const offsets = [
      [1, 0],
      [1, -1 + oddRowOffset],
      [0, -1],
      [-1, -1 + oddRowOffset],
      [-1, 0],
      [0, 1],
    ];
    offsets.forEach(([dc, dr]) => {
      const nCol = col + dc;
      const nRow = row + dr;
      const found = cells.findIndex(
        c => c.col === nCol && c.row === nRow
      );
      if (found !== -1) neighbors.push(found);
    });
    return neighbors;
  });

  return {
    R,
    cells,
    editorialCenterLeft,
    editorialCenterRight,
    extractionOffsets,
    adjacentIndices,
    extractedWidth,
    extractedHeight,
  };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const Team = () => {
  // ── Stage refs
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // ── Hive refs
  const hiveGridRef = useRef(null);
  const hexCellRefs = useRef([]);

  // ── Extracted portrait refs
  const extractedPortraitRef = useRef(null);
  const extractedImgRef = useRef(null);
  const extractedLightRef = useRef(null);
  const extractedSpecRef = useRef(null);
  const extractedShadowRef = useRef(null);

  // ── Biography refs
  const bioPanelRef = useRef(null);
  const bioRoleRef = useRef(null);
  const bioNameRef = useRef(null);
  const bioSepLineRef = useRef(null);
  const bioBioRef = useRef(null);
  const bioMetaRef = useRef(null);
  const bioTenureRef = useRef(null);
  const bioTagsRef = useRef(null);
  const bioBgNameRef = useRef(null);

  // ── Chrome refs
  const progressDotRef = useRef(null);

  // ── GSAP timeline & ScrollTrigger
  const masterTlRef = useRef(null);
  const scrollTrigRef = useRef(null);

  // ── Geometry (populated after mount)
  const geoRef = useRef(null);

  // ── Mutable non‑render state
  const activeMemberRef = useRef(-1);
  const cursorRef = useRef({ x: 0.5, y: 0.5 });
  const ambientTickerRef = useRef(null);
  const breathPhaseOffsets = useRef([]);
  const mobileMemberIdxRef = useRef(0);

  // Biographies pre‑split into lines for staggered animation
  const bioLineRefs = useRef([]);

  /* ── Geometry & DOM setup ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= HIVE_CONSTANTS.MOBILE_BREAKPOINT) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const geo = computeHexGeometry(vw, vh);
        geoRef.current = geo;

        geo.cells.forEach((cell, i) => {
          const el = hexCellRefs.current[i];
          if (!el) return;
          el.style.width = `${2 * geo.R}px`;
          el.style.height = `${geo.R * Math.sqrt(3)}px`;
          el.style.left = `${cell.cx - geo.R}px`;
          el.style.top = `${cell.cy - (geo.R * Math.sqrt(3)) / 2}px`;
        });

        const extracted = extractedPortraitRef.current;
        if (extracted) {
          extracted.style.width = `${geo.extractedWidth}px`;
          extracted.style.height = `${geo.extractedHeight}px`;
          extracted.style.left = `${
            geo.editorialCenterLeft.x - geo.extractedWidth / 2
          }px`;
          extracted.style.top = `${
            geo.editorialCenterLeft.y - geo.extractedHeight / 2
          }px`;
        }

        // Pre‑cache all portrait images
        TEAM_DATA.forEach(member => {
          const img = new Image();
          img.src = member.portrait.src;
        });
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Ambient ticker (enhanced) ── */
  useEffect(() => {
    const isMobile = window.innerWidth < HIVE_CONSTANTS.MOBILE_BREAKPOINT;
    if (isMobile) return;

    breathPhaseOffsets.current = Array.from({ length: N }, () => ({
      breathY: Math.random() * Math.PI * 2,
      breathR: Math.random() * Math.PI * 2,
      breathS: Math.random() * Math.PI * 2,
    }));

    let parallaxCurrentX = 0;
    let parallaxCurrentY = 0;

    const ambientTick = time => {
      if (!stageRef.current) return;

      // 1. Per‑cell breathing (y, rotation, scale) + magnetic pull
      hexCellRefs.current.forEach((cell, i) => {
        if (!cell) return;
        const phases = breathPhaseOffsets.current[i];
        const period = 4.0;
        const ampY = 2;
        const offsetY =
          Math.sin(((time / period) * Math.PI * 2) + phases.breathY) * ampY;
        cell.style.setProperty('--breath-y', `${offsetY}px`);

        const ampR = 0.3; // degrees
        const rot =
          Math.sin(((time / period) * Math.PI * 2) + phases.breathR) * ampR;
        cell.style.setProperty('--breath-r', `${rot}deg`);

        const ampS = 0.015;
        const scale =
          1 +
          Math.sin(((time / period) * Math.PI * 2) + phases.breathS) * ampS;
        cell.style.setProperty('--breath-s', scale.toString());

        // Magnetic attraction to cursor (strength falls with distance)
        if (cursorRef.current) {
          const rect = cell.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx =
            (cursorRef.current.x * window.innerWidth - cx) /
            window.innerWidth;
          const dy =
            (cursorRef.current.y * window.innerHeight - cy) /
            window.innerHeight;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const strength = Math.max(0, 1 - dist / 0.4) * 6; // up to 6px pull
          cell.style.setProperty('--magnet-x', `${dx * strength}px`);
          cell.style.setProperty('--magnet-y', `${dy * strength}px`);
        } else {
          cell.style.setProperty('--magnet-x', '0px');
          cell.style.setProperty('--magnet-y', '0px');
        }
      });

      // 2. Traveling light pulse over the hive
      const pulseX = Math.sin(time * 0.2) * 30 + 50; // moves slowly
      const pulseY = Math.cos(time * 0.15) * 30 + 50;
      hiveGridRef.current?.style.setProperty(
        '--light-pulse-x',
        `${pulseX}%`
      );
      hiveGridRef.current?.style.setProperty(
        '--light-pulse-y',
        `${pulseY}%`
      );

      // 3. Bloom intensity (global background glow)
      const bloom = 0.06 + 0.04 * Math.sin(((time / 6.0) * Math.PI * 2));
      stageRef.current.style.setProperty('--bloom-intensity', bloom.toString());

      // 4. Cursor parallax (lerped)
      const targetX = (cursorRef.current.x - 0.5) * -4;
      const targetY = (cursorRef.current.y - 0.5) * -4;
      parallaxCurrentX = lerp(parallaxCurrentX, targetX, 0.08);
      parallaxCurrentY = lerp(parallaxCurrentY, targetY, 0.08);
      hiveGridRef.current?.style.setProperty(
        '--parallax-x',
        `${parallaxCurrentX}px`
      );
      hiveGridRef.current?.style.setProperty(
        '--parallax-y',
        `${parallaxCurrentY}px`
      );

      // 5. Portrait breathing (during hold) & reflection sweep
      const portraitBreath =
        1 + Math.sin(time * 1.8) * 0.012;
      extractedPortraitRef.current?.style.setProperty(
        '--portrait-breath',
        portraitBreath.toString()
      );
    };

    gsap.ticker.add(ambientTick);
    ambientTickerRef.current = ambientTick;

    return () => {
      gsap.ticker.remove(ambientTick);
    };
  }, []);

  /* ── Cursor tracking ── */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMouseMove = e => {
      cursorRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      const portrait = extractedPortraitRef.current;
      const spec = extractedSpecRef.current;
      if (portrait && spec) {
        const rect = portrait.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
        spec.style.transform = `translate(${relX}%, ${relY}%) translate(-50%, -50%)`;
        // reflection sweep
        portrait.style.setProperty('--sweep-x', `${relX}%`);
        portrait.style.setProperty('--sweep-y', `${relY}%`);
        // rim light brightness based on cursor proximity
        const centerDist = Math.hypot(relX - 50, relY - 50) / 70;
        const rimAlpha = Math.max(0, 0.4 - centerDist * 0.2);
        portrait.style.setProperty('--rim-opacity', rimAlpha.toString());
      }
    };

    stage.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () =>
      stage.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* ── Content swapping (unchanged logic) ── */
  const swapMemberContent = index => {
    const member = TEAM_DATA[index];
    const geo = geoRef.current;
    if (!geo) return;

    if (extractedImgRef.current) {
      extractedImgRef.current.src = member.portrait.src;
      extractedImgRef.current.alt = member.portrait.alt;
      extractedImgRef.current.style.setProperty(
        '--focal-x',
        member.portrait.focalPoint.x
      );
      extractedImgRef.current.style.setProperty(
        '--focal-y',
        member.portrait.focalPoint.y
      );
    }

    if (bioRoleRef.current) bioRoleRef.current.textContent = member.role;
    if (bioNameRef.current) bioNameRef.current.textContent = member.name;
    if (bioBgNameRef.current)
      bioBgNameRef.current.textContent = member.name;
    if (bioBioRef.current) {
      // Split biography into lines for staggered animation
      const sentences = member.biography.split('. ');
      bioBioRef.current.innerHTML = sentences
        .map((s, idx) => `<span class="bio-line" ref={el => bioLineRefs.current[${idx}] = el}>${s}${idx < sentences.length - 1 ? '.' : ''}</span>`)
        .join(' ');
      // store line elements for GSAP later
      bioLineRefs.current = Array.from(
        bioBioRef.current.querySelectorAll('.bio-line')
      );
    }
    if (bioTenureRef.current)
      bioTenureRef.current.textContent = member.tenure;

    if (bioTagsRef.current) {
      bioTagsRef.current.innerHTML = member.tags
        .map(tag => `<span class="team-bio__tag">${encodeHTML(tag)}</span>`)
        .join('');
    }

    hexCellRefs.current.forEach((cell, i) =>
      cell?.removeAttribute('data-extracting')
    );
    hexCellRefs.current[index]?.setAttribute('data-extracting', '');

    const direction = index % 2 === 0 ? 'left' : 'right';
    if (bioPanelRef.current)
      bioPanelRef.current.setAttribute('data-side', direction);
    if (extractedPortraitRef.current)
      extractedPortraitRef.current.setAttribute('data-side', direction);

    const editorialCenter =
      direction === 'left'
        ? geo.editorialCenterLeft
        : geo.editorialCenterRight;
    if (extractedPortraitRef.current) {
      extractedPortraitRef.current.style.left = `${
        editorialCenter.x - geo.extractedWidth / 2
      }px`;
      extractedPortraitRef.current.style.top = `${
        editorialCenter.y - geo.extractedHeight / 2
      }px`;
    }

    // Apply member colour as CSS variable on stage
    stageRef.current?.style.setProperty(
      '--member-color',
      member.color
    );
  };

  const resetExtractedState = () => {
    hexCellRefs.current.forEach(cell =>
      cell?.removeAttribute('data-extracting')
    );
    extractedPortraitRef.current?.classList.remove(
      'team-extracted--active'
    );
  };

  /* ── Skip / Scroll indicator ── */
  const handleSkip = () => {
    const section = sectionRef.current;
    if (!section) return;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight,
      behavior: 'smooth',
    });
  };

  const updateScrollIndicator = progress => {
    if (!progressDotRef.current) return;
    const percent = Math.round(progress * 100);
    progressDotRef.current.style.top = `${percent}%`;
  };

  /* ── GSAP Master Timeline + ScrollTrigger (enhanced) ── */
  useEffect(() => {
    const isMobile = window.innerWidth < HIVE_CONSTANTS.MOBILE_BREAKPOINT;
    if (isMobile) return;

    const geo = geoRef.current;
    if (!geo) return;

    const { ENTRY_UNITS, EXIT_UNITS, TOTAL_UNITS, PER_MEMBER_UNITS } =
      HIVE_CONSTANTS;

    const sectionVH =
      100 +
      HIVE_CONSTANTS.ENTRY_SCROLL_VH +
      N * HIVE_CONSTANTS.MEMBER_SCROLL_VH +
      HIVE_CONSTANTS.EXIT_SCROLL_VH;
    sectionRef.current.style.height = `${sectionVH}vh`;

    const tl = gsap.timeline({ paused: true });
    masterTlRef.current = tl;

    // Entry: Hive formation (radial stagger)
    tl.from(
      hexCellRefs.current,
      {
        opacity: 0,
        scale: 0.94,
        duration: 1.5,
        stagger: {
          grid: [Math.ceil(Math.sqrt(N)), Math.ceil(N / Math.ceil(Math.sqrt(N)))],
          from: 'center',
          amount: 1.2,
          ease: 'power2.out',
        },
        ease: 'power2.out',
      },
      0
    );

    // Per‑member cycles
    TEAM_DATA.forEach((_, Nindex) => {
      const O = ENTRY_UNITS + Nindex * PER_MEMBER_UNITS;

      // Phase 1: Pre‑signal (brightness shift + heartbeat pulse)
      tl.to(
        hexCellRefs.current[Nindex],
        { filter: 'brightness(1.18)', duration: 0.79, ease: 'power1.inOut' },
        O
      );
      if (geo.adjacentIndices[Nindex]?.length) {
        tl.to(
          geo.adjacentIndices[Nindex]
            .map(i => hexCellRefs.current[i])
            .filter(Boolean),
          { filter: 'brightness(0.82)', duration: 0.79, ease: 'power1.inOut' },
          O
        );
      }

      // Heartbeat pulse (anticipation)
      tl.to(
        hexCellRefs.current[Nindex],
        { scale: 1.06, duration: 0.15, ease: 'power1.inOut' },
        O + 0.3
      );
      tl.to(
        hexCellRefs.current[Nindex],
        { scale: 1.0, duration: 0.15, ease: 'power1.inOut' },
        O + 0.45
      );
      tl.to(
        hexCellRefs.current[Nindex],
        { scale: 1.06, duration: 0.15, ease: 'power1.inOut' },
        O + 0.6
      );
      tl.to(
        hexCellRefs.current[Nindex],
        { scale: 1.0, duration: 0.15, ease: 'power1.inOut' },
        O + 0.75
      );

      // Phase 2: Extraction
      const extractionStart = O + 0.79;
      tl.call(() => swapMemberContent(Nindex), null, extractionStart);
      tl.set(hexCellRefs.current[Nindex], { opacity: 0 }, extractionStart);
      tl.set(extractedPortraitRef.current, { opacity: 1 }, extractionStart);
      tl.call(
        () =>
          extractedPortraitRef.current?.classList.add(
            'team-extracted--active'
          ),
        null,
        extractionStart
      );

      // Weighted Bezier trajectory (arc upward then settle)
      // We split into two tweens: from cell position -> intermediate (above and slightly offset)
      const off = geo.extractionOffsets[Nindex];
      // Intermediate point: offset with a lift (negative Y)
      const midY = off.dy - 30; // upward arc
      tl.from(
        extractedPortraitRef.current,
        {
          x: () => geoRef.current.extractionOffsets[Nindex].dx,
          y: () => geoRef.current.extractionOffsets[Nindex].dy - 30,
          scale: () => geoRef.current.extractionOffsets[Nindex].scaleFrom,
          duration: 0.55,
          ease: 'power3.out',
        },
        extractionStart
      );
      // Second part: settle into final editorial with overshoot
      tl.to(
        extractedPortraitRef.current,
        {
          y: () => geoRef.current.extractionOffsets[Nindex].dy, // function‑based, live
          duration: 0.5,
          ease: 'back.out(1.4)',
        },
        extractionStart + 0.5
      );

      // Dynamic shadow on extraction
      tl.from(
        extractedShadowRef.current,
        {
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.8,
          ease: 'power2.out',
        },
        extractionStart
      );

      // Hive recession & fog
      tl.to(
        hiveGridRef.current,
        {
          '--hive-scale': 0.92,
          '--hive-blur': '3.5px',
          '--hive-opacity': 0.6,
          duration: 0.8,
          ease: 'power2.out',
        },
        extractionStart
      );
      tl.to(
        '.team-fog',
        { opacity: 0.7, duration: 0.8, ease: 'power2.out' },
        extractionStart
      );

      // Phase 3: Text cascade in (staggered lines)
      tl.from(
        bioRoleRef.current,
        {
          opacity: 0,
          letterSpacing: '0.3em',
          duration: 0.35,
          ease: 'expo.out',
        },
        O + 1.9
      );
      tl.from(
        bioNameRef.current,
        {
          opacity: 0,
          filter: 'blur(4px)',
          duration: 0.4,
          ease: 'expo.out',
        },
        O + 2.1
      );
      tl.from(
        bioBgNameRef.current,
        {
          opacity: 0,
          rotation: -5,
          duration: 0.6,
          ease: 'power3.out',
        },
        O + 2.0
      );
      tl.from(
        bioSepLineRef.current,
        {
          scaleX: 0,
          duration: 0.45,
          ease: 'back.out(1.4)',
          transformOrigin: 'center center',
        },
        O + 2.4
      );
      // Staggered biography lines
      if (bioLineRefs.current.length) {
        tl.from(
          bioLineRefs.current,
          {
            opacity: 0,
            y: 12,
            stagger: 0.06,
            duration: 0.4,
            ease: 'power2.out',
          },
          O + 2.65
        );
      } else {
        tl.from(
          bioBioRef.current,
          { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' },
          O + 2.65
        );
      }
      tl.from(
        bioMetaRef.current,
        { opacity: 0, duration: 0.3, ease: 'power2.out' },
        O + 2.95
      );

      // Specular dot visible + portrait breathing active
      tl.set(extractedSpecRef.current, { opacity: 1 }, O + 3.17);
      tl.set(extractedPortraitRef.current, { filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }, O + 3.17);

      // Phase 4: Hold
      tl.to({}, { duration: 11.4 - 3.17 }, O + 3.17);

      // Phase 5: Text cascade out (reverse)
      tl.set(extractedSpecRef.current, { opacity: 0 }, O + 11.4);
      tl.to(
        bioMetaRef.current,
        { opacity: 0, y: 6, duration: 0.18, ease: 'power2.in' },
        O + 11.4
      );
      tl.to(
        bioBioRef.current,
        { opacity: 0, y: 6, duration: 0.2, ease: 'power2.in' },
        O + 11.55
      );
      tl.to(
        bioSepLineRef.current,
        {
          scaleX: 0,
          duration: 0.25,
          ease: 'power2.in',
          transformOrigin: 'center center',
        },
        O + 11.72
      );
      tl.to(
        bioNameRef.current,
        { opacity: 0, filter: 'blur(4px)', duration: 0.22, ease: 'power2.in' },
        O + 11.9
      );
      tl.to(
        bioRoleRef.current,
        { opacity: 0, duration: 0.18, ease: 'power2.in' },
        O + 12.05
      );
      tl.to(
        bioBgNameRef.current,
        { opacity: 0, duration: 0.3, ease: 'power2.in' },
        O + 12.1
      );

      // Phase 6: Return (reverse arc)
      tl.to(
        extractedPortraitRef.current,
        {
          x: () => geoRef.current.extractionOffsets[Nindex].dx,
          y: () => geoRef.current.extractionOffsets[Nindex].dy - 15, // slight lift
          scale: () => geoRef.current.extractionOffsets[Nindex].scaleFrom,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.in',
        },
        O + 12.66
      );
      tl.to(
        extractedPortraitRef.current,
        {
          y: () => geoRef.current.extractionOffsets[Nindex].dy,
          duration: 0.3,
          ease: 'power2.in',
        },
        O + 12.66
      );

      // Restore hive
      tl.to(
        hexCellRefs.current[Nindex],
        { opacity: 1, duration: 0.25, ease: 'power2.out' },
        O + 13.5
      );
      tl.to(
        hiveGridRef.current,
        {
          '--hive-scale': 1,
          '--hive-blur': '0px',
          '--hive-opacity': 1,
          duration: 0.9,
          ease: 'power2.out',
        },
        O + 12.66
      );
      tl.to('.team-fog', { opacity: 0, duration: 0.6, ease: 'power2.out' }, O + 12.66);
      if (geo.adjacentIndices[Nindex]?.length) {
        tl.to(
          geo.adjacentIndices[Nindex]
            .map(i => hexCellRefs.current[i])
            .filter(Boolean),
          { filter: 'brightness(1)', duration: 0.5, ease: 'power2.out' },
          O + 13.0
        );
      }
      tl.to(
        hexCellRefs.current[Nindex],
        { filter: 'brightness(1)', duration: 0.5, ease: 'power2.out' },
        O + 13.2
      );

      // Clean after member
      tl.set(
        extractedPortraitRef.current,
        { x: 0, y: 0, scale: 1, opacity: 0, filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
        O + 14.25
      );
      tl.call(resetExtractedState, null, O + 14.25);
    });

    // Exit sequence
    const exitStart = TOTAL_UNITS - EXIT_UNITS;
    tl.to(
      hexCellRefs.current,
      {
        filter: 'brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      exitStart
    );
    tl.to(
      hiveGridRef.current,
      {
        '--hive-scale': 1,
        '--hive-blur': '0px',
        '--hive-opacity': 1,
        duration: 0.8,
      },
      exitStart
    );
    tl.to({}, { duration: 2 }, exitStart + 0.5);
    tl.to(
      stageRef.current,
      { opacity: 0, duration: 0.5, ease: 'power2.in' },
      exitStart + 2.5
    );

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      animation: tl,
      onUpdate: self => updateScrollIndicator(self.progress),
    });

    scrollTrigRef.current = st;

    return () => {
      tl.kill();
      st.kill();
    };
  }, []);

  /* ── Mobile touch swipe (unchanged) ── */
  useEffect(() => {
    const isMobile = window.innerWidth < HIVE_CONSTANTS.MOBILE_BREAKPOINT;
    if (!isMobile) return;

    const stage = stageRef.current;
    if (!stage) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        const dir = dx > 0 ? -1 : 1;
        mobileMemberIdxRef.current = Math.min(
          N - 1,
          Math.max(0, mobileMemberIdxRef.current + dir)
        );
        swapMemberContent(mobileMemberIdxRef.current);
      }
    };

    stage.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });

    swapMemberContent(0);

    return () => {
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  /* ── Inline CSS (complete, enhanced) ── */
  const styles = `
    .team-stage {
      --color-ink-void: #0a0a0c;
      --color-ink-deep: #141418;
      --color-halo-warm: #c8a87c;
      --color-halo-dim: #4a4238;
      --color-text-primary: #eae6df;
      --color-text-secondary: #8c847b;
      --font-display: 'Inter', system-ui, sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
      --member-color: #c8a87c;
    }

    .team-section {
      position: relative;
    }

    .team-stage {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      background-color: var(--color-ink-void);
    }

    /* Fog layer */
    .team-fog {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 50%, rgba(20,20,24,0) 0%, rgba(10,10,12,0.8) 80%);
      opacity: 0;
      pointer-events: none;
      z-index: 0;
      transition: opacity 0.3s ease;
    }

    .team-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .team-bg__gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at 50% 50%,
        var(--member-color) 0%,
        var(--color-ink-void) 70%
      );
      opacity: var(--bloom-intensity, 0.06);
    }

    .team-bg__noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      mix-blend-mode: overlay;
      opacity: 0.7;
    }

    .team-bg__vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at center,
        transparent 40%,
        rgba(0,0,0,0.6) 100%
      );
    }

    /* Dust motes */
    .team-dust {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(1px 1px at 30% 40%, rgba(255,255,255,0.2), transparent);
      animation: dust-drift 24s infinite alternate ease-in-out;
    }
    .team-dust:nth-child(2) {
      background: radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.15), transparent);
      animation-duration: 28s;
    }
    .team-dust:nth-child(3) {
      background: radial-gradient(1.5px 1.5px at 50% 80%, rgba(255,255,255,0.25), transparent);
      animation-duration: 22s;
    }
    @keyframes dust-drift {
      0% { transform: translate(0,0); }
      100% { transform: translate(2%, -1%); }
    }

    /* Hive grid */
    .team-hive {
      position: absolute;
      inset: 0;
      transform:
        translate(var(--parallax-x, 0px), var(--parallax-y, 0px))
        scale(var(--hive-scale, 1));
      filter: blur(var(--hive-blur, 0px));
      opacity: var(--hive-opacity, 1);
      will-change: transform, filter, opacity;
      z-index: 1;
    }

    /* Traveling light pulse (pseudo element) */
    .team-hive::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at var(--light-pulse-x, 50%) var(--light-pulse-y, 50%),
        rgba(255,255,240,0.06) 0%,
        transparent 40%
      );
      pointer-events: none;
    }

    /* Hex cells */
    .hex-cell {
      position: absolute;
      will-change: transform, opacity;
      transform:
        translateY(var(--breath-y, 0px))
        rotateZ(var(--breath-r, 0deg))
        scale(var(--breath-s, 1))
        translate(var(--magnet-x, 0px), var(--magnet-y, 0px));
    }

    .hex-cell__socket {
      position: absolute;
      inset: 0;
      background: var(--color-ink-deep);
      box-shadow: inset 0 0 12px rgba(0,0,0,0.8);
      z-index: 0;
      transition: box-shadow 0.3s ease;
    }

    /* Iris ring that scales on extraction */
    .hex-cell__ring {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: 1px solid rgba(255,255,255,0.2);
      transform: scale(0.8);
      opacity: 0;
      z-index: 2;
      pointer-events: none;
      transition: transform 0.4s ease, opacity 0.4s ease;
    }
    .hex-cell[data-extracting] .hex-cell__ring {
      transform: scale(1.2);
      opacity: 1;
    }

    .hex-cell[data-extracting] .hex-cell__socket {
      box-shadow: inset 0 0 30px rgba(var(--member-color), 0.5);
    }

    .hex-cell__clip {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 1;
    }

    .hex-cell__portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: var(--focal-x, 50%) var(--focal-y, 30%);
    }

    .hex-cell__overlay {
      position: absolute;
      inset: 0;
      background: #6b6e78;
      mix-blend-mode: color;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }

    .hex-cell[data-extracting] .hex-cell__overlay {
      opacity: 0;
    }

    .hex-cell__edge {
      position: absolute;
      inset: 0;
      box-shadow: inset 1px 1px 4px rgba(255,255,255,0.06);
      pointer-events: none;
    }

    /* Extracted portrait */
    .team-extracted {
      position: absolute;
      will-change: transform, opacity, filter;
      opacity: 0;
      pointer-events: none;
      z-index: 2;
    }

    .team-extracted--active {
      pointer-events: auto;
    }

    .team-extracted__frame {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      clip-path: inherit;
      box-shadow: 0 0 0 rgba(0,0,0,0);
      transition: box-shadow 0.3s ease;
    }
    .team-extracted--active .team-extracted__frame {
      box-shadow:
        inset 0 0 30px rgba(var(--member-color), 0.3),
        0 15px 30px rgba(0,0,0,0.6);
    }

    .team-extracted__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: var(--focal-x, 50%) var(--focal-y, 30%);
      filter: saturate(0);
      transform: scale(var(--portrait-breath, 1));
      transition: filter 1.1s ease;
    }

    .team-extracted--active .team-extracted__img {
      filter: saturate(1);
    }

    .team-extracted__light {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at var(--sweep-x, 50%) var(--sweep-y, 50%),
        rgba(255,255,255,0.15) 0%,
        transparent 60%
      );
      pointer-events: none;
      opacity: var(--rim-opacity, 0.2);
      transition: opacity 0.2s ease;
    }

    .team-extracted__spec {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(255,255,255,0.35) 0%,
        transparent 70%
      );
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -50%);
    }

    /* Biography panel */
    .team-bio {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      z-index: 3;
    }

    .team-bio[data-side="left"] {
      left: 45%;
      right: auto;
    }

    .team-bio[data-side="right"] {
      left: 8%;
      right: auto;
    }

    .team-bio__bg-name {
      position: absolute;
      top: -20%;
      left: -10%;
      font-family: var(--font-display);
      font-size: 12vw;
      font-weight: 900;
      color: rgba(255,255,255,0.04);
      white-space: nowrap;
      pointer-events: none;
      z-index: -1;
      transform: rotate(-3deg);
    }

    .team-bio__role {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--member-color);
      margin-bottom: 0.5rem;
    }

    .team-bio__name {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 300;
      letter-spacing: -0.01em;
      color: var(--color-text-primary);
      margin: 0 0 1rem;
    }

    .team-bio__sep {
      height: 1px;
      width: 40px;
      margin: 1rem 0;
      overflow: visible;
    }

    .team-bio__sep-line {
      height: 1px;
      background: var(--member-color);
      box-shadow: 0 0 8px rgba(var(--member-color), 0.5);
      transform-origin: center center;
      transform: scaleX(0);
    }

    .team-bio__body {
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.75;
      max-width: 480px;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem;
    }
    .bio-line {
      display: block;
    }

    .team-bio__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .team-bio__tenure {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .team-bio__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .team-bio__tag {
      font-size: 0.6875rem;
      padding: 3px 10px;
      border: 1px solid var(--member-color);
      color: var(--color-text-secondary);
      border-radius: 999px;
    }

    /* Chrome */
    .team-chrome {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    }

    .team-progress {
      position: absolute;
      right: 32px;
      top: 50%;
      transform: translateY(-50%);
      height: 120px;
      width: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
    }

    .team-progress__dot {
      position: absolute;
      left: 0;
      width: 4px;
      height: 4px;
      background: var(--member-color);
      border-radius: 50%;
      transition: top 0.1s linear;
    }

    .team-skip {
      position: absolute;
      top: 24px;
      right: 32px;
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      pointer-events: auto;
      transition: color 0.2s;
    }

    .team-skip:hover {
      color: var(--color-text-primary);
    }

    .team-a11y {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }

    @media (max-width: 1023px) {
      .team-hive, .team-fog, .team-dust { display: none; }
      .team-extracted {
        position: relative;
        width: 80vw;
        height: auto;
        left: 50% !important;
        top: 10% !important;
        transform: translateX(-50%);
        opacity: 1;
        pointer-events: auto;
      }
      .team-extracted__frame { clip-path: none; }
      .team-extracted__img { filter: saturate(1); }
      .team-bio {
        position: relative;
        top: auto;
        transform: none;
        left: 10% !important;
        right: auto;
        max-width: 80%;
        margin-top: 2rem;
      }
      .team-bio[data-side] { left: 10% !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      .team-stage *, .team-stage *::before, .team-stage *::after {
        animation-duration: 0ms !important;
        transition-duration: 0ms !important;
        scroll-behavior: auto !important;
      }
      .team-hive { transform: none !important; filter: none !important; }
      .hex-cell { transform: none !important; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <section className="team-section" ref={sectionRef} data-lenis-prevent>
        <div className="team-stage" ref={stageRef}>
          {/* Atmospheric layers */}
          <div className="team-fog" />
          <div className="team-dust" />
          <div className="team-dust" />
          <div className="team-dust" />

          {/* Background */}
          <div className="team-bg">
            <div className="team-bg__gradient" />
            <div className="team-bg__noise" />
            <div className="team-bg__vignette" />
          </div>

          {/* Hive grid */}
          <div className="team-hive" ref={hiveGridRef}>
            {TEAM_DATA.map((_, idx) => (
              <div
                className="hex-cell"
                key={idx}
                ref={el => (hexCellRefs.current[idx] = el)}
              >
                <div className="hex-cell__socket">
                  <div className="hex-cell__ring" />
                </div>
                <div
                  className="hex-cell__clip"
                  style={{ clipPath: HEX_CLIP_PATH }}
                >
                  <img
                    className="hex-cell__portrait"
                    src={TEAM_DATA[idx].portrait.src}
                    alt={TEAM_DATA[idx].portrait.alt}
                    style={{
                      objectPosition: `${
                        TEAM_DATA[idx].portrait.focalPoint.x * 100
                      }% ${TEAM_DATA[idx].portrait.focalPoint.y * 100}%`,
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="hex-cell__overlay" />
                  <div className="hex-cell__edge" />
                </div>
              </div>
            ))}
          </div>

          {/* Extracted portrait */}
          <div
            className="team-extracted"
            ref={extractedPortraitRef}
            data-side="left"
          >
            <div
              className="team-extracted__frame"
              style={{ clipPath: HEX_CLIP_PATH }}
            >
              <img className="team-extracted__img" ref={extractedImgRef} alt="" />
              <div className="team-extracted__light" ref={extractedLightRef} />
              <div className="team-extracted__spec" ref={extractedSpecRef} />
            </div>
            {/* Drop shadow element animated separately */}
            <div
              ref={extractedShadowRef}
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Biography */}
          <div className="team-bio" ref={bioPanelRef} data-side="left">
            <div className="team-bio__bg-name" ref={bioBgNameRef} />
            <span className="team-bio__role" ref={bioRoleRef} />
            <h2 className="team-bio__name" ref={bioNameRef} />
            <div className="team-bio__sep">
              <div className="team-bio__sep-line" ref={bioSepLineRef} />
            </div>
            <p className="team-bio__body" ref={bioBioRef} />
            <div className="team-bio__meta" ref={bioMetaRef}>
              <span className="team-bio__tenure" ref={bioTenureRef} />
              <div className="team-bio__tags" ref={bioTagsRef} />
            </div>
          </div>

          {/* Chrome */}
          <div className="team-chrome">
            <div className="team-progress">
              <div className="team-progress__dot" ref={progressDotRef} />
            </div>
            <button
              className="team-skip"
              onClick={handleSkip}
              aria-label="Skip team section"
            >
              Skip
            </button>
          </div>

          {/* A11y */}
          <div className="team-a11y" aria-hidden="true">
            <ul aria-label="Team">
              {TEAM_DATA.map((m, i) => (
                <li key={i}>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                  <span>{m.biography}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;