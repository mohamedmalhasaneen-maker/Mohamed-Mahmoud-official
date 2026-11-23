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
        glowRef.current.style.transform = `translate3d(${currentX - 280}px, ${currentY - 280}px, 0)`;
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
      {/* Top Studio Volumetric Lighting (Calm & Non-Competing) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_50%_-10%,rgba(37,99,235,0.08),rgba(124,58,237,0.04)_48%,transparent_84%)] dark:bg-[radial-gradient(ellipse_95%_55%_at_50%_-10%,rgba(37,99,235,0.16),rgba(124,58,237,0.09)_48%,transparent_84%)]" />

      {/* Electric Blue, Royal Violet & Luminous Cyan Soft Ambient Washes */}
      <div
        className="absolute -top-36 -right-32 w-[28rem] h-[28rem] opacity-45 dark:opacity-60 animate-float-desktop"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0.03) 44%, transparent 72%)',
        }}
      />
      <div
        className="absolute top-[28%] -left-36 w-[26rem] h-[26rem] opacity-40 dark:opacity-55"
        style={{
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.03) 46%, transparent 72%)',
        }}
      />
      <div
        className="hidden sm:block absolute -bottom-36 right-[14%] w-[26rem] h-[26rem] opacity-40 dark:opacity-55 animate-float-desktop"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.11) 0%, rgba(6, 182, 212, 0.025) 45%, transparent 72%)',
        }}
      />

      {/* Subtle Architectural Perspective Grid */}
      <div className="absolute inset-0 studio-grid-pattern opacity-65 [mask-image:radial-gradient(ellipse_85%_65%_at_50%_22%,#000_22%,transparent_100%)]" />

      {/* Subtle Cursor Ambient Halo (Desktop Fine Pointer Only) */}
      <div
        ref={glowRef}
        className="hidden lg:block fixed top-0 left-0 w-[520px] h-[520px] rounded-full opacity-55 dark:opacity-75 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.055) 0%, rgba(124, 58, 237, 0.03) 40%, transparent 70%)',
        }}
      />
    </div>
  );
});

AmbientBackground.displayName = 'AmbientBackground';
