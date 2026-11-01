import React, { useState, useMemo, useRef } from 'react';
import { m } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
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
                  {/* Facebook Official Colorful App Icon */}
                  <a
                    href={
                      profile.facebookUrl ||
                      'https://www.facebook.com/mohamed.mahmoud.533503/?locale=ar_AR'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[54px] px-3.5 py-2.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.04] hover:bg-[#1877F2]/[0.08] dark:hover:bg-[#1877F2]/[0.14] active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200/85 dark:border-white/10 hover:border-[#1877F2]/50 font-bold text-xs sm:text-sm flex items-center justify-start sm:justify-center gap-2.5 transition-all group"
                  >
                    <span className="w-9 h-9 rounded-[10px] bg-gradient-to-b from-[#18ACFE] to-[#0163E0] shadow-[0_4px_12px_rgba(24,119,242,0.38)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                        <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73Z" />
                      </svg>
                    </span>
                    <span>فيسبوك</span>
                  </a>

                  {/* Instagram Official Multi-Color Gradient App Icon */}
                  <a
                    href={
                      profile.instagramUrl || 'https://www.instagram.com/eng_mohamed662010/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[54px] px-3.5 py-2.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.04] hover:bg-[#E1306C]/[0.08] dark:hover:bg-[#E1306C]/[0.14] active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200/85 dark:border-white/10 hover:border-[#E1306C]/50 font-bold text-xs sm:text-sm flex items-center justify-start sm:justify-center gap-2.5 transition-all group"
                  >
                    <span
                      className="w-9 h-9 rounded-[10px] shadow-[0_4px_12px_rgba(225,48,108,0.38)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="w-[21px] h-[21px] fill-none stroke-white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                        <circle cx="12" cy="12" r="4.25" />
                        <circle cx="17.4" cy="6.6" r="1.15" className="fill-white stroke-none" />
                      </svg>
                    </span>
                    <span>انستجرام</span>
                  </a>

                  {/* TikTok Official Dual-Neon App Icon */}
                  <a
                    href={profile.tiktokUrl || 'https://www.tiktok.com/@eng_mahamed6'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[54px] px-3.5 py-2.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.04] hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.09] active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200/85 dark:border-white/10 hover:border-[#25F4EE]/60 dark:hover:border-[#FE2C55]/55 font-bold text-xs sm:text-sm flex items-center justify-start sm:justify-center gap-2.5 transition-all group"
                  >
                    <span className="w-9 h-9 rounded-[10px] bg-[#07070b] border border-slate-900/10 dark:border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.32)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                        <path
                          fill="#25F4EE"
                          transform="translate(-0.85 -0.65)"
                          d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"
                        />
                        <path
                          fill="#FE2C55"
                          transform="translate(0.85 0.65)"
                          d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"
                        />
                        <path
                          fill="#FFFFFF"
                          d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"
                        />
                      </svg>
                    </span>
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
