import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { RefreshCw, WifiOff, Wifi, X, Sparkles } from 'lucide-react';
import { ConnectivityIndicatorState } from '../hooks/useConnectivityAndSync';

interface PWAStatusBannerProps {
  indicatorState: ConnectivityIndicatorState;
  needRefresh: boolean;
  offlineReady: boolean;
  onApplyUpdate: () => void;
  onDismissUpdate: () => void;
  onDismissOfflineReady: () => void;
}

export const PWAStatusBanner: React.FC<PWAStatusBannerProps> = React.memo(
  ({
    indicatorState,
    needRefresh,
    offlineReady,
    onApplyUpdate,
    onDismissUpdate,
    onDismissOfflineReady,
  }) => {
    return (
      <div
        aria-live="polite"
        className="fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.35rem)] right-4 sm:right-6 z-40 flex flex-col items-start gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-none"
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
    );
  }
);

PWAStatusBanner.displayName = 'PWAStatusBanner';
