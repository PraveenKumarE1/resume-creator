import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setSession(res.data.data.user, res.data.data.accessToken);
      navigate("/onboarding");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <h1>Create your account</h1>
      <form onSubmit={onSubmit} className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "#ff7a7a", fontSize: 14 }}>{error}</div>}
        <div>
          <label>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password (min 8 characters)</label>
          <input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p style={{ color: "var(--muted)", marginTop: 16 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
