import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <nav className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
        <strong style={{ fontSize: 18 }}>Portify <span style={{ color: "var(--accent)" }}>AI</span></strong>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      <header className="container" style={{ padding: "80px 0 60px", textAlign: "center", position: "relative" }}>
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            width: 500,
            height: 500,
            marginLeft: -250,
            background: "radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%)",
            filter: "blur(10px)",
            zIndex: -1,
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 56, lineHeight: 1.1, margin: "0 0 20px" }}
        >
          Your portfolio,
          <br />
          <span style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", color: "transparent" }}>
            written and designed by AI.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ color: "var(--muted)", fontSize: 18, maxWidth: 560, margin: "0 auto 32px" }}
        >
          Import your resume, pick a template, and let Portify AI write your about section, project
          descriptions and taglines — then publish a stunning, shareable 3D portfolio in minutes.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
            Build my portfolio — it's free
          </Link>
        </motion.div>
      </header>

      <section className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, paddingBottom: 100 }}>
        {[
          { title: "AI Resume Import", desc: "Upload a PDF or DOCX resume and watch Portify extract your experience, skills and projects automatically." },
          { title: "Live 3D Templates", desc: "Aurora, Glass, Minimal and Developer themes — all responsive, all built for recruiters to remember you." },
          { title: "Quality Scoring", desc: "Get an instant score and concrete suggestions to make your portfolio stronger before you share it." },
        ].map((f) => (
          <div key={f.title} className="glass" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>{f.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
