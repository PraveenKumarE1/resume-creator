import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { emptyPortfolio, TemplateId, UserPersona } from "@portify/shared";
import { useAuthStore } from "../store/authStore";

const PERSONAS: { id: UserPersona; label: string }[] = [
  { id: "student", label: "Student" },
  { id: "developer", label: "Developer" },
  { id: "designer", label: "Designer" },
  { id: "freelancer", label: "Freelancer" },
  { id: "professional", label: "Professional" },
];

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "aurora", label: "Aurora 3D" },
  { id: "glass", label: "Glass" },
  { id: "minimal", label: "Minimal" },
  { id: "developer", label: "Developer" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [persona, setPersona] = useState<UserPersona>("student");
  const [template, setTemplate] = useState<TemplateId>("aurora");
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    const draft = emptyPortfolio({
      fullName: user?.name ?? "",
      headline: persona === "student" ? "Student" : persona.charAt(0).toUpperCase() + persona.slice(1),
      template,
    });
    try {
      await api.put("/portfolios/me", draft);
      navigate("/editor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 640, paddingTop: 60 }}>
      <h1>Let's set up your portfolio</h1>

      <h3>What best describes you?</h3>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPersona(p.id)}
            className={`btn ${persona === p.id ? "btn-primary" : "btn-ghost"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <h3>Pick a starting template</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className="glass"
            style={{
              padding: 20,
              textAlign: "left",
              cursor: "pointer",
              border: template === t.id ? "2px solid var(--primary)" : "1px solid var(--border)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button className="btn btn-primary" disabled={loading} onClick={finish}>
        {loading ? "Setting up…" : "Continue to editor"}
      </button>
    </div>
  );
}
