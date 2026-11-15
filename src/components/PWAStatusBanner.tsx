import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { RefreshCw, WifiOff, Wifi, X, Copy, Check, Sparkles } from 'lucide-react';
import { ConnectivityIndicatorState } from '../hooks/useConnectivityAndSync';
import { copyToClipboard } from '../utils/clipboard';

interface PWAStatusBannerProps {
  indicatorState: ConnectivityIndicatorState;
  needRefresh: boolean;
  offlineReady: boolean;
  blockedExternalUrl: string | null;
  onApplyUpdate: () => void;
  onDismissUpdate: () => void;
  onDismissOfflineReady: () => void;
  onCloseBlockedExternalUrl: () => void;
}

export const PWAStatusBanner: React.FC<PWAStatusBannerProps> = React.memo(
  ({
    indicatorState,
    needRefresh,
    offlineReady,
    blockedExternalUrl,
    onApplyUpdate,
    onDismissUpdate,
    onDismissOfflineReady,
    onCloseBlockedExternalUrl,
  }) => {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const copyLockRef = useRef(false);

    const handleCopyBlockedUrl = async () => {
      if (!blockedExternalUrl || copyLockRef.current) return;
      copyLockRef.current = true;
      const ok = await copyToClipboard(blockedExternalUrl);
      if (ok) {
        setCopiedUrl(true);
        window.setTimeout(() => {
          setCopiedUrl(false);
          copyLockRef.current = false;
        }, 1800);
      } else {
        copyLockRef.current = false;
      }
    };

    const blockedHostname = (() => {
      if (!blockedExternalUrl) return '';
      try {
        return new URL(blockedExternalUrl).hostname;
      } catch {
        return blockedExternalUrl;
      }
    })();

    return (
      <>
        {/* Non-Intrusive Connectivity & Update Floating Stack (Only Shown When Needed) */}
        <div
          aria-live="polite"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:right-6 z-40 flex flex-col items-start gap-2 max-w-[calc(100vw-5.5rem)] sm:max-w-sm pointer-events-none"
        >
          {/* Connectivity Indicator: Offline (Red), Syncing (Spin), Online Reconnected (Green, auto-hides) */}
          <AnimatePresence>
            {indicatorState !== 'hidden' && (
              <m.div
                id="pwa-connectivity-indicator"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-lg backdrop-blur-md ${
                  indicatorState === 'offline'
                    ? 'bg-slate-900/95 dark:bg-[#0d152b]/95 border-rose-500/45 text-rose-100'
                    : indicatorState === 'syncing'
                      ? 'bg-slate-900/95 dark:bg-[#0d152b]/95 border-sky-500/45 text-sky-100'
                      : 'bg-slate-900/95 dark:bg-[#0d152b]/95 border-emerald-500/45 text-emerald-100'
                }`}
              >
                {indicatorState === 'offline' && (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.85)] shrink-0"
                    />
                    <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>غير متصل بالإنترنت · وضع التصفح المحلي</span>
                  </>
                )}

                {indicatorState === 'syncing' && (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                    <span>جاري تحديث البيانات...</span>
                  </>
                )}

                {indicatorState === 'online' && (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)] shrink-0"
                    />
                    <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>متصل بالإنترنت · تم تحديث البيانات</span>
                  </>
                )}
              </m.div>
            )}
          </AnimatePresence>

          {/* First-Time Offline Cache Ready Subtle Notice */}
          <AnimatePresence>
            {offlineReady && !needRefresh && indicatorState === 'hidden' && (
              <m.div
                id="pwa-offline-ready-toast"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-cyan-500/35 text-slate-100 text-xs font-bold shadow-lg backdrop-blur-md"
              >
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"
                />
                <span>التطبيق جاهز للعمل بدون إنترنت</span>
                <button
                  type="button"
                  onClick={onDismissOfflineReady}
                  aria-label="إغلاق الإشعار"
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </m.div>
            )}
          </AnimatePresence>

          {/* App Update Notification Toast */}
          <AnimatePresence>
            {needRefresh && (
              <m.div
                id="pwa-update-toast"
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="pointer-events-auto w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/98 dark:bg-[#0d1730]/98 border border-blue-500/40 dark:border-cyan-400/40 text-slate-900 dark:text-white shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold leading-tight">
                      يتوفر تحديث جديد للموقع
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      تم حفظ النسخة الجديدة بنجاح
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    id="pwa-update-now-btn"
                    onClick={onApplyUpdate}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-studio-gradient text-white text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    تحديث الآن
                  </button>
                  <button
                    type="button"
                    onClick={onDismissUpdate}
                    aria-label="تأجيل التحديث"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Offline External Link Dialog */}
        <AnimatePresence>
          {blockedExternalUrl && (
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="offline-external-title"
              aria-describedby="offline-external-desc"
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
            >
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCloseBlockedExternalUrl}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
              />

              <m.div
                id="offline-external-modal"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0b1328] border-t sm:border border-slate-200 dark:border-white/15 p-5 sm:p-6 shadow-2xl text-right"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                      <WifiOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        id="offline-external-title"
                        className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
                      >
                        الاتصال بالإنترنت مطلوب
                      </h3>
                      <p className="font-latin text-xs text-slate-500 dark:text-slate-400 truncate max-w-[210px]">
                        {blockedHostname}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onCloseBlockedExternalUrl}
                    aria-label="إغلاق"
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p
                  id="offline-external-desc"
                  className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  الاتصال بالإنترنت مطلوب لفتح الموقع الخارجي. يمكنك الاستمرار في تصفح جميع أقسام
                  الموقع واستعراض تفاصيل المشاريع المحفوظة محلياً بكل سهولة.
                </p>

                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onCloseBlockedExternalUrl}
                    className="flex-1 min-h-[46px] px-4 py-2.5 rounded-2xl bg-studio-gradient text-white font-bold text-sm cursor-pointer"
                  >
                    حسناً، متابعة التصفح
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyBlockedUrl}
                    className="min-h-[46px] px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>تم نسخ الرابط</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

PWAStatusBanner.displayName = 'PWAStatusBanner';
