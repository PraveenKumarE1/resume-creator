import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublicPortfolio from "./pages/PublicPortfolio";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { api } from "./lib/api";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const setSession = useAuthStore((s) => s.setSession);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    api
      .post("/auth/refresh")
      .then((res) => setSession(res.data.data.user, res.data.data.accessToken))
      .catch(() => {})
      .finally(() => setBootstrapped(true));
  }, []);

  if (!bootstrapped) return null;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/p/:slug" element={<PublicPortfolio />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
