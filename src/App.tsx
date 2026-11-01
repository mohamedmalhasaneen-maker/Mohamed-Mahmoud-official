import { useState, useCallback, lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import {
  PROFILE_DATA,
  PROJECTS,
} from './data/projects';
import { Project, ProjectFilterGroup } from './types';
import { useTheme } from './hooks/useTheme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

// Code-split ProjectModal so modal chunk only loads when a user opens project details
const ProjectModal = lazy(() => import('./components/ProjectModal'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterGroup>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            whatsappUrl={PROFILE_DATA.whatsappUrl || 'https://wa.me/201031498281'}
            studioName={PROFILE_DATA.studioName}
          />

          {/* Main Portfolio Experience */}
          <main className="relative z-10">
            {/* 1. Hero & Real Portfolio Metrics */}
            <HeroSection
              profile={PROFILE_DATA}
              totalProjects={PROJECTS.length}
            />

            {/* 2. Interactive Portfolio Gallery */}
            <PortfolioSection
              projects={PROJECTS}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onSelectProject={setSelectedProject}
            />

            {/* 3. Contact & Project Inquiry */}
            <ContactSection profile={PROFILE_DATA} />
          </main>

          {/* Studio Footer */}
          <Footer profile={PROFILE_DATA} />

          {/* Lazy-Loaded Project Details Modal */}
          {selectedProject && (
            <Suspense fallback={null}>
              <ProjectModal
                project={selectedProject}
                onClose={handleCloseModal}
                whatsappUrl={PROFILE_DATA.whatsappUrl || 'https://wa.me/201031498281'}
              />
            </Suspense>
          )}

          {/* Floating Back-To-Top Button */}
          <BackToTop />
        </div>
      </LazyMotion>
    </ErrorBoundary>
  );
}
