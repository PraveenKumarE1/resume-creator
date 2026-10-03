import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useEditorStore } from "../store/editorStore";
import { AiAssistButton } from "../components/ui/AiAssistButton";
import { Skill, Project, Experience } from "@portify/shared";

const TABS = ["Profile", "About", "Skills", "Experience", "Projects", "Contact", "Design"] as const;
type Tab = (typeof TABS)[number];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Editor() {
  const navigate = useNavigate();
  const { draft, setDraft, update, saveStatus, setSaveStatus } = useEditorStore();
  const [tab, setTab] = useState<Tab>("Profile");

  useEffect(() => {
    api.get("/portfolios/me").then((res) => {
      if (!res.data.data.portfolio) {
        navigate("/onboarding");
        return;
      }
      setDraft(res.data.data.portfolio);
    });
  }, []);

  // Debounced autosave
  useEffect(() => {
    if (!draft) return;
    if (saveStatus !== "idle") return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await api.put("/portfolios/me", draft);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [draft]);

  const statusLabel = useMemo(() => {
    switch (saveStatus) {
      case "saving":
        return "Saving…";
      case "saved":
        return "All changes saved";
      case "error":
        return "Couldn't save — retrying on next edit";
      default:
        return "";
    }
  }, [saveStatus]);

  if (!draft) return <div className="container" style={{ paddingTop: 60 }}>Loading editor…</div>;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, display: "grid", gridTemplateColumns: "220px 1fr", gap: 32 }}>
      <aside>
        <h3 style={{ marginTop: 0 }}>Portify AI</h3>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="btn"
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              marginBottom: 6,
              background: tab === t ? "var(--surface)" : "transparent",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {t}
          </button>
        ))}
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 20 }}>{statusLabel}</p>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => navigate("/dashboard")}>
          Done
        </button>
      </aside>

      <main className="glass" style={{ padding: 32 }}>
        {tab === "Profile" && (
          <section>
            <h2>Profile</h2>
            <label>Full name</label>
            <input value={draft.fullName} onChange={(e) => update({ fullName: e.target.value })} />
            <label style={{ marginTop: 16 }}>Headline</label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <input value={draft.headline} onChange={(e) => update({ headline: e.target.value })} />
              <AiAssistButton action="suggest_headline" input={draft.headline || draft.about} onResult={(o) => update({ headline: o })} />
            </div>
            <label style={{ marginTop: 16 }}>Tagline</label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <input value={draft.tagline ?? ""} onChange={(e) => update({ tagline: e.target.value })} />
              <AiAssistButton action="generate_tagline" input={draft.headline} onResult={(o) => update({ tagline: o })} />
            </div>
            <label style={{ marginTop: 16 }}>Location</label>
            <input value={draft.location ?? ""} onChange={(e) => update({ location: e.target.value })} />
          </section>
        )}

        {tab === "About" && (
          <section>
            <h2>About</h2>
            <textarea rows={8} value={draft.about} onChange={(e) => update({ about: e.target.value })} />
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <AiAssistButton action="generate_about" input={`${draft.fullName} — ${draft.headline}`} onResult={(o) => update({ about: o })} label="✨ Generate about" />
              <AiAssistButton action="rewrite_professional" input={draft.about} onResult={(o) => update({ about: o })} label="Rewrite professionally" />
              <AiAssistButton action="shorten" input={draft.about} onResult={(o) => update({ about: o })} label="Shorten" />
            </div>
          </section>
        )}

        {tab === "Skills" && (
          <SkillsSection skills={draft.skills} onChange={(skills) => update({ skills })} />
        )}

        {tab === "Experience" && (
          <ExperienceSection experience={draft.experience} onChange={(experience) => update({ experience })} />
        )}

        {tab === "Projects" && (
          <ProjectsSection projects={draft.projects} onChange={(projects) => update({ projects })} />
        )}

        {tab === "Contact" && (
          <section>
            <h2>Contact</h2>
            <label>Email</label>
            <input value={draft.email ?? ""} onChange={(e) => update({ email: e.target.value })} />
            <label style={{ marginTop: 16 }}>Phone</label>
            <input value={draft.phone ?? ""} onChange={(e) => update({ phone: e.target.value })} />
            {(["github", "linkedin", "twitter", "website", "instagram"] as const).map((key) => (
              <div key={key}>
                <label style={{ marginTop: 16, textTransform: "capitalize" }}>{key}</label>
                <input
                  value={draft.socialLinks[key] ?? ""}
                  onChange={(e) => update({ socialLinks: { ...draft.socialLinks, [key]: e.target.value } })}
                />
              </div>
            ))}
          </section>
        )}

        {tab === "Design" && (
          <section>
            <h2>Design</h2>
            <label>Template</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(["aurora", "glass", "minimal", "developer"] as const).map((t) => (
                <button
                  key={t}
                  className={`btn ${draft.template === t ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => update({ template: t })}
                >
                  {t}
                </button>
              ))}
            </div>
            <label style={{ marginTop: 20 }}>Primary color</label>
            <input type="color" value={draft.theme.primaryColor} onChange={(e) => update({ theme: { ...draft.theme, primaryColor: e.target.value } })} />
            <label style={{ marginTop: 16 }}>Accent color</label>
            <input type="color" value={draft.theme.accentColor} onChange={(e) => update({ theme: { ...draft.theme, accentColor: e.target.value } })} />
          </section>
        )}
      </main>
    </div>
  );
}

function SkillsSection({ skills, onChange }: { skills: Skill[]; onChange: (s: Skill[]) => void }) {
  const [name, setName] = useState("");
  return (
    <section>
      <h2>Skills</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="e.g. React" value={name} onChange={(e) => setName(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!name.trim()) return;
            onChange([...skills, { id: uid(), name: name.trim(), level: 70 }]);
            setName("");
          }}
        >
          Add
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((s) => (
          <span key={s.id} className="glass" style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            {s.name}
            <button
              onClick={() => onChange(skills.filter((x) => x.id !== s.id))}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ experience, onChange }: { experience: Experience[]; onChange: (e: Experience[]) => void }) {
  function addEntry() {
    onChange([...experience, { id: uid(), company: "", role: "", description: "" }]);
  }
  function patch(id: string, fields: Partial<Experience>) {
    onChange(experience.map((e) => (e.id === id ? { ...e, ...fields } : e)));
  }
  return (
    <section>
      <h2>Experience</h2>
      {experience.map((e) => (
        <div key={e.id} className="glass" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Company" value={e.company} onChange={(ev) => patch(e.id, { company: ev.target.value })} />
            <input placeholder="Role" value={e.role} onChange={(ev) => patch(e.id, { role: ev.target.value })} />
          </div>
          <textarea
            placeholder="What did you do?"
            style={{ marginTop: 10 }}
            rows={3}
            value={e.description ?? ""}
            onChange={(ev) => patch(e.id, { description: ev.target.value })}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "space-between" }}>
            <AiAssistButton
              action="generate_experience_bullets"
              input={e.description ?? ""}
              onResult={(o) => patch(e.id, { description: o })}
              label="✨ Turn into bullet points"
            />
            <button className="btn btn-ghost" onClick={() => onChange(experience.filter((x) => x.id !== e.id))}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={addEntry}>+ Add experience</button>
    </section>
  );
}

function ProjectsSection({ projects, onChange }: { projects: Project[]; onChange: (p: Project[]) => void }) {
  function addEntry() {
    onChange([...projects, { id: uid(), title: "", description: "", tags: [] }]);
  }
  function patch(id: string, fields: Partial<Project>) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  }
  return (
    <section>
      <h2>Projects</h2>
      {projects.map((p) => (
        <div key={p.id} className="glass" style={{ padding: 16, marginBottom: 12 }}>
          <input placeholder="Project title" value={p.title} onChange={(ev) => patch(p.id, { title: ev.target.value })} />
          <textarea
            placeholder="Describe the project and its impact"
            style={{ marginTop: 10 }}
            rows={3}
            value={p.description}
            onChange={(ev) => patch(p.id, { description: ev.target.value })}
          />
          <input
            placeholder="Link (optional)"
            style={{ marginTop: 10 }}
            value={p.link ?? ""}
            onChange={(ev) => patch(p.id, { link: ev.target.value })}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "space-between" }}>
            <AiAssistButton
              action="generate_project_description"
              input={p.description || p.title}
              onResult={(o) => patch(p.id, { description: o })}
              label="✨ Improve description"
            />
            <button className="btn btn-ghost" onClick={() => onChange(projects.filter((x) => x.id !== p.id))}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={addEntry}>+ Add project</button>
    </section>
  );
}
