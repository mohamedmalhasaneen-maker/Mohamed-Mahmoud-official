export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: 'graduation-cap' | 'flask' | 'home' | 'calculator';
  color: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    hoverBg: string;
    hoverText: string;
    glow: string;
  };
}

export interface ProfileInfo {
  studioName: string;
  developerName: string;
  roleTitle: string;
  bio: string;
  email?: string;
  phone?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  location?: string;
  photoUrl: string;
}
