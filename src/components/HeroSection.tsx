import React, { useState, useEffect, useRef } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  ArrowDown,
  FolderGit2,
  Send,
  Phone,
  Facebook,
  Instagram,
  Video,
} from 'lucide-react';
import { ProfileInfo } from '../types';
import { scrollToElementById } from '../utils/scroll';
import defaultDevPhoto from '../assets/developer-photo.jpg';
import devPhoto480Webp from '../assets/developer-photo-480.webp';
import devPhoto800Webp from '../assets/developer-photo-800.webp';

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
      const duration = 950;

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
      <div
        ref={ref}
        className="p-3.5 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#0c1428]/90 md:bg-white/80 md:dark:bg-slate-900/60 md:backdrop-blur-xl border border-slate-200/85 dark:border-white/10 text-center sm:text-right"
      >
        <div
          className="font-latin text-2xl sm:text-3xl font-extrabold text-studio-gradient tabular-nums tracking-tight"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {count}
          {suffix}
        </div>
        <div className="mt-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
          {label}
        </div>
        <div className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
          {sublabel}
        </div>
      </div>
    );
  }
);

AnimatedCounter.displayName = 'AnimatedCounter';

export const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({ profile, totalProjects }) => {
    const prefersReducedMotion = useReducedMotion();
    const [photoSrc, setPhotoSrc] = useState<string>(
      defaultDevPhoto || profile.photoUrl || '/profile.jpg'
    );
    const [useFallbackJpgOnly, setUseFallbackJpgOnly] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Accessible Typewriter Effect with Stable Container Height (Zero Mobile Layout Shift)
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
        className="relative pt-5 sm:pt-10 lg:pt-16 pb-10 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-12 items-center">
            {/* Right Column (RTL Primary Typography & CTAs) */}
            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right order-2 lg:order-1"
            >
              {/* Eyebrow Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 dark:bg-sky-500/10 border border-blue-500/20 dark:border-cyan-400/25 text-blue-700 dark:text-cyan-300 text-xs sm:text-sm font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 dark:text-cyan-400 shrink-0" />
                <span>متاح لتطوير المشاريع البرمجية والحلول الذكية</span>
              </div>

              {/* Developer Name & Studio Heading */}
              <h1
                id="studio-name"
                className="font-latin text-[1.75rem] xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
              >
                <span className="block">{profile.developerName}</span>
                <span className="block mt-1.5 sm:mt-2 text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-studio-gradient font-sans">
                  {profile.studioName}
                </span>
              </h1>

              {/* Role Subtitle */}
              <p
                id="developer-title"
                className="mt-3 text-sm sm:text-lg font-bold text-blue-600 dark:text-sky-400"
              >
                {profile.roleTitle}
              </p>

              {/* Fixed-Height Typing Specialty Line — Prevents Vertical Jumping on Narrow Phones */}
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

              {/* Preserved Original Bio */}
              <p
                id="developer-bio"
                className="mt-2.5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
              >
                {profile.bio} — نصمم ونبرمج تجارب ويب عصرية تجمع بين قوة الأداء، جاذبية الهوية البصرية، وسلاسة الاستخدام على الهواتف وأجهزة الكمبيوتر.
              </p>

              {/* Primary Interactive CTA Buttons (48px+ Touch Targets) */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => scrollToElementById('projects')}
                  className="min-h-[48px] px-6 sm:px-7 py-3.5 rounded-2xl bg-studio-gradient text-white font-bold text-sm sm:text-base shadow-[0_10px_26px_-8px_rgba(37,99,235,0.55)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FolderGit2 className="w-5 h-5 shrink-0" />
                  <span>استكشف المشروعات ({totalProjects})</span>
                </button>

                <a
                  id="hero-whatsapp-btn"
                  href={profile.whatsappUrl || 'https://wa.me/201031498281'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-6 sm:px-7 py-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/85 hover:bg-emerald-600 dark:hover:bg-emerald-600 active:scale-[0.98] text-slate-800 dark:text-slate-100 hover:text-white border border-slate-200 dark:border-emerald-500/35 hover:border-emerald-500 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 group"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500 group-hover:text-white shrink-0 transition-colors" />
                  <span>تواصل عبر واتساب</span>
                </a>
              </div>

              {/* Touch-Friendly Quick Channels Bar (All >= 44px Hitboxes) */}
              <div
                id="contact-channels"
                className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full"
              >
                <a
                  id="contact-telegram-btn"
                  href={profile.telegramUrl || 'https://t.me/+201031498281'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] hover:bg-sky-600 dark:hover:bg-sky-600 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-bold transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                  <span>تيليجرام</span>
                </a>

                <a
                  id="contact-phone-btn"
                  href={`tel:${profile.phone || '01031498281'}`}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] hover:bg-blue-600 dark:hover:bg-blue-600 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                  <span className="font-latin">{profile.phone || '01031498281'}</span>
                </a>

                <a
                  id="social-facebook-btn"
                  href={
                    profile.facebookUrl ||
                    'https://www.facebook.com/mohamed.mahmoud.533503/?locale=ar_AR'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك"
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] hover:bg-[#1877F2] active:scale-95 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-bold transition-all"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>فيسبوك</span>
                </a>

                <a
                  id="social-instagram-btn"
                  href={profile.instagramUrl || 'https://www.instagram.com/eng_mohamed662010/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="انستجرام"
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] hover:bg-[#E4405F] active:scale-95 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-bold transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>انستجرام</span>
                </a>

                <a
                  id="social-tiktok-btn"
                  href={profile.tiktokUrl || 'https://www.tiktok.com/@eng_mahamed6'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] hover:bg-slate-900 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-bold transition-all"
                >
                  <Video className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>تيك توك</span>
                </a>
              </div>
            </m.div>

            {/* Left Column (RTL Developer Portrait — WebP + Original JPG Fallback, Zero CLS 3:4 Box) */}
            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex justify-center order-1 lg:order-2 px-3"
            >
              <div className="relative w-full max-w-[205px] xs:max-w-[235px] sm:max-w-[290px] lg:max-w-[360px]">
                {/* Pre-softened Radial Aura (Zero Blur Filter GPU Cost) */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-[2.25rem] opacity-85 dark:opacity-100 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(59,130,246,0.32) 0%, rgba(124,58,237,0.22) 45%, transparent 72%)',
                  }}
                />

                {/* Safe-Bounded Geometric Corner Accents */}
                <div
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-tr-3xl border-t-2 border-r-2 border-cyan-400/75 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-14 sm:h-14 rounded-bl-3xl border-b-2 border-l-2 border-violet-500/75 pointer-events-none"
                />

                {/* Gradient-Bordered Portrait Frame with Reserved 3:4 Aspect Ratio */}
                <div
                  id="developer-photo-wrapper"
                  className="relative rounded-[1.5rem] sm:rounded-[1.75rem] p-[2px] bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 shadow-[0_18px_44px_-12px_rgba(37,99,235,0.4)]"
                >
                  <div className="relative aspect-[3/4] w-full rounded-[calc(1.5rem-2px)] sm:rounded-[calc(1.75rem-2px)] overflow-hidden bg-slate-200 dark:bg-slate-900">
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
                          sizes="(max-width: 640px) 235px, (max-width: 1024px) 290px, 360px"
                        />
                      )}
                      <img
                        id="developer-photo-img"
                        src={photoSrc}
                        alt={profile.developerName}
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
                </div>
              </div>
            </m.div>
          </div>

          {/* Real Portfolio Metrics Bar */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
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
              <span className="w-9 h-9 rounded-full border border-slate-300 dark:border-white/15 flex items-center justify-center group-hover:border-blue-500 dark:group-hover:border-cyan-400 transition-colors">
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
