import React, { useState, useEffect, useRef } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import {
  MessageCircle,
  ArrowDown,
  FolderGit2,
} from 'lucide-react';
import { ProfileInfo } from '../types';
import { scrollToElementById } from '../utils/scroll';
import { Card3DTilt } from './Card3DTilt';
import { MagneticWrapper } from './MagneticWrapper';
import { Interactive3DPortrait } from './Interactive3DPortrait';

interface HeroSectionProps {
  profile: ProfileInfo;
  totalProjects: number;
}

interface CounterItemProps {
  endValue: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

const AnimatedCounter: React.FC<CounterItemProps> = React.memo(
  ({ endValue, suffix = '', label, sublabel }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.35 });
    const prefersReducedMotion = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;
      if (prefersReducedMotion) {
        setCount(endValue);
        return;
      }

      let startTimestamp: number | null = null;
      const duration = 900;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * endValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      const rafId = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(rafId);
    }, [isInView, endValue, prefersReducedMotion]);

    return (
      <Card3DTilt
        maxTiltDeg={5}
        scaleOnHover={1.02}
        spotlightColor="rgba(56, 189, 248, 0.2)"
        className="p-4 sm:p-5 text-center sm:text-right hover:border-blue-400/50 dark:hover:border-cyan-400/40"
      >
        <div
          ref={ref}
          className="preserve-3d"
        >
          <div
            className="font-latin text-2xl sm:text-4xl font-extrabold text-studio-gradient tabular-nums tracking-tight depth-layer-1"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {count}
            {suffix}
          </div>
          <div className="mt-1.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {label}
          </div>
          <div className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
            {sublabel}
          </div>
        </div>
      </Card3DTilt>
    );
  }
);

AnimatedCounter.displayName = 'AnimatedCounter';

