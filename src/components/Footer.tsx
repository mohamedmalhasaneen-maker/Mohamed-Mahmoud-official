import React from 'react';
import { Heart, Code2 } from 'lucide-react';
import { ProfileInfo } from '../types';
import { NAV_ITEMS, SectionId } from './Navbar';
import { scrollToElementById } from '../utils/scroll';

interface FooterProps {
  profile: ProfileInfo;
}

export const Footer: React.FC<FooterProps> = React.memo(({ profile }) => {
  const handleScroll = (id: SectionId) => {
    scrollToElementById(id);
  };

  return (
    <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#050914]/92 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Brand Summary */}
          <div className="flex items-center gap-3 text-right">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-latin font-extrabold text-base text-slate-900 dark:text-white">
                {profile.studioName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.roleTitle} — تطوير مواقع وتطبيقات الويب الحديثة
              </p>
            </div>
          </div>

          {/* Touch-Friendly Quick Section Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(item.id);
                }}
                className="min-h-[40px] px-2.5 inline-flex items-center hover:text-blue-600 dark:hover:text-cyan-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200/75 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400 text-center">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
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
