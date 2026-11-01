export type ProjectFilterGroup = 'all' | 'educational' | 'corporate' | 'commerce-tools';

export type ThemeMode = 'dark' | 'light';

export type ProjectIconName =
  | 'graduation-cap'
  | 'flask'
  | 'home'
  | 'calculator'
  | 'palette'
  | 'paint-brush'
  | 'dna'
  | 'camera'
  | 'image'
  | 'app-window'
  | 'store';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  filterGroup: Exclude<ProjectFilterGroup, 'all'>;
  techStack: string[];
  highlights: string[];
  imageUrl?: string;
  icon: ProjectIconName;
  color: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    hoverBg: string;
    hoverText: string;
    glow: string;
    accentHex: string;
    secondaryHex: string;
  };
}

export interface ProfileInfo {
  studioName: string;
  developerName: string;
  roleTitle: string;
  bio: string;
  typingRoles: string[];
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

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: 'globe' | 'layers' | 'shopping-bag' | 'sparkles' | 'cpu' | 'layout';
  accentFrom: string;
  accentTo: string;
  glowColor: string;
  targetFilter?: ProjectFilterGroup;
}

export interface SkillItem {
  name: string;
  nameEn?: string;
  role: string;
  icon:
    | 'code'
    | 'file-code'
    | 'palette'
    | 'sparkles'
    | 'box'
    | 'smartphone'
    | 'zap'
    | 'globe'
    | 'layers'
    | 'cpu'
    | 'layout'
    | 'rocket';
  accentColor: string;
}

export interface SkillCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  accentGradient: string;
  skills: SkillItem[];
}