export const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({ profile, totalProjects }) => {
    const prefersReducedMotion = useReducedMotion();

    const roles = profile.typingRoles;
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState(roles[0] || '');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      if (prefersReducedMotion || roles.length === 0) {
        setDisplayedText(roles[0] || '');
        return;
      }

      const currentFullText = roles[roleIndex];
      let timeoutId: number;

      if (!isDeleting && displayedText === currentFullText) {
        timeoutId = window.setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        const speed = isDeleting ? 28 : 50;
        timeoutId = window.setTimeout(() => {
          const nextLength = isDeleting
            ? displayedText.length - 1
            : displayedText.length + 1;
          setDisplayedText(currentFullText.slice(0, nextLength));
        }, speed);
      }

      return () => window.clearTimeout(timeoutId);
    }, [displayedText, isDeleting, roleIndex, roles, prefersReducedMotion]);

    return (
      <section
        id="home"
        aria-label="الواجهة الرئيسية"
        className="relative pt-6 sm:pt-12 lg:pt-16 pb-10 sm:pb-16 overflow-x-clip"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 3D Interactive Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Primary Column: 3D Depth Typography & Magnetic CTAs */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right order-2 lg:order-1"
            >
              {/* Unboxed Clean Studio Kicker */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-blue-700 dark:text-cyan-300 mb-3 sm:mb-4">
                <span aria-hidden="true" className="w-6 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <span>محمد محمود استوديو · Mohamed Mahmoud Studio</span>
              </div>

              {/* Developer Name & Studio Heading */}
              <h1
                id="studio-name"
                className="font-latin text-[1.9rem] xs:text-[2.15rem] sm:text-5xl lg:text-[3.55rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] [text-wrap:balance]"
              >
                <span className="block drop-shadow-[0_6px_22px_rgba(37,99,235,0.16)] dark:drop-shadow-[0_8px_28px_rgba(56,189,248,0.28)]">
                  {profile.developerName}
                </span>
                <span className="block mt-2 text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-studio-gradient">
                  {profile.studioName}
                </span>
              </h1>

              {/* Role Subtitle */}
              <p
                id="developer-title"
                className="mt-3.5 text-sm sm:text-lg font-extrabold text-blue-700 dark:text-cyan-300"
              >
                {profile.roleTitle} (المطور والمبرمج محمد محمود) · Mohamed Mahmoud Web Developer
              </p>

              {/* Fixed-Height Typing Specialty Line */}
              <div
                aria-live="polite"
                className="mt-2.5 min-h-[3.25rem] sm:min-h-[2.5rem] flex items-center justify-center lg:justify-start px-1 sm:px-0"
              >
                <span className="text-sm xs:text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {displayedText}
                  <span
                    aria-hidden="true"
                    className="inline-block w-0.5 h-4 sm:h-5 bg-gradient-to-b from-blue-500 to-cyan-400 mr-1.5 align-middle animate-caret"
                  />
                </span>
              </div>

              {/* Official Arabic & English Studio Overview */}
              <p
                id="developer-bio"
                className="mt-2.5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
              >
                أهلاً بك في استوديو محمد محمود (Mohamed Mahmoud Studio)، الموقع الرسمي لأعمال محمد محمود البرمجية. يضم هذا المعرض أحدث تطبيقات ومواقع محمد محمود والمنصات التعليمية والحلول الرقمية من تصميم وتطوير المبرمج محمد محمود للتطبيقات والويب.
              </p>
              <p
                lang="en"
                dir="ltr"
                className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed"
              >
                Official Mohamed Mahmoud Portfolio by Mohamed Mahmoud Developer — showcasing Mohamed Mahmoud Apps, Mohamed Mahmoud Software, Websites, and Interactive Web Applications.
              </p>

              {/* Magnetic 3D CTA Controls (48px+ Touch Targets) */}
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <MagneticWrapper strength={0.22} className="w-full sm:w-auto">
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElementById('projects');
                    }}
                    className="w-full sm:w-auto min-h-[48px] px-6 sm:px-7 py-3.5 rounded-2xl bg-studio-gradient text-white font-bold text-sm sm:text-base shadow-[0_14px_30px_-8px_rgba(37,99,235,0.55)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
                  >
                    <FolderGit2 className="w-5 h-5 shrink-0" />
                    <span>استكشف المشروعات ({totalProjects})</span>
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={0.2} className="w-full sm:w-auto">
                  <a
                    id="hero-whatsapp-btn"
                    href={profile.whatsappUrl || 'https://wa.me/201031498281'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[48px] px-6 sm:px-7 py-3.5 rounded-2xl bg-white dark:bg-[#0d1732] hover:bg-emerald-600 dark:hover:bg-emerald-600 active:scale-[0.98] text-slate-800 dark:text-slate-100 hover:text-white border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 whitespace-nowrap group"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-500 group-hover:text-white shrink-0 transition-colors" />
                    <span>تواصل عبر واتساب</span>
                  </a>
                </MagneticWrapper>
              </div>
            </m.div>

            {/* Secondary Column: Interactive 3D Multi-Plane Portrait (Original Photo Intact!) */}
            <Interactive3DPortrait
              developerName={profile.developerName}
              studioName={profile.studioName}
              photoUrl={profile.photoUrl}
            />
          </div>

          {/* Real Portfolio Metrics Bar (4-Col Full-Width Row Below Split) */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 perspective-stage"
          >
            <AnimatedCounter
              endValue={totalProjects}
              suffix=""
              label="مشاريع وتطبيقات منشورة"
              sublabel="مواقع ومنصات حية قيد التشغيل"
            />
            <AnimatedCounter
              endValue={4}
              suffix=""
              label="مجالات رقمية متكاملة"
              sublabel="شركات · تعليم 3D · متاجر · أدوات"
            />
            <AnimatedCounter
              endValue={6}
              suffix=""
              label="خدمات برمجية وتصميمية"
              sublabel="من الفكرة والتصميم حتى النشر"
            />
            <AnimatedCounter
              endValue={100}
              suffix="%"
              label="توافق الهواتف والشاشات"
              sublabel="تجربة استخدام سريعة ومتجاوبة"
            />
          </m.div>

          {/* Touch-Friendly Scroll-Down Indicator */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => scrollToElementById('projects')}
              aria-label="النزول لاستكشاف المشروعات"
              className="min-h-[44px] px-4 py-1.5 group inline-flex flex-col items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 active:scale-95 transition-all cursor-pointer"
            >
              <span>اكتشف المشروعات والأعمال</span>
              <span className="w-9 h-9 rounded-full border border-slate-300 dark:border-cyan-400/30 flex items-center justify-center group-hover:border-blue-500 dark:group-hover:border-cyan-300 transition-colors shadow-sm">
                <ArrowDown className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';
