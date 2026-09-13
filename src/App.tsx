import { useState } from 'react';
import { PROFILE_DATA, PROJECTS } from './data/projects';
import { ProfileHeader } from './components/ProfileHeader';
import { ProjectCard } from './components/ProjectCard';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { Code2, Heart } from 'lucide-react';

export default function App() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#080d1a] text-slate-100 flex flex-col items-center justify-start py-8 sm:py-12 px-4 selection:bg-sky-500/30 selection:text-sky-200 overflow-x-hidden font-sans">
      
      {/* Ambient background lighting effects */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% -10%, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.8) 45%, rgba(8, 13, 26, 1) 100%)'
        }}
      />
      <div className="fixed top-20 -right-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-20 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Content Container - Centered, Mobile-First */}
      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Profile Header (Centered at Top) */}
        <ProfileHeader profile={PROFILE_DATA} />

        {/* Project Cards Section */}
        <section 
          aria-label="قائمة المشاريع" 
          className="w-full space-y-3.5 sm:space-y-4"
        >
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-xs font-semibold text-slate-400 tracking-wider">
              أبرز الأعمال والمشاريع البرمجية
            </h2>
            <span className="text-[11px] text-sky-400 font-medium">
              {PROJECTS.length} مشاريع متكاملة
            </span>
          </div>

          {PROJECTS.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
            />
          ))}
        </section>

        {/* Standalone HTML trigger button */}
        <div className="mt-8 w-full flex justify-center">
          <button
            type="button"
            id="open-standalone-modal-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-500/20 hover:border-sky-400/40 text-sky-300 hover:text-sky-200 text-xs font-medium transition-all shadow-md backdrop-blur-md cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>عرض ونسخ كود HTML المستقل (Single File)</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 sm:mt-12 text-center text-xs text-slate-400 pb-6 w-full">
          <p className="flex items-center justify-center gap-1 text-slate-400 font-medium">
            <span>صُنع بشغف وإتقان</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/80 inline" />
            <span>بواسطة Mohamed Mahmoud</span>
          </p>
          <p className="mt-1.5 text-[11px] text-slate-400">
            © {new Date().getFullYear()} Mohamed Mahmoud Studio. جميع الحقوق محفوظة.
          </p>
        </footer>

      </main>

      {/* Standalone HTML Export Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}
