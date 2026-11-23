import React from 'react';

const RIBBON_ITEMS_PRIMARY = [
  'Mohamed Mahmoud Studio',
  'مطور مواقع وتطبيقات ويب',
  'واجهات تفاعلية ثلاثية الأبعاد',
  'منصات تعليمية ذكية',
  'متاجر إلكترونية حديثة',
  'حلول برمجية متكاملة',
];

const RIBBON_ITEMS_SECONDARY = [
  'React 19',
  'TypeScript',
  'Three.js 3D',
  'Progressive Web App',
  'Mobile-First Experience',
  'High-Performance UI',
];

export const KineticMarquee: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 w-full overflow-hidden py-5 sm:py-7 select-none"
    >
      {/* Primary Angled Studio Strip */}
      <div className="relative -mx-4 bg-gradient-to-r from-[#091534] via-[#131d47] to-[#081b38] dark:from-[#08122b] dark:via-[#121942] dark:to-[#071630] border-y border-blue-400/25 shadow-[0_12px_36px_-12px_rgba(37,99,235,0.4)] py-3 sm:py-3.5">
        <div className="flex w-max animate-marquee-rtl">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-6 sm:gap-10 px-4 sm:px-6 shrink-0">
              {RIBBON_ITEMS_PRIMARY.map((item, idx) => (
                <span
                  key={`${dup}-${idx}`}
                  className="inline-flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-extrabold tracking-wide text-slate-100 whitespace-nowrap"
                >
                  <span>{item}</span>
                  <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400/90 inline-block" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Counter-Scrolling Stack Strip */}
      <div className="relative -mx-4 mt-2 bg-white/85 dark:bg-[#060d20]/88 border-y border-slate-200/80 dark:border-white/10 py-2.5">
        <div dir="ltr" className="flex w-max animate-marquee-ltr">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-6 sm:gap-10 px-4 sm:px-6 shrink-0">
              {RIBBON_ITEMS_SECONDARY.map((item, idx) => (
                <span
                  key={`${dup}-${idx}`}
                  className="font-latin inline-flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-cyan-300/90 whitespace-nowrap"
                >
                  <span>{item}</span>
                  <span className="text-violet-500 dark:text-violet-400">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

KineticMarquee.displayName = 'KineticMarquee';
