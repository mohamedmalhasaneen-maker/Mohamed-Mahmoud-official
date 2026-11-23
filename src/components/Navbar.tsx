import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Home, FolderGit2, MessageSquare, Menu, X, LayoutGrid } from 'lucide-react';
import { ThemeMode } from '../types';
import { scrollToElementById } from '../utils/scroll';

export type SectionId = 'home' | 'projects' | 'contact';

interface NavItem {
  id: SectionId;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'projects', label: 'المشروعات' },
  { id: 'contact', label: 'تواصل معي' },
];

const NAV_ICONS: Record<SectionId, React.ComponentType<{ className?: string }>> = {
  home: Home,
  projects: FolderGit2,
  contact: MessageSquare,
};

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  whatsappUrl?: string;
  studioName: string;
}

const GLASS_TILE_BASE =
  'bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-slate-200/90 dark:border-white/14 shadow-[0_6px_20px_-8px_rgba(37,99,235,0.18)] dark:shadow-[0_8px_24px_-10px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 hover:bg-white dark:hover:bg-white/[0.11] hover:border-blue-500/55 dark:hover:border-cyan-400/50 hover:shadow-[0_10px_26px_-8px_rgba(37,99,235,0.36)] active:scale-[0.97] transition-all duration-200';

export const Navbar: React.FC<NavbarProps> = React.memo(
  ({ theme, onToggleTheme, studioName }) => {
    const [activeSection, setActiveSection] = useState<SectionId>('home');
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      const sectionIds = NAV_ITEMS.map((item) => item.id);
      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          let bestEntry: IntersectionObserverEntry | null = null;
          for (const entry of entries) {
            if (
              entry.isIntersecting &&
              (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)
            ) {
              bestEntry = entry;
            }
          }
          if (bestEntry) {
            const nextId = bestEntry.target.id as SectionId;
            setActiveSection((prev) => (prev === nextId ? prev : nextId));
          }
        },
        {
          rootMargin: '-20% 0px -58% 0px',
          threshold: [0.1, 0.3],
        }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const onScroll = () => {
        const isScrolled = window.scrollY > 18;
        setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavigate = useCallback((id: SectionId) => {
      setActiveSection(id);
      setIsMenuOpen(false);
      window.requestAnimationFrame(() => {
        scrollToElementById(id);
      });
    }, []);

    return (
      <>
        <header
          className={`sticky top-0 z-40 w-full pt-safe transition-all duration-300 ${
            scrolled
              ? 'bg-[#f4f7fc]/82 dark:bg-[#050a18]/82 backdrop-blur-xl border-b border-slate-200/75 dark:border-cyan-400/15 shadow-[0_10px_30px_-14px_rgba(37,99,235,0.22)]'
              : 'bg-[#f4f7fc]/55 dark:bg-[#050a18]/55 backdrop-blur-md border-b border-slate-200/45 dark:border-white/[0.06]'
          }`}
        >
          <nav
            aria-label="التنقل الرئيسي"
            className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-3 lg:gap-4"
          >
            {/* Independent Brand Tile (Logo + Studio Name) */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('home');
              }}
              className={`min-h-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-2xl inline-flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink ${GLASS_TILE_BASE}`}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#040814] ring-2 ring-cyan-400/50 group-hover:ring-blue-500 shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_1.08.01_AM_48e19d64.jpeg"
                  alt={studioName}
                  width={36}
                  height={36}
                  decoding="async"
                  className="w-full h-full object-cover scale-[1.04] rounded-full select-none"
                />
              </div>
              <span className="font-latin font-extrabold text-[11px] xs:text-[13px] sm:text-sm md:text-[15px] tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap truncate">
                {studioName}
              </span>
            </a>

            {/* Independent Utility Buttons (Theme Toggle & Sections Menu Button) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              <button
                type="button"
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
                title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-slate-700 dark:text-cyan-300 cursor-pointer shrink-0 ${GLASS_TILE_BASE}`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Sections Menu Button (Placed immediately to the left of the theme toggle button) */}
              <button
                type="button"
                id="sections-menu-btn"
                onClick={() => setIsMenuOpen(true)}
                aria-label="قائمة الأقسام"
                title="قائمة الأقسام"
                className={`w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-slate-700 dark:text-cyan-300 cursor-pointer shrink-0 ${GLASS_TILE_BASE}`}
              >
                <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </button>
            </div>
          </nav>
        </header>

        {/* Side Menu Drawer for Navigation Sections */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop Overlay */}
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Side Drawer Panel */}
            <div className="relative w-80 max-w-[85vw] h-full bg-[#f8fafc] dark:bg-[#080e21] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-10 p-5 sm:p-6 ml-auto animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#040814] ring-1 ring-cyan-400/50 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_1.08.01_AM_48e19d64.jpeg"
                      alt={studioName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="font-latin font-bold text-sm text-slate-900 dark:text-white">
                    أقسام الموقع
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = NAV_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white dark:bg-white/[0.05] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 hover:border-blue-400 dark:hover:border-cyan-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600 dark:text-cyan-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {studioName} &copy; 2026
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

Navbar.displayName = 'Navbar';
