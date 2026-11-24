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
        className="relative py-12 sm:py-20 lg:py-24 overflow-x-clip"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <m.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-blue-700 dark:text-cyan-400">
              <span aria-hidden="true" className="w-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              <span>معرض الأعمال والمشروعات المنفذة</span>
              <span aria-hidden="true" className="w-5 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
            </div>

            <h2
              id="projects-heading"
              className="mt-2.5 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug [text-wrap:balance]"
            >
              مشاريع محمد محمود وأعماله البرمجية — Mohamed Mahmoud Projects ({projects.length})
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              تصفح أحدث تطبيقات ومواقع محمد محمود والمنصات التعليمية (Mohamed Mahmoud Applications &amp; Software) من تطوير المبرمج محمد محمود في استوديو محمد محمود — اضغط على أي مشروع لعرض تفاصيله الكاملة أو فتحه مباشرة.
            </p>
          </m.div>

          {/* Touch-Friendly Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="تصنيف المشروعات"
            className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-9 sm:mb-12"
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
                  className={`min-h-[46px] px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between xs:justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white shadow-[0_10px_24px_-6px_rgba(37,99,235,0.52)]'
                      : 'bg-white/95 dark:bg-[#0b1328]/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-white/12'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`font-latin text-[11px] px-1.5 py-0.5 rounded-md tabular-nums shrink-0 ${
                      isSelected
                        ? 'bg-white/22 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3D Interactive Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 perspective-stage">
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
