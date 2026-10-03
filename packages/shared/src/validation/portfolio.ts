import { z } from "zod";

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  category: z.string().optional(),
});

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  link: z.string().optional(),
  repoLink: z.string().optional(),
  imageUrl: z.string().optional(),
  metrics: z.string().optional(),
});

const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().optional(),
  link: z.string().optional(),
});

const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
});

const serviceSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().optional(),
});

const socialLinksSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
});

const themeSchema = z.object({
  primaryColor: z.string(),
  accentColor: z.string(),
  fontFamily: z.enum(["sans", "serif", "mono"]),
  darkMode: z.boolean(),
  radius: z.enum(["sharp", "soft", "round"]),
});

const animationSchema = z.object({
  intensity: z.enum(["off", "subtle", "normal", "high"]),
  respectReducedMotion: z.boolean(),
});

export const portfolioSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  slug: z.string().min(1),
  template: z.enum(["aurora", "neural", "glass", "minimal", "developer", "datasphere", "creative", "executive"]),
  theme: themeSchema,
  animation: animationSchema,
  published: z.boolean(),
  views: z.number().optional(),
  fullName: z.string().min(1),
  headline: z.string().min(1).or(z.literal("")),
  tagline: z.string().optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  about: z.string(),
  skills: z.array(skillSchema).default([]),
  education: z.array(educationSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  services: z.array(serviceSchema).default([]),
  email: z.string().optional(),
  phone: z.string().optional(),
  socialLinks: socialLinksSchema.default({}),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
