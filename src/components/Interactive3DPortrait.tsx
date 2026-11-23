import React, { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import defaultDevPhoto from '../assets/developer-photo.jpg';
import devPhoto480Webp from '../assets/developer-photo-480.webp';
import devPhoto800Webp from '../assets/developer-photo-800.webp';

interface Interactive3DPortraitProps {
  developerName: string;
  studioName: string;
  photoUrl?: string;
}

export const Interactive3DPortrait: React.FC<Interactive3DPortraitProps> = React.memo(
  ({ developerName, studioName, photoUrl }) => {
    const prefersReducedMotion = useReducedMotion();
    const [photoSrc, setPhotoSrc] = useState<string>(
      defaultDevPhoto || photoUrl || '/profile.jpg'
    );
    const [useFallbackJpgOnly, setUseFallbackJpgOnly] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <m.div
        initial={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 24, scale: 0.95 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 flex justify-center order-1 lg:order-2 px-2 sm:px-4"
      >
        <div className="relative w-full max-w-[248px] xs:max-w-[276px] sm:max-w-[320px] lg:max-w-[360px]">
          {/* Metallic Studio Hanging Clip / Lanyard Anchor */}
          <div
            aria-hidden="true"
            className="mx-auto -mb-2.5 relative z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="w-2.5 h-6 sm:h-7 rounded-t-full bg-gradient-to-b from-blue-500 via-violet-500 to-cyan-400 opacity-85 shadow-sm" />
            <div className="w-14 sm:w-16 h-3.5 rounded-lg bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 border border-white/25 shadow-md flex items-center justify-center">
              <span className="w-6 h-1 rounded-full bg-cyan-300/80" />
            </div>
          </div>

          {/* Static Portrait Card Frame */}
          <div
            id="developer-photo-wrapper"
            className="relative p-2.5 sm:p-3.5 rounded-[1.75rem] bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#0e1b38] dark:via-[#0a142d] dark:to-[#070d20] border border-blue-400/40 dark:border-cyan-400/35 shadow-[0_24px_50px_-14px_rgba(37,99,235,0.35)]"
          >
            <div className="relative z-10">
              {/* Top Identity Bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#040814] ring-1 ring-cyan-400/55 shrink-0">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_1.08.01_AM_48e19d64.jpeg"
                      alt={studioName}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="font-latin text-[11px] font-extrabold text-slate-800 dark:text-cyan-200 truncate">
                    MM STUDIO
                  </span>
                </div>
                <Code2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
              </div>

              {/* Static Portrait Stage (Unmodified Original Photo) */}
              <div
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 ring-1 ring-blue-400/35 dark:ring-cyan-300/25 shadow-md"
              >
                {!imageLoaded && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
                  />
                )}

                <picture>
                  {!useFallbackJpgOnly && (
                    <source
                      type="image/webp"
                      srcSet={`${devPhoto480Webp} 480w, ${devPhoto800Webp} 800w`}
                      sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 360px"
                    />
                  )}
                  <img
                    id="developer-photo-img"
                    src={photoSrc}
                    alt={developerName}
                    width={960}
                    height={1280}
                    fetchPriority="high"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setUseFallbackJpgOnly(true);
                      if (photoSrc !== '/profile.jpg') {
                        setPhotoSrc('/profile.jpg');
                      }
                    }}
                    className={`w-full h-full object-cover object-top block select-none transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-95'
                    }`}
                  />
                </picture>
              </div>

              {/* Nameplate */}
              <div className="pt-3 px-1 flex flex-wrap items-center justify-between gap-1.5">
                <div className="text-right min-w-0">
                  <p className="font-latin text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {developerName}
                  </p>
                  <p className="text-[11px] font-bold text-blue-600 dark:text-cyan-300 leading-snug">
                    مطور مواقع وتطبيقات ويب
                  </p>
                </div>
                <span
                  dir="ltr"
                  className="font-latin text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 shrink-0"
                >
                  WEB · 3D
                </span>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    );
  }
);

Interactive3DPortrait.displayName = 'Interactive3DPortrait';
