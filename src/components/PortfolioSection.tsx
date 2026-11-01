import React, { useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Project, ProjectFilterGroup } from '../types';
import { PROJECT_FILTERS } from '../data/projects';
import { ProjectCard } from './ProjectCard';

interface PortfolioSectionProps {
  projects: Project[];
  activeFilter: ProjectFilterGroup;
  onFilterChange: (filter: ProjectFilterGroup) => void;
  onSelectProject: (project: Project) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = React.memo(
  ({ projects, activeFilter, onFilterChange, onSelectProject }) => {
    const filteredProjects = useMemo(() => {
      if (activeFilter === 'all') return projects;
      return projects.filter((p) => p.filterGroup === activeFilter);
    }, [projects, activeFilter]);

    const categoryCounts = useMemo(() => {
      const counts: Record<ProjectFilterGroup, number> = {
        all: projects.length,
        educational: 0,
        corporate: 0,
        'commerce-tools': 0,
      };
      for (const p of projects) {
        counts[p.filterGroup] += 1;
      }
      return counts;
    }, [projects]);

    return (
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="relative py-12 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <span className="text-xs sm:text-sm font-bold tracking-wide text-violet-600 dark:text-cyan-400">
              معرض الأعمال والمشروعات المنفذة
            </span>
            <h2
              id="projects-heading"
              className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
            >
              أبرز الأعمال والمشاريع البرمجية ({projects.length} مشاريع متكاملة)
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تصفح مجموعة من المواقع والتطبيقات والأنظمة التفاعلية المنشورة فعلياً — اضغط على أي مشروع لعرض تفاصيله الكاملة أو فتحه مباشرة.
            </p>
          </m.div>

          {/* Touch-Friendly Category Filter Tabs (1-col at 320px, 2x2 Grid at 376px+, Flex Row at 640px+) */}
          <div
            role="tablist"
            aria-label="تصنيف المشروعات"
            className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-12"
          >
            {PROJECT_FILTERS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              const count = categoryCounts[filter.id];
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onFilterChange(filter.id)}
                  className={`min-h-[46px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between xs:justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]'
                      : 'bg-white/95 dark:bg-[#0c1428]/90 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/85 dark:border-white/10'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`font-latin text-[11px] px-1.5 py-0.5 rounded-md tabular-nums shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Responsive Projects Grid (1 col mobile -> 2 col tablet -> 3 col desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onOpenDetails={onSelectProject}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    );
  }
);

PortfolioSection.displayName = 'PortfolioSection';
