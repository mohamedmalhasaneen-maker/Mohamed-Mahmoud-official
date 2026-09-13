import React from 'react';
import { Project } from '../types';
import { 
  GraduationCap, 
  FlaskConical, 
  Home, 
  Calculator, 
  ChevronLeft, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { copyToClipboard } from '../utils/clipboard';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [copied, setCopied] = React.useState(false);

  const renderIcon = () => {
    const iconClass = "w-6 h-6 transition-transform duration-300 group-hover:scale-110";
    switch (project.icon) {
      case 'graduation-cap':
        return <GraduationCap className={iconClass} />;
      case 'flask':
        return <FlaskConical className={iconClass} />;
      case 'home':
        return <Home className={iconClass} />;
      case 'calculator':
        return <Calculator className={iconClass} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await copyToClipboard(project.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative group"
    >
      <a
        id={`project-card-${project.id}`}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between group cursor-pointer block border border-white/10 relative overflow-hidden"
      >
        {/* Subtle decorative hover glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at 85% 50%, ${project.color.glow}, transparent 70%)` }}
        />

        <div className="flex items-center space-x-4 space-x-reverse min-w-0 pr-1">
          {/* Project Icon container */}
          <div 
            className={`w-13 h-13 shrink-0 rounded-xl ${project.color.badgeBg} border ${project.color.badgeBorder} flex items-center justify-center ${project.color.badgeText} ${project.color.hoverBg} ${project.color.hoverText} transition-all duration-300 shadow-sm`}
          >
            {renderIcon()}
          </div>

          {/* Project info */}
          <div className="text-right overflow-hidden">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-sky-300 transition-colors">
                {project.title}
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                {project.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {project.description}
            </p>
          </div>
        </div>

        {/* Action icons (arrow + copy button) */}
        <div className="flex items-center gap-1 shrink-0 mr-2">
          <button
            type="button"
            id={`copy-btn-${project.id}`}
            title="نسخ رابط المشروع"
            aria-label="نسخ رابط المشروع"
            onClick={handleCopyLink}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-white/10 transition-all opacity-80 hover:opacity-100"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-colors">
            <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </div>
        </div>
      </a>
    </motion.div>
  );
};
