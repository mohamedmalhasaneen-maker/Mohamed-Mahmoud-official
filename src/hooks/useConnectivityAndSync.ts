import { useEffect, useRef, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ProfileInfo, Project } from '../types';

export type ConnectivityIndicatorState = 'hidden' | 'offline' | 'syncing' | 'online';

interface SnapshotPayload {
  version?: string;
  updatedAt?: string;
  profile?: ProfileInfo;
  projects?: Project[];
}

const SNAPSHOT_STORAGE_KEY = 'mm-studio-offline-snapshot-v1';

function readLocalSnapshot(): SnapshotPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SnapshotPayload;
    if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore corrupt localStorage entries
  }
  return null;
}

function writeLocalSnapshot(payload: SnapshotPayload) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function useConnectivityAndSync(
  initialProfile: ProfileInfo,
  initialProjects: Project[]
) {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [indicatorState, setIndicatorState] = useState<ConnectivityIndicatorState>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'hidden'
  );
  const [snapshot, setSnapshot] = useState<SnapshotPayload>(() => {
    const cached = readLocalSnapshot();
    if (cached && cached.projects && cached.projects.length >= initialProjects.length) {
      return cached;
    }
    const seed: SnapshotPayload = {
      profile: initialProfile,
      projects: initialProjects,
    };
    writeLocalSnapshot(seed);
    return seed;
  });

  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const hideTimerRef = useRef<number | null>(null);
  const wasOfflineRef = useRef<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration;
      if (registration) {
        // Periodically check for newly deployed versions (every 60 mins)
        window.setInterval(() => {
          if (navigator.onLine) {
            registration.update().catch(() => {});
          }
        }, 60 * 60 * 1000);
      }
    },
  });

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const syncDataSnapshot = useCallback(
    async (showSyncIndicator: boolean) => {
      if (typeof window === 'undefined' || !navigator.onLine) return;

      clearHideTimer();
      if (showSyncIndicator) {
        setIndicatorState('syncing');
      }

      try {
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.ready.catch(() => undefined);
          if (registrationRef.current) {
            registrationRef.current.update().catch(() => {});
          }
        }

        const response = await fetch('/projects-snapshot.json', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const data = (await response.json()) as SnapshotPayload;
          if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            writeLocalSnapshot(data);
            setSnapshot(data);
          }
        }

        // Warm-cache Google Fonts stylesheet and font files through active SW on first online visit
        const fontsCssUrl =
          'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap';
        const fontRes = await fetch(fontsCssUrl, { mode: 'cors' }).catch(() => null);
        if (fontRes && fontRes.ok) {
          const cssText = await fontRes.text();
          const fontUrls = Array.from(
            new Set(
              Array.from(cssText.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)).map(
                (m) => m[1]
              )
            )
          ).slice(0, 12);
          await Promise.allSettled(
            fontUrls.map((url) => fetch(url, { mode: 'cors' }).catch(() => null))
          );
        }
      } catch {
        // Silent fallback to cached local snapshot
      } finally {
        if (showSyncIndicator && navigator.onLine) {
          setIndicatorState('online');
          hideTimerRef.current = window.setTimeout(() => {
            setIndicatorState('hidden');
          }, 3500);
        }
      }
    },
    [clearHideTimer]
  );

  // Warm / sync snapshot silently on initial online load
  useEffect(() => {
    if (navigator.onLine) {
      void syncDataSnapshot(false);
    }
  }, [syncDataSnapshot]);

  // Auto-hide offlineReady notice after a brief display
  useEffect(() => {
    if (!offlineReady) return;
    const t = window.setTimeout(() => setOfflineReady(false), 4500);
    return () => window.clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  // Listen to online / offline connectivity transitions
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const shouldNotifySync = wasOfflineRef.current;
      wasOfflineRef.current = false;
      void syncDataSnapshot(shouldNotifySync);
    };

    const handleOffline = () => {
      clearHideTimer();
      wasOfflineRef.current = true;
      setIsOnline(false);
      setIndicatorState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearHideTimer();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [clearHideTimer, syncDataSnapshot]);

  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  const dismissOfflineReady = useCallback(() => {
    setOfflineReady(false);
  }, [setOfflineReady]);

  const applyUpdate = useCallback(async () => {
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  return {
    isOnline,
    indicatorState,
    needRefresh,
    offlineReady,
    dismissUpdate,
    dismissOfflineReady,
    applyUpdate,
    profile: snapshot.profile || initialProfile,
    projects:
      snapshot.projects && snapshot.projects.length >= initialProjects.length
        ? snapshot.projects
        : initialProjects,
  };
}
