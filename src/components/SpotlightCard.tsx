import React, { useRef } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
  id?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(56, 189, 248, 0.14)',
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Skip forced layout reads on touch/pen devices to keep mobile scroll at 60/120fps
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onClick={onClick}
      style={{ '--spotlight-color': spotlightColor } as React.CSSProperties}
      className={`spotlight-card rounded-2xl bg-white/95 dark:bg-[#0c1428]/92 md:bg-white/85 md:dark:bg-slate-900/65 md:backdrop-blur-xl border border-slate-200/85 dark:border-white/10 shadow-[0_8px_28px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
