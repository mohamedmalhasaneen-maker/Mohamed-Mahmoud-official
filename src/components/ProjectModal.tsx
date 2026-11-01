import React, { useEffect, useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { Project } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { ProjectArtwork } from './ProjectArtwork';

export interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  whatsappUrl: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  whatsappUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const isCopyingRef = useRef(false);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const handleCopy = async () => {
    if (!project || isCopyingRef.current) return;
    isCopyingRef.current = true;
    const ok = await copyToClipboard(project.url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
        isCopyingRef.current = false;
      }, 1800);
    } else {
      isCopyingRef.current = false;
    }
  };

  const buildSimilarProjectWhatsapp = (title: string) => {
    const base = whatsappUrl || 'https://wa.me/201031498281';
    const text = encodeURIComponent(
      `مرحباً م. محمد محمود، أعجبني مشروع "${title}" وأود الاستفسار عن تنفيذ مشروع مماثل.`
    );
    return `${base}${base.includes('?') ? '&' : '?'}text=${text}`;
  };

  return (
    <AnimatePresence>
      {project && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
        >
          {/* Tap-to-Dismiss Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          {/* Responsive Bottom Sheet on Mobile / Centered Modal on Tablet & Desktop */}
          <m.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0b1328] border-t sm:border border-slate-200 dark:border-white/15 shadow-2xl text-right overflow-hidden"
          >
            {/* Dedicated Sticky Modal Top Bar (Prevents Close Button Collision on Small Screens) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0b1328]/95 shrink-0">
              <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 truncate pl-2">
                {project.category.replace('•', '·')}
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق نافذة تفاصيل المشروع"
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-slate-700 dark:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body with Overscroll Containment */}
            <div className="overflow-y-auto overscroll-contain flex-1">
              {/* Artwork Stage */}
              <ProjectArtwork project={project} size="modal" />

              {/* Details Content */}
              <div className="p-5 sm:p-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <h3
                  id="project-modal-title"
                  className="text-lg xs:text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug"
                >
                  {project.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Highlights */}
                {project.highlights.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2.5">
                      أبرز مميزات المشروع:
                    </h4>
                    <ul className="space-y-2">
                      {project.highlights.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Used */}
                {project.techStack.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      التقنيات والأدوات المستخدمة:
                    </span>
                    <p
                      dir="ltr"
                      className="font-latin text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 text-right"
                    >
                      {project.techStack.join('  ·  ')}
                    </p>
                  </div>
                )}

                {/* Direct Live URL Bar */}
                <div className="mt-5 p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="font-latin text-xs sm:text-sm text-blue-600 dark:text-cyan-300 hover:underline truncate"
                    >
                      {project.url}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.08] active:scale-95 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0 transition-transform cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Modal Actions (48px Touch Targets) */}
                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[48px] px-5 py-3 rounded-2xl bg-studio-gradient active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_24px_-6px_rgba(37,99,235,0.5)] transition-transform"
                  >
                    <span>فتح المشروع المباشر</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>

                  <a
                    href={buildSimilarProjectWhatsapp(project.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>اطلب مشروعاً مماثلاً</span>
                  </a>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
