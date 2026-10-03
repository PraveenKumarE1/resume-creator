import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 100, textAlign: "center" }}>
      <h1>404</h1>
      <p style={{ color: "var(--muted)" }}>This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
