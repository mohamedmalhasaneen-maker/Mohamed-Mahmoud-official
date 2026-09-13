import React, { useState } from 'react';
import { Code2, Copy, Check, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { copyToClipboard } from '../utils/clipboard';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Standalone code representation
  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mohamed Mahmoud Studio</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome Icons CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Cairo Google Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0d1117 50%, #070a10 100%);
            color: #f0f6fc;
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.75);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
            transform: translateY(-4px);
            border-color: rgba(56, 189, 248, 0.4);
            box-shadow: 0 12px 32px -10px rgba(56, 189, 248, 0.25);
        }
        .profile-container {
            border: 2px solid rgba(56, 189, 248, 0.35);
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.15);
        }
    </style>
</head>
<body class="flex flex-col items-center justify-start py-10 px-4 min-h-screen">

    <div class="w-full max-w-md flex flex-col items-center">
        
        <!-- Profile Header Section (Centered at Top) -->
        <div class="flex flex-col items-center text-center mb-8 w-full">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium mb-4">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>متاح للمشاريع الجديدة</span>
            </div>

            <!-- Profile Image Container (Preserves original dimensions without circular cropping) -->
            <div class="profile-container rounded-2xl mb-4 overflow-hidden max-w-[260px] bg-slate-900">
                <img id="profile-img" src="your-photo.jpg" alt="Mohamed Mahmoud" class="w-full h-auto block select-none">
            </div>
            
            <h1 class="text-2xl sm:text-3xl font-bold tracking-wide text-white mb-1">Mohamed Mahmoud Studio</h1>
            <h2 class="text-sm font-semibold text-sky-400 mb-2">المطور / Mohamed Mahmoud</h2>
            <p class="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
                مطور تطبيقات ومواقع إلكترونية | تقديم حلول برمجية ذكية وواجهات مستخدم حديثة
            </p>

            <!-- Direct Contact & Social Links -->
            <div class="mt-4 flex flex-col items-center gap-2.5 w-full">
                <div class="flex items-center gap-2 flex-wrap justify-center">
                    <a href="https://wa.me/201031498281" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition-all shadow-sm">
                        <i class="fa-brands fa-whatsapp text-emerald-400"></i>
                        <span>واتساب: 01031498281</span>
                    </a>
                    <a href="https://t.me/+201031498281" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/50 hover:bg-sky-600 border border-sky-500/30 text-sky-300 hover:text-white text-xs font-semibold transition-all shadow-sm">
                        <i class="fa-brands fa-telegram text-sky-400"></i>
                        <span>تيليجرام</span>
                    </a>
                    <a href="tel:01031498281" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm">
                        <i class="fa-solid fa-phone text-slate-400"></i>
                        <span>اتصال</span>
                    </a>
                </div>

                <div class="flex items-center gap-2 justify-center pt-2 border-t border-white/5 w-full flex-wrap">
                    <span class="text-[11px] text-slate-400">حساباتي:</span>
                    <a href="https://www.facebook.com/mohamed.mahmoud.533503/?locale=ar_AR" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white text-xs transition-all border border-white/10">
                        <i class="fa-brands fa-facebook text-blue-400"></i>
                        <span>فيسبوك</span>
                    </a>
                    <a href="https://www.instagram.com/eng_mohamed662010/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#E4405F] text-slate-300 hover:text-white text-xs transition-all border border-white/10">
                        <i class="fa-brands fa-instagram text-pink-400"></i>
                        <span>انستجرام</span>
                    </a>
                    <a href="https://www.tiktok.com/@eng_mahamed6" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-black text-slate-300 hover:text-white text-xs transition-all border border-white/10">
                        <i class="fa-brands fa-tiktok text-cyan-400"></i>
                        <span>تيك توك</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Project Cards Container -->
        <div class="w-full space-y-4">

            <!-- Card 1 -->
            <a href="https://rafeeqsmart.ai.studio/" target="_blank" rel="noopener noreferrer" class="glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer block">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                        <i class="fa-solid fa-graduation-cap text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">رفيق الثانوية العامة</h3>
                        <p class="text-xs text-slate-400 mt-1 leading-relaxed">منصة ذكية مدعومة بالذكاء الاصطناعي لمساعدة طلاب الثانوية العامة في تنظيم المذاكرة وتسهيل التعلم.</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-500 group-hover:text-sky-400 group-hover:-translate-x-1 transition-all mr-2 shrink-0"></i>
            </a>

            <!-- Card 2 -->
            <a href="https://chemical-reactions.vercel.app/" target="_blank" rel="noopener noreferrer" class="glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer block">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                        <i class="fa-solid fa-flask text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">التفاعلات الكيميائية</h3>
                        <p class="text-xs text-slate-400 mt-1 leading-relaxed">موقع تفاعلي مخصص لشرح ومحاكاة التفاعلات الكيميائية بطريقة مبسطة وبصرية ممتعة.</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-500 group-hover:text-sky-400 group-hover:-translate-x-1 transition-all mr-2 shrink-0"></i>
            </a>

            <!-- Card 3 -->
            <a href="https://almekawy-home-official.vercel.app/" target="_blank" rel="noopener noreferrer" class="glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer block">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <i class="fa-solid fa-house-chimney text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">شركة المكاوي هوم - الموقع الرسمي</h3>
                        <p class="text-xs text-slate-400 mt-1 leading-relaxed">المنصة الرسمية لاستعراض منتجات وخدمات شركة المكاوي هوم والديكورات الحديثة.</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-500 group-hover:text-sky-400 group-hover:-translate-x-1 transition-all mr-2 shrink-0"></i>
            </a>

            <!-- Card 4 -->
            <a href="https://al-mekawy-home.vercel.app/" target="_blank" rel="noopener noreferrer" class="glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer block">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shrink-0">
                        <i class="fa-solid fa-calculator text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">المكاوي هوم - عروض الأسعار</h3>
                        <p class="text-xs text-slate-400 mt-1 leading-relaxed">أداة مخصصة لإنشاء وحساب عروض الأسعار لعملاء شركة المكاوي هوم بسرعة وسهولة.</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-left text-slate-500 group-hover:text-sky-400 group-hover:-translate-x-1 transition-all mr-2 shrink-0"></i>
            </a>

        </div>

        <!-- Footer -->
        <footer class="mt-12 text-center text-xs text-slate-500 pb-6">
            <p>© 2026 Mohamed Mahmoud Studio. جميع الحقوق محفوظة.</p>
        </footer>

    </div>
</body>
</html>`;

  const handleCopy = async () => {
    const success = await copyToClipboard(standaloneHtmlCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mohamed-mahmoud-portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="standalone-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">كود HTML المستقل والمباشر</h3>
                <p className="text-xs text-slate-400">ملف جاهز للتشغيل مباشرة في أي متصفح أو رفعه كصفحة مستقلة</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-white/5 gap-2">
            <span className="text-xs text-slate-400 font-mono">index.html (HTML + Tailwind + FontAwesome + Cairo)</span>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="modal-copy-btn"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ الكود'}</span>
              </button>

              <button
                type="button"
                id="modal-download-btn"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل الملف</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed dir-ltr text-left selection:bg-sky-500/30">
            <pre className="whitespace-pre overflow-x-auto">
              <code>{standaloneHtmlCode}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
