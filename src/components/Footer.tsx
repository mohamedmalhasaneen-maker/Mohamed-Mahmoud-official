import React from 'react';
import { Heart } from 'lucide-react';
import { ProfileInfo } from '../types';

interface FooterProps {
  profile: ProfileInfo;
}

export const Footer: React.FC<FooterProps> = React.memo(({ profile }) => {
  return (
    <footer className="relative z-10 mt-6 sm:mt-10 border-t border-slate-200/80 dark:border-white/10 bg-[#050b1d] text-slate-100 pb-safe overflow-hidden">
      {/* Subtle Top Rim Lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[38rem] h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(37,99,235,0.22) 0%, rgba(124,58,237,0.12) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 text-center">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-slate-300">
            <span>صُنع بشغف وإتقان</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/85 inline shrink-0" />
            <span>بواسطة {profile.developerName}</span>
          </p>

          <p>
            © {new Date().getFullYear()} {profile.studioName}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

