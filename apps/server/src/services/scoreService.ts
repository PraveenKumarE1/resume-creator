import { IPortfolio } from "../models/Portfolio";

const WEIGHTS = {
  profile: 0.12,
  about: 0.12,
  skills: 0.12,
  projects: 0.18,
  experience: 0.14,
  education: 0.08,
  certifications: 0.06,
  contact: 0.08,
  design: 0.05,
  contentQuality: 0.05,
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computePortfolioScore(p: IPortfolio) {
  const suggestions: string[] = [];

  const profile = p.fullName && p.headline && p.avatarUrl ? 100 : p.fullName && p.headline ? 65 : p.fullName ? 30 : 0;
  if (!p.avatarUrl) suggestions.push("Add a profile photo to build trust with visitors.");
  if (!p.headline) suggestions.push("Add a headline describing what you do.");

  const about = p.about.length > 300 ? 100 : p.about.length > 120 ? 70 : p.about.length > 0 ? 35 : 0;
  if (p.about.length < 120) suggestions.push("Expand your About section to at least 2-3 sentences.");

  const skillsArr = (p.skills as unknown[]) ?? [];
  const skills = skillsArr.length >= 8 ? 100 : skillsArr.length >= 4 ? 70 : skillsArr.length > 0 ? 35 : 0;
  if (skillsArr.length < 6) suggestions.push("List at least 6-8 relevant skills.");

  const projectsArr = (p.projects as unknown[]) ?? [];
  const projects = projectsArr.length >= 3 ? 100 : projectsArr.length === 2 ? 70 : projectsArr.length === 1 ? 40 : 0;
  if (projectsArr.length < 3) suggestions.push("Add 2 more projects with measurable results to stand out.");

  const expArr = (p.experience as unknown[]) ?? [];
  const experience = expArr.length >= 2 ? 100 : expArr.length === 1 ? 60 : 20;
  if (expArr.length === 0) suggestions.push("Add at least one experience or internship entry.");

  const eduArr = (p.education as unknown[]) ?? [];
  const education = eduArr.length >= 1 ? 100 : 0;
  if (eduArr.length === 0) suggestions.push("Add your education background.");

  const certArr = (p.certifications as unknown[]) ?? [];
  const certifications = certArr.length >= 2 ? 100 : certArr.length === 1 ? 60 : 20;

  const links = p.socialLinks ?? {};
  const contactPoints = [p.email, links.github, links.linkedin, links.website].filter(Boolean).length;
  const contact = contactPoints >= 3 ? 100 : contactPoints === 2 ? 70 : contactPoints === 1 ? 40 : 0;
  if (!links.github) suggestions.push("Add your GitHub profile.");
  if (!links.linkedin) suggestions.push("Add your LinkedIn profile.");

  const design = p.theme?.primaryColor && p.template ? 90 : 60;

  const longText = `${p.about} ${projectsArr.map((pr: any) => pr.description ?? "").join(" ")}`;
  const contentQuality = longText.length > 400 ? 90 : longText.length > 150 ? 60 : 30;

  const breakdown = {
    profile: clamp(profile),
    about: clamp(about),
    skills: clamp(skills),
    projects: clamp(projects),
    experience: clamp(experience),
    education: clamp(education),
    certifications: clamp(certifications),
    contact: clamp(contact),
    design: clamp(design),
    contentQuality: clamp(contentQuality),
  };

  const total = clamp(
    Object.entries(breakdown).reduce((sum, [key, value]) => sum + value * (WEIGHTS as any)[key], 0)
  );

  return { total, breakdown, suggestions: suggestions.slice(0, 5) };
}
