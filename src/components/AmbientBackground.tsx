import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = React.memo(() => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReduced || !hasFinePointer) return;

    let rafId = 0;
    let isAnimating = false;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.14;
      currentY += dy * 0.14;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 240}px, ${currentY - 240}px, 0)`;
      }

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isAnimating) {
        isAnimating = true;
        rafId = window.requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Pre-softened Radial Atmospheric Lighting (Zero CSS filter:blur() GPU Overhead!) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(37,99,235,0.14),rgba(124,58,237,0.06)_48%,transparent_82%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(37,99,235,0.26),rgba(124,58,237,0.14)_48%,transparent_82%)]" />

      {/* Electric Blue, Violet & Cyan Soft Radial Orbs — No Blur Filter Required */}
      <div
        className="absolute -top-36 -right-32 w-[28rem] h-[28rem] opacity-80 dark:opacity-100 animate-float-desktop"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.20) 0%, rgba(37, 99, 235, 0.06) 42%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[30%] -left-36 w-[26rem] h-[26rem] opacity-75 dark:opacity-100"
        style={{
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.05) 44%, transparent 70%)',
        }}
      />
      <div
        className="hidden sm:block absolute -bottom-36 right-[14%] w-[26rem] h-[26rem] opacity-75 dark:opacity-100 animate-float-desktop"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, rgba(6, 182, 212, 0.04) 44%, transparent 70%)',
        }}
      />

      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 studio-grid-pattern [mask-image:radial-gradient(ellipse_80%_60%_at_50%_25%,#000_30%,transparent_100%)]" />

      {/* Lightweight Desktop Geometric Accents */}
      <svg
        className="hidden lg:block absolute top-28 left-[7%] w-32 h-32 text-blue-500/15 dark:text-cyan-400/15 animate-spin-desktop"
        viewBox="0 0 120 120"
        fill="none"
      >
        <polygon
          points="60,6 108,33 108,87 60,114 12,87 12,33"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      </svg>

      {/* Idle-Sleeping Desktop Cursor Glow */}
      <div
        ref={glowRef}
        className="hidden lg:block fixed top-0 left-0 w-[480px] h-[480px] rounded-full opacity-70 dark:opacity-100 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(124, 58, 237, 0.045) 38%, transparent 68%)',
        }}
      />
    </div>
  );
});

AmbientBackground.displayName = 'AmbientBackground';
