import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export interface ResumeParseResult {
  extracted: {
    fullName?: string;
    email?: string;
    phone?: string;
    about?: string;
    skills?: string[];
    socialLinks?: Record<string, string>;
  };
  confidence: number;
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s-]{8,}\d)/;
const URL_RE = /(https?:\/\/[^\s)]+)/g;

function guessName(text: string): string | undefined {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && /^[A-Z]/.test(line) && !EMAIL_RE.test(line)) {
      return line;
    }
  }
  return undefined;
}

function extractSection(text: string, headers: string[]): string | undefined {
  const lower = text.toLowerCase();
  for (const header of headers) {
    const idx = lower.indexOf(header);
    if (idx !== -1) {
      const chunk = text.slice(idx + header.length, idx + header.length + 600);
      return chunk.split(/\n{2,}/)[0]?.trim();
    }
  }
  return undefined;
}

export async function parseResume(buffer: Buffer, mimeType: string): Promise<ResumeParseResult> {
  let text = "";
  if (mimeType === "application/pdf") {
    const result = await pdfParse(buffer);
    text = result.text;
  } else {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }

  const email = text.match(EMAIL_RE)?.[0];
  const phone = text.match(PHONE_RE)?.[0];
  const urls = Array.from(text.matchAll(URL_RE)).map((m) => m[0]);
  const fullName = guessName(text);
  const about = extractSection(text, ["summary", "about", "objective", "profile"]);
  const skillsRaw = extractSection(text, ["skills", "technical skills"]);
  const skills = skillsRaw
    ? skillsRaw.split(/[,•\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 30).slice(0, 15)
    : undefined;

  const socialLinks: Record<string, string> = {};
  for (const url of urls) {
    if (url.includes("github.com")) socialLinks.github = url;
    else if (url.includes("linkedin.com")) socialLinks.linkedin = url;
    else if (url.includes("twitter.com") || url.includes("x.com")) socialLinks.twitter = url;
  }

  let confidence = 0.2;
  if (fullName) confidence += 0.2;
  if (email) confidence += 0.2;
  if (about) confidence += 0.2;
  if (skills?.length) confidence += 0.2;

  return {
    extracted: { fullName, email, phone, about, skills, socialLinks },
    confidence: Math.min(1, confidence),
  };
}
