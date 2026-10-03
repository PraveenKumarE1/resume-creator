import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { PortfolioData, TemplateId } from "@portify/shared";

const THEMES: Record<TemplateId, { bg: string; card: string; accent: string; font: string }> = {
  aurora: { bg: "radial-gradient(circle at 30% 0%, #241b45, #0b0b14 60%)", card: "rgba(255,255,255,0.05)", accent: "#7c5cff", font: "sans-serif" },
  glass: { bg: "linear-gradient(135deg, #1a2740, #0b0b14)", card: "rgba(255,255,255,0.08)", accent: "#22d3ee", font: "sans-serif" },
  minimal: { bg: "#ffffff", card: "#f5f5f7", accent: "#111111", font: "sans-serif" },
  developer: { bg: "#0d1117", card: "#161b22", accent: "#3fb950", font: "monospace" },
  neural: { bg: "#0b0b14", card: "rgba(255,255,255,0.05)", accent: "#7c5cff", font: "sans-serif" },
  datasphere: { bg: "#0b0b14", card: "rgba(255,255,255,0.05)", accent: "#22d3ee", font: "sans-serif" },
  creative: { bg: "#0b0b14", card: "rgba(255,255,255,0.05)", accent: "#f472b6", font: "sans-serif" },
  executive: { bg: "#111318", card: "rgba(255,255,255,0.04)", accent: "#d4af37", font: "serif" },
};

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/public/${slug}`)
      .then((res) => setPortfolio(res.data.data.portfolio))
      .catch(() => setError("This portfolio doesn't exist or hasn't been published yet."));
  }, [slug]);

  if (error) {
    return <div className="container" style={{ paddingTop: 80, textAlign: "center", color: "var(--muted)" }}>{error}</div>;
  }
  if (!portfolio) {
    return <div className="container" style={{ paddingTop: 80, textAlign: "center" }}>Loading…</div>;
  }

  const theme = THEMES[portfolio.template] ?? THEMES.aurora;
  const dark = portfolio.template !== "minimal";

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: dark ? "#f4f4f8" : "#111", fontFamily: theme.font }}>
      <div className="container" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ background: theme.card, borderRadius: 20, padding: 40, marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 40 }}>{portfolio.fullName}</h1>
          <p style={{ fontSize: 20, color: theme.accent, margin: "8px 0" }}>{portfolio.headline}</p>
          {portfolio.tagline && <p style={{ opacity: 0.7 }}>{portfolio.tagline}</p>}
        </div>

        {portfolio.about && (
          <Section title="About" accent={theme.accent}>
            <p style={{ lineHeight: 1.7, opacity: 0.85 }}>{portfolio.about}</p>
          </Section>
        )}

        {portfolio.skills.length > 0 && (
          <Section title="Skills" accent={theme.accent}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {portfolio.skills.map((s) => (
                <span key={s.id} style={{ background: theme.card, padding: "6px 14px", borderRadius: 999, fontSize: 13 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {portfolio.projects.length > 0 && (
          <Section title="Projects" accent={theme.accent}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {portfolio.projects.map((p) => (
                <div key={p.id} style={{ background: theme.card, borderRadius: 14, padding: 20 }}>
                  <h3 style={{ marginTop: 0 }}>{p.title}</h3>
                  <p style={{ opacity: 0.8, fontSize: 14 }}>{p.description}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ color: theme.accent, fontSize: 13 }}>
                      View project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {portfolio.experience.length > 0 && (
          <Section title="Experience" accent={theme.accent}>
            {portfolio.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 16 }}>
                <strong>{e.role}</strong> — {e.company}
                <p style={{ opacity: 0.75, fontSize: 14 }}>{e.description}</p>
              </div>
            ))}
          </Section>
        )}

        {(portfolio.email || portfolio.socialLinks.github || portfolio.socialLinks.linkedin) && (
          <Section title="Contact" accent={theme.accent}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {portfolio.email && <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>}
              {portfolio.socialLinks.github && <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>}
              {portfolio.socialLinks.linkedin && <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ color: accent, fontSize: 18, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}
