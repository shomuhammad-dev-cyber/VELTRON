// ==============================================================================
// VELTRON 3D AUDEMARS PIGUET ROYAL OAK TOURBILLON HOROLOGY ENGINE (THREE.JS WEBGL)
// 18k Rose Gold Octagonal Bezel with 8 Hexagonal Screws & Bleue Nuit Tapisserie Dial
// Real-time Oscillating Flying Tourbillon at 6 o'clock & Integrated Rose Gold Bracelet
// ==============================================================================

'use client';

import React, { useEffect, useRef } from 'react';
import * as _THREE from 'three';
const THREE: any = _THREE;

export interface CinematicWorldProps {
  scrollProgress: number; // 0.0 to 1.0
  className?: string;
}

/**
 * Procedurally renders the iconic Audemars Piguet "Petite Tapisserie" Navy Blue Waffle Dial
 * in high-resolution 2048x2048 canvas texture with white gold hour batons and open tourbillon ring
 */
function createRoyalOakDialCanvas(): HTMLCanvasElement {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size / 2;
  const R = 940;

  // 1. Base Navy Blue / Royal Blue Dial Color
  const baseGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, R);
  baseGrad.addColorStop(0, '#1c3154');
  baseGrad.addColorStop(0.5, '#13243f');
  baseGrad.addColorStop(0.85, '#0b1627');
  baseGrad.addColorStop(1, '#060d18');
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // 2. ICONIC "PETITE TAPISSERIE" WAFFLE GRID PATTERN (Square Pyramids)
  const tileSize = 42;
  const gap = 6;
  const cols = Math.ceil((R * 2) / (tileSize + gap));
  const startX = cx - R;
  const startY = cy - R;

  ctx.save();
  // Clip inside circular dial
  ctx.beginPath();
  ctx.arc(cx, cy, R - 15, 0, Math.PI * 2);
  ctx.clip();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      const tx = startX + i * (tileSize + gap);
      const ty = startY + j * (tileSize + gap);
      const distFromCenter = Math.hypot(tx + tileSize / 2 - cx, ty + tileSize / 2 - cy);

      if (distFromCenter < R - 20) {
        // Tile Base
        ctx.fillStyle = '#172c4c';
        ctx.fillRect(tx, ty, tileSize, tileSize);

        // Top & Left Highlight (Illuminated 3D facet)
        ctx.fillStyle = '#26487a';
        ctx.beginPath();
        ctx.moveTo(tx, ty + tileSize);
        ctx.lineTo(tx, ty);
        ctx.lineTo(tx + tileSize, ty);
        ctx.lineTo(tx + tileSize - 8, ty + 8);
        ctx.lineTo(tx + 8, ty + 8);
        ctx.lineTo(tx + 8, ty + tileSize - 8);
        ctx.closePath();
        ctx.fill();

        // Bottom & Right Shadow (Depressed 3D facet)
        ctx.fillStyle = '#0a1424';
        ctx.beginPath();
        ctx.moveTo(tx + tileSize, ty);
        ctx.lineTo(tx + tileSize, ty + tileSize);
        ctx.lineTo(tx, ty + tileSize);
        ctx.lineTo(tx + 8, ty + tileSize - 8);
        ctx.lineTo(tx + tileSize - 8, ty + tileSize - 8);
        ctx.lineTo(tx + tileSize - 8, ty + 8);
        ctx.closePath();
        ctx.fill();

        // Center Square Apex
        ctx.fillStyle = '#1a3358';
        ctx.fillRect(tx + 8, ty + 8, tileSize - 16, tileSize - 16);
      }
    }
  }
  ctx.restore();

  // 3. Outer Rose Gold Chapter Ring & Minute Track
  ctx.strokeStyle = '#D99B79';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, R - 25, 0, Math.PI * 2);
  ctx.stroke();

  // 60-Minute precision tick marks
  for (let m = 0; m < 60; m++) {
    const angle = (m / 60) * Math.PI * 2 - Math.PI / 2;
    const isHour = m % 5 === 0;
    const tickLen = isHour ? 30 : 16;
    const rOuter = R - 28;
    const rInner = rOuter - tickLen;

    ctx.strokeStyle = isHour ? '#E8B69A' : 'rgba(217, 155, 121, 0.55)';
    ctx.lineWidth = isHour ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
    ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
    ctx.stroke();
  }

  // 4. APPLIED 18K ROSE GOLD BATON HOUR MARKERS (with white luminescent center)
  for (let h = 1; h <= 12; h++) {
    // 6 o'clock is reserved for the large Open Tourbillon
    if (h === 6) continue;

    const angle = (h / 12) * Math.PI * 2 - Math.PI / 2;
    const dist = R - 130;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    const isTwelve = h === 12;
    const bw = isTwelve ? 22 : 32;
    const bh = 110;

    if (isTwelve) {
      // Iconic Royal Oak Double Baton at 12 o'clock
      [-16, 16].forEach((offset) => {
        ctx.fillStyle = '#E2A782';
        ctx.beginPath();
        ctx.roundRect(offset - bw / 2, -bh / 2, bw, bh, 5);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(offset - bw / 2 + 4, -bh / 2 + 5, bw - 8, bh - 10, 3);
        ctx.fill();
      });
    } else {
      // Single Rose Gold Baton Marker
      ctx.fillStyle = '#E2A782';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6);
      ctx.fill();

      // White Luminescent Center Strip
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-bw / 2 + 5, -bh / 2 + 6, bw - 10, bh - 12, 4);
      ctx.fill();
    }

    ctx.restore();
  }

  // 5. OFFICIAL BRAND INSCRIPTION ("AUDEMARS PIGUET" below 12 o'clock)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // White Clean Raised Print matching the exact photo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 54px "Times New Roman", Georgia, serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 8;
  ctx.letterSpacing = '8px';
  ctx.fillText('AUDEMARS PIGUET', cx, cy - 380);

  ctx.restore();

  // 6. LARGE CIRCULAR TOURBILLON CAVITY APERTURE AT 6 O'CLOCK
  const tourbillonY = cy + 390;
  const tourbillonRadius = 320;

  ctx.save();
  // Cutout dark aperture
  ctx.beginPath();
  ctx.arc(cx, tourbillonY, tourbillonRadius, 0, Math.PI * 2);
  const cavGrad = ctx.createRadialGradient(cx, tourbillonY, 40, cx, tourbillonY, tourbillonRadius);
  cavGrad.addColorStop(0, '#0c1018');
  cavGrad.addColorStop(0.75, '#04070a');
  cavGrad.addColorStop(1, '#1a120c');
  ctx.fillStyle = cavGrad;
  ctx.fill();

  // Rose Gold Beveled Aperture Frame Ring
  ctx.strokeStyle = '#E2A782';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, tourbillonY, tourbillonRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Internal Graduation Ring for Seconds Telemetry
  ctx.strokeStyle = 'rgba(217, 155, 121, 0.5)';
  ctx.lineWidth = 2;
  for (let s = 0; s < 60; s++) {
    const sAngle = (s / 60) * Math.PI * 2;
    const isMajorSec = s % 5 === 0;
    const sLen = isMajorSec ? 16 : 8;
    const sOuter = tourbillonRadius - 8;
    const sInner = sOuter - sLen;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(sAngle) * sInner, tourbillonY + Math.sin(sAngle) * sInner);
    ctx.lineTo(cx + Math.cos(sAngle) * sOuter, tourbillonY + Math.sin(sAngle) * sOuter);
    ctx.stroke();
  }

  ctx.restore();

  // 7. "SWISS MADE" below the Tourbillon at 6 o'clock
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SWISS   MADE', cx, cy + R - 45);

  return canvas;
}

