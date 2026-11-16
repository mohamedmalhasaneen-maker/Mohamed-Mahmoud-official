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
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { PWAStatusBanner } from './components/PWAStatusBanner';

// Code-split ProjectModal so modal chunk only loads when a user opens project details
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
        <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#060b18] dark:text-slate-100 overflow-x-clip">
          {/* Lightweight Radial Ambient Backdrop */}
          <AmbientBackground />

          {/* Sticky Glassmorphism Navigation Bar (Self-Contained Active Section Observer) */}
          <Navbar
            theme={theme}
            onToggleTheme={toggleTheme}
            whatsappUrl={profile.whatsappUrl || 'https://wa.me/201031498281'}
            studioName={profile.studioName}
          />

          {/* Main Portfolio Experience */}
          <main className="relative z-10">
            {/* 1. Hero & Real Portfolio Metrics */}
            <HeroSection
              profile={profile}
              totalProjects={projects.length}
            />

            {/* 2. Interactive Portfolio Gallery */}
            <PortfolioSection
              projects={projects}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onSelectProject={setSelectedProject}
            />

            {/* 3. Contact & Project Inquiry */}
            <ContactSection profile={profile} />
          </main>

          {/* Studio Footer */}
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
