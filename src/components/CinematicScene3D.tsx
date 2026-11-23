import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ThemeMode } from '../types';

interface CinematicScene3DProps {
  theme: ThemeMode;
}

// Reusable module-scope math objects to keep the render loop zero-GC
const _dummy = new THREE.Object3D();
const _targetCam = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const rendererName = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererName);
  } catch {
    return true;
  }
}

export const CinematicScene3D: React.FC<CinematicScene3DProps> = React.memo(({ theme }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<ThemeMode>(theme);
  const [contextLost, setContextLost] = useState(false);

  // Sync theme reactively without tearing down the WebGLRenderer
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bgClearRef = useRef<THREE.Color>(new THREE.Color('#050a18'));
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    const isDark = theme === 'dark';
    const nextBg = isDark ? 0x050a18 : 0xf4f7fc;
    bgClearRef.current.setHex(nextBg);

    if (sceneRef.current && fogRef.current) {
      fogRef.current.color.setHex(nextBg);
      fogRef.current.density = isDark ? 0.036 : 0.028;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(isDark ? 0x38bdf8 : 0x60a5fa);
      hemiLightRef.current.groundColor.setHex(isDark ? 0x1e1b4b : 0xe0e7ff);
      hemiLightRef.current.intensity = isDark ? 0.72 : 0.9;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = isDark ? 2.0 : 1.3;
    }
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let glSupported = false;
    try {
      const testCanvas = document.createElement('canvas');
      glSupported = Boolean(
        window.WebGLRenderingContext &&
          (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'))
      );
    } catch {
      glSupported = false;
    }
    if (!glSupported) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const isCompactDevice = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isCompactDevice,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isInitialDark = themeRef.current === 'dark';
    const fogColor = isInitialDark ? 0x050a18 : 0xf4f7fc;
    const fog = new THREE.FogExp2(fogColor, isInitialDark ? 0.036 : 0.028);
    scene.fog = fog;
    fogRef.current = fog;

    // Studio Environment Reflection for rich metallic & glass bevels
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      90
    );
    camera.position.set(0, 0.3, isCompactDevice ? 14.2 : 12.2);

    // Calm 3-Point Studio Lighting Rig (Blue / Violet / Cyan Signature)
    const hemiLight = new THREE.HemisphereLight(
      isInitialDark ? 0x38bdf8 : 0x60a5fa,
      isInitialDark ? 0x1e1b4b : 0xe0e7ff,
      isInitialDark ? 0.72 : 0.9
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.25);
    keyLight.position.set(7, 8, 9);
    scene.add(keyLight);

    const violetFillLight = new THREE.DirectionalLight(0x8b5cf6, 0.85);
    violetFillLight.position.set(-8, -4, 5);
    scene.add(violetFillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, isInitialDark ? 2.0 : 1.3, 26, 1.7);
    rimLight.position.set(2.5, 2.2, 4.5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Materials softened so ambient 3D accents support rather than compete with foreground content
    const sapphireGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      metalness: 0.15,
      roughness: 0.16,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      iridescence: 0.4,
      transparent: true,
      opacity: 0.46,
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.78,
      roughness: 0.34,
      transparent: true,
      opacity: 0.55,
    });

    const obsidianPrismMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.6,
      roughness: 0.44,
      transparent: true,
      opacity: 0.52,
    });

    const violetCoreMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.34,
      metalness: 0.4,
      roughness: 0.25,
      transparent: true,
      opacity: 0.65,
    });

    const wireframeAccentMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    // Composite Architectural Sculpture #1: Deep Outer Orbital Accent (Far upper-right deep field)
    const heroCluster = new THREE.Group();
    heroCluster.position.set(isCompactDevice ? 4.8 : 11.2, isCompactDevice ? 4.4 : 3.9, -9.8);
    heroCluster.scale.setScalar(isCompactDevice ? 0.54 : 0.62);

    const coreOctaGeo = new THREE.OctahedronGeometry(1.05, 0);
    const coreOcta = new THREE.Mesh(coreOctaGeo, sapphireGlassMat);
    heroCluster.add(coreOcta);

    const innerPrismGeo = new THREE.IcosahedronGeometry(0.58, 0);
    const innerPrism = new THREE.Mesh(innerPrismGeo, violetCoreMat);
    heroCluster.add(innerPrism);

    const outerCageGeo = new THREE.IcosahedronGeometry(1.48, 1);
    const outerCage = new THREE.Mesh(outerCageGeo, wireframeAccentMat);
    heroCluster.add(outerCage);

    const orbitalRingGeo = new THREE.TorusGeometry(1.95, 0.032, 16, 72);
    const orbitalRingA = new THREE.Mesh(orbitalRingGeo, brushedTitaniumMat);
    orbitalRingA.rotation.x = Math.PI * 0.36;
    orbitalRingA.rotation.y = Math.PI * 0.16;
    heroCluster.add(orbitalRingA);

    const orbitalRingBGeo = new THREE.TorusGeometry(2.4, 0.018, 12, 84);
    const orbitalRingB = new THREE.Mesh(orbitalRingBGeo, obsidianPrismMat);
    orbitalRingB.rotation.x = -Math.PI * 0.28;
    orbitalRingB.rotation.z = Math.PI * 0.22;
    heroCluster.add(orbitalRingB);

    scene.add(heroCluster);

    // Composite Architectural Sculpture #2: Deep Left Outer Accent
    const secondaryCluster = new THREE.Group();
    secondaryCluster.position.set(isCompactDevice ? -4.8 : -10.8, -3.2, -10.2);
    secondaryCluster.scale.setScalar(isCompactDevice ? 0.56 : 0.66);

    const secTorusGeo = new THREE.TorusKnotGeometry(0.88, 0.18, 72, 14, 2, 3);
    const secTorus = new THREE.Mesh(secTorusGeo, obsidianPrismMat);
    secondaryCluster.add(secTorus);

    const secHaloGeo = new THREE.TorusGeometry(1.6, 0.02, 12, 64);
    const secHalo = new THREE.Mesh(secHaloGeo, brushedTitaniumMat);
    secHalo.rotation.x = Math.PI * 0.42;
    secondaryCluster.add(secHalo);

    scene.add(secondaryCluster);

    // Composite Architectural Sculpture #3: Floating Geometric Accent (Deep Upper Left Outer Field)
    const accentCluster = new THREE.Group();
    accentCluster.position.set(isCompactDevice ? -4.4 : -10.4, 4.2, -10.8);
    accentCluster.scale.setScalar(isCompactDevice ? 0.54 : 0.64);
    const accentBodyGeo = new THREE.DodecahedronGeometry(0.68, 0);
    const accentBody = new THREE.Mesh(accentBodyGeo, violetCoreMat);
    const accentWireGeo = new THREE.OctahedronGeometry(1.06, 0);
    const accentWire = new THREE.Mesh(accentWireGeo, wireframeAccentMat);
    accentCluster.add(accentBody, accentWire);
    scene.add(accentCluster);

    // Calm Minimal Instanced Studio Particles (Low Density & Soft Opacity)
    const particleCount = isCompactDevice ? 28 : 56;
    const particleGeo = new THREE.OctahedronGeometry(0.04, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.36,
    });
    const particlesMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particlesMesh.frustumCulled = false;

    const particleData = new Float32Array(particleCount * 4); // x, y, z, speedPhase
    const palette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x22d3ee),
    ];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 24;
      const py = (Math.random() - 0.5) * 16;
      const pz = -1 - Math.random() * 11;
      const phase = Math.random() * Math.PI * 2;
      particleData[i * 4] = px;
      particleData[i * 4 + 1] = py;
      particleData[i * 4 + 2] = pz;
      particleData[i * 4 + 3] = phase;

      const scale = 0.65 + Math.random() * 0.9;
      _dummy.position.set(px, py, pz);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      particlesMesh.setMatrixAt(i, _dummy.matrix);
      particlesMesh.setColorAt(i, palette[i % palette.length]);
    }
    particlesMesh.instanceMatrix.needsUpdate = true;
    if (particlesMesh.instanceColor) particlesMesh.instanceColor.needsUpdate = true;
    particlesMesh.computeBoundingSphere();
    scene.add(particlesMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer Parallax & Scroll Depth Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollProgress = 0;
    let currentScroll = 0;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const handlePointerMove = (e: PointerEvent) => {
      if (!hasFinePointer || e.pointerType !== 'mouse') return;
      targetMouseX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      targetMouseY = -(e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    };

    if (hasFinePointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const delta = Math.min((nowMs - prevTimeMs) / 1000, 0.08);
      const elapsed = (nowMs - startTimeMs) / 1000;
      prevTimeMs = nowMs;

      currentMouseX = THREE.MathUtils.damp(currentMouseX, targetMouseX, 4.5, delta);
      currentMouseY = THREE.MathUtils.damp(currentMouseY, targetMouseY, 4.5, delta);
      currentScroll = THREE.MathUtils.damp(currentScroll, scrollProgress, 4.0, delta);

      // Camera subtle parallax + scroll depth glide
      const baseZ = isCompactDevice ? 14.2 : 12.2;
      _targetCam.set(
        currentMouseX * 0.85,
        0.3 + currentMouseY * 0.55 - currentScroll * 3.1,
        baseZ - currentScroll * 2.2
      );
      camera.position.lerp(_targetCam, 1 - Math.exp(-5 * delta));
      camera.lookAt(0, -currentScroll * 2.1, -2.5);

      // Interactive cursor-linked Rim Light
      rimLight.position.set(
        2.5 + currentMouseX * 4.5,
        2.2 + currentMouseY * 3.5 - currentScroll * 2.0,
        4.5
      );

      // Slow, tranquil architectural rotation
      heroCluster.rotation.y = elapsed * 0.12 + currentMouseX * 0.16;
      heroCluster.rotation.x = Math.sin(elapsed * 0.2) * 0.1 - currentMouseY * 0.12;
      heroCluster.position.y = (isCompactDevice ? 4.4 : 3.9) + Math.sin(elapsed * 0.45) * 0.16;

      orbitalRingA.rotation.z = elapsed * 0.18;
      orbitalRingB.rotation.y = -elapsed * 0.14;
      innerPrism.rotation.x = -elapsed * 0.22;
      innerPrism.rotation.y = elapsed * 0.18;

      secondaryCluster.rotation.y = -elapsed * 0.1 + currentMouseX * 0.1;
      secondaryCluster.rotation.z = elapsed * 0.08;
      secondaryCluster.position.y = -3.0 + currentScroll * 1.1 + Math.cos(elapsed * 0.35) * 0.14;

      accentCluster.rotation.x = elapsed * 0.12;
      accentCluster.rotation.y = elapsed * 0.14;

      // Gentle drift for instanced particles
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 4;
        const px = particleData[idx];
        const py = particleData[idx + 1] + Math.sin(elapsed * 0.4 + particleData[idx + 3]) * 0.18;
        const pz = particleData[idx + 2];
        const pulse = 0.75 + 0.2 * Math.sin(elapsed * 0.9 + particleData[idx + 3]);

        _dummy.position.set(px, py, pz);
        _dummy.rotation.set(elapsed * 0.15 + i, elapsed * 0.12 + i, 0);
        _dummy.scale.setScalar(pulse);
        _dummy.updateMatrix();
        particlesMesh.setMatrixAt(i, _dummy.matrix);
      }
      particlesMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);

      if (hasFinePointer) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      coreOctaGeo.dispose();
      innerPrismGeo.dispose();
      outerCageGeo.dispose();
      orbitalRingGeo.dispose();
      orbitalRingBGeo.dispose();
      secTorusGeo.dispose();
      secHaloGeo.dispose();
      accentBodyGeo.dispose();
      accentWireGeo.dispose();
      particleGeo.dispose();

      sapphireGlassMat.dispose();
      brushedTitaniumMat.dispose();
      obsidianPrismMat.dispose();
      violetCoreMat.dispose();
      wireframeAccentMat.dispose();
      particleMat.dispose();
      envTexture.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (contextLost) return null;

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none select-none opacity-28 dark:opacity-55 transition-opacity duration-500"
    />
  );
});

CinematicScene3D.displayName = 'CinematicScene3D';
