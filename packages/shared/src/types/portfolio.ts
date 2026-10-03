export type TemplateId =
  | "aurora"
  | "neural"
  | "glass"
  | "minimal"
  | "developer"
  | "datasphere"
  | "creative"
  | "executive";

export const AVAILABLE_TEMPLATES: { id: TemplateId; name: string; has3D: boolean; implemented: boolean }[] = [
  { id: "aurora", name: "Aurora 3D", has3D: true, implemented: true },
  { id: "glass", name: "Glass", has3D: false, implemented: true },
  { id: "minimal", name: "Minimal", has3D: false, implemented: true },
  { id: "developer", name: "Developer", has3D: false, implemented: true },
  { id: "neural", name: "Neural", has3D: true, implemented: false },
  { id: "datasphere", name: "DataSphere", has3D: true, implemented: false },
  { id: "creative", name: "Creative", has3D: false, implemented: false },
  { id: "executive", name: "Executive", has3D: false, implemented: false },
];

export type AnimationIntensity = "off" | "subtle" | "normal" | "high";

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  repoLink?: string;
  imageUrl?: string;
  metrics?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: "sans" | "serif" | "mono";
  darkMode: boolean;
  radius: "sharp" | "soft" | "round";
}

export interface AnimationSettings {
  intensity: AnimationIntensity;
  respectReducedMotion: boolean;
}

export interface PortfolioScoreBreakdown {
  profile: number;
  about: number;
  skills: number;
  projects: number;
  experience: number;
  education: number;
  certifications: number;
  contact: number;
  design: number;
  contentQuality: number;
}

export interface PortfolioScore {
  total: number; // 0-100
  breakdown: PortfolioScoreBreakdown;
  suggestions: string[];
}

export interface PortfolioData {
  id?: string;
  userId?: string;
  slug: string;
  template: TemplateId;
  theme: ThemeSettings;
  animation: AnimationSettings;
  published: boolean;
  views?: number;

  // Profile
  fullName: string;
  headline: string;
  tagline?: string;
  avatarUrl?: string;
  location?: string;

  about: string;

  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  services: Service[];

  email?: string;
  phone?: string;
  socialLinks: SocialLinks;

  score?: PortfolioScore;
  updatedAt?: string;
  createdAt?: string;
}

export type UserPersona = "student" | "developer" | "designer" | "freelancer" | "professional" | "other";
export type PortfolioGoal = "job" | "freelance" | "showcase" | "personal_brand" | "other";

export interface OnboardingSelection {
  persona: UserPersona;
  goal: PortfolioGoal;
  template?: TemplateId;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export function emptyPortfolio(overrides: Partial<PortfolioData> = {}): PortfolioData {
  return {
    slug: "",
    template: "aurora",
    theme: {
      primaryColor: "#7C5CFF",
      accentColor: "#22D3EE",
      fontFamily: "sans",
      darkMode: true,
      radius: "soft",
    },
    animation: { intensity: "normal", respectReducedMotion: true },
    published: false,
    fullName: "",
    headline: "",
    about: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    services: [],
    socialLinks: {},
    ...overrides,
  };
}
