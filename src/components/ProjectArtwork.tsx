import React, { useState } from 'react';
import {
  GraduationCap,
  FlaskConical,
  Home,
  Calculator,
  Palette,
  Paintbrush,
  Dna,
  Camera,
  Image as ImageIcon,
  Maximize2 as AppWindow,
  Store,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectIconName } from '../types';

export const renderProjectIcon = (icon: ProjectIconName, className = 'w-6 h-6') => {
  switch (icon) {
    case 'graduation-cap':
      return <GraduationCap className={className} />;
    case 'flask':
      return <FlaskConical className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'calculator':
      return <Calculator className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'paint-brush':
      return <Paintbrush className={className} />;
    case 'dna':
      return <Dna className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    case 'app-window':
      return <AppWindow className={className} />;
    case 'store':
      return <Store className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
};

interface ProjectArtworkProps {
  project: Project;
  size?: 'card' | 'modal';
}

export const ProjectArtwork: React.FC<ProjectArtworkProps> = React.memo(
  ({ project, size = 'card' }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const hostname = (() => {
      try {
        return new URL(project.url).hostname;
      } catch {
        return project.url;
      }
    })();

    const heightClass = size === 'modal' ? 'h-44 sm:h-56' : 'h-42 sm:h-46';

    const renderCustomScene = () => {
      switch (project.id) {
        case 'ms-nada-bio':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <circle cx="180" cy="80" r="56" stroke="rgba(45,212,191,0.28)" strokeWidth="1.2" strokeDasharray="4 4" />
              <circle cx="180" cy="80" r="38" stroke="rgba(34,211,238,0.38)" strokeWidth="1.2" />
              <path
                d="M95 52 C 135 20, 225 140, 265 108"
                stroke="rgba(45,212,191,0.75)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M95 108 C 135 140, 225 20, 265 52"
                stroke="rgba(56,189,248,0.75)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {[115, 148, 180, 212, 245].map((x, idx) => (
                <line
                  key={idx}
                  x1={x}
                  y1={56 + (idx % 2) * 10}
                  x2={x}
                  y2={104 - (idx % 2) * 10}
                  stroke="rgba(255,255,255,0.32)"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          );

        case 'radwa-drawings':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <rect x="64" y="28" width="232" height="104" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(192,132,252,0.35)" />
              <path
                d="M92 106 Q 140 38, 184 82 T 268 54"
                stroke="#c084fc"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="110" cy="54" r="9" fill="#c084fc" fillOpacity="0.7" />
              <circle cx="136" cy="54" r="9" fill="#38bdf8" fillOpacity="0.7" />
              <circle cx="162" cy="54" r="9" fill="#f472b6" fillOpacity="0.7" />
            </svg>
          );

        case 'rafeeq':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <rect x="58" y="32" width="144" height="96" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(129,140,248,0.35)" />
              <rect x="74" y="50" width="84" height="8" rx="4" fill="rgba(165,180,252,0.65)" />
              <rect x="74" y="68" width="112" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
              <rect x="74" y="82" width="96" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="74" y="102" width="58" height="12" rx="6" fill="rgba(99,102,241,0.65)" />
              <rect x="216" y="32" width="86" height="96" rx="12" fill="rgba(99,102,241,0.14)" stroke="rgba(167,139,250,0.35)" />
              <circle cx="259" cy="68" r="18" stroke="rgba(165,180,252,0.8)" strokeWidth="3" />
              <rect x="236" y="100" width="46" height="7" rx="3.5" fill="rgba(196,181,253,0.6)" />
            </svg>
          );

        case 'chemical':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <circle cx="122" cy="82" r="22" fill="rgba(16,185,129,0.2)" stroke="rgba(52,211,153,0.7)" strokeWidth="2" />
              <circle cx="188" cy="56" r="16" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.7)" strokeWidth="2" />
              <circle cx="238" cy="96" r="24" fill="rgba(59,130,246,0.2)" stroke="rgba(96,165,250,0.7)" strokeWidth="2" />
              <line x1="141" y1="74" x2="173" y2="62" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <line x1="201" y1="66" x2="220" y2="81" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <circle cx="122" cy="82" r="5" fill="#34d399" />
              <circle cx="188" cy="56" r="4" fill="#22d3ee" />
              <circle cx="238" cy="96" r="5" fill="#60a5fa" />
            </svg>
          );

        case 'elmekawy-quotes':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <rect x="74" y="26" width="212" height="108" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(251,113,133,0.38)" />
              <rect x="92" y="42" width="176" height="22" rx="7" fill="rgba(244,63,94,0.22)" stroke="rgba(251,113,133,0.4)" />
              <rect x="92" y="76" width="52" height="18" rx="5" fill="rgba(255,255,255,0.12)" />
              <rect x="154" y="76" width="52" height="18" rx="5" fill="rgba(255,255,255,0.12)" />
              <rect x="216" y="76" width="52" height="42" rx="6" fill="rgba(244,63,94,0.55)" />
              <rect x="92" y="100" width="52" height="18" rx="5" fill="rgba(255,255,255,0.12)" />
              <rect x="154" y="100" width="52" height="18" rx="5" fill="rgba(255,255,255,0.12)" />
            </svg>
          );

        case 'elmahlawy-store':
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              {[62, 146, 230].map((x, i) => (
                <g key={i}>
                  <rect x={x} y="30" width="68" height="100" rx="11" fill="rgba(255,255,255,0.07)" stroke="rgba(251,146,60,0.38)" />
                  <rect x={x + 8} y="38" width="52" height="42" rx="7" fill="rgba(249,115,22,0.22)" />
                  <rect x={x + 8} y="88" width="40" height="6" rx="3" fill="rgba(255,255,255,0.45)" />
                  <rect x={x + 8} y="100" width="28" height="6" rx="3" fill="rgba(52,211,153,0.75)" />
                  <rect x={x + 8} y="112" width="52" height="10" rx="5" fill="rgba(249,115,22,0.65)" />
                </g>
              ))}
            </svg>
          );

        default:
          return (
            <svg className="w-full h-full" viewBox="0 0 360 160" fill="none" aria-hidden="true">
              <rect x="64" y="28" width="232" height="104" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(56,189,248,0.35)" />
              <line x1="180" y1="28" x2="180" y2="132" stroke="rgba(56,189,248,0.32)" strokeWidth="2" />
              <line x1="64" y1="80" x2="296" y2="80" stroke="rgba(56,189,248,0.24)" strokeWidth="1.5" />
              <rect x="78" y="40" width="88" height="28" rx="6" fill="rgba(59,130,246,0.22)" />
              <rect x="194" y="40" width="88" height="28" rx="6" fill="rgba(6,182,212,0.22)" />
              <rect x="78" y="92" width="88" height="28" rx="6" fill="rgba(6,182,212,0.18)" />
              <rect x="194" y="92" width="88" height="28" rx="6" fill="rgba(124,58,237,0.22)" />
            </svg>
          );
      }
    };

    return (
      <div
        className={`relative w-full ${heightClass} overflow-hidden select-none shrink-0`}
        style={{
          background: `linear-gradient(135deg, #0b132b 0%, ${project.color.accentHex}3b 55%, ${project.color.secondaryHex}36 100%)`,
        }}
      >
        {/* Lightweight Browser Top Bar (Zero Blur Filter Cost on Mobile) */}
        <div
          dir="ltr"
          className="relative z-20 flex items-center justify-between px-3 py-2 bg-slate-950/75 border-b border-white/10"
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="font-latin text-[11px] font-medium text-slate-300/90 truncate max-w-[160px] xs:max-w-[210px] sm:max-w-[260px]">
            {hostname}
          </span>
          <span className="w-4 shrink-0" />
        </div>

        {/* Main Preview Stage */}
        {project.imageUrl && !imgFailed ? (
          <div className="relative w-full h-[calc(100%-33px)] bg-slate-900">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
            )}
            <img
              src={project.imageUrl}
              alt={project.title}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
              className={`w-full h-full object-cover object-center transition-all duration-300 [@media(hover:hover)]:group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          <div className="relative w-full h-[calc(100%-33px)] flex items-center justify-center">
            <div className="absolute inset-0 opacity-90 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105">
              {renderCustomScene()}
            </div>

            <div
              className="relative z-10 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/25 transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${project.color.accentHex}, ${project.color.secondaryHex})`,
                boxShadow: `0 12px 26px -6px ${project.color.glow}`,
              }}
            >
              {renderProjectIcon(project.icon, 'w-6 h-6 sm:w-7 sm:h-7')}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProjectArtwork.displayName = 'ProjectArtwork';
