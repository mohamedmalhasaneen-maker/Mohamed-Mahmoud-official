import React, { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, MessageCircle, ChevronLeft } from 'lucide-react';
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

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  whatsappUrl: string;
  studioName: string;
}

export const Navbar: React.FC<NavbarProps> = React.memo(
  ({ theme, onToggleTheme, whatsappUrl, studioName }) => {
    const [activeSection, setActiveSection] = useState<SectionId>('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Self-contained IntersectionObserver prevents parent App re-renders during scroll
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

    // Lightweight boolean-only scroll threshold check (zero extra state updates)
    useEffect(() => {
      const onScroll = () => {
        const isScrolled = window.scrollY > 16;
        setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on Escape or resize to desktop
    useEffect(() => {
      if (!mobileMenuOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      const onResize = () => {
        if (window.innerWidth >= 768) setMobileMenuOpen(false);
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('resize', onResize, { passive: true });
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('resize', onResize);
      };
    }, [mobileMenuOpen]);

    const handleNavigate = useCallback((id: SectionId) => {
      setMobileMenuOpen(false);
      setActiveSection(id);
      window.requestAnimationFrame(() => {
        scrollToElementById(id);
      });
    }, []);

    return (
      <>
        <header
          className={`sticky top-0 z-40 w-full pt-safe transition-colors duration-200 ${
            scrolled
              ? 'bg-white/90 dark:bg-[#060b18]/90 backdrop-blur-lg border-b border-slate-200/85 dark:border-white/10 shadow-[0_8px_24px_-14px_rgba(37,99,235,0.18)]'
              : 'bg-white/75 dark:bg-[#060b18]/75 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5'
          }`}
        >
          <nav
            aria-label="التنقل الرئيسي"
            className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2"
          >
            {/* Brand Identity */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('home');
              }}
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0 py-1"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#040814] ring-1 ring-cyan-400/45 shadow-[0_6px_18px_-4px_rgba(37,99,235,0.55)] flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-04_at_1.08.01_AM_48e19d64.jpeg"
                  alt={studioName}
                  width={44}
                  height={44}
                  decoding="async"
                  className="w-full h-full object-cover scale-[1.04] rounded-full select-none"
                />
              </div>
              <div className="flex flex-col text-right min-w-0">
                <span className="font-latin font-extrabold text-[13px] xs:text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  {studioName}
                </span>
                <span className="text-[11px] font-medium text-blue-600 dark:text-cyan-400 leading-tight hidden sm:block truncate">
                  تصميم وتطوير مواقع وتطبيقات الويب
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links (Compositor-Only Active Pill) */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item.id);
                    }}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 shadow-[0_4px_14px_-2px_rgba(59,130,246,0.45)]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Right Controls: Theme Toggle (44x44) + WhatsApp + Mobile Menu Toggle (44x44) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
                title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 active:scale-95 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-cyan-300 transition-all cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_-4px_rgba(37,99,235,0.45)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل واتساب</span>
              </a>

              {/* Mobile Menu Trigger (44x44px Touch Target) */}
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 active:scale-95 dark:bg-white/[0.07] border border-slate-200/85 dark:border-white/12 text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </header>

        {/* GPU-Composited Floating Mobile Menu Overlay (Zero Header Layout Reflow!) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-30 pt-16">
              {/* Tap-Outside Backdrop */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px]"
              />

              {/* Floating Menu Card (Transform + Opacity Only) */}
              <m.div
                id="mobile-nav-drawer"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-3 mt-2 rounded-2xl bg-white/98 dark:bg-[#0a1226]/98 border border-slate-200/90 dark:border-white/12 shadow-2xl p-3 max-h-[calc(100dvh-5.5rem)] overflow-y-auto"
              >
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate(item.id);
                        }}
                        className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold transition-all active:scale-[0.99] ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronLeft
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                      </a>
                    );
                  })}

                  <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-center gap-2 bg-emerald-600 active:scale-[0.99] hover:bg-emerald-500 text-white text-sm font-bold shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تواصل مباشر عبر واتساب</span>
                    </a>
                  </div>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

Navbar.displayName = 'Navbar';
