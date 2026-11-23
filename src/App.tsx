import { useState, useCallback, lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import {
  PROFILE_DATA,
  PROJECTS,
} from './data/projects';
import { Project, ProjectFilterGroup } from './types';
import { useTheme } from './hooks/useTheme';
import { useConnectivityAndSync } from './hooks/useConnectivityAndSync';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { KineticMarquee } from './components/KineticMarquee';
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { PWAStatusBanner } from './components/PWAStatusBanner';

// Progressive lazy loading for 3D Three.js stage and interactive modal
const CinematicScene3D = lazy(() =>
  import('./components/CinematicScene3D').then((mod) => ({ default: mod.CinematicScene3D }))
);
const ProjectModal = lazy(() => import('./components/ProjectModal'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
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

  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation}>
        <div className="relative min-h-screen w-full bg-[#f4f7fc] text-slate-900 dark:bg-[#050a18] dark:text-slate-100 overflow-x-clip">
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

          {/* Main 3D Portfolio Experience */}
          <main className="relative z-10">
            {/* 1. 3D Interactive Hero & Floating Studio Pass Portrait */}
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
          </main>

          {/* Architectural Closing Studio Footer */}
          <Footer profile={profile} />

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

          {/* Floating Official WhatsApp Button (Fixed Bottom-Left) */}
          <FloatingWhatsAppButton
            whatsappUrl={profile.whatsappUrl || 'https://wa.me/201031498281'}
          />

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

