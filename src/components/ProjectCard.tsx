import React, { useState, useRef } from 'react';
import { m } from 'framer-motion';
import { ExternalLink, Copy, Check, Eye } from 'lucide-react';
import { Project } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { Card3DTilt } from './Card3DTilt';
import { MagneticWrapper } from './MagneticWrapper';
import { ProjectArtwork } from './ProjectArtwork';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, index, onOpenDetails }) => {
    const [copied, setCopied] = useState(false);
    const isCopyingRef = useRef(false);

    const handleCopyLink = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isCopyingRef.current) return;
      isCopyingRef.current = true;

      const success = await copyToClipboard(project.url);
      if (success) {
        setCopied(true);
        window.setTimeout(() => {
          setCopied(false);
          isCopyingRef.current = false;
        }, 1800);
      } else {
        isCopyingRef.current = false;
      }
    };

    return (
      <m.article
        initial={{ opacity: 0, y: 24, rotateX: 6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
        transition={{
          duration: 0.42,
          delay: Math.min(index * 0.045, 0.24),
          ease: [0.16, 1, 0.3, 1],
        }}
        className="h-full perspective-stage"
      >
        <Card3DTilt
          id={`project-card-${project.id}`}
          spotlightColor={project.color.glow}
          maxTiltDeg={7}
          scaleOnHover={1.018}
          onClick={() => onOpenDetails(project)}
          className="group h-full flex flex-col overflow-hidden cursor-pointer hover:border-blue-500/55 dark:hover:border-cyan-400/50"
        >
          <div className="flex flex-col h-full preserve-3d">
            {/* Visual 3D Preview Header */}
            <ProjectArtwork project={project} size="card" />

            {/* Card Content Body with 3D Depth Offset */}
            <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between preserve-3d">
              <div className="depth-layer-1">
                {/* Clean Unboxed Typographic Category Metadata */}
                <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 mb-1.5">
                  {project.category.replace('•', '·')}
                </div>

                {/* Full Project Title */}
                <h3 className="text-base xs:text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white [@media(hover:hover)]:group-hover:text-blue-600 dark:[@media(hover:hover)]:group-hover:text-cyan-300 transition-colors leading-snug">
                  {project.title}
                </h3>

                {/* Full Project Description */}
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Unboxed Tech Stack Line */}
                {project.techStack.length > 0 && (
                  <p
                    dir="ltr"
                    className="mt-3.5 font-latin text-xs font-semibold text-slate-500 dark:text-slate-400 text-right"
                  >
                    {project.techStack.join(' · ')}
                  </p>
                )}
              </div>

              {/* Unconditional Direct Navigation & Details Footer (44px+ Touch Targets) */}
              <div className="mt-5 pt-3.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 depth-layer-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <MagneticWrapper strength={0.18}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white text-xs font-bold whitespace-nowrap shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all"
                    >
                      <span>فتح المشروع</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </MagneticWrapper>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(project);
                    }}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-white/[0.07] dark:hover:bg-white/[0.14] text-slate-700 dark:text-slate-200 text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>التفاصيل</span>
                  </button>
                </div>

                <button
                  type="button"
                  id={`copy-btn-${project.id}`}
                  title="نسخ رابط المشروع"
                  aria-label="نسخ رابط المشروع"
                  onClick={handleCopyLink}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 bg-slate-100/90 hover:bg-slate-200/80 active:scale-95 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] transition-all cursor-pointer shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card3DTilt>
      </m.article>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';
