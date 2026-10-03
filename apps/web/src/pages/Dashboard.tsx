import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PortfolioData, PortfolioScore } from "@portify/shared";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<(PortfolioData & { score?: PortfolioScore }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/portfolios/me").then((res) => {
      setPortfolio(res.data.data.portfolio);
      setLoading(false);
    });
  }, []);

  async function togglePublish() {
    if (!portfolio) return;
    const res = await api.post("/portfolios/me/publish", { published: !portfolio.published });
    setPortfolio((p) => (p ? { ...p, published: res.data.data.portfolio.published } : p));
  }

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading…</div>;

  if (!portfolio) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <h1>No portfolio yet</h1>
        <Link to="/onboarding" className="btn btn-primary">Start building</Link>
      </div>
    );
  }

  const publicUrl = `/p/${portfolio.slug}`;

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/editor" className="btn btn-ghost">Edit portfolio</Link>
          <button className="btn btn-primary" onClick={togglePublish}>
            {portfolio.published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>Public link</h3>
          {portfolio.published ? (
            <Link to={publicUrl} style={{ color: "var(--accent)" }}>{publicUrl}</Link>
          ) : (
            <p style={{ color: "var(--muted)" }}>Publish your portfolio to get a shareable link.</p>
          )}

          <h3>Overview</h3>
          <p><strong>{portfolio.fullName || "Unnamed"}</strong> — {portfolio.headline || "No headline yet"}</p>
          <p style={{ color: "var(--muted)" }}>
            {portfolio.projects.length} projects · {portfolio.skills.length} skills · {portfolio.experience.length} experience entries
          </p>
        </div>

        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>Portfolio score</h3>
          <div style={{ fontSize: 42, fontWeight: 700, color: "var(--accent)" }}>{portfolio.score?.total ?? 0}/100</div>
          <ul style={{ paddingLeft: 18, color: "var(--muted)", fontSize: 13 }}>
            {(portfolio.score?.suggestions ?? []).map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
