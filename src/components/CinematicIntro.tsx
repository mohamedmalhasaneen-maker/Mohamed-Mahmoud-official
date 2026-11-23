import React, { useEffect, useRef, useState, useCallback } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';

interface CinematicIntroProps {
  visible: boolean;
  onComplete: () => void;
}

const LINE_ONE = 'MOHAMED MAHMOUD';
const LINE_TWO = 'STUDIO';

export const CinematicIntro: React.FC<CinematicIntroProps> = React.memo(
  ({ visible, onComplete }) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [exiting, setExiting] = useState(false);
    const completedRef = useRef(false);
    const exitTimerRef = useRef<number | null>(null);

    const triggerExit = useCallback(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setProgress(100);
      setExiting(true);
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
      exitTimerRef.current = window.setTimeout(() => {
        exitTimerRef.current = null;
        onComplete();
      }, 520);
    }, [onComplete]);

    useEffect(() => {
      return () => {
        if (exitTimerRef.current !== null) {
          window.clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (visible) {
        if (exitTimerRef.current !== null) {
          window.clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
        completedRef.current = false;
        setExiting(false);
        setProgress(0);
      }
    }, [visible]);

    useEffect(() => {
      if (visible && prefersReducedMotion) {
        onComplete();
      }
    }, [visible, prefersReducedMotion, onComplete]);

    // Snappy ~3.1s timeline progress & keyboard / click skip
    useEffect(() => {
      if (!visible || prefersReducedMotion) return;

      const durationMs = 3100;
      const startTime = performance.now();
      let rafId = 0;

      const updateProgress = (now: number) => {
        const ratio = Math.min((now - startTime) / durationMs, 1);
        const eased = 1 - Math.pow(1 - ratio, 2.2);
        setProgress(Math.round(eased * 100));
        if (ratio < 1 && !completedRef.current) {
          rafId = window.requestAnimationFrame(updateProgress);
        } else if (ratio >= 1 && !completedRef.current) {
          triggerExit();
        }
      };

      rafId = window.requestAnimationFrame(updateProgress);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
          e.preventDefault();
          triggerExit();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [visible, prefersReducedMotion, triggerExit]);

    // Lightweight luminous background particles on canvas
    useEffect(() => {
      if (!visible || prefersReducedMotion) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animId = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      const resize = () => {
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const count = window.innerWidth < 640 ? 28 : 54;
      const particles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00045,
        vy: -0.00025 - Math.random() * 0.00055,
        r: 1 + Math.random() * 2.1,
        alpha: 0.25 + Math.random() * 0.55,
        hue: Math.random() > 0.5 ? '56, 189, 248' : Math.random() > 0.4 ? '139, 92, 246' : '59, 130, 246',
      }));

      const render = (t: number) => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -0.02) p.y = 1.02;
          if (p.x < -0.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -0.02;

          const twinkle = 0.6 + 0.4 * Math.sin(t * 0.002 + p.x * 20);
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue}, ${(p.alpha * twinkle).toFixed(3)})`;
          ctx.fill();
        }

        animId = window.requestAnimationFrame(render);
      };

      animId = window.requestAnimationFrame(render);
      return () => {
        window.cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
      };
    }, [visible, prefersReducedMotion]);

    return (
      <AnimatePresence>
        {visible && (
          <m.div
            id="cinematic-intro-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="المقدمة السينمائية لاستوديو محمد محمود"
            initial={{ opacity: 1 }}
            animate={
              exiting
                ? {
                    opacity: 0,
                    scale: 1.12,
                    filter: 'blur(6px)',
                  }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
            }
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#040814] text-white select-none"
          >
            {/* Deep Radial Midnight Spotlight Aura */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 47%, rgba(37, 99, 235, 0.28) 0%, rgba(124, 58, 237, 0.16) 26%, rgba(6, 182, 212, 0.08) 44%, rgba(4, 8, 20, 0.96) 72%)',
              }}
            />

            {/* Floating Light Particles Canvas */}
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none"
            />



            {/* Center 3D Sculpted Stage */}
            <div className="relative z-10 flex flex-col items-center justify-center px-5 text-center max-w-4xl mx-auto">
              {/* Central 3D Orbital Studio Emblem */}
              <m.div
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-8 sm:mb-10 flex items-center justify-center"
              >
                <div
                  aria-hidden="true"
                  className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(56, 189, 248, 0.36) 0%, rgba(124, 58, 237, 0.24) 45%, transparent 72%)',
                  }}
                />
                <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full p-[3px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_0_48px_rgba(37,99,235,0.65)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#040814] ring-1 ring-white/25">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_1.08.01_AM_48e19d64.jpeg"
                      alt="Mohamed Mahmoud Studio"
                      width={104}
                      height={104}
                      className="w-full h-full object-cover scale-[1.05] rounded-full"
                    />
                  </div>
                </div>
              </m.div>

              {/* Studio Wordmark: MOHAMED MAHMOUD STUDIO */}
              <h1
                dir="ltr"
                className="font-latin font-extrabold tracking-[0.14em] sm:tracking-[0.22em] text-xl xs:text-2xl sm:text-4xl md:text-5xl text-white uppercase leading-tight drop-shadow-[0_14px_34px_rgba(37,99,235,0.55)]"
              >
                <span className="block">{LINE_ONE}</span>
                <span className="block mt-2 text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
                  {LINE_TWO}
                </span>
              </h1>

              {/* Subtitle */}
              <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3 sm:gap-5 w-full max-w-md">
                <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-cyan-400/60 to-transparent" />
                <span className="text-xs sm:text-sm font-bold text-cyan-200/90 tracking-wide whitespace-nowrap">
                  مطور مواقع وتطبيقات ويب
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-violet-400/60 to-transparent" />
              </div>
            </div>

            {/* Bottom Cinematic Bar: Tabular Progress & Glass Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-6 sm:px-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 flex items-center justify-center">
              <div className="flex items-center gap-4 min-w-0 w-full max-w-md bg-white/[0.04] backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
                <span className="font-latin text-xs font-extrabold text-cyan-300 tabular-nums w-10 text-left shrink-0">
                  {String(progress).padStart(2, '0')}%
                </span>
                <div className="h-2.5 flex-1 bg-white/10 rounded-full overflow-hidden p-0.5 ring-1 ring-white/15">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 rounded-full transition-[width] duration-75 ease-out shadow-[0_0_14px_rgba(56,189,248,0.65)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    );
  }
);

CinematicIntro.displayName = 'CinematicIntro';
