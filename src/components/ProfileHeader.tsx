import React from 'react';
import { ProfileInfo } from '../types';
import { Sparkles, MessageCircle, Send, Phone, Facebook, Instagram, Video } from 'lucide-react';
import { motion } from 'motion/react';
import defaultDevPhoto from '../assets/developer-photo.jpg';

interface ProfileHeaderProps {
  profile: ProfileInfo;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const [currentPhoto, setCurrentPhoto] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom_profile_photo');
      if (saved) return saved;
    }
    return defaultDevPhoto || profile.photoUrl;
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('custom_profile_photo');
    if (saved) {
      setCurrentPhoto(saved);
    }
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center text-center mb-8 relative w-full"
    >
      {/* Availability Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium mb-5 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>متاح لتطوير المشاريع البرمجية والحلول الذكية</span>
      </div>

      {/* Developer Photo Container:
          Preserves original aspect ratio without circular cropping or distortion,
          with delicate rounded corners and refined border/shadow
      */}
      <div className="relative flex flex-col items-center mb-5">
        <div 
          id="developer-photo-wrapper"
          className="relative max-w-[260px] sm:max-w-[280px] rounded-2xl overflow-hidden border-2 border-sky-400/35 shadow-[0_12px_36px_-6px_rgba(14,165,233,0.3)] bg-slate-900/80 transition-all duration-300 hover:border-sky-400/60"
        >
          <img
            id="developer-photo-img"
            src={currentPhoto}
            alt={profile.developerName}
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none"
            loading="eager"
          />
        </div>
      </div>

      {/* Studio / App Name */}
      <h1 
        id="studio-name"
        className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white mb-1.5 drop-shadow-sm flex items-center justify-center gap-2"
      >
        <span>{profile.studioName}</span>
        <Sparkles className="w-5 h-5 text-sky-400 inline-block shrink-0" />
      </h1>

      {/* Developer Name */}
      <h2 
        id="developer-title"
        className="text-sm sm:text-base font-semibold text-sky-400 mb-3"
      >
        {profile.roleTitle}
      </h2>

      {/* Short Bio */}
      <p 
        id="developer-bio"
        className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed px-2 font-normal"
      >
        {profile.bio}
      </p>

      {/* Contact Channels & Social Profiles */}
      <div id="contact-channels" className="flex flex-col items-center gap-3 mt-5 w-full max-w-sm px-1">
        {/* Direct Contact with 01031498281 */}
        <div className="flex items-center gap-2 flex-wrap justify-center w-full">
          {/* WhatsApp */}
          <a
            id="contact-whatsapp-btn"
            href={profile.whatsappUrl || 'https://wa.me/201031498281'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-600/90 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:text-white text-xs font-semibold transition-all shadow-sm group"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
            <span>واتساب: {profile.phone || '01031498281'}</span>
          </a>

          {/* Telegram */}
          <a
            id="contact-telegram-btn"
            href={profile.telegramUrl || 'https://t.me/+201031498281'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-950/50 hover:bg-sky-600/90 border border-sky-500/30 hover:border-sky-400/60 text-sky-300 hover:text-white text-xs font-semibold transition-all shadow-sm group"
          >
            <Send className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
            <span>تيليجرام</span>
          </a>

          {/* Direct Phone Call */}
          <a
            id="contact-phone-btn"
            href={`tel:${profile.phone || '01031498281'}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm group"
            title="اتصال هاتفي مباشر"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            <span>اتصال</span>
          </a>
        </div>

        {/* Social Accounts */}
        <div className="flex items-center gap-2 justify-center pt-2 border-t border-white/5 w-full flex-wrap">
          <span className="text-[11px] text-slate-400 ml-1">حساباتي:</span>
          
          {/* Facebook */}
          <a
            id="social-facebook-btn"
            href={profile.facebookUrl || 'https://www.facebook.com/mohamed.mahmoud.533503/?locale=ar_AR'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-[#1877F2] text-slate-300 hover:text-white text-xs font-medium transition-all border border-white/10 shadow-sm group"
            title="حساب فيسبوك"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
            <span>فيسبوك</span>
          </a>

          {/* Instagram */}
          <a
            id="social-instagram-btn"
            href={profile.instagramUrl || 'https://www.instagram.com/eng_mohamed662010/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-[#E4405F] text-slate-300 hover:text-white text-xs font-medium transition-all border border-white/10 shadow-sm group"
            title="حساب إنستغرام"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:text-white" />
            <span>انستجرام</span>
          </a>

          {/* TikTok */}
          <a
            id="social-tiktok-btn"
            href={profile.tiktokUrl || 'https://www.tiktok.com/@eng_mahamed6'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-black hover:border-cyan-400/40 text-slate-300 hover:text-white text-xs font-medium transition-all border border-white/10 shadow-sm group"
            title="حساب تيك توك"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
            <span>تيك توك</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
};
