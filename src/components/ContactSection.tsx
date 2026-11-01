import React, { useState, useMemo, useRef } from 'react';
import { m } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Video,
  Copy,
  Check,
  ArrowUpLeft,
  Sparkles,
} from 'lucide-react';
import { ProfileInfo } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { SpotlightCard } from './SpotlightCard';

interface ContactSectionProps {
  profile: ProfileInfo;
}

const PROJECT_TYPES = [
  'موقع تعريفي لشركة أو مؤسسة',
  'تطبيق ويب تفاعلي مخصص',
  'متجر إلكتروني مع طلب واتساب',
  'منصة تعليمية أو محاكاة 3D',
  'أداة ذكية / نظام حساب تكاليف',
  'مشروع آخر',
];

export const ContactSection: React.FC<ContactSectionProps> = React.memo(({ profile }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyLockRef = useRef(false);
  const [senderName, setSenderName] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [projectDetails, setProjectDetails] = useState('');

  const phone = profile.phone || '01031498281';
  const whatsappUrl = profile.whatsappUrl || 'https://wa.me/201031498281';
  const telegramUrl = profile.telegramUrl || 'https://t.me/+201031498281';
  const email = profile.email || 'mohamed.m.alhasaneen@gmail.com';

  const handleCopy = async (key: string, value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (copyLockRef.current) return;
    copyLockRef.current = true;

    const ok = await copyToClipboard(value);
    if (ok) {
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey(null);
        copyLockRef.current = false;
      }, 1800);
    } else {
      copyLockRef.current = false;
    }
  };

  const composedWhatsappHref = useMemo(() => {
    const lines = [
      'مرحباً م. محمد محمود،',
      senderName.trim() ? `الاسم: ${senderName.trim()}` : '',
      `نوع المشروع المطلوب: ${projectType}`,
      projectDetails.trim() ? `التفاصيل: ${projectDetails.trim()}` : '',
    ].filter(Boolean);

    const encoded = encodeURIComponent(lines.join('\n'));
    return `${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${encoded}`;
  }, [whatsappUrl, senderName, projectType, projectDetails]);

  const composedEmailHref = useMemo(() => {
    const subject = encodeURIComponent(
      `طلب مشروع جديد: ${projectType}${senderName.trim() ? ` - ${senderName.trim()}` : ''}`
    );
    const body = encodeURIComponent(
      [
        'مرحباً م. محمد محمود،',
        senderName.trim() ? `الاسم: ${senderName.trim()}` : '',
        `نوع المشروع: ${projectType}`,
        projectDetails.trim() ? `\nالتفاصيل:\n${projectDetails.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }, [email, senderName, projectType, projectDetails]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-12 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Pre-softened Radial Glow (Zero CSS Blur Filter Cost on Mobile) */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[22rem] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(124,58,237,0.08) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <span className="text-xs sm:text-sm font-bold tracking-wide text-blue-600 dark:text-cyan-400">
            تواصل مباشر وسريع
          </span>
          <h2
            id="contact-heading"
            className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
          >
            لنبدأ بتحويل فكرتك القادمة إلى مشروع رقمي مميز
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            يسعدني تواصلك لمناقشة تفاصيل موقعك أو تطبيقك القادم عبر واتساب أو أي من قنوات التواصل المباشرة.
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          {/* Right Column: Separate Contact Channel Cards + Social Profiles */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4 }}
              >
                <a
                  id="contact-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <SpotlightCard
                    spotlightColor="rgba(16, 185, 129, 0.24)"
                    className="touch-card-interactive h-full p-5 hover:border-emerald-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                      واتساب مباشر
                    </h3>
                    <p className="mt-1 font-latin text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {phone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      تحدث معي مباشرة لمناقشة مشروعك
                    </p>
                  </SpotlightCard>
                </a>
              </m.div>

              {/* Telegram Card */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <SpotlightCard
                    spotlightColor="rgba(14, 165, 233, 0.24)"
                    className="touch-card-interactive h-full p-5 hover:border-sky-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <Send className="w-5 h-5" />
                      </div>
                      <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                      تيليجرام
                    </h3>
                    <p className="mt-1 font-latin text-sm font-bold text-sky-600 dark:text-sky-400">
                      {phone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      مراسلة سريعة ومشاركة ملفات المشروع
                    </p>
                  </SpotlightCard>
                </a>
              </m.div>

              {/* Direct Phone Call Card */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <a href={`tel:${phone}`} className="block h-full group">
                  <SpotlightCard
                    spotlightColor="rgba(124, 58, 237, 0.24)"
                    className="touch-card-interactive h-full p-5 hover:border-violet-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <Phone className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('phone', phone, e)}
                        title="نسخ رقم الهاتف"
                        aria-label="نسخ رقم الهاتف"
                        className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 active:scale-95 dark:hover:bg-white/[0.14] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                      >
                        {copiedKey === 'phone' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                      اتصال هاتفي مباشر
                    </h3>
                    <p className="mt-1 font-latin text-sm font-bold text-violet-600 dark:text-violet-400">
                      {phone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {copiedKey === 'phone' ? 'تم نسخ الرقم بنجاح!' : 'اضغط للاتصال المباشر أو نسخ الرقم'}
                    </p>
                  </SpotlightCard>
                </a>
              </m.div>

              {/* Email Card */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <a href={`mailto:${email}`} className="block h-full group">
                  <SpotlightCard
                    spotlightColor="rgba(6, 182, 212, 0.24)"
                    className="touch-card-interactive h-full p-5 hover:border-cyan-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <Mail className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('email', email, e)}
                        title="نسخ البريد الإلكتروني"
                        aria-label="نسخ البريد الإلكتروني"
                        className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 active:scale-95 dark:hover:bg-white/[0.14] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                      >
                        {copiedKey === 'email' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                      البريد الإلكتروني
                    </h3>
                    <p
                      dir="ltr"
                      className="mt-1 font-latin text-xs font-bold text-cyan-700 dark:text-cyan-300 break-all text-right"
                    >
                      {email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {copiedKey === 'email' ? 'تم نسخ البريد بنجاح!' : 'للمراسلات الرسمية وعروض الأعمال'}
                    </p>
                  </SpotlightCard>
                </a>
              </m.div>
            </div>

            {/* Social Media Accounts Card */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SpotlightCard className="p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-3.5">
                  الحسابات الرسمية على منصات التواصل الاجتماعي
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <a
                    href={
                      profile.facebookUrl ||
                      'https://www.facebook.com/mohamed.mahmoud.533503/?locale=ar_AR'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-[#1877F2] dark:hover:bg-[#1877F2] active:scale-[0.98] text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/80 dark:border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white shrink-0 transition-colors" />
                    <span>فيسبوك</span>
                  </a>

                  <a
                    href={
                      profile.instagramUrl || 'https://www.instagram.com/eng_mohamed662010/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-[#E4405F] dark:hover:bg-[#E4405F] active:scale-[0.98] text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/80 dark:border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <Instagram className="w-4 h-4 text-[#E4405F] group-hover:text-white shrink-0 transition-colors" />
                    <span>انستجرام</span>
                  </a>

                  <a
                    href={profile.tiktokUrl || 'https://www.tiktok.com/@eng_mahamed6'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-900 dark:hover:bg-black active:scale-[0.98] text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200/80 dark:border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group"
                  >
                    <Video className="w-4 h-4 text-cyan-500 group-hover:text-cyan-300 shrink-0 transition-colors" />
                    <span>تيك توك</span>
                  </a>
                </div>
              </SpotlightCard>
            </m.div>
          </div>

          {/* Left Column: Direct WhatsApp / Email Project Inquiry Form (16px Mobile Font Prevents Auto-Zoom) */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-6"
          >
            <SpotlightCard className="p-5 sm:p-8 border-blue-500/20 dark:border-cyan-400/20">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-studio-gradient flex items-center justify-center text-white shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  أرسل تفاصيل مشروعك مباشرة
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 sm:mb-6 leading-relaxed">
                اكتب نبذة سريعة عن فكرتك ليتم تجهيز رسالتك وإرسالها فوراً عبر واتساب أو البريد الإلكتروني.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label
                    htmlFor="inquiry-name"
                    className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    الاسم الكريم أو اسم الشركة
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    autoComplete="name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="مثال: أحمد / شركة النور"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-base sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry-type"
                    className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    نوع المشروع المطلوب
                  </label>
                  <select
                    id="inquiry-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-base sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-white dark:bg-slate-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-details"
                    className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    تفاصيل الفكرة أو المتطلبات
                  </label>
                  <textarea
                    id="inquiry-details"
                    rows={3}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="اكتب نبذة مختصرة عن المشروع أو المميزات التي ترغب بها..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-base sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={composedWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[48px] px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_-6px_rgba(16,185,129,0.45)] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>إرسال عبر واتساب الآن</span>
                  </a>

                  <a
                    href={composedEmailHref}
                    className="min-h-[48px] px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200/85 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>إرسال عبر البريد</span>
                  </a>
                </div>
              </form>
            </SpotlightCard>
          </m.div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
