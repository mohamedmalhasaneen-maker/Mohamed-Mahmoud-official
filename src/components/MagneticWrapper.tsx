import React, { useRef, useState, useEffect, useCallback } from 'react';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticWrapper: React.FC<MagneticElementProps> = React.memo(
  ({ children, className = 'inline-flex', strength = 0.24 }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setEnabled(hoverQuery.matches && !reducedQuery.matches);
      update();
      hoverQuery.addEventListener('change', update);
      reducedQuery.addEventListener('change', update);
      return () => {
        hoverQuery.removeEventListener('change', update);
        reducedQuery.removeEventListener('change', update);
      };
    }, []);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!enabled || e.pointerType !== 'mouse' || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        ref.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      },
      [enabled, strength]
    );

    const handlePointerLeave = useCallback(() => {
      if (ref.current) {
        ref.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
    }, []);

    return (
      <div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={className}
      >
        {children}
      </div>
    );
  }
);

MagneticWrapper.displayName = 'MagneticWrapper';
