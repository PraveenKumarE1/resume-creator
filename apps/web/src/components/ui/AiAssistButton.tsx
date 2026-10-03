import { useState } from "react";
import { api } from "../../lib/api";
import { AiAction } from "@portify/shared";

interface Props {
  action: AiAction;
  input: string;
  onResult: (output: string) => void;
  label?: string;
}

export function AiAssistButton({ action, input, onResult, label = "✨ AI assist" }: Props) {
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/generate", { action, input });
      onResult(res.data.data.output);
    } catch {
      // Errors are surfaced globally; this button just stays usable.
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={run} disabled={loading}>
      {loading ? "Thinking…" : label}
    </button>
  );
}
