import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  maxTiltDeg?: number;
  scaleOnHover?: number;
  onClick?: () => void;
  id?: string;
}

export const Card3DTilt: React.FC<Card3DTiltProps> = React.memo(
  ({
    children,
    className = '',
    spotlightColor = 'rgba(56, 189, 248, 0.22)',
    maxTiltDeg = 7.5,
    scaleOnHover = 1.015,
    onClick,
    id,
  }) => {
    const outerRef = useRef<HTMLDivElement | null>(null);
    const glareRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number>(0);
    const [canHoverTilt, setCanHoverTilt] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => {
        setCanHoverTilt(hoverQuery.matches && !reducedQuery.matches);
      };
      update();
      hoverQuery.addEventListener('change', update);
      reducedQuery.addEventListener('change', update);
      return () => {
        hoverQuery.removeEventListener('change', update);
        reducedQuery.removeEventListener('change', update);
      };
    }, []);

    useEffect(() => {
      return () => {
        if (rafRef.current) {
          window.cancelAnimationFrame(rafRef.current);
        }
      };
    }, []);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!canHoverTilt || e.pointerType !== 'mouse' || !outerRef.current) return;

        const clientX = e.clientX;
        const clientY = e.clientY;

        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        rafRef.current = window.requestAnimationFrame(() => {
          const el = outerRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const relX = (clientX - rect.left) / rect.width;
          const relY = (clientY - rect.top) / rect.height;

          const rotateY = (relX - 0.5) * maxTiltDeg * 2;
          const rotateX = -(relY - 0.5) * maxTiltDeg * 2;

          el.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`;
          el.style.setProperty('--mouse-x', `${(relX * 100).toFixed(1)}%`);
          el.style.setProperty('--mouse-y', `${(relY * 100).toFixed(1)}%`);

          if (glareRef.current) {
            glareRef.current.style.opacity = '1';
            glareRef.current.style.background = `radial-gradient(340px circle at ${(relX * 100).toFixed(1)}% ${(relY * 100).toFixed(1)}%, rgba(255,255,255,0.16), transparent 60%)`;
          }
        });
      },
      [canHoverTilt, maxTiltDeg, scaleOnHover]
    );

    const handlePointerLeave = useCallback(() => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (outerRef.current) {
        outerRef.current.style.transform =
          'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '0';
      }
    }, []);

    return (
      <div
        id={id}
        ref={outerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        style={
          {
            '--spotlight-color': spotlightColor,
            transformStyle: 'preserve-3d',
            transition:
              'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease, box-shadow 260ms ease',
          } as React.CSSProperties
        }
        className={`spotlight-card relative rounded-2xl bg-white/95 dark:bg-[#0b1328]/92 md:bg-white/88 md:dark:bg-[#0c1630]/78 border border-slate-200/90 dark:border-white/12 shadow-[0_14px_38px_-14px_rgba(15,23,42,0.12)] dark:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.68)] will-change-transform active:scale-[0.988] ${className}`}
      >
        {/* Dynamic Specular Sheen Layer */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-[3]"
        />

        {/* Crisp Inner Rim Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/45 dark:via-cyan-400/55 to-transparent z-[4]"
        />

        <div className="relative z-10 h-full preserve-3d">{children}</div>
      </div>
    );
  }
);

Card3DTilt.displayName = 'Card3DTilt';
