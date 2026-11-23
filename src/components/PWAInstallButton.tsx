import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'mobile';
  onActionComplete?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = React.memo(
  ({ variant = 'navbar', onActionComplete }) => {
    const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    if (isInstalled) {
      return null;
    }

    if (!isInstallable && !isIOS) {
      return null;
    }

    const handleClick = async () => {
      if (isInstallable) {
        await install();
        onActionComplete?.();
      } else if (isIOS) {
        setShowIOSGuide(true);
      }
    };

    return (
      <>
        {variant === 'mobile' ? (
          <button
            type="button"
            id="pwa-install-mobile-btn"
            onClick={handleClick}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 active:scale-[0.99] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>تثبيت التطبيق على الهاتف</span>
          </button>
        ) : (
          <button
            type="button"
            id="pwa-install-btn"
            onClick={handleClick}
            aria-label="تثبيت التطبيق"
            title="تثبيت تطبيق Mohamed Mahmoud Studio"
            className="min-h-[42px] sm:min-h-[44px] min-w-[42px] sm:min-w-[44px] inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white dark:bg-white/[0.06] dark:hover:bg-white/[0.12] backdrop-blur-xl border border-slate-200/90 dark:border-white/14 hover:border-blue-500/60 dark:hover:border-cyan-400/55 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-8px_rgba(37,99,235,0.38)] active:scale-95 text-slate-700 dark:text-cyan-300 hover:text-blue-600 dark:hover:text-cyan-200 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">تثبيت التطبيق</span>
          </button>
        )}

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-sm sm:p-4"
            onClick={() => setShowIOSGuide(false)}
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
                      id="ios-install-title"
                      className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
                    >
                      تثبيت التطبيق على iPhone و iPad
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mohamed Mahmoud Studio
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="إغلاق"
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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

              <button
                type="button"
                onClick={() => {
                  setShowIOSGuide(false);
                  onActionComplete?.();
                }}
                className="mt-5 w-full min-h-[46px] rounded-2xl bg-studio-gradient text-white font-bold text-sm cursor-pointer"
              >
                فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

PWAInstallButton.displayName = 'PWAInstallButton';
