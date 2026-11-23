import { useState, useCallback, lazy, Suspense } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  PROFILE_DATA,
  PROJECTS,
} from './data/projects';
import { Project, ProjectFilterGroup } from './types';
import { useTheme } from './hooks/useTheme';
import { useConnectivityAndSync } from './hooks/useConnectivityAndSync';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientBackground } from './components/AmbientBackground';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { KineticMarquee } from './components/KineticMarquee';
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { PWAInstallButton } from './components/PWAInstallButton';
import { PWAStatusBanner } from './components/PWAStatusBanner';

// Progressive lazy loading for 3D Three.js stage and interactive modal
const CinematicScene3D = lazy(() =>
  import('./components/CinematicScene3D').then((mod) => ({ default: mod.CinematicScene3D }))
);
const ProjectModal = lazy(() => import('./components/ProjectModal'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [introVisible, setIntroVisible] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState<ProjectFilterGroup>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    indicatorState,
    needRefresh,
    offlineReady,
    dismissUpdate,
    dismissOfflineReady,
    applyUpdate,
    profile,
    projects,
  } = useConnectivityAndSync(PROFILE_DATA, PROJECTS);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleCompleteIntro = useCallback(() => {
    setIntroVisible(false);
  }, []);

  const handleReplayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setIntroKey((prev) => prev + 1);
    setIntroVisible(true);
  }, []);

  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation}>
        <div className="relative min-h-screen w-full bg-[#f4f7fc] text-slate-900 dark:bg-[#050a18] dark:text-slate-100 overflow-x-clip">
          {/* Cinematic Opening Loading Screen with Skip Intro */}
          <CinematicIntro key={introKey} visible={introVisible} onComplete={handleCompleteIntro} />

          {/* Instant Base Volumetric Layer + Progressive Lazy Three.js 3D Scene */}
          <AmbientBackground />
          <Suspense fallback={null}>
            <CinematicScene3D theme={theme} />
          </Suspense>

          {/* Sticky Architectural Navigation Bar */}
          <Navbar
            theme={theme}
            onToggleTheme={toggleTheme}
            whatsappUrl={profile.whatsappUrl || 'https://wa.me/201031498281'}
            studioName={profile.studioName}
          />

          {/* Main 3D Portfolio Experience with Portal Reveal */}
          <m.main
            initial={false}
            animate={
              introVisible
                ? { opacity: 0.25, scale: 0.975 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 origin-top"
          >
            {/* 1. 3D Interactive Hero & Portrait */}
            <HeroSection
              profile={profile}
              totalProjects={projects.length}
            />

            {/* 2. Kinetic Double-Band Studio Divider */}
            <KineticMarquee />

            {/* 3. 3D Interactive Portfolio Gallery */}
            <PortfolioSection
              projects={projects}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onSelectProject={setSelectedProject}
            />

            {/* 4. Direct Contact & 3D Studio Inquiry */}
            <ContactSection profile={profile} />
          </m.main>

          {/* Architectural Closing Studio Footer */}
          <Footer profile={profile} onReplayIntro={handleReplayIntro} />

          {/* Lazy-Loaded Project Details Modal */}
          {selectedProject && (
            <Suspense fallback={null}>
              <ProjectModal
                project={selectedProject}
                onClose={handleCloseModal}
                whatsappUrl={profile.whatsappUrl || 'https://wa.me/201031498281'}
              />
            </Suspense>
          )}

          {/* Floating Back-To-Top Button */}
          <BackToTop />

          {/* Floating Actions Container (Install App Above WhatsApp) */}
          <div
            className="fixed z-[99999] flex flex-col items-center"
            style={{
              right: '20px',
              bottom: 'calc(25px + env(safe-area-inset-bottom))',
              gap: '18px',
            }}
          >
            <PWAInstallButton />
            <FloatingWhatsAppButton
              whatsappUrl={profile.whatsappUrl || 'https://wa.me/201031498281'}
            />
          </div>

          {/* PWA Connectivity Indicator & Update Prompt */}
          <PWAStatusBanner
            indicatorState={indicatorState}
            needRefresh={needRefresh}
            offlineReady={offlineReady}
            onApplyUpdate={applyUpdate}
            onDismissUpdate={dismissUpdate}
            onDismissOfflineReady={dismissOfflineReady}
          />
        </div>
      </LazyMotion>
    </ErrorBoundary>
  );
}