export function CinematicWorld({ scrollProgress = 0, className }: CinematicWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Perspective Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090c, isMobile ? 0.05 : 0.035);

    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.6);

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 2. High-Horology Studio Lighting (Warm Rose Gold & Specular Reflections)
    const ambientLight = new THREE.AmbientLight(0x0b1019, 2.8);
    scene.add(ambientLight);

    // 18k Rose Gold Key Light (Top-Right Warm Champagne)
    const roseGoldKeyLight = new THREE.PointLight(0xffecd6, 55, 32);
    roseGoldKeyLight.position.set(4.5, 5.0, 5.5);
    scene.add(roseGoldKeyLight);

    // Polished Octagon Bevel Rim Light (Left)
    const bevelRimLight = new THREE.PointLight(0xd99b79, 45, 28);
    bevelRimLight.position.set(-5.0, -3.5, 4.5);
    scene.add(bevelRimLight);

    // Tourbillon Ruby Core Glint
    const tourbillonRubyLight = new THREE.PointLight(0xe0115f, 25, 8);
    tourbillonRubyLight.position.set(0, -0.9, 1.2);
    scene.add(tourbillonRubyLight);

    // 3. Ambient Stardust Particle Field
    const particleCount = prefersReducedMotion ? 200 : isMobile ? 350 : 800;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cRoseGold = new THREE.Color(0xd99b79);
    const cBlue = new THREE.Color(0x3a6096);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 26;

      const r = Math.random();
      const c = r < 0.65 ? cRoseGold : r < 0.85 ? cBlue : cWhite;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(particleGeo, particleMat);
    scene.add(starField);

    // -------------------------------------------------------------------------
    // 4. THE AUDEMARS PIGUET ROYAL OAK TOURBILLON 3D OBJECT
    // -------------------------------------------------------------------------
    const royalOakMaster = new THREE.Group();

    // 18k Rose Gold Materials (Vertical Brushed Finish & Mirror Polished Bevels)
    const roseGoldBrushedMat = new THREE.MeshStandardMaterial({
      color: 0xd99b79,
      metalness: 0.94,
      roughness: 0.22,
      emissive: 0x2e180d,
      emissiveIntensity: 0.25,
    });

    const roseGoldPolishedMat = new THREE.MeshStandardMaterial({
      color: 0xf0b899,
      metalness: 0.98,
      roughness: 0.12,
    });

    const steelScrewMat = new THREE.MeshStandardMaterial({
      color: 0xf5f7fb,
      metalness: 0.96,
      roughness: 0.1,
    });

    const tourbillonGoldMat = new THREE.MeshStandardMaterial({
      color: 0xe5c158,
      metalness: 0.95,
      roughness: 0.18,
    });

    const syntheticRubyMat = new THREE.MeshStandardMaterial({
      color: 0xe0115f,
      emissive: 0x990033,
      emissiveIntensity: 1.4,
      metalness: 0.1,
      roughness: 0.1,
    });

    // A. Navy Blue Tapisserie Dial
    const dialCanvas = createRoyalOakDialCanvas();
    const dialTexture = new THREE.CanvasTexture(dialCanvas);
    dialTexture.anisotropy = 16;
    dialTexture.generateMipmaps = true;

    const dialGeo = new THREE.CircleGeometry(2.28, 64);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.25,
      metalness: 0.65,
    });
    const royalOakDial = new THREE.Mesh(dialGeo, dialMat);
    royalOakDial.position.z = 0.02;
    royalOakMaster.add(royalOakDial);

    // B. ICONIC 8-SIDED OCTAGONAL ROSE GOLD BEZEL
    // Builds an authentic 8-sided regular octagon bezel matching the Royal Oak geometry
    const octagonOuterRadius = 3.02;
    const octagonInnerRadius = 2.27;

    const bezelShape = new THREE.Shape();
    // 8 Outer Vertices
    for (let i = 0; i < 8; i++) {
      const theta = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(theta) * octagonOuterRadius;
      const y = Math.sin(theta) * octagonOuterRadius;
      if (i === 0) bezelShape.moveTo(x, y);
      else bezelShape.lineTo(x, y);
    }
    bezelShape.closePath();

    // Inner Circular Hole
    const bezelHole = new THREE.Path();
    bezelHole.absarc(0, 0, octagonInnerRadius, 0, Math.PI * 2, true);
    bezelShape.holes.push(bezelHole);

    const bezelExtrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.06,
    };
    const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, bezelExtrudeSettings);
    const octagonalBezel = new THREE.Mesh(bezelGeo, roseGoldBrushedMat);
    octagonalBezel.position.z = -0.04;
    royalOakMaster.add(octagonalBezel);

    // C. 8 HEXAGONAL SCREWS (The unmistakable Royal Oak Signature)
    // Sunk into each of the 8 corners of the octagonal bezel, with slot tangentially aligned
    const screwDistance = 2.62;
    const screwGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 6);
    const slotGeo = new THREE.BoxGeometry(0.025, 0.18, 0.09);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const sx = Math.cos(angle) * screwDistance;
      const sy = Math.sin(angle) * screwDistance;

      const screwGroup = new THREE.Group();
      const screwHead = new THREE.Mesh(screwGeo, steelScrewMat);
      screwHead.rotation.x = Math.PI / 2;
      screwGroup.add(screwHead);

      // Dark slot cut across screw face
      const slot = new THREE.Mesh(slotGeo, new THREE.MeshBasicMaterial({ color: 0x111317 }));
      slot.position.z = 0.042;
      screwGroup.add(slot);

      // Royal Oak screws have their slots aligned tangentially along the bezel curve
      screwGroup.rotation.z = angle + Math.PI / 2;
      screwGroup.position.set(sx, sy, 0.22);
      royalOakMaster.add(screwGroup);
    }

    // D. 18k Rose Gold Case Middle & Angular Lugs
    const caseMiddleGeo = new THREE.BoxGeometry(4.35, 4.35, 0.42);
    const caseMiddle = new THREE.Mesh(caseMiddleGeo, roseGoldBrushedMat);
    caseMiddle.position.z = -0.25;
    royalOakMaster.add(caseMiddle);

    // E. INTEGRATED ROYAL OAK ROSE GOLD BRACELET (Top & Bottom Links)
    const createBraceletSegment = (yPos: number, isTop: boolean) => {
      const bGroup = new THREE.Group();
      const link1Geo = new THREE.BoxGeometry(3.6, 0.65, 0.32);
      const link1 = new THREE.Mesh(link1Geo, roseGoldBrushedMat);
      bGroup.add(link1);

      // Intermediate Plots (Two vertical connecting blocks between links)
      [-0.85, 0.85].forEach((px) => {
        const plot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 0.34), roseGoldPolishedMat);
        plot.position.set(px, 0, 0.01);
        bGroup.add(plot);
      });

      // Second Tapered Link
      const link2Geo = new THREE.BoxGeometry(3.2, 0.65, 0.3);
      const link2 = new THREE.Mesh(link2Geo, roseGoldBrushedMat);
      link2.position.y = isTop ? 0.75 : -0.75;
      bGroup.add(link2);

      // Third Link
      const link3Geo = new THREE.BoxGeometry(2.9, 0.65, 0.28);
      const link3 = new THREE.Mesh(link3Geo, roseGoldBrushedMat);
      link3.position.y = isTop ? 1.5 : -1.5;
      bGroup.add(link3);

      bGroup.position.set(0, yPos, -0.22);
      return bGroup;
    };

    royalOakMaster.add(createBraceletSegment(2.85, true));
    royalOakMaster.add(createBraceletSegment(-2.85, false));

    // F. HEXAGONAL WINDING CROWN AT 3 O'CLOCK
    const crownGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 6);
    const crown = new THREE.Mesh(crownGeo, roseGoldBrushedMat);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(3.4, 0, -0.05);
    royalOakMaster.add(crown);

    // G. REAL-TIME OSCILLATING FLYING TOURBILLON AT 6 O'CLOCK
    // Placed exactly inside the 6 o'clock circular dial opening
    const tourbillonAssembly = new THREE.Group();
    tourbillonAssembly.position.set(0, -0.9, 0.08);

    // 1. Gold Balance Wheel with Perimeter Balance Screws
    const balanceRimGeo = new THREE.TorusGeometry(0.55, 0.035, 12, 32);
    const balanceRim = new THREE.Mesh(balanceRimGeo, tourbillonGoldMat);
    tourbillonAssembly.add(balanceRim);

    // Balance Rim Inertia Screws
    for (let s = 0; s < 4; s++) {
      const sAngle = (s / 4) * Math.PI * 2;
      const bScrew = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.06), roseGoldPolishedMat);
      bScrew.position.set(Math.cos(sAngle) * 0.56, Math.sin(sAngle) * 0.56, 0);
      tourbillonAssembly.add(bScrew);
    }

    // 2. Three-Spoke Tourbillon Bridge (Iconic Steel Finish)
    const bridgeGroup = new THREE.Group();
    for (let b = 0; b < 3; b++) {
      const bRad = (b / 3) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.06, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xf0f3f8, metalness: 0.95, roughness: 0.15 })
      );
      spoke.position.set(Math.cos(bRad) * 0.26, Math.sin(bRad) * 0.26, 0.04);
      spoke.rotation.z = bRad;
      bridgeGroup.add(spoke);
    }

    // 3. Central Synthetic Ruby Jewel Bearing (Magenta/Purple Pivot)
    const rubyJewel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16), syntheticRubyMat);
    rubyJewel.rotation.x = Math.PI / 2;
    rubyJewel.position.z = 0.05;
    bridgeGroup.add(rubyJewel);

    // Rose gold bezel setting around ruby
    const rubyGoldCollet = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.14, 16), tourbillonGoldMat);
    rubyGoldCollet.position.z = 0.06;
    bridgeGroup.add(rubyGoldCollet);

    tourbillonAssembly.add(bridgeGroup);
    royalOakMaster.add(tourbillonAssembly);

    // H. ROYAL OAK ROSE GOLD HANDS (Hour and Minute with White Luminous Insert)
    // 1. Royal Oak Hour Hand
    const hourHandGroup = new THREE.Group();
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.3, 0.05), roseGoldPolishedMat);
    hourHand.position.y = 0.65;
    hourHandGroup.add(hourHand);

    const hourLume = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.95, 0.055),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    hourLume.position.y = 0.65;
    hourHandGroup.add(hourLume);

    hourHandGroup.position.z = 0.12;
    royalOakMaster.add(hourHandGroup);

    // 2. Royal Oak Minute Hand (Longer, sweeping over the Tapisserie waffle)
    const minuteHandGroup = new THREE.Group();
    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.9, 0.05), roseGoldPolishedMat);
    minHand.position.y = 0.95;
    minuteHandGroup.add(minHand);

    const minLume = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.45, 0.055),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    minLume.position.y = 0.95;
    minuteHandGroup.add(minLume);

    minuteHandGroup.position.z = 0.16;
    royalOakMaster.add(minuteHandGroup);

    // 3. Center Rose Gold Cap Pivot
    const centerPin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24), roseGoldPolishedMat);
    centerPin.rotation.x = Math.PI / 2;
    centerPin.position.z = 0.2;
    royalOakMaster.add(centerPin);

    // I. Scratch-Resistant Sapphire Crystal with Specular Glint
    const sapphireGeo = new THREE.CircleGeometry(2.32, 64);
    const sapphireMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      roughness: 0.04,
      metalness: 0.95,
      depthWrite: false,
    });
    const sapphire = new THREE.Mesh(sapphireGeo, sapphireMat);
    sapphire.position.z = 0.22;
    royalOakMaster.add(sapphire);

    scene.add(royalOakMaster);

    // -------------------------------------------------------------------------
    // 5. CONTINUOUS RENDER LOOP & REALISTIC MECHANICAL MOTION
    // -------------------------------------------------------------------------
    let targetCameraZ = 7.6;
    let targetCameraY = 0;
    let targetCameraX = 0;
    let currentCameraZ = 7.6;
    let currentCameraY = 0;
    let currentCameraX = 0;

    const startTime = performance.now();
    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      const p = Math.max(0, Math.min(1, scrollRef.current || 0));

      // Slow ambient stardust orbit
      starField.rotation.y = elapsed * 0.015;

      // 1. High-Frequency Flying Tourbillon Harmonic Oscillation (3 Hz / 21,600 vph)
      balanceRim.rotation.z = Math.sin(elapsed * 16.0) * 0.95;

      // 2. Flying Tourbillon Carriage Continuous 360-Degree Rotation (1 rev per 60s)
      bridgeGroup.rotation.z = elapsed * ((Math.PI * 2) / 60) * 6; // Accelerated for visual spectacle

      // 3. Minute Hand Slow Clockwise Sweep
      minuteHandGroup.rotation.z = -Math.PI * 0.2 - elapsed * 0.002;

      // 4. Hour Hand Set to ~10:10 Classic Luxury Display
      hourHandGroup.rotation.z = Math.PI * 0.35;

      // 5. Dynamic 3D Camera Tilt & Scroll Choreography
      if (p < 0.25) {
        // SCENE 1: Full Frontal Master Watch Presentation
        const localP = p / 0.25;
        targetCameraZ = 7.6 - localP * 3.2; // Smooth zoom from 7.6 to 4.4
        targetCameraX = Math.sin(localP * Math.PI) * 0.65;
        targetCameraY = -localP * 0.35;

        // Gentle organic dial tilt so 18k rose gold bezel catches light gleams
        royalOakMaster.rotation.y = Math.sin(elapsed * 0.5) * 0.12;
        royalOakMaster.rotation.x = Math.cos(elapsed * 0.4) * 0.09;
        royalOakMaster.scale.setScalar(1.0);
      } else if (p < 0.6) {
        // SCENE 2 & 3: Deep Angle Shot Highlighting the Octagon Bezel & Flying Tourbillon
        const localP = (p - 0.25) / 0.35;
        targetCameraZ = 4.4 + Math.sin(localP * Math.PI) * 1.0;
        targetCameraX = -1.1 + localP * 2.2;
        targetCameraY = 0.35 - localP * 0.6;

        royalOakMaster.rotation.y = 0.35 - localP * 0.7;
        royalOakMaster.rotation.x = 0.25;
        royalOakMaster.scale.setScalar(0.95);
      } else {
        // SCENE 4-7: Sovereign Convergence & Grand Pullback
        const localP = (p - 0.6) / 0.4;
        targetCameraZ = 5.0 + localP * 3.6;
        targetCameraX = 0;
        targetCameraY = 0;

        royalOakMaster.rotation.y = elapsed * 0.25;
        royalOakMaster.rotation.x = 0;
        royalOakMaster.scale.setScalar(0.85 + localP * 0.15);
      }

      // Smooth Camera Exponential Damping
      currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;
      currentCameraY += (targetCameraY - currentCameraY) * 0.08;
      currentCameraX += (targetCameraX - currentCameraX) * 0.08;

      camera.position.set(currentCameraX, currentCameraY, currentCameraZ);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Disposal & Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      dialTexture.dispose();
      dialGeo.dispose();
      dialMat.dispose();
      bezelGeo.dispose();
      caseMiddleGeo.dispose();
      sapphireGeo.dispose();
      sapphireMat.dispose();
      roseGoldBrushedMat.dispose();
      roseGoldPolishedMat.dispose();
      steelScrewMat.dispose();
      tourbillonGoldMat.dispose();
      syntheticRubyMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
