import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Globe, Menu, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'floating-mobile';
  onActionComplete?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = React.memo(
  ({ onActionComplete }) => {
    const { hasNativePrompt, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
    const [showGuide, setShowGuide] = useState(false);

    if (isInstalled) {
      return null;
    }

    const handleClick = async () => {
      if (hasNativePrompt) {
        const success = await install();
        if (success) {
          onActionComplete?.();
          return;
        }
      }
      setShowGuide(true);
    };

    return (
      <>
        <button
          type="button"
          id="pwa-install-floating"
          onClick={handleClick}
          aria-label="تثبيت التطبيق"
          title="تثبيت تطبيق Mohamed Mahmoud Studio"
          className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 hover:brightness-110 text-white shadow-[0_10px_28px_-5px_rgba(37,99,235,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer relative group shrink-0"
        >
          <Download className="w-6 h-6 shrink-0" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-[#0b1328] border border-white/15 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            تثبيت التطبيق
          </span>
        </button>

        {showGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-guide-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 sm:p-4"
            onClick={() => setShowGuide(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0b1328] border-t sm:border border-slate-200 dark:border-white/15 p-5 sm:p-6 shadow-2xl text-right"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      id="install-guide-title"
                      className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
                    >
                      تثبيت تطبيق Mohamed Mahmoud Studio
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      استمتع بتجربة تطبيق مستقل وسريع بدون إنترنت
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  aria-label="إغلاق"
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isIOS ? (
                <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <Share className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      1. اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.
                    </span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <PlusSquare className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>
                      2. مرّر لأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                    </span>
                  </li>
                </ol>
              ) : isAndroid ? (
                <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <MoreVertical className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      1. اضغط على قائمة المتصفح (النقاط الثلاث أعلى اليمين).
                    </span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <Download className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>
                      2. اختر <strong>تثبيت التطبيق (Install App)</strong> أو <strong>إضافة إلى الشاشة الرئيسية</strong>.
                    </span>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      1. ابحث عن أيقونة التثبيت <Download className="w-4 h-4 inline text-cyan-400" /> في شريط عنوان المتصفح (أعلى اليمين أو اليسار).
                    </span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                    <Download className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>
                      2. اضغط على <strong>تثبيت (Install)</strong> لتثبيت التطبيق على جهازك.
                    </span>
                  </li>
                </ol>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowGuide(false);
                  onActionComplete?.();
                }}
                className="mt-5 w-full min-h-[46px] rounded-2xl bg-studio-gradient text-white font-bold text-sm cursor-pointer shadow-lg"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

PWAInstallButton.displayName = 'PWAInstallButton';
